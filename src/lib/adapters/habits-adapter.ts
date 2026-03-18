/**
 * Converts real Checkins rows → domain types.
 *
 * Input row (from your Google Sheets):
 *   user_id | habit_name | date       | time  | status | weekday
 */
import { format } from 'date-fns'
import type { Habit, HabitEntry, HabitStatus } from '@/types'
import type { RawSheetRow } from '@/lib/api/google-sheets'

function normalizeStatus(raw: string): HabitStatus {
  const s = raw.toLowerCase().trim()
  if (s === 'done' || s === 'completed') return 'completed'
  if (s === 'skip' || s === 'skipped')   return 'skipped'
  if (s === 'pending')                   return 'pending'
  return 'missed'
}

// Strip emoji from habit names like "□ Чтение книг" → "Чтение книг"
function cleanName(name: string): string {
  return name.replace(/^[\p{Emoji}\p{So}\s]+/u, '').trim()
}

export function extractHabits(rows: RawSheetRow[]): Habit[] {
  const seen = new Map<string, Habit>()

  for (const row of rows) {
    const name = cleanName(row.habit_name)
    const key  = name.toLowerCase()
    if (!seen.has(key)) {
      // Find earliest date this habit appeared = createdAt
      seen.set(key, {
        id:        `habit-${key.replace(/\s+/g, '-')}`,
        name,
        category:  row.category?.trim() || 'General',
        createdAt: row.date || format(new Date(), 'yyyy-MM-dd'),
        order:     seen.size + 1,
      })
    }
  }

  return Array.from(seen.values())
}

export function rowsToEntries(
  rows: RawSheetRow[],
  habits: Habit[],
): HabitEntry[] {
  const habitByName = new Map(
    habits.map(h => [h.name.toLowerCase(), h]),
  )

  return rows.map((row, idx) => {
    const name  = cleanName(row.habit_name).toLowerCase()
    const habit = habitByName.get(name)
    if (!habit) return null

    // Build ISO timestamp from date + time columns
    const timestamp = row.time
      ? `${row.date}T${row.time}:00.000Z`
      : `${row.date}T00:00:00.000Z`

    return {
      id:        `entry-${idx}`,
      habitId:   habit.id,
      date:      row.date.trim(),
      status:    normalizeStatus(row.status),
      note:      row.comment?.trim() || undefined,
      timestamp,
    } as HabitEntry
  }).filter(Boolean) as HabitEntry[]
}
