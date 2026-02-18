export type EventCategory = 'wedding-prep' | 'appointment' | 'celebration' | 'travel' | 'personal' | 'deadline'

export interface CalendarEvent {
  id: string
  couple_id: string
  date: string
  title: string
  description: string | null
  time_start: string | null
  time_end: string | null
  category: EventCategory
  created_by: string
  created_at: string
  updated_at: string
}

export interface CalendarDay {
  date: string
  dayOfMonth: number
  isCurrentMonth: boolean
  isToday: boolean
  events: CalendarEvent[]
  hasPhotos: boolean
}

export interface MonthData {
  number: number
  name: string
  shortName: string
  daysInMonth: number
}
