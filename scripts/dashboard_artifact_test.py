"""Test independent checks against tampered copies of the compact artifact."""
import hashlib
import importlib.util
import json
from pathlib import Path
import shutil
import tempfile
import unittest

spec = importlib.util.spec_from_file_location("audit", Path(__file__).with_name("audit-dashboard-bundle.py"))
auditor = importlib.util.module_from_spec(spec)
spec.loader.exec_module(auditor)
SOURCE = Path(__file__).resolve().parents[1] / "content/dashboard/v1"


class ArtifactTests(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.folder = Path(self.temp.name)
        for name in ("bundle.json", "activities.csv", "observations.csv", "manifest.json"):
            shutil.copyfile(SOURCE / name, self.folder / name)
        self.bundle = json.loads((self.folder / "bundle.json").read_text(encoding="utf-8"))

    def tearDown(self):
        self.temp.cleanup()

    def rehash_modified_bundle(self):
        payload = (json.dumps(self.bundle, ensure_ascii=False) + "\n").encode()
        (self.folder / "bundle.json").write_bytes(payload)
        path = self.folder / "manifest.json"
        manifest = json.loads(path.read_text(encoding="utf-8"))
        manifest["bundle_sha256"] = hashlib.sha256(payload).hexdigest()
        manifest["artifacts_sha256"]["bundle.json"] = manifest["bundle_sha256"]
        path.write_text(json.dumps(manifest), encoding="utf-8")

    def test_committed_preview_passes_without_promoting_release_gates(self):
        result = auditor.audit(self.folder)
        self.assertTrue(result["integrity_passed"])
        self.assertFalse(result["public_reveal_approved"])

    def test_cooccurrence_cannot_be_relabelled_as_partnership_even_after_rehash(self):
        self.bundle["co_occurrences"][0]["is_partnership"] = True
        self.rehash_modified_bundle()
        with self.assertRaisesRegex(ValueError, "cannot establish partnership"):
            auditor.audit(self.folder)

    def test_wrong_period_denominator_is_rejected_even_after_rehash(self):
        self.bundle["periods"][0]["denominator_unique_posts"] += 1
        self.rehash_modified_bundle()
        with self.assertRaisesRegex(ValueError, "denominator mismatch"):
            auditor.audit(self.folder)

    def test_observation_stage_cannot_disappear_from_its_activity(self):
        row = next(a for a in self.bundle["activities"] if a["observation_ids"])
        row["observation_stages"] = []
        self.rehash_modified_bundle()
        with self.assertRaisesRegex(ValueError, "links/stages mismatch"):
            auditor.audit(self.folder)


if __name__ == "__main__":
    unittest.main()
