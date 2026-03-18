/**
 * Google Sheets data source.
 *
 * Real sheet structure (Checkins tab):
 *   user_id | habit_name | date       | time  | status | weekday
 *   871419921 | Сон       | 2026-03-16 | 17:01 | done   | Monday
 *
 * Apps Script reads the "Checkins" sheet and returns:
 * { "rows": [ { "user_id": "...", "habit_name": "...", ... } ] }
 */

export interface RawSheetRow {
  user_id:    string
  habit_name: string
  date:       string   // YYYY-MM-DD
  time:       string   // HH:MM
  status:     string   // done | skip | pending
  weekday:    string   // Monday, Tuesday, ...
  // optional extras from Habits sheet (injected by Apps Script if present)
  category?:  string
  comment?:   string
}

interface SheetResponse {
  rows: RawSheetRow[]
}

export async function fetchSheetRows(
  endpoint: string,
  userId?: string,
): Promise<RawSheetRow[]> {
  const url = new URL(endpoint)
  if (userId) url.searchParams.set('user_id', userId)

  const res = await fetch(url.toString(), {
    cache:   'no-store',
    headers: { Accept: 'application/json' },
    signal:  AbortSignal.timeout(15_000),
  })

  if (!res.ok) {
    throw new Error(`Sheets endpoint returned ${res.status}: ${res.statusText}`)
  }

  const json: SheetResponse = await res.json()

  if (!Array.isArray(json.rows)) {
    throw new Error('Unexpected response: expected { rows: [...] }')
  }

  return json.rows
}
