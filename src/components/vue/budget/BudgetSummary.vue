<script setup lang="ts">
import { computed } from 'vue'
import { Progress } from '@/components/ui/progress'
import { Button } from '@/components/ui/button'
import { formatCurrency, cn } from '@/lib/utils'
import { Pencil, Wallet, TrendingUp, Receipt, PiggyBank } from 'lucide-vue-next'

interface Props {
  totalBudget: number
  totalEstimated: number
  totalSpent: number
  totalRemaining: number
  budgetProgress: number
}

const props = defineProps<Props>()

const emit = defineEmits<{
  editBudget: []
}>()

const progressColor = computed(() => {
  if (props.budgetProgress >= 100) return 'text-error'
  if (props.budgetProgress >= 75) return 'text-gold-dark'
  return 'text-success'
})

const progressBg = computed(() => {
  if (props.budgetProgress >= 100) return '[&>div]:bg-error'
  if (props.budgetProgress >= 75) return '[&>div]:bg-gold'
  return '[&>div]:bg-success'
})

const remainingColor = computed(() => {
  if (props.totalRemaining < 0) return 'text-error'
  return 'text-success'
})

const cards = computed(() => [
  {
    label: 'Total Budget',
    value: formatCurrency(props.totalBudget),
    icon: Wallet,
    color: 'text-primary',
    bgColor: 'bg-primary/10',
  },
  {
    label: 'Estimated',
    value: formatCurrency(props.totalEstimated),
    icon: TrendingUp,
    color: 'text-gold-dark',
    bgColor: 'bg-gold/10',
  },
  {
    label: 'Spent',
    value: formatCurrency(props.totalSpent),
    icon: Receipt,
    color: 'text-accent-dark',
    bgColor: 'bg-accent/10',
  },
  {
    label: 'Remaining',
    value: formatCurrency(props.totalRemaining),
    icon: PiggyBank,
    color: remainingColor.value,
    bgColor: props.totalRemaining < 0 ? 'bg-error/10' : 'bg-success/10',
  },
])
</script>

<template>
  <div class="space-y-4">
    <!-- Summary cards -->
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-3">
      <div
        v-for="card in cards"
        :key="card.label"
        class="bg-surface border border-border rounded-radius-xl p-4"
      >
        <div class="flex items-center gap-2 mb-2">
          <div :class="cn('p-1.5 rounded-radius-md', card.bgColor)">
            <component :is="card.icon" :class="cn('w-4 h-4', card.color)" />
          </div>
          <span class="text-xs text-muted font-medium">{{ card.label }}</span>
        </div>
        <p :class="cn('text-lg sm:text-xl font-semibold', card.color)">
          {{ card.value }}
        </p>
      </div>
    </div>

    <!-- Overall progress bar -->
    <div v-if="totalBudget > 0" class="bg-surface border border-border rounded-radius-xl p-4">
      <div class="flex items-center justify-between mb-2">
        <span class="text-sm font-medium text-foreground">Overall Budget Usage</span>
        <div class="flex items-center gap-2">
          <span :class="cn('text-sm font-semibold', progressColor)">{{ budgetProgress }}%</span>
          <Button
            variant="ghost"
            size="sm"
            class="h-7 w-7 p-0 text-muted hover:text-foreground"
            aria-label="Edit budget"
            @click="emit('editBudget')"
          >
            <Pencil class="w-3.5 h-3.5" />
          </Button>
        </div>
      </div>
      <Progress
        :model-value="Math.min(budgetProgress, 100)"
        :class="cn('h-2.5 bg-border', progressBg)"
      />
      <p class="text-xs text-muted mt-1.5">
        {{ formatCurrency(totalSpent) }} of {{ formatCurrency(totalBudget) }} spent
      </p>
    </div>
  </div>
</template>
