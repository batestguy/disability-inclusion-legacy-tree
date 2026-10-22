// Descriptive metrics only. The unit of analysis is a distinct documented activity.
export function validateLedger(ledger, sources) {
  const ids = new Set();
  for (const r of ledger.records) {
    if (!r.id || ids.has(r.id)) throw new Error(`Duplicate/missing activity: ${r.id}`);
    ids.add(r.id);
    if (!r.reviewed || !r.sources.length || r.sources.some(id => !sources.some(s => s.id === id)))
      throw new Error(`Unreviewed or unresolved evidence: ${r.id}`);
    if (!r.reportDate || !r.dateBasis || !r.role || !r.deliveryPartners.length || !r.limitations)
      throw new Error(`Incomplete context: ${r.id}`);
    if (r.eventDate !== null && !/^\d{4}-\d{2}-\d{2}$/.test(r.eventDate))
      throw new Error(`Invalid event date: ${r.id}`);
    const measureIds = new Set();
    for (const m of r.measures) {
      if (!m.id || measureIds.has(m.id)) throw new Error(`Duplicate measure: ${r.id}`);
      measureIds.add(m.id);
      if (!Number.isFinite(m.value) || m.value < 0 || !m.unit || !m.population ||
          !['exact', 'greater-than', 'at-least'].includes(m.bound) ||
          !['reported-delivery', 'target'].includes(m.stage) || !m.evidence)
        throw new Error(`Invalid measure: ${r.id}/${m.id}`);
    }
  }
  return ledger;
}

export function filterRecords(records, { year = 'all', branch = 'all', search = '' } = {}) {
  return records.filter(r =>
    (year === 'all' || r.reportDate.slice(0, 4) === year) &&
    (branch === 'all' || r.branch === branch) &&
    `${r.title} ${r.role} ${r.deliveryPartners.join(' ')}`.toLowerCase().includes(search.toLowerCase()));
}

export function describe(records) {
  const delivered = records.flatMap(r => r.measures.filter(m => m.stage === 'reported-delivery'));
  return {
    documentedActivities: records.length,
    quantifiedActivities: records.filter(r => r.measures.length).length,
    activitiesWithReportedDelivery: records.filter(r => r.measures.some(m => m.stage === 'reported-delivery')).length,
    reportedDeliveryMeasures: delivered.length,
    targetMeasures: records.flatMap(r => r.measures.filter(m => m.stage === 'target')).length,
    sourceDocuments: new Set(records.flatMap(r => r.sources)).size,
    // No total of people: overlap and counting definitions are not resolved.
    uniquePeopleReached: null,
    byReportYear: Object.fromEntries([...new Set(records.map(r => r.reportDate.slice(0, 4)))].sort()
      .map(year => [year, records.filter(r => r.reportDate.startsWith(year)).length])),
  };
}

export function displayMeasure(m) {
  return `${m.bound === 'greater-than' ? '>' : m.bound === 'at-least' ? '≥' : ''}${m.value.toLocaleString('en-NG')}`;
}
