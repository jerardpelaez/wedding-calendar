import type { BudgetCategory } from '@/types/budget'

export type BudgetCategoryGroup = 'wedding' | 'personal'

export interface BudgetCategoryConfig {
  label: string
  iconName: string
  color: string
  bgColor: string
  dotColor: string
  defaultSortOrder: number
  group: BudgetCategoryGroup
}

export const budgetCategoryGroups: { key: BudgetCategoryGroup; label: string }[] = [
  { key: 'wedding', label: 'Wedding' },
  { key: 'personal', label: 'Personal & Home' },
]

export const budgetCategories: Record<BudgetCategory, BudgetCategoryConfig> = {
  'venue-catering': {
    label: 'Venue & Catering',
    iconName: 'UtensilsCrossed',
    color: 'text-primary',
    bgColor: 'bg-primary/10',
    dotColor: 'bg-primary',
    defaultSortOrder: 0,
    group: 'wedding',
  },
  'photography-video': {
    label: 'Photography & Video',
    iconName: 'Camera',
    color: 'text-accent-dark',
    bgColor: 'bg-accent/10',
    dotColor: 'bg-accent',
    defaultSortOrder: 1,
    group: 'wedding',
  },
  'attire-beauty': {
    label: 'Attire & Beauty',
    iconName: 'Shirt',
    color: 'text-primary-dark',
    bgColor: 'bg-primary-dark/10',
    dotColor: 'bg-primary-dark',
    defaultSortOrder: 2,
    group: 'wedding',
  },
  'flowers-decor': {
    label: 'Flowers & Decor',
    iconName: 'Flower2',
    color: 'text-accent-dark',
    bgColor: 'bg-accent/10',
    dotColor: 'bg-accent-dark',
    defaultSortOrder: 3,
    group: 'wedding',
  },
  'music-entertainment': {
    label: 'Music & Entertainment',
    iconName: 'Music',
    color: 'text-gold-dark',
    bgColor: 'bg-gold/10',
    dotColor: 'bg-gold',
    defaultSortOrder: 4,
    group: 'wedding',
  },
  'stationery-invitations': {
    label: 'Stationery & Invitations',
    iconName: 'Mail',
    color: 'text-primary',
    bgColor: 'bg-primary/10',
    dotColor: 'bg-primary-light',
    defaultSortOrder: 5,
    group: 'wedding',
  },
  transportation: {
    label: 'Transportation',
    iconName: 'Car',
    color: 'text-primary-dark',
    bgColor: 'bg-primary-dark/10',
    dotColor: 'bg-primary-dark',
    defaultSortOrder: 6,
    group: 'wedding',
  },
  'favors-gifts': {
    label: 'Favors & Gifts',
    iconName: 'Gift',
    color: 'text-gold-dark',
    bgColor: 'bg-gold/10',
    dotColor: 'bg-gold-dark',
    defaultSortOrder: 7,
    group: 'wedding',
  },
  'officiant-ceremony': {
    label: 'Officiant & Ceremony',
    iconName: 'Heart',
    color: 'text-error',
    bgColor: 'bg-error/10',
    dotColor: 'bg-error',
    defaultSortOrder: 8,
    group: 'wedding',
  },
  miscellaneous: {
    label: 'Miscellaneous',
    iconName: 'MoreHorizontal',
    color: 'text-muted',
    bgColor: 'bg-muted/10',
    dotColor: 'bg-muted',
    defaultSortOrder: 9,
    group: 'wedding',
  },
  honeymoon: {
    label: 'Honeymoon & Travel',
    iconName: 'Plane',
    color: 'text-accent-dark',
    bgColor: 'bg-accent/10',
    dotColor: 'bg-accent',
    defaultSortOrder: 10,
    group: 'personal',
  },
  'home-furniture': {
    label: 'Home & Furniture',
    iconName: 'Sofa',
    color: 'text-primary',
    bgColor: 'bg-primary/10',
    dotColor: 'bg-primary',
    defaultSortOrder: 11,
    group: 'personal',
  },
  appliances: {
    label: 'Appliances & Electronics',
    iconName: 'Tv',
    color: 'text-primary-dark',
    bgColor: 'bg-primary-dark/10',
    dotColor: 'bg-primary-dark',
    defaultSortOrder: 12,
    group: 'personal',
  },
  'legal-documents': {
    label: 'Legal & Documents',
    iconName: 'FileText',
    color: 'text-gold-dark',
    bgColor: 'bg-gold/10',
    dotColor: 'bg-gold',
    defaultSortOrder: 13,
    group: 'personal',
  },
  'savings-fund': {
    label: 'Savings & Emergency Fund',
    iconName: 'PiggyBank',
    color: 'text-success',
    bgColor: 'bg-success/10',
    dotColor: 'bg-success',
    defaultSortOrder: 14,
    group: 'personal',
  },
  'home-renovation': {
    label: 'Home Renovation',
    iconName: 'Hammer',
    color: 'text-gold-dark',
    bgColor: 'bg-gold/10',
    dotColor: 'bg-gold-dark',
    defaultSortOrder: 15,
    group: 'personal',
  },
  'other-personal': {
    label: 'Other Personal',
    iconName: 'Briefcase',
    color: 'text-muted',
    bgColor: 'bg-muted/10',
    dotColor: 'bg-muted',
    defaultSortOrder: 16,
    group: 'personal',
  },
}

export const budgetCategoryOptions = Object.entries(budgetCategories).map(([value, config]) => ({
  value: value as BudgetCategory,
  label: config.label,
}))
