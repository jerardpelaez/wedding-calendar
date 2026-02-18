<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { useAuth } from '@/composables/useAuth'
import { useBudget } from '@/composables/useBudget'
import { budgetCategories, budgetCategoryGroups } from '@/data/budget-categories'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Wallet, Plus } from 'lucide-vue-next'
import { withBase, formatCurrency } from '@/lib/utils'
import { toast } from 'vue-sonner'
import type { BudgetCategory, BudgetExpense } from '@/types/budget'
import BudgetSummary from './BudgetSummary.vue'
import BudgetCategoryCard from './BudgetCategoryCard.vue'
import BudgetForm from './BudgetForm.vue'
import CategoryBudgetForm from './CategoryBudgetForm.vue'
import ExpenseForm from './ExpenseForm.vue'

const { state, init } = useAuth()
const {
  loading,
  totalBudget,
  totalEstimated,
  totalSpent,
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
} = useBudget()

const budgetFormOpen = ref(false)
const categoryFormOpen = ref(false)
const expenseFormOpen = ref(false)

const editingCategory = ref<BudgetCategory | null>(null)
const editingCategoryAmount = ref(0)

const editingExpense = ref<BudgetExpense | null>(null)
const defaultExpenseCategory = ref<BudgetCategory>('miscellaneous')

const isAuthenticated = computed(() => state.value.isAuthenticated)
const isLoading = computed(() => state.value.isLoading)
const hasBudget = computed(() => totalBudget.value > 0)

const groupedCategories = computed(() =>
  budgetCategoryGroups.map((group) => ({
    ...group,
    categories: Object.entries(budgetCategories)
      .filter(([, config]) => config.group === group.key)
      .sort(([, a], [, b]) => a.defaultSortOrder - b.defaultSortOrder)
      .map(([key, config]) => ({
        key: key as BudgetCategory,
        config,
      })),
  })),
)

async function handleSetBudget(amount: number) {
  try {
    await setTotalBudget(amount)
    budgetFormOpen.value = false
    toast.success('Budget updated')
  } catch {
    toast.error('Failed to update budget')
  }
}

function handleEditCategory(category: BudgetCategory) {
  editingCategory.value = category
  editingCategoryAmount.value = categoryEstimated(category)
  categoryFormOpen.value = true
}

async function handleSaveCategoryBudget(data: { category: BudgetCategory; amount: number }) {
  try {
    await upsertCategoryBudget(data.category, data.amount)
    categoryFormOpen.value = false
    toast.success('Category budget updated')
  } catch {
    toast.error('Failed to update category budget')
  }
}

function handleAddExpense(category: BudgetCategory) {
  editingExpense.value = null
  defaultExpenseCategory.value = category
  expenseFormOpen.value = true
}

function handleEditExpense(expense: BudgetExpense) {
  editingExpense.value = expense
  defaultExpenseCategory.value = expense.category
  expenseFormOpen.value = true
}

async function handleSaveExpense(data: {
  category: BudgetCategory
  vendor_name: string
  description: string
  amount: number
  is_paid: boolean
  date: string
}) {
  try {
    if (editingExpense.value) {
      await updateExpense(editingExpense.value.id, data)
      toast.success('Expense updated')
    } else {
      await createExpense(data)
      toast.success('Expense added')
    }
    expenseFormOpen.value = false
  } catch {
    toast.error('Failed to save expense')
  }
}

async function handleDeleteExpense(id: string) {
  try {
    await removeExpense(id)
    toast.success('Expense deleted')
  } catch {
    toast.error('Failed to delete expense')
  }
}

async function handleTogglePaid(id: string) {
  try {
    await toggleExpensePaid(id)
  } catch {
    toast.error('Failed to update expense')
  }
}

async function loadData() {
  await fetchAll()
}

onMounted(async () => {
  await init()
  if (state.value.isAuthenticated) {
    await loadData()
    subscribe(() => loadData())
  }
})

onUnmounted(() => {
  unsubscribe()
})
</script>

<template>
  <!-- Auth loading -->
  <div v-if="isLoading" class="space-y-4">
    <Skeleton class="h-32 rounded-radius-xl" />
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <Skeleton v-for="i in 4" :key="i" class="h-40 rounded-radius-xl" />
    </div>
  </div>

  <!-- Not authenticated -->
  <div
    v-else-if="!isAuthenticated"
    class="text-center py-12"
  >
    <Wallet class="w-12 h-12 text-muted mx-auto mb-4" />
    <h2 class="font-display text-2xl font-semibold text-foreground mb-2">Sign in to track your budget</h2>
    <p class="text-muted mb-6">Keep track of your wedding expenses together.</p>
    <a :href="withBase('/login')">
      <Button class="bg-primary text-surface hover:bg-primary-dark">Sign In</Button>
    </a>
  </div>

  <!-- Authenticated -->
  <div v-else class="space-y-6">
    <!-- Data loading -->
    <template v-if="loading">
      <Skeleton class="h-32 rounded-radius-xl" />
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Skeleton v-for="i in 6" :key="i" class="h-40 rounded-radius-xl" />
      </div>
    </template>

    <template v-else>
      <!-- Empty state: no budget set -->
      <div v-if="!hasBudget" class="text-center py-12 bg-surface border border-border rounded-radius-xl">
        <Wallet class="w-12 h-12 text-primary mx-auto mb-4" />
        <h2 class="font-display text-2xl font-semibold text-foreground mb-2">
          Set your wedding budget to get started
        </h2>
        <p class="text-muted mb-6 max-w-md mx-auto">
          Define your total budget and allocate amounts to each category to keep spending on track.
        </p>
        <Button
          class="bg-primary text-surface hover:bg-primary-dark"
          @click="budgetFormOpen = true"
        >
          <Wallet class="w-4 h-4 mr-2" />
          Set Budget
        </Button>
      </div>

      <!-- Budget set: show summary + categories -->
      <template v-else>
        <BudgetSummary
          :total-budget="totalBudget"
          :total-estimated="totalEstimated"
          :total-spent="totalSpent"
          :total-remaining="totalRemaining"
          :budget-progress="budgetProgress"
          @edit-budget="budgetFormOpen = true"
        />

        <!-- Add expense button -->
        <div class="flex items-center justify-between">
          <h2 class="font-display text-xl font-semibold text-foreground">Categories</h2>
          <Button
            size="sm"
            class="bg-primary text-surface hover:bg-primary-dark"
            @click="handleAddExpense('miscellaneous')"
          >
            <Plus class="w-4 h-4 mr-1" />
            Add Expense
          </Button>
        </div>

        <!-- Grouped category cards -->
        <div v-for="group in groupedCategories" :key="group.key" class="space-y-4">
          <h3 class="font-display text-lg font-semibold text-foreground">{{ group.label }}</h3>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <BudgetCategoryCard
              v-for="{ key, config } in group.categories"
              :key="key"
              :category="key"
              :config="config"
              :estimated="categoryEstimated(key)"
              :spent="categorySpent(key)"
              :paid="categoryPaid(key)"
              :expenses="categoryExpenses(key)"
              @edit-category="handleEditCategory"
              @add-expense="handleAddExpense"
              @edit-expense="handleEditExpense"
              @delete-expense="handleDeleteExpense"
              @toggle-expense-paid="handleTogglePaid"
            />
          </div>
        </div>
      </template>
    </template>
  </div>

  <!-- Dialogs -->
  <BudgetForm
    :open="budgetFormOpen"
    :current-amount="totalBudget"
    @update:open="budgetFormOpen = $event"
    @save="handleSetBudget"
  />

  <CategoryBudgetForm
    :open="categoryFormOpen"
    :category="editingCategory"
    :current-amount="editingCategoryAmount"
    @update:open="categoryFormOpen = $event"
    @save="handleSaveCategoryBudget"
  />

  <ExpenseForm
    :open="expenseFormOpen"
    :edit-expense="editingExpense"
    :default-category="defaultExpenseCategory"
    @update:open="expenseFormOpen = $event"
    @save="handleSaveExpense"
  />
</template>
