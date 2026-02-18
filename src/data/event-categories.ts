import type { EventCategory } from '@/types/calendar'

export interface CategoryConfig {
  label: string
  color: string
  bgColor: string
  dotColor: string
}

export const eventCategories: Record<EventCategory, CategoryConfig> = {
  'wedding-prep': {
    label: 'Wedding Prep',
    color: 'text-primary',
    bgColor: 'bg-primary/10',
    dotColor: 'bg-primary',
  },
  appointment: {
    label: 'Appointment',
    color: 'text-gold-dark',
    bgColor: 'bg-gold/10',
    dotColor: 'bg-gold',
  },
  celebration: {
    label: 'Celebration',
    color: 'text-accent-dark',
    bgColor: 'bg-accent/10',
    dotColor: 'bg-accent',
  },
  travel: {
    label: 'Travel',
    color: 'text-primary-dark',
    bgColor: 'bg-primary-dark/10',
    dotColor: 'bg-primary-dark',
  },
  personal: {
    label: 'Personal',
    color: 'text-muted',
    bgColor: 'bg-muted/10',
    dotColor: 'bg-muted',
  },
  deadline: {
    label: 'Deadline',
    color: 'text-error',
    bgColor: 'bg-error/10',
    dotColor: 'bg-error',
  },
}

export const categoryOptions = Object.entries(eventCategories).map(([value, config]) => ({
  value: value as EventCategory,
  label: config.label,
}))
