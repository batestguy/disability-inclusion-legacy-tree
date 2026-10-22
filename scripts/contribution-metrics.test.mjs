import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { validateLedger, describe, filterRecords, displayMeasure } from './contribution-metrics.mjs';
const ledger = JSON.parse(readFileSync(new URL('../content/contributions.json', import.meta.url), 'utf8'));
const seed = JSON.parse(readFileSync(new URL('../content/records.json', import.meta.url), 'utf8'));
const sources = [...seed.sources, ...ledger.sources];
test('metric ledger rejects duplicate activities and unresolved evidence', () => {
  validateLedger(ledger, sources);
  assert.throws(() => validateLedger({...ledger,records:[...ledger.records,ledger.records[0]]},sources), /Duplicate/);
  assert.throws(() => validateLedger(ledger,[]), /unresolved/);
});
test('targets cannot inflate delivery counts and people are not summed', () => {
  const target = ledger.records.find(r => r.measures.some(m => m.stage === 'target'));
  const s = describe([target]);
  assert.equal(s.reportedDeliveryMeasures,0);
  assert.equal(s.activitiesWithReportedDelivery,0);
  assert.equal(s.uniquePeopleReached,null);
  assert.equal(s.targetMeasures,1);
});
test('unquantified activities remain missing quantities rather than zero people', () => {
  const r = ledger.records.find(r => !r.measures.length);
  const s = describe([r]);
  assert.equal(s.documentedActivities,1);
  assert.equal(s.quantifiedActivities,0);
  assert.equal(s.uniquePeopleReached,null);
  assert.deepEqual(describe([]).byReportYear,{});
});
test('filtering uses explicitly labelled report years, not invented event dates', () => {
  const records = filterRecords(ledger.records,{year:'2024',branch:'economic'});
  assert.ok(records.length);
  assert.ok(records.every(r => r.reportDate.startsWith('2024') && r.branch === 'economic'));
  assert.equal(filterRecords(ledger.records,{search:'no matching contribution'}).length,0);
});
test('lower bounds stay visible and invalid quantities are rejected', () => {
  assert.equal(displayMeasure({value:45,bound:'greater-than'}),'>45');
  const bad = structuredClone(ledger);
  const m = bad.records.find(r => r.measures.length).measures[0];
  m.value = -1;
  assert.throws(() => validateLedger(bad,sources),/Invalid measure/);
});
