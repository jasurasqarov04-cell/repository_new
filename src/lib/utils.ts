import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { format, parseISO } from 'date-fns'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function fmtPct(value: number, decimals = 0): string {
  return `${(value * 100).toFixed(decimals)}%`
}

export function fmtDate(dateStr: string, pattern = 'd MMM'): string {
  try { return format(parseISO(dateStr), pattern) }
  catch { return dateStr }
}

export function fmtDateFull(dateStr: string): string {
  return fmtDate(dateStr, 'd MMMM yyyy')
}

export function statusColor(rate: number): string {
  if (rate >= 0.75) return 'success'
  if (rate >= 0.5)  return 'warning'
  return 'danger'
}

export function rateLabel(rate: number): string {
  if (rate >= 0.9)  return 'Excellent'
  if (rate >= 0.75) return 'Good'
  if (rate >= 0.5)  return 'Average'
  if (rate >= 0.25) return 'Low'
  return 'Poor'
}

export function last<T>(arr: T[]): T | undefined {
  return arr[arr.length - 1]
}

export function clamp(v: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, v))
}
