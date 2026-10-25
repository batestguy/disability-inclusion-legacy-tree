"""Model-selection guard tests using synthetic text, no scientific dependencies."""
import hashlib
import importlib.util
from pathlib import Path
import unittest

spec = importlib.util.spec_from_file_location("phase2", Path(__file__).with_name("analyse-dashboard-corpus.py"))
phase2 = importlib.util.module_from_spec(spec)
spec.loader.exec_module(phase2)


def article(identifier, text, date="2024-01-01T00:00:00"):
    return {"source_id": identifier, "source_type": "posts", "text": text,
            "text_sha256": hashlib.sha256(text.encode()).hexdigest(), "report_date": date}


def review(rows):
    return {"corpus": [{"source_id": a["source_id"], "text_sha256": a["text_sha256"],
                        "categories": ["policy-accessibility"], "reason": "Synthetic source checked"} for a in rows]}


class CorpusTests(unittest.TestCase):
    def test_exact_duplicates_keep_aliases_and_earliest_publication(self):
        rows = [article(1, "same full text", "2025-01-01T00:00:00"), article(2, "same full text")]
        selected, unique, aliases = phase2.select_corpus(rows, review(rows))
        self.assertEqual(len(selected), 2)
        self.assertEqual([r["source_id"] for r in unique], [2])
        self.assertEqual(aliases, {1: 2, 2: 2})

    def test_changed_text_invalidates_review(self):
        original = article(1, "old text")
        changed = article(1, "new text")
        with self.assertRaisesRegex(ValueError, "Stale corpus"):
            phase2.select_corpus([changed], review([original]))

    def test_duplicate_ids_cannot_weight_the_model_twice(self):
        a = article(1, "checked text")
        r = review([a]); r["corpus"] *= 2
        with self.assertRaisesRegex(ValueError, "Duplicate reviewed"):
            phase2.select_corpus([a], r)

    def test_conflicting_alias_categories_require_reconciliation(self):
        rows = [article(1, "same text"), article(2, "same text")]
        r = review(rows); r["corpus"][1]["categories"] = ["sport"]
        with self.assertRaisesRegex(ValueError, "Conflicting categories"):
            phase2.select_corpus(rows, r)

    def test_template_pages_do_not_enter_publication_model(self):
        a = {**article(1, "page text"), "source_type": "pages"}
        with self.assertRaisesRegex(ValueError, "non-post"):
            phase2.select_corpus([a], review([a]))

    def test_near_copies_are_flagged_for_review(self):
        text = "one two three four five six seven eight nine ten eleven twelve thirteen fourteen fifteen sixteen seventeen eighteen nineteen twenty"
        pairs = phase2.near_duplicate_pairs([article(1, text), article(2, text + " extra")])
        self.assertEqual(pairs[0]["source_ids"], [1, 2])

    def test_unrelated_texts_are_not_merged_as_same_activity(self):
        pairs = phase2.near_duplicate_pairs([article(1, "training programme supporting people in business"),
                                             article(2, "volleyball tournament matches for national sports teams")])
        self.assertEqual(pairs, [])

    def test_reviewed_boilerplate_is_removed_without_altering_evidence(self):
        a = article(1, "Repeated appointment notice.\nSpecific meeting with a delivery partner.")
        before = a["text"]
        cleaned, removed = phase2.prepare.clean_corpus([a], ["Repeated appointment notice."])
        self.assertNotIn("appointment", cleaned[0])
        self.assertIn("specific meeting", cleaned[0])
        self.assertEqual(a["text"], before)
        self.assertIn("repeated appointment notice.", removed)

    def test_substantive_by_clause_is_not_an_author_line(self):
        text = "By Lanre Oloyede\nBy enabling access in Abuja, the office discussed inclusion."
        cleaned, _ = phase2.prepare.clean_corpus([article(1, text)])
        self.assertNotIn("lanre oloyede", cleaned[0])
        self.assertIn("by enabling access in abuja", cleaned[0])


if __name__ == "__main__":
    unittest.main()
