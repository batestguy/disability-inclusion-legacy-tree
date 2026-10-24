"""Synthetic tests; run python -m unittest discover -s scripts -p '*_test.py'."""
import copy
import hashlib
import importlib.util
from pathlib import Path
import unittest

spec = importlib.util.spec_from_file_location("analysis", Path(__file__).with_name("prepare-analysis.py"))
analysis = importlib.util.module_from_spec(spec)
spec.loader.exec_module(analysis)


def source(identifier=1, kind="posts", text="Reported more than 45 women trained."):
    return {"source_id": identifier, "source_type": kind, "title": "Training",
            "url": f"https://example.org/source-{identifier}/",
            "report_date": "2024-07-19T12:00:00", "text": text,
            "text_sha256": hashlib.sha256(text.encode()).hexdigest()}


class ReviewTests(unittest.TestCase):
    def setUp(self):
        self.article = source()
        self.candidate = {"source_id": 1, "candidate_id": "posts-1-s1", "location": "text-segment-1",
                          "report_date": self.article["report_date"], "url": self.article["url"],
                          "text_sha256": self.article["text_sha256"], "paragraph": self.article["text"]}

    def decision(self):
        row = analysis.build_queue([self.article], [self.candidate], [])[0]
        return {"candidate_id": row["candidate_id"], "fingerprint": row["fingerprint"],
                "disposition": "unresolved-ambiguity", "reviewer": "Test reviewer", "reason": "Unit unresolved"}

    def test_unreviewed_does_not_become_approved(self):
        row = analysis.build_queue([self.article], [self.candidate], [])[0]
        self.assertEqual(row["decision_status"], "awaiting-review")
        self.assertEqual(row["disposition"], "unresolved-ambiguity")
        self.assertIsNone(row["decision"])

    def test_changed_bound_invalidates_review(self):
        decision = self.decision()
        updated = source(text="Reported 45 women trained.")
        candidate = {**self.candidate, "paragraph": updated["text"], "text_sha256": updated["text_sha256"]}
        with self.assertRaisesRegex(ValueError, "Stale decision"):
            analysis.build_queue([updated], [candidate], [decision])

    def test_moved_passage_invalidates_review(self):
        decision = self.decision()
        candidate = {**self.candidate, "location": "title"}
        with self.assertRaisesRegex(ValueError, "Stale decision"):
            analysis.build_queue([self.article], [candidate], [decision])

    def test_changed_publication_date_invalidates_review(self):
        decision = self.decision()
        article = {**self.article, "report_date": "2025-07-19T12:00:00"}
        candidate = {**self.candidate, "report_date": article["report_date"]}
        with self.assertRaisesRegex(ValueError, "Stale decision"):
            analysis.build_queue([article], [candidate], [decision])

    def test_wrong_source_url_fails(self):
        candidate = {**self.candidate, "url": "https://example.org/wrong/"}
        with self.assertRaisesRegex(ValueError, "citation/date mismatch"):
            analysis.build_queue([self.article], [candidate], [])

    def test_duplicate_review_ids_fail(self):
        decision = self.decision()
        with self.assertRaisesRegex(ValueError, "Duplicate review"):
            analysis.build_queue([self.article], [self.candidate], [decision, copy.deepcopy(decision)])

    def test_orphan_reviews_fail(self):
        with self.assertRaisesRegex(ValueError, "missing candidate"):
            analysis.build_queue([self.article], [], [self.decision()])

    def test_accepted_requires_observation_reference(self):
        decision = {**self.decision(), "disposition": "accepted-observation"}
        with self.assertRaisesRegex(ValueError, "observation ID"):
            analysis.build_queue([self.article], [self.candidate], [decision])

    def test_reviewed_hold_still_remains_a_hold(self):
        row = analysis.build_queue([self.article], [self.candidate], [self.decision()])[0]
        self.assertEqual(row["decision_status"], "reviewed")
        self.assertEqual(row["disposition"], "unresolved-ambiguity")

    def test_changed_source_hash_fails(self):
        with self.assertRaisesRegex(ValueError, "Changed text"):
            analysis.canonical_sources([{**self.article, "text": "changed"}])

    def test_duplicate_articles_keep_aliases_not_extra_model_rows(self):
        unique, aliases = analysis.canonical_sources([source(3), source(2), source(1, "pages")])
        self.assertEqual([a["source_id"] for a in unique], [2])
        self.assertEqual(aliases, {1: 2, 2: 2, 3: 2})

    def test_duplicate_passages_link_without_approving_canonical(self):
        other = {**self.candidate, "candidate_id": "posts-2-s1", "source_id": 2, "url": source(2)["url"]}
        queue = analysis.build_queue([self.article, source(2)], [self.candidate, other], [])
        self.assertEqual(queue[0]["decision_status"], "awaiting-review")
        self.assertEqual(queue[1]["exact_repeat_of"], "posts-1-s1")
        self.assertEqual(queue[1]["decision_status"], "automatic-exact-repeat")

    def test_same_passage_in_different_article_is_not_an_activity_match(self):
        article = source(2, text=self.article["text"] + " Another programme also discussed.")
        other = {**self.candidate, "candidate_id": "posts-2-s1", "source_id": 2,
                 "url": article["url"],
                 "text_sha256": article["text_sha256"]}
        queue = analysis.build_queue([self.article, article], [self.candidate, other], [])
        self.assertIsNone(queue[1]["exact_repeat_of"])

    def test_similar_titles_do_not_merge_distinct_articles(self):
        unique, _ = analysis.canonical_sources([source(), source(2, text="A different cohort trained.")])
        self.assertEqual(len(unique), 2)

    def test_subject_text_remains_untouched(self):
        article = source(text="By Reporter\nMohammed Abba Isa announced a training programme.")
        before = copy.deepcopy(article)
        cleaned, _ = analysis.clean_corpus([article])
        self.assertNotIn("by reporter", cleaned[0])
        self.assertEqual(article, before)

    def test_source_relevance_decision_rejects_changed_date(self):
        decision = {"source_id": 1, "text_sha256": self.article["text_sha256"],
                    "source_url": self.article["url"], "report_date": "2025-01-01",
                    "relevance": "exclude-other-person-reporting", "reason": "Other subject", "reviewer": "Test"}
        with self.assertRaisesRegex(ValueError, "Stale source relevance"):
            analysis.validate_source_decisions([self.article], [decision])

    def test_source_relevance_cannot_have_conflicting_duplicate_decisions(self):
        decision = {"source_id": 1}
        with self.assertRaisesRegex(ValueError, "Duplicate source relevance"):
            analysis.validate_source_decisions([self.article], [decision, decision])

    def test_exact_repeat_links_to_reviewed_canonical_hold_without_promoting_it(self):
        other = {**self.candidate, "candidate_id": "posts-2-s1", "source_id": 2, "url": source(2)["url"]}
        queue = analysis.build_queue([self.article, source(2)], [self.candidate, other], [self.decision()])
        self.assertEqual(queue[1]["decision_status"], "linked-exact-repeat")
        self.assertEqual(queue[1]["canonical_decision"]["disposition"], "unresolved-ambiguity")
        self.assertEqual(queue[1]["disposition"], "repeated-claim")
        self.assertIsNone(queue[1]["decision"])
        self.assertTrue(analysis.review_complete(queue))

    def test_unreviewed_canonical_keeps_its_exact_repeats_open(self):
        other = {**self.candidate, "candidate_id": "posts-2-s1", "source_id": 2, "url": source(2)["url"]}
        queue = analysis.build_queue([self.article, source(2)], [self.candidate, other], [])
        self.assertEqual(queue[1]["decision_status"], "automatic-exact-repeat")
        self.assertIsNone(queue[1]["canonical_decision"])
        self.assertFalse(analysis.review_complete(queue))

    def test_empty_queue_is_not_a_complete_review(self):
        self.assertFalse(analysis.review_complete([]))


class ObservationTests(unittest.TestCase):
    def setUp(self):
        self.article = source()
        self.candidate = {"source_id": 1, "candidate_id": "posts-1-s1", "location": "text-segment-1",
                          "report_date": self.article["report_date"], "url": self.article["url"],
                          "text_sha256": self.article["text_sha256"], "paragraph": self.article["text"]}
        self.observation = {"id": "training-1", "candidate_id": "posts-1-s1", "activity_id": "training",
                            "source_id": 1, "source_url": self.article["url"], "source_text_sha256": self.article["text_sha256"],
                            "report_date": "2024-07-19", "event_date": None, "date_basis": "Publication only",
                            "value": 45, "bound": "greater-than", "unit": "people", "population": "Women trained",
                            "stage": "reported-delivery", "original_numeric_wording": "more than 45",
                            "evidence_excerpt": "more than 45 women trained", "partners": ["Not specified"],
                            "geography": [], "isa_role": "Office reports training", "limitations": "Overlap unknown",
                            "public_approved": False}
        self.decision = {"candidate_id": "posts-1-s1", "fingerprint": analysis.build_queue([self.article], [self.candidate], [])[0]["fingerprint"],
                         "disposition": "accepted-observation", "reason": "Source-context checked", "reviewer": "Test reviewer",
                         "observation_id": "training-1", "observation_fingerprint": analysis.digest(self.observation)}

    def validate(self, observation=None, decisions=None):
        queue = analysis.build_queue([self.article], [self.candidate], decisions if decisions is not None else [self.decision])
        return analysis.validate_observations([self.article], queue, [observation or self.observation])

    def test_valid_research_observation_resolves(self):
        self.assertEqual(len(self.validate()), 1)

    def test_numeric_semantic_changes_invalidate_review(self):
        for field, replacement in [("value", 450), ("bound", "exact"), ("unit", "households"),
                                   ("stage", "target"), ("report_date", "2025-07-19")]:
            with self.subTest(field=field), self.assertRaisesRegex(ValueError, "changed since"):
                self.validate({**self.observation, field: replacement})

    def test_missing_observation_cannot_satisfy_accepted_decision(self):
        queue = analysis.build_queue([self.article], [self.candidate], [self.decision])
        with self.assertRaisesRegex(ValueError, "unresolved observation"):
            analysis.validate_observations([self.article], queue, [])

    def test_accepted_observation_is_not_multiplied_by_a_linked_repeat(self):
        duplicate = source(2)
        candidate = {**self.candidate, "source_id": 2, "candidate_id": "posts-2-s1", "url": duplicate["url"]}
        queue = analysis.build_queue([self.article, duplicate], [self.candidate, candidate], [self.decision])
        observations = analysis.validate_observations([self.article, duplicate], queue, [self.observation])
        self.assertEqual(queue[1]["decision_status"], "linked-exact-repeat")
        self.assertEqual(len(observations), 1)

    def test_evidence_must_be_present_even_with_matching_fingerprint(self):
        observation = {**self.observation, "evidence_excerpt": "An invented quotation"}
        decision = {**self.decision, "observation_fingerprint": analysis.digest(observation)}
        with self.assertRaisesRegex(ValueError, "evidence absent"):
            self.validate(observation, [decision])

    def test_source_context_cannot_establish_public_approval(self):
        observation = {**self.observation, "public_approved": True}
        decision = {**self.decision, "observation_fingerprint": analysis.digest(observation)}
        with self.assertRaisesRegex(ValueError, "cannot establish public"):
            self.validate(observation, [decision])

    def test_unknown_event_date_must_not_be_inferred(self):
        observation = {**self.observation, "event_date": "2024-07-18"}
        decision = {**self.decision, "observation_fingerprint": analysis.digest(observation)}
        with self.assertRaisesRegex(ValueError, "date mismatch"):
            self.validate(observation, [decision])


class ActivityTests(unittest.TestCase):
    def setUp(self):
        self.article = source(text="Reported a meeting on inclusive services.")
        self.relevance = {"source_id": 1, "relevance": "include-isa-reporting"}
        self.evidence = {"source_id": 1, "source_url": self.article["url"],
                         "source_text_sha256": self.article["text_sha256"], "report_date": "2024-07-19",
                         "excerpt": "meeting on inclusive services", "report_stage": "reported-activity"}
        self.activity = {"id": "meeting-1", "title": "Inclusion meeting", "categories": ["policy-accessibility"],
                         "stage": "reported-activity", "report_date": "2024-07-19", "event_date": None,
                         "date_basis": "Publication date only", "isa_role": "Meeting participant",
                         "participants_or_institutions": [], "geography": [],
                         "evidence": [self.evidence], "measures": [], "limitations": "No service delivery measured",
                         "public_approved": False}

    def validate(self, activities=None, relevance=None):
        return analysis.validate_activities([self.article], relevance or [self.relevance], activities or [self.activity])

    def test_duplicate_evidence_does_not_create_another_activity(self):
        activity = {**self.activity, "evidence": [self.evidence, {**self.evidence, "report_stage": "duplicate-report"}]}
        self.assertEqual(len(self.validate([activity])), 1)

    def test_duplicate_activity_ids_are_rejected(self):
        with self.assertRaisesRegex(ValueError, "Duplicate/missing"):
            self.validate([self.activity, self.activity])

    def test_excluded_source_cannot_support_a_reviewed_activity(self):
        with self.assertRaisesRegex(ValueError, "lacks reviewed Isa relevance"):
            self.validate(relevance=[{**self.relevance, "relevance": "exclude-other-person-reporting"}])

    def test_qualitative_activity_does_not_invent_beneficiary_measures(self):
        with self.assertRaisesRegex(ValueError, "cannot invent measures"):
            self.validate([{**self.activity, "measures": [{"value": 2, "unit": "people"}]}])

    def test_activity_evidence_must_match_source(self):
        with self.assertRaisesRegex(ValueError, "excerpt absent"):
            self.validate([{**self.activity, "evidence": [{**self.evidence, "excerpt": "Invented services delivered"}]}])

    def test_earlier_announcement_cannot_date_later_reported_receipt(self):
        activity = {**self.activity, "report_date": "2024-07-18",
                    "evidence": [{**self.evidence, "report_date": "2024-07-18", "report_stage": "announced"}, self.evidence]}
        # The announcement uses a distinct real source/date; isolate chronology validation.
        announcement = {**self.article, "source_id": 2, "url": "https://example.org/announcement/", "report_date": "2024-07-18T12:00:00"}
        activity["evidence"][0].update(source_id=2, source_url=announcement["url"])
        with self.assertRaisesRegex(ValueError, "chronology/stage mismatch"):
            analysis.validate_activities([self.article, announcement], [self.relevance, {"source_id": 2, "relevance": "include-isa-reporting"}], [activity])


if __name__ == "__main__":
    unittest.main()
