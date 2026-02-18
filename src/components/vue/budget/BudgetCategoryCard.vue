<script setup lang="ts">
import { ref, computed } from 'vue'
import { Progress } from '@/components/ui/progress'
import { Button } from '@/components/ui/button'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
import { formatCurrency, cn } from '@/lib/utils'
import {
  Pencil,
  Plus,
  Trash2,
  ChevronDown,
  UtensilsCrossed,
  Camera,
  Shirt,
  Flower2,
  Music,
  Mail,
  Car,
  Gift,
  Heart,
  MoreHorizontal,
  Plane,
  Sofa,
  Tv,
  FileText,
  PiggyBank,
  Hammer,
  Briefcase,
} from 'lucide-vue-next'
import type { BudgetCategory, BudgetExpense } from '@/types/budget'
import type { BudgetCategoryConfig } from '@/data/budget-categories'
import ExpenseItem from './ExpenseItem.vue'

const iconMap: Record<string, ReturnType<typeof UtensilsCrossed>> = {
  UtensilsCrossed,
  Camera,
  Shirt,
  Flower2,
  Music,
  Mail,
  Car,
  Gift,
  Heart,
  MoreHorizontal,
  Plane,
  Sofa,
  Tv,
  FileText,
  PiggyBank,
  Hammer,
  Briefcase,
}

interface Props {
  category: BudgetCategory
  config: BudgetCategoryConfig
  estimated: number
  spent: number
  paid: number
  expenses: BudgetExpense[]
}

const props = defineProps<Props>()

const emit = defineEmits<{
  editCategory: [category: BudgetCategory]
  deleteCategory: [category: BudgetCategory]
  addExpense: [category: BudgetCategory]
  editExpense: [expense: BudgetExpense]
  deleteExpense: [id: string]
  toggleExpensePaid: [id: string]
}>()

const isOpen = ref(false)

const icon = computed(() => iconMap[props.config.iconName] ?? MoreHorizontal)

const progress = computed(() => {
  if (props.estimated <= 0) return 0
  return Math.round((props.spent / props.estimated) * 100)
})

const progressColor = computed(() => {
  if (progress.value >= 100) return '[&>div]:bg-error'
  if (progress.value >= 75) return '[&>div]:bg-gold'
  return '[&>div]:bg-success'
})

const progressTextColor = computed(() => {
  if (progress.value >= 100) return 'text-error'
  if (progress.value >= 75) return 'text-gold-dark'
  return 'text-success'
})
</script>

<template>
  <Collapsible v-model:open="isOpen" class="bg-surface border border-border rounded-radius-xl overflow-hidden">
    <!-- Header -->
    <div class="p-4">
      <div class="flex items-start justify-between gap-3">
        <div class="flex items-center gap-3 min-w-0">
          <div :class="cn('p-2 rounded-radius-md flex-shrink-0', config.bgColor)">
            <component :is="icon" :class="cn('w-4 h-4', config.color)" />
          </div>
          <div class="min-w-0">
            <h3 class="text-sm font-semibold text-foreground truncate">{{ config.label }}</h3>
            <div class="flex items-center gap-2 text-xs text-muted">
              <span>{{ formatCurrency(spent) }} spent</span>
              <span v-if="estimated > 0">&middot;</span>
              <span v-if="estimated > 0">{{ formatCurrency(estimated) }} budgeted</span>
            </div>
          </div>
        </div>

        <div class="flex items-center gap-1 flex-shrink-0">
          <Button
            variant="ghost"
            size="sm"
            class="h-7 w-7 p-0 text-muted hover:text-foreground"
            aria-label="Edit category budget"
            @click="emit('editCategory', category)"
          >
            <Pencil class="w-3 h-3" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            class="h-7 w-7 p-0 text-muted hover:text-error"
            aria-label="Delete category"
            @click="emit('deleteCategory', category)"
          >
            <Trash2 class="w-3 h-3" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            class="h-7 w-7 p-0 text-primary hover:text-primary-dark"
            aria-label="Add expense"
            @click="emit('addExpense', category)"
          >
            <Plus class="w-3.5 h-3.5" />
          </Button>
        </div>
      </div>

      <!-- Progress bar -->
      <div v-if="estimated > 0" class="mt-3">
        <div class="flex items-center justify-between mb-1">
          <span class="text-xs text-muted">{{ expenses.length }} {{ expenses.length === 1 ? 'expense' : 'expenses' }}</span>
          <span :class="cn('text-xs font-medium', progressTextColor)">{{ progress }}%</span>
        </div>
        <Progress
          :model-value="Math.min(progress, 100)"
          :class="cn('h-1.5 bg-border', progressColor)"
        />
      </div>
    </div>

    <!-- Expense list toggle -->
    <div v-if="expenses.length > 0" class="border-t border-border">
      <CollapsibleTrigger class="flex items-center justify-between w-full px-4 py-2.5 text-xs text-muted hover:bg-day-hover transition-colors">
        <span>{{ expenses.length }} {{ expenses.length === 1 ? 'expense' : 'expenses' }}</span>
        <ChevronDown :class="cn('w-3.5 h-3.5 transition-transform', isOpen && 'rotate-180')" />
      </CollapsibleTrigger>

      <CollapsibleContent>
        <div class="px-2 pb-2">
          <ExpenseItem
            v-for="expense in expenses"
            :key="expense.id"
            :expense="expense"
            @edit="emit('editExpense', $event)"
            @delete="emit('deleteExpense', $event)"
            @toggle-paid="emit('toggleExpensePaid', $event)"
          />
        </div>
      </CollapsibleContent>
    </div>
  </Collapsible>
</template>
