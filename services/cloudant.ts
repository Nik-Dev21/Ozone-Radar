import { nanoid } from 'nanoid/non-secure';
import type { CitizenReport } from './types';

const CLOUDANT_URL = process.env.EXPO_PUBLIC_CLOUDANT_URL ?? '';
const CLOUDANT_API_KEY = process.env.EXPO_PUBLIC_CLOUDANT_API_KEY ?? '';
const CLOUDANT_DB = process.env.EXPO_PUBLIC_CLOUDANT_DB ?? '';

const headers = {
  Authorization: `Bearer ${CLOUDANT_API_KEY}`,
  'Content-Type': 'application/json',
};

// ---------------------------------------------------------------------------
// Save a new citizen report to Cloudant
// ---------------------------------------------------------------------------

export async function saveReport(
  report: Omit<CitizenReport, '_id' | '_rev' | 'type'>,
): Promise<CitizenReport> {
  const doc: CitizenReport = {
    ...report,
    _id: nanoid(),
    type: 'report',
  };

  const res = await fetch(`${CLOUDANT_URL}/${CLOUDANT_DB}`, {
    method: 'POST',
    headers,
    body: JSON.stringify(doc),
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Cloudant save failed (${res.status}): ${body}`);
  }

  const result = (await res.json()) as { rev: string };
  doc._rev = result.rev;

  return doc;
}

// ---------------------------------------------------------------------------
// Get the most recent 30 citizen reports from Cloudant
// ---------------------------------------------------------------------------

export async function getReports(): Promise<CitizenReport[]> {
  const res = await fetch(
    `${CLOUDANT_URL}/${CLOUDANT_DB}/_all_docs?include_docs=true`,
    { headers },
  );

  if (!res.ok) {
    throw new Error(`Cloudant fetch failed: ${res.status}`);
  }

  const data = (await res.json()) as {
    rows: Array<{ doc: CitizenReport & { type?: string } }>;
  };

  return data.rows
    .map((row) => row.doc)
    .filter((doc) => doc.type === 'report')
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, 30);
}
