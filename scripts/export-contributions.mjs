import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { validateLedger, describe } from './contribution-metrics.mjs';
const ledger = JSON.parse(await readFile('content/contributions.json', 'utf8'));
const content = JSON.parse(await readFile('content/records.json', 'utf8'));
validateLedger(ledger, [...content.sources, ...ledger.sources]);
await mkdir('output', { recursive: true });
const summary = describe(ledger.records);
await writeFile('output/contribution-summary.json', JSON.stringify(summary, null, 2) + '\n');
const rows = [['activity_id','title','report_date','event_date','date_basis','branch','role','partners','measure_id','value','bound','unit','population','stage','evidence','source_urls','limitations']];
for (const r of ledger.records) {
  for (const m of r.measures.length ? r.measures : [null]) {
    rows.push([r.id,r.title,r.reportDate,r.eventDate ?? '',r.dateBasis,r.branch,r.role,r.deliveryPartners.join('; '),m?.id ?? '',m?.value ?? '',m?.bound ?? '',m?.unit ?? '',m?.population ?? '',m?.stage ?? '',m?.evidence ?? '',r.sources.map(id => [...content.sources,...ledger.sources].find(s => s.id === id).url).join('; '),r.limitations]);
  }
}
const cell = value => {
  let text = String(value);
  if (/^[=+@\-\t\r]/.test(text)) text = `'${text}`;
  return `"${text.replaceAll('"','""')}"`;
};
await writeFile('output/contributions.csv', rows.map(row => row.map(cell).join(',')).join('\r\n') + '\r\n');
console.log(JSON.stringify(summary, null, 2));
console.log('Wrote output/contributions.csv and output/contribution-summary.json');
