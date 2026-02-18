import { ref, computed } from 'vue'
import { supabase } from '@/lib/supabase'
import { useAuth } from './useAuth'
import { budgetCategories } from '@/data/budget-categories'
import type { Budget, BudgetCategoryAllocation, BudgetExpense, BudgetCategory } from '@/types/budget'
import type { RealtimeChannel } from '@supabase/supabase-js'

const budget = ref<Budget | null>(null)
const categories = ref<BudgetCategoryAllocation[]>([])
const expenses = ref<BudgetExpense[]>([])
let channel: RealtimeChannel | null = null

export function useBudget() {
  const { state } = useAuth()
  const loading = ref(false)
  const error = ref<string | null>(null)

  const totalBudget = computed(() => budget.value?.total_budget ?? 0)

  const totalEstimated = computed(() =>
    categories.value.reduce((sum, c) => sum + Number(c.estimated_amount), 0),
  )

  const totalSpent = computed(() =>
    expenses.value.reduce((sum, e) => sum + Number(e.amount), 0),
  )

  const totalPaid = computed(() =>
    expenses.value.filter((e) => e.is_paid).reduce((sum, e) => sum + Number(e.amount), 0),
  )

  const totalRemaining = computed(() => totalBudget.value - totalSpent.value)

  const budgetProgress = computed(() => {
    if (totalBudget.value <= 0) return 0
    return Math.round((totalSpent.value / totalBudget.value) * 100)
  })

  function categoryEstimated(category: BudgetCategory): number {
    const found = categories.value.find((c) => c.category === category)
    return found ? Number(found.estimated_amount) : 0
  }

  function categorySpent(category: BudgetCategory): number {
    return expenses.value
      .filter((e) => e.category === category)
      .reduce((sum, e) => sum + Number(e.amount), 0)
  }

  function categoryPaid(category: BudgetCategory): number {
    return expenses.value
      .filter((e) => e.category === category && e.is_paid)
      .reduce((sum, e) => sum + Number(e.amount), 0)
  }

  function categoryExpenses(category: BudgetCategory): BudgetExpense[] {
    return expenses.value.filter((e) => e.category === category)
  }

  async function fetchAll() {
    const coupleId = state.value.coupleId
    if (!coupleId) return

    loading.value = true
    error.value = null

    const [budgetRes, categoriesRes, expensesRes] = await Promise.all([
      supabase.from('budgets').select('*').eq('couple_id', coupleId).maybeSingle(),
      supabase.from('budget_categories').select('*').eq('couple_id', coupleId).order('sort_order'),
      supabase.from('budget_expenses').select('*').eq('couple_id', coupleId).order('created_at', { ascending: false }),
    ])

    if (budgetRes.error) {
      error.value = budgetRes.error.message
    } else {
      budget.value = budgetRes.data as Budget | null
    }

    if (categoriesRes.error) {
      error.value = categoriesRes.error.message
    } else {
      categories.value = categoriesRes.data as BudgetCategoryAllocation[]
    }

    if (expensesRes.error) {
      error.value = expensesRes.error.message
    } else {
      expenses.value = expensesRes.data as BudgetExpense[]
    }

    loading.value = false
  }

  async function setTotalBudget(amount: number) {
    const coupleId = state.value.coupleId
    if (!coupleId) throw new Error('Not authenticated')

    if (budget.value) {
      const { data, error: err } = await supabase
        .from('budgets')
        .update({ total_budget: amount, updated_at: new Date().toISOString() })
        .eq('id', budget.value.id)
        .select()
        .single()

      if (err) throw err
      budget.value = data as Budget
    } else {
      const { data, error: err } = await supabase
        .from('budgets')
        .insert({ couple_id: coupleId, total_budget: amount })
        .select()
        .single()

      if (err) throw err
      budget.value = data as Budget
    }
  }

  async function upsertCategoryBudget(category: BudgetCategory, estimatedAmount: number) {
    const coupleId = state.value.coupleId
    if (!coupleId) throw new Error('Not authenticated')

    const existing = categories.value.find((c) => c.category === category)
    const sortOrder = budgetCategories[category]?.defaultSortOrder ?? 0

    if (existing) {
      const { data, error: err } = await supabase
        .from('budget_categories')
        .update({ estimated_amount: estimatedAmount, updated_at: new Date().toISOString() })
        .eq('id', existing.id)
        .select()
        .single()

      if (err) throw err
      const idx = categories.value.findIndex((c) => c.id === existing.id)
      if (idx !== -1) categories.value[idx] = data as BudgetCategoryAllocation
    } else {
      const { data, error: err } = await supabase
        .from('budget_categories')
        .insert({
          couple_id: coupleId,
          category,
          estimated_amount: estimatedAmount,
          sort_order: sortOrder,
        })
        .select()
        .single()

      if (err) throw err
      categories.value.push(data as BudgetCategoryAllocation)
    }
  }

  async function createExpense(expense: {
    category: BudgetCategory
    vendor_name: string
    description?: string
    amount: number
    is_paid?: boolean
    date?: string
  }) {
    const coupleId = state.value.coupleId
    const userId = state.value.userId
    if (!coupleId || !userId) throw new Error('Not authenticated')

    const { data, error: err } = await supabase
      .from('budget_expenses')
      .insert({
        couple_id: coupleId,
        created_by: userId,
        ...expense,
      })
      .select()
      .single()

    if (err) throw err
    expenses.value.unshift(data as BudgetExpense)
    return data as BudgetExpense
  }

  async function updateExpense(
    id: string,
    updates: Partial<Pick<BudgetExpense, 'category' | 'vendor_name' | 'description' | 'amount' | 'is_paid' | 'date'>>,
  ) {
    const { data, error: err } = await supabase
      .from('budget_expenses')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single()

    if (err) throw err
    const idx = expenses.value.findIndex((e) => e.id === id)
    if (idx !== -1) expenses.value[idx] = data as BudgetExpense
    return data as BudgetExpense
  }

  async function removeExpense(id: string) {
    const { error: err } = await supabase
      .from('budget_expenses')
      .delete()
      .eq('id', id)

    if (err) throw err
    expenses.value = expenses.value.filter((e) => e.id !== id)
  }

  async function toggleExpensePaid(id: string) {
    const expense = expenses.value.find((e) => e.id === id)
    if (!expense) return

    await updateExpense(id, { is_paid: !expense.is_paid })
  }

  function subscribe(onchange: () => void) {
    const coupleId = state.value.coupleId
    if (!coupleId) return

    channel = supabase
      .channel('budget-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'budgets',
          filter: `couple_id=eq.${coupleId}`,
        },
        () => onchange(),
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'budget_categories',
          filter: `couple_id=eq.${coupleId}`,
        },
        () => onchange(),
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'budget_expenses',
          filter: `couple_id=eq.${coupleId}`,
        },
        () => onchange(),
      )
      .subscribe()
  }

  function unsubscribe() {
    if (channel) {
      supabase.removeChannel(channel)
      channel = null
    }
  }

  return {
    budget,
    categories,
    expenses,
    loading,
    error,
    totalBudget,
    totalEstimated,
    totalSpent,
    totalPaid,
    totalRemaining,
    budgetProgress,
    categoryEstimated,
    categorySpent,
    categoryPaid,
    categoryExpenses,
    fetchAll,
    setTotalBudget,
    upsertCategoryBudget,
    createExpense,
    updateExpense,
    removeExpense,
    toggleExpensePaid,
    subscribe,
    unsubscribe,
  }
}
