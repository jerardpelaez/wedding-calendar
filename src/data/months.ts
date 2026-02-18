import type { MonthData } from '@/types/calendar'

export const YEAR = 2026

export const months: MonthData[] = [
  { number: 1, name: 'January', shortName: 'Jan', daysInMonth: 31 },
  { number: 2, name: 'February', shortName: 'Feb', daysInMonth: 28 },
  { number: 3, name: 'March', shortName: 'Mar', daysInMonth: 31 },
  { number: 4, name: 'April', shortName: 'Apr', daysInMonth: 30 },
  { number: 5, name: 'May', shortName: 'May', daysInMonth: 31 },
  { number: 6, name: 'June', shortName: 'Jun', daysInMonth: 30 },
  { number: 7, name: 'July', shortName: 'Jul', daysInMonth: 31 },
  { number: 8, name: 'August', shortName: 'Aug', daysInMonth: 31 },
  { number: 9, name: 'September', shortName: 'Sep', daysInMonth: 30 },
  { number: 10, name: 'October', shortName: 'Oct', daysInMonth: 31 },
  { number: 11, name: 'November', shortName: 'Nov', daysInMonth: 30 },
  { number: 12, name: 'December', shortName: 'Dec', daysInMonth: 31 },
]

export function getMonth(monthNumber: number): MonthData | undefined {
  return months.find((m) => m.number === monthNumber)
}
