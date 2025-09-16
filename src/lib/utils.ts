import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function parseNumeric(value: string | number | null): number | null {
  if (value === null || value === undefined) return null
  if (typeof value === 'number') return value
  if (typeof value === 'string') {
    if (value.toLowerCase() === 'unknown' || value.toLowerCase() === 'n/a') return null
    const parsed = parseFloat(value.replace(/,/g, ''))
    return isNaN(parsed) ? null : parsed
  }
  return null
}

export function formatCredits(credits: number | null): string {
  if (credits === null) return 'Unknown'
  return new Intl.NumberFormat().format(credits) + ' credits'
}

export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout
  return (...args: Parameters<T>) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}