import { YEAR } from '@/data/months'

export function useCalendarUtils() {
  function getDaysInMonth(month: number, year: number = YEAR): number {
    return new Date(year, month, 0).getDate()
  }

  function getFirstDayOfMonth(month: number, year: number = YEAR): number {
    return new Date(year, month - 1, 1).getDay()
  }

  function formatDate(year: number, month: number, day: number): string {
    return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`
  }

  function isToday(dateStr: string): boolean {
    const today = new Date()
    const todayStr = formatDate(today.getFullYear(), today.getMonth() + 1, today.getDate())
    return dateStr === todayStr
  }

  function toISODate(date: Date): string {
    return formatDate(date.getFullYear(), date.getMonth() + 1, date.getDate())
  }

  function parseDate(dateStr: string): { year: number; month: number; day: number } {
    const [year, month, day] = dateStr.split('-').map(Number)
    return { year, month, day }
  }

  function getMonthName(month: number): string {
    return new Date(YEAR, month - 1, 1).toLocaleString('default', { month: 'long' })
  }

  function getDayName(dateStr: string): string {
    const date = new Date(dateStr + 'T00:00:00')
    return date.toLocaleString('default', { weekday: 'long' })
  }

  function formatDisplayDate(dateStr: string): string {
    const date = new Date(dateStr + 'T00:00:00')
    return date.toLocaleDateString('default', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  function generateDateRange(startDate: string, endDate: string): string[] {
    const dates: string[] = []
    const current = new Date(startDate + 'T00:00:00')
    const end = new Date(endDate + 'T00:00:00')

    while (current <= end) {
      dates.push(toISODate(current))
      current.setDate(current.getDate() + 1)
    }

    return dates
  }

  return {
    getDaysInMonth,
    getFirstDayOfMonth,
    formatDate,
    isToday,
    toISODate,
    parseDate,
    getMonthName,
    getDayName,
    formatDisplayDate,
    generateDateRange,
  }
}
