"""Offline synthetic bundle tests; no archive, third-party packages or app needed."""
import copy
import csv
import hashlib
import importlib.util
import io
import json
from pathlib import Path
import tempfile
import unittest

spec = importlib.util.spec_from_file_location("dashboard_bundle", Path(__file__).with_name("build-dashboard-bundle.py"))
builder = importlib.util.module_from_spec(spec)
spec.loader.exec_module(builder)


def article(identifier=1, text="Abba Isa and Red-Cross reported over 20 women receiving kits."):
    return {"source_id": identifier, "source_type": "posts", "title": "An office account", "text": text,
            "text_sha256": hashlib.sha256(text.encode()).hexdigest(), "report_date": "2024-03-09T10:00:00",
            "publisher": "Office", "url": f"https://example.org/{identifier}/", "snapshot_file": "PRIVATE-LOCAL-PATH"}


def observation(source, identifier="research-1", **overrides):
    return {"id": identifier, "activity_id": "startup-support-march-2024", "source_id": source["source_id"],
            "source_title": source["title"], "source_url": source["url"], "source_text_sha256": source["text_sha256"],
            "report_date": "2024-03-09", "event_date": None, "date_basis": "Publication date; event date unknown.",
            "value": 20, "bound": "greater-than", "unit": "people",
            "population": "Women with disabilities receiving POS equipment and startup kits", "stage": "reported-delivery",
            "original_numeric_wording": "over 20", "evidence_excerpt": "over 20 women receiving kits.",
            "partners": ["Red Cross"], "geography": [], "isa_role": "Office-reported facilitation.",
            "limitations": "Overlap unknown.", "corroboration": "Office report only.",
            "review_status": "source-context-checked-research-only", "public_approved": False, **overrides}


class BundleTests(unittest.TestCase):
    def setUp(self):
        self.articles = [article(1), article(2)]
        self.contributions = {"sources": [], "records": [{
            "id": "startup-support-march-2024", "title": "Startup kits", "branch": "economic",
            "reportDate": "2024-11-09", "eventDate": None, "dateBasis": "Retrospective report; event day unknown.",
            "role": "Office-reported support.", "deliveryPartners": ["Partners not specified"], "geography": [],
            "sources": ["old-source"], "reviewed": True, "limitations": "Cohort overlap unknown.",
            "measures": [{"id": "recipients", "value": 20, "bound": "greater-than", "unit": "people",
                          "population": "PWD recipients in the March startup-support activity", "stage": "reported-delivery",
                          "evidence": "The old ledger paraphrases a report of more than twenty recipients."}]}]}
        self.records = {"sources": [{"id": "old-source", "title": "Older citation", "publisher": "Office", "type": "office",
                                     "date": "2024-03-09", "url": self.articles[0]["url"]}], "achievements": []}
        self.observations = [observation(self.articles[0])]
        self.activities = []
        self.review = {"schema_version": 1, "dataset_date": "2026-10-24", "scope": "Selected preview only.",
                       "corpus": [{"source_id": a["source_id"], "categories": ["livelihoods"], "reason": "Source-context checked."} for a in self.articles],
                       "entities": [{"id": "isa", "label": "Abba Isa", "kind": "person", "aliases": ["Isa"]},
                                    {"id": "redcross", "label": "Red Cross", "kind": "organisation", "aliases": ["Red-Cross"]}],
                       "partnerships": [], "topic_labels": [],
                       "coverage_accounting": {"candidate_count": 20, "reviewed_candidates": 2, "linked_exact_repeats": 3,
                                               "automatic_exact_repeats": 4, "awaiting_review": 11}}
        self.analysis = {"schema_version": 1, "corpus_source_ids": [1],
                         "topics": [{"id": f"topic-{i}", "label": {"en": f"Topic {i}", "ha": f"Draft {i}"},
                                     "terms": ["kits"], "representative_source_ids": [1]} for i in range(1, 9)],
                         "documents": [{"source_id": 1, "topic_shares": [1.0] + [0.0] * 7}],
                         "periods": [{"publication_year": "2024", "denominator_unique_posts": 1, "mean_topic_share": [1.0] + [0.0] * 7}],
                         "method": {"local_path": "DO-NOT-EXPORT"}}

    def build(self):
        return builder.build_bundle(self.articles, self.contributions, self.records, self.observations,
                                    self.activities, self.review, self.analysis)

    def test_duplicate_reports_do_not_inflate_activity_or_cohort(self):
        self.observations.append(observation(self.articles[1], identifier="research-2"))
        result = self.build()
        self.assertEqual(len(result["activities"]), 1)
        self.assertEqual(len(result["observations"]), 1)
        self.assertEqual(result["observations"][0]["observation_id_aliases"], ["research-1", "research-2"])
        self.assertEqual(result["coverage"]["canonical_model_documents"], 1)
        self.assertEqual(result["periods"][0]["category_post_counts"]["livelihoods"], 1)
        self.assertEqual(result["co_occurrences"][0]["supporting_unique_documents"], 1)

    def test_target_delivery_unit_and_bound_are_never_collapsed(self):
        for name, fields in [("target", {"stage": "target"}), ("household", {"unit": "households"}),
                             ("at-least", {"bound": "at-least"}), ("approximate", {"bound": "approximate"})]:
            self.observations.append(observation(self.articles[0], identifier=name, **fields))
        result = self.build()
        rows = result["observations"]
        self.assertEqual(len(rows), 5)
        self.assertEqual(sum(r["stage"] == "target" for r in rows), 1)
        self.assertIn("households", {r["unit"] for r in rows})
        self.assertEqual({r["bound"] for r in rows}, {"greater-than", "at-least", "approximate"})
        self.assertEqual(result["activities"][0]["observation_ids"], sorted(r["id"] for r in rows))
        self.assertEqual(result["activities"][0]["observation_stages"], ["reported-delivery", "target"])

    def test_unrelated_population_is_not_merged_by_same_number(self):
        self.observations.append(observation(self.articles[0], identifier="separate", population="Other participants"))
        self.assertEqual(len(self.build()["observations"]), 2)

    def test_unknown_or_excluded_source_fails_closed(self):
        self.review["corpus"] = [self.review["corpus"][1]]
        with self.assertRaisesRegex(ValueError, "missing or excluded"):
            self.build()
        self.review["corpus"].append({"source_id": 500, "categories": ["livelihoods"], "reason": "Selected"})
        with self.assertRaisesRegex(ValueError, "Missing reviewed corpus"):
            self.build()

    def test_exact_partnership_excerpt_required(self):
        self.review["partnerships"] = [{"id": "p1", "source_id": 1, "entity_ids": ["isa", "redcross"],
                                         "kind": "stated-cooperation", "excerpt": "Abba Isa and Red-Cross", "limitations": "Stated only."}]
        result = self.build()
        self.assertEqual(result["partnerships"][0]["kind"], "stated-cooperation")
        self.review["partnerships"][0]["excerpt"] = "Abba Isa signed an agreement"
        with self.assertRaisesRegex(ValueError, "Exact evidence"):
            self.build()

    def test_review_note_preserves_source_disagreement_without_another_observation(self):
        self.review["claim_notes"] = [{"id": "bound-disagreement", "activity_id": "startup-support-march-2024",
                                       "source_id": 1, "excerpt": "over 20 women receiving kits.",
                                       "note": "A source wording variation remains unresolved; not a new observation."}]
        result = self.build()
        self.assertEqual(len(result["observations"]), 1)
        self.assertEqual(result["review_notes"][0]["evidence"]["kind"], "exact-source-excerpt")
        self.assertEqual(result["review_notes"][0]["evidence"]["source_id"], "old-source")
        self.assertIs(result["review_notes"][0]["public_approved"], False)
        note = self.review["claim_notes"][0]
        note["source_id"] = 999
        with self.assertRaisesRegex(ValueError, "missing or excluded"):
            self.build()
        note["source_id"] = 1
        note["excerpt"] = "An invented variation"
        with self.assertRaisesRegex(ValueError, "Exact evidence"):
            self.build()
        note["excerpt"] = "over 20 women receiving kits."
        note["activity_id"] = "missing-activity"
        with self.assertRaisesRegex(ValueError, "existing activity"):
            self.build()
        note["activity_id"] = "startup-support-march-2024"
        self.review["claim_notes"].append(copy.deepcopy(note))
        with self.assertRaisesRegex(ValueError, "Duplicate id"):
            self.build()

    def test_cooccurrence_is_never_automatically_a_partnership(self):
        result = self.build()
        self.assertEqual(result["partnerships"], [])
        self.assertEqual(result["co_occurrences"][0]["kind"], "article-co-occurrence")
        self.assertIs(result["co_occurrences"][0]["is_partnership"], False)

    def test_entity_matching_normalizes_tokens_without_substring_matches(self):
        entities = [{"id": "isa", "label": "Isa", "kind": "person", "aliases": []},
                    {"id": "rc", "label": "Red Cross", "kind": "organisation", "aliases": []},
                    {"id": "o", "label": "O'Brien", "kind": "person", "aliases": []}]
        matches = builder.entity_matches("disability, ISAAC and visa. RED\u2011CROSS, O\u2019Brien; Isa.", entities)
        self.assertEqual({h["entity_id"] for h in matches}, {"isa", "rc", "o"})
        self.assertEqual(builder.entity_matches("disability ISAAC visa", entities), [])

    def test_byline_only_person_is_excluded_but_in_body_representative_remains(self):
        entities = [{"id": "author", "label": "Lanre Oloyede", "kind": "person", "aliases": []},
                    {"id": "isa", "label": "Isa", "kind": "person", "aliases": []}]
        text = "  BY Lanre Oloyede\nIsa attended the event."
        self.assertEqual([r["entity_id"] for r in builder.entity_matches(text, entities)], ["isa"])
        text += "\nIsa was represented by Lanre Oloyede."
        self.assertEqual({r["entity_id"] for r in builder.entity_matches(text, entities)}, {"author", "isa"})
        self.articles = [article(1, "By Lanre Oloyede\nAbba Isa and Red-Cross reported over 20 women receiving kits."),
                         article(2, "By Lanre Oloyede\nAbba Isa and Red-Cross reported over 20 women receiving kits.")]
        self.observations[0]["source_text_sha256"] = self.articles[0]["text_sha256"]
        self.review["entities"].append(entities[0])
        result = self.build()
        self.assertNotIn("author", {m["entity_id"] for m in result["entity_mentions"]})
        self.assertTrue(all("author" not in edge["entity_ids"] for edge in result["co_occurrences"]))
        self.assertIn("byline", result["method"]["entity_method"])

    def test_by_prose_is_preserved_while_name_shaped_author_lines_are_removed(self):
        entities = [{"id": "author", "label": "Lanre Oloyede", "kind": "person", "aliases": []}]
        self.assertEqual(builder.entity_matches("By working with Lanre Oloyede, Isa supports inclusion.", entities)[0]["entity_id"], "author")
        self.assertEqual(builder.entity_matches("By enabling Lanre Oloyede to contribute, the office broadens access.", entities)[0]["entity_id"], "author")
        for line in ["By Lanre Oloyede", "  BY LANRE OLOYEDE  ", "by Our Correspondent", "BY OUR CORRESPONDENT", "By Reporter", "by reporter"]:
            with self.subTest(line=line):
                self.assertTrue(builder.is_author_byline(line))
        self.assertFalse(builder.is_author_byline("By enabling greater opportunity for people with disabilities."))
        self.assertFalse(builder.is_author_byline("By working with Lanre Oloyede, Isa supports inclusion."))

    def test_existing_source_ids_and_public_achievement_urls_survive(self):
        self.records["achievements"] = [{"slug": "startup-support-march-2024", "reviewed": True, "branch": "economic", "date": "2024-03-09",
                                          "status": "reported", "title": {"en": "Kits", "ha": "Draft"},
                                          "description": {"en": "Reported kits", "ha": "Draft"}, "role": {"en": "Facilitator"},
                                          "evidenceLimits": {"en": "Office report"}, "sources": ["old-source"]}]
        result = self.build()
        self.assertEqual(len(result["activities"]), 1)
        self.assertEqual(result["activities"][0]["achievement_slug"], "startup-support-march-2024")
        self.assertEqual(result["sources"][0]["id"], "2")
        old = next(s for s in result["sources"] if s["id"] == "old-source")
        self.assertEqual(old["archive_source_ids"], [1])
        self.assertEqual(old["url"], self.articles[0]["url"])

    def test_paraphrase_and_report_chronology_remain_explicit(self):
        result = self.build()
        row = result["observations"][0]
        self.assertEqual(row["report_date"], "2024-11-09")
        self.assertIsNone(row["event_date"])
        self.assertEqual(row["evidence"][0]["kind"], "reviewed-ledger-paraphrase")
        self.assertEqual(row["evidence"][1]["kind"], "exact-source-excerpt")
        self.assertEqual(row["evidence"][1]["report_date"], "2024-03-09")
        self.assertEqual(len(row["population_descriptions"]), 2)

    def test_exports_are_deterministic_and_hashed_without_article_or_local_paths(self):
        first, second = self.build(), self.build()
        self.assertEqual(builder.json_bytes(first), builder.json_bytes(second))
        serialized = builder.json_bytes(first).decode()
        for hidden in [self.articles[0]["text"], "PRIVATE-LOCAL-PATH", "DO-NOT-EXPORT"]:
            self.assertNotIn(hidden, serialized)
        with tempfile.TemporaryDirectory() as folder:
            manifest = builder.export_bundle(first, folder, {"fixture": "0" * 64})
            one = {p.name: p.read_bytes() for p in Path(folder).iterdir()}
            builder.export_bundle(second, folder, {"fixture": "0" * 64})
            self.assertEqual(one, {p.name: p.read_bytes() for p in Path(folder).iterdir()})
            for name, expected in manifest["artifacts_sha256"].items():
                self.assertEqual(hashlib.sha256(one[name]).hexdigest(), expected)

    def test_csv_formula_prefixes_and_quotes_are_safe(self):
        values = ["=CMD()", " +1", "\t-2", "\n@evil", 'safe, "quoted"\nvalue']
        data = builder.csv_bytes([{"value": v} for v in values], ["value"])
        rows = list(csv.DictReader(io.StringIO(data.decode("utf-8-sig"))))
        self.assertEqual([r["value"] for r in rows[:4]], ["'" + v for v in values[:4]])
        self.assertEqual(rows[4]["value"], values[4])

    def test_incomplete_coverage_and_release_gates_are_honest(self):
        result = self.build()
        self.assertIn("preview", result["status"])
        for key in ["numerical_review_complete", "career_coverage_complete", "unique_people_total_available"]:
            self.assertIs(result["coverage"][key], False)
        self.assertEqual(result["coverage"]["numerical_queue"]["awaiting_review"], 11)
        self.assertTrue(all(v is False for v in result["gates"].values()))
        self.assertTrue(all(r["public_approved"] is False for r in result["observations"] + result["activities"]))
        self.assertNotIn("total_people", result)
        self.assertTrue(all(t["ha_reviewed"] is False for t in result["topics"]))

    def test_source_hash_date_and_excerpt_changes_fail(self):
        for field, value in [("source_text_sha256", "stale"), ("report_date", "2025-03-09"),
                             ("source_url", "https://example.org/wrong")]:
            with self.subTest(field=field):
                saved = self.observations[0][field]
                self.observations[0][field] = value
                with self.assertRaisesRegex(ValueError, "Stale reviewed"):
                    self.build()
                self.observations[0][field] = saved
        self.observations[0]["evidence_excerpt"] = "Invented quote"
        with self.assertRaisesRegex(ValueError, "Exact evidence"):
            self.build()

    def test_bad_model_denominators_representatives_and_nonfinite_values_fail(self):
        self.analysis["periods"][0]["denominator_unique_posts"] = 2
        with self.assertRaisesRegex(ValueError, "period denominator"):
            self.build()
        self.analysis["periods"][0]["denominator_unique_posts"] = 1
        self.analysis["topics"][0]["representative_source_ids"] = [999]
        with self.assertRaisesRegex(ValueError, "Representative"):
            self.build()
        self.analysis["topics"][0]["representative_source_ids"] = [1]
        self.analysis["documents"][0]["topic_shares"][0] = float("nan")
        with self.assertRaisesRegex(ValueError, "Invalid topic"):
            self.build()

    def test_qualitative_activity_keeps_zero_observations_and_stage_specific_date(self):
        self.activities = [{"id": "meeting", "title": "Meeting", "categories": ["policy-accessibility"],
                            "stage": "reported-activity", "report_date": "2024-03-09", "event_date": None,
                            "date_basis": "Publication date", "isa_role": "Attendee", "geography": [],
                            "participants_or_institutions": ["Red Cross"], "limitations": "No agreement established.",
                            "public_approved": False, "measures": [],
                            "evidence": [{"source_id": 1, "source_url": self.articles[0]["url"], "report_date": "2024-03-09",
                                          "source_text_sha256": self.articles[0]["text_sha256"], "excerpt": "Abba Isa and Red-Cross",
                                          "report_stage": "reported-activity"}]}]
        result = self.build()
        self.assertEqual(len(result["activities"]), 2)
        self.assertEqual(len(result["observations"]), 1)
        self.activities[0]["measures"] = [{"value": 50}]
        with self.assertRaisesRegex(ValueError, "cannot invent measures"):
            self.build()

    def test_duplicate_input_ids_fail(self):
        self.observations *= 2
        with self.assertRaisesRegex(ValueError, "Duplicate id"):
            self.build()

    def test_qualitative_evidence_attaches_to_existing_identity(self):
        self.activities = [{"id": "startup-support-march-2024", "title": "Same activity, new evidence",
                            "categories": ["livelihoods", "education-training"], "stage": "reported-activity",
                            "report_date": "2024-03-09", "event_date": None, "date_basis": "Publication date",
                            "isa_role": "Reported facilitator", "geography": [], "participants_or_institutions": [],
                            "limitations": "No extra cohort", "public_approved": False, "measures": [],
                            "evidence": [{"source_id": 1, "source_url": self.articles[0]["url"], "report_date": "2024-03-09",
                                          "source_text_sha256": self.articles[0]["text_sha256"], "excerpt": "Abba Isa and Red-Cross",
                                          "report_stage": "reported-activity"}]}]
        result = self.build()
        self.assertEqual(len(result["activities"]), 1)
        self.assertEqual(len(result["observations"]), 1)
        self.assertEqual(len(result["activities"][0]["evidence"]), 2)
        self.assertEqual(result["activities"][0]["report_date"], "2024-11-09")
        self.assertEqual(result["activities"][0]["evidence"][-1]["report_date"], "2024-03-09")

    def test_zero_vector_post_stays_in_category_denominator(self):
        self.articles[1] = article(2, "Other relevant reviewed report with no modelled terms.")
        self.analysis["corpus_source_ids"] = [1, 2]
        self.analysis["documents"].append({"source_id": 2, "topic_shares": [0.0] * 8})
        self.analysis["periods"][0]["denominator_unique_posts"] = 2
        period = self.build()["periods"][0]
        self.assertEqual(period["denominator_unique_posts"], 2)
        self.assertEqual(period["modelled_posts"], 1)
        self.assertEqual(period["zero_vector_posts"], 1)
        self.assertEqual(period["category_post_counts"]["livelihoods"], 2)
        self.assertEqual(period["mean_topic_share"], [1.0] + [0.0] * 7)

    def test_stale_corpus_review_and_unbalanced_coverage_fail(self):
        self.review["corpus"][0]["text_sha256"] = "stale"
        with self.assertRaisesRegex(ValueError, "Stale corpus review"):
            self.build()
        self.review["corpus"][0]["text_sha256"] = self.articles[0]["text_sha256"]
        self.review["coverage_accounting"]["awaiting_review"] = 10
        with self.assertRaisesRegex(ValueError, "accounting does not balance"):
            self.build()

    def test_model_method_settings_and_hashes_are_explainable_without_paths(self):
        self.analysis["method"].update(random_state=42, n_components=8, full_archive_model=False,
                                       representative_min_topic_share=.2, reviewed_boilerplate_lines_removed=3,
                                       input_corpus_sha256="a" * 64, settings_sha256="b" * 64,
                                       model_arrays_sha256="c" * 64, environment={"python": "3.14.4", "local_path": "PRIVATE"},
                                       tfidf={"ngram_range": [1, 2], "min_df": 3, "max_df": .85, "sublinear_tf": True,
                                              "local_path": "PRIVATE"})
        method = self.build()["method"]
        self.assertEqual(method["model"]["random_state"], 42)
        self.assertEqual(method["model"]["n_components"], 8)
        self.assertEqual(method["model"]["representative_min_topic_share"], .2)
        self.assertEqual(method["model"]["reviewed_boilerplate_lines_removed"], 3)
        self.assertEqual(method["model"]["input_corpus_sha256"], "a" * 64)
        self.assertEqual(method["model"]["environment"], {"python": "3.14.4"})
        self.assertEqual(method["model"]["tfidf"]["ngram_range"], [1, 2])
        self.assertIn("selected", method["sample_limitation"])
        self.assertNotIn("PRIVATE", json.dumps(method))
        self.analysis["method"]["model_arrays_sha256"] = "incorrect"
        with self.assertRaisesRegex(ValueError, "Invalid model method hash"):
            self.build()


if __name__ == "__main__":
    unittest.main()
