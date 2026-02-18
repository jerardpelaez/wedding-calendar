import type { BudgetCategory } from '@/types/budget'

export interface BudgetCategoryConfig {
  label: string
  iconName: string
  color: string
  bgColor: string
  dotColor: string
  defaultSortOrder: number
}

export const budgetCategories: Record<BudgetCategory, BudgetCategoryConfig> = {
  'venue-catering': {
    label: 'Venue & Catering',
    iconName: 'UtensilsCrossed',
    color: 'text-primary',
    bgColor: 'bg-primary/10',
    dotColor: 'bg-primary',
    defaultSortOrder: 0,
  },
  'photography-video': {
    label: 'Photography & Video',
    iconName: 'Camera',
    color: 'text-accent-dark',
    bgColor: 'bg-accent/10',
    dotColor: 'bg-accent',
    defaultSortOrder: 1,
  },
  'attire-beauty': {
    label: 'Attire & Beauty',
    iconName: 'Shirt',
    color: 'text-primary-dark',
    bgColor: 'bg-primary-dark/10',
    dotColor: 'bg-primary-dark',
    defaultSortOrder: 2,
  },
  'flowers-decor': {
    label: 'Flowers & Decor',
    iconName: 'Flower2',
    color: 'text-accent-dark',
    bgColor: 'bg-accent/10',
    dotColor: 'bg-accent-dark',
    defaultSortOrder: 3,
  },
  'music-entertainment': {
    label: 'Music & Entertainment',
    iconName: 'Music',
    color: 'text-gold-dark',
    bgColor: 'bg-gold/10',
    dotColor: 'bg-gold',
    defaultSortOrder: 4,
  },
  'stationery-invitations': {
    label: 'Stationery & Invitations',
    iconName: 'Mail',
    color: 'text-primary',
    bgColor: 'bg-primary/10',
    dotColor: 'bg-primary-light',
    defaultSortOrder: 5,
  },
  transportation: {
    label: 'Transportation',
    iconName: 'Car',
    color: 'text-primary-dark',
    bgColor: 'bg-primary-dark/10',
    dotColor: 'bg-primary-dark',
    defaultSortOrder: 6,
  },
  'favors-gifts': {
    label: 'Favors & Gifts',
    iconName: 'Gift',
    color: 'text-gold-dark',
    bgColor: 'bg-gold/10',
    dotColor: 'bg-gold-dark',
    defaultSortOrder: 7,
  },
  'officiant-ceremony': {
    label: 'Officiant & Ceremony',
    iconName: 'Heart',
    color: 'text-error',
    bgColor: 'bg-error/10',
    dotColor: 'bg-error',
    defaultSortOrder: 8,
  },
  miscellaneous: {
    label: 'Miscellaneous',
    iconName: 'MoreHorizontal',
    color: 'text-muted',
    bgColor: 'bg-muted/10',
    dotColor: 'bg-muted',
    defaultSortOrder: 9,
  },
}

export const budgetCategoryOptions = Object.entries(budgetCategories).map(([value, config]) => ({
  value: value as BudgetCategory,
  label: config.label,
}))
