<script setup lang="ts">
import type { BudgetExpense } from '@/types/budget'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { formatCurrency, cn } from '@/lib/utils'
import { Pencil, Trash2, Check, Circle } from 'lucide-vue-next'

interface Props {
  expense: BudgetExpense
}

defineProps<Props>()

const emit = defineEmits<{
  edit: [expense: BudgetExpense]
  delete: [id: string]
  togglePaid: [id: string]
}>()

function formatDate(date: string | null): string {
  if (!date) return ''
  return new Date(date + 'T00:00:00').toLocaleDateString('en-PH', {
    month: 'short',
    day: 'numeric',
  })
}
</script>

<template>
  <div class="flex items-center gap-3 py-2.5 px-3 rounded-radius-md hover:bg-day-hover transition-colors">
    <!-- Paid toggle -->
    <button
      class="flex-shrink-0"
      :aria-label="expense.is_paid ? 'Mark as unpaid' : 'Mark as paid'"
      @click="emit('togglePaid', expense.id)"
    >
      <div
        v-if="expense.is_paid"
        class="w-5 h-5 rounded-full bg-success flex items-center justify-center"
      >
        <Check class="w-3 h-3 text-surface" />
      </div>
      <Circle v-else class="w-5 h-5 text-border" />
    </button>

    <!-- Details -->
    <div class="flex-1 min-w-0">
      <div class="flex items-center gap-2">
        <span
          :class="cn('text-sm font-medium truncate', expense.is_paid ? 'text-muted line-through' : 'text-foreground')"
        >
          {{ expense.vendor_name }}
        </span>
        <Badge
          v-if="expense.is_paid"
          class="bg-success/10 text-success text-xs px-1.5 py-0"
        >
          Paid
        </Badge>
      </div>
      <div class="flex items-center gap-2 text-xs text-muted">
        <span v-if="expense.description" class="truncate">{{ expense.description }}</span>
        <span v-if="expense.description && expense.date" class="flex-shrink-0">&middot;</span>
        <span v-if="expense.date" class="flex-shrink-0">{{ formatDate(expense.date) }}</span>
      </div>
    </div>

    <!-- Amount -->
    <span :class="cn('text-sm font-semibold flex-shrink-0', expense.is_paid ? 'text-muted' : 'text-foreground')">
      {{ formatCurrency(Number(expense.amount)) }}
    </span>

    <!-- Actions -->
    <div class="flex items-center gap-0.5 flex-shrink-0">
      <Button
        variant="ghost"
        size="sm"
        class="h-7 w-7 p-0 text-muted hover:text-foreground"
        aria-label="Edit expense"
        @click="emit('edit', expense)"
      >
        <Pencil class="w-3 h-3" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        class="h-7 w-7 p-0 text-muted hover:text-error"
        aria-label="Delete expense"
        @click="emit('delete', expense.id)"
      >
        <Trash2 class="w-3 h-3" />
      </Button>
    </div>
  </div>
</template>
