<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog'
import { budgetCategories } from '@/data/budget-categories'
import type { BudgetCategory } from '@/types/budget'

interface Props {
  open: boolean
  category: BudgetCategory | null
  currentAmount: number
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'update:open': [value: boolean]
  save: [data: { category: BudgetCategory; amount: number }]
}>()

const amount = ref('')
const saving = ref(false)

const categoryLabel = computed(() => {
  if (!props.category) return ''
  return budgetCategories[props.category]?.label ?? props.category
})

watch(
  () => props.open,
  (open) => {
    if (open) {
      amount.value = props.currentAmount > 0 ? String(props.currentAmount) : ''
    }
  },
)

async function handleSubmit() {
  if (!props.category) return
  const parsed = parseFloat(amount.value)
  if (isNaN(parsed) || parsed < 0) return
  saving.value = true
  emit('save', { category: props.category, amount: parsed })
  saving.value = false
}
</script>

<template>
  <Dialog :open="open" @update:open="emit('update:open', $event)">
    <DialogContent class="sm:max-w-md bg-surface">
      <DialogHeader>
        <DialogTitle class="font-display text-xl">Set Category Budget</DialogTitle>
      </DialogHeader>

      <form class="space-y-4" @submit.prevent="handleSubmit">
        <div class="space-y-2">
          <label class="text-sm font-medium text-foreground">Category</label>
          <p class="text-sm text-muted">{{ categoryLabel }}</p>
        </div>

        <div class="space-y-2">
          <label for="category-amount" class="text-sm font-medium text-foreground">
            Estimated Amount (PHP)
          </label>
          <Input
            id="category-amount"
            v-model="amount"
            type="number"
            min="0"
            step="100"
            placeholder="e.g. 50000"
            required
          />
        </div>

        <DialogFooter class="gap-2 sm:gap-0">
          <DialogClose as-child>
            <Button type="button" variant="ghost">Cancel</Button>
          </DialogClose>
          <Button
            type="submit"
            class="bg-primary text-surface hover:bg-primary-dark"
            :disabled="!amount || saving"
          >
            {{ saving ? 'Saving...' : 'Save' }}
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  </Dialog>
</template>
