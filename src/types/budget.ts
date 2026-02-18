export type BudgetCategory =
  | 'venue-catering'
  | 'photography-video'
  | 'attire-beauty'
  | 'flowers-decor'
  | 'music-entertainment'
  | 'stationery-invitations'
  | 'transportation'
  | 'favors-gifts'
  | 'officiant-ceremony'
  | 'miscellaneous'

export interface Budget {
  id: string
  couple_id: string
  total_budget: number
  created_at: string
  updated_at: string
}

export interface BudgetCategoryAllocation {
  id: string
  couple_id: string
  category: BudgetCategory
  estimated_amount: number
  sort_order: number
  created_at: string
  updated_at: string
}

export interface BudgetExpense {
  id: string
  couple_id: string
  category: BudgetCategory
  vendor_name: string
  description: string | null
  amount: number
  is_paid: boolean
  date: string | null
  created_by: string
  created_at: string
  updated_at: string
}
