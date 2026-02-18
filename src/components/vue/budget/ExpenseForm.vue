<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { budgetCategoryOptions } from '@/data/budget-categories'
import type { BudgetCategory, BudgetExpense } from '@/types/budget'

interface Props {
  open: boolean
  editExpense?: BudgetExpense | null
  defaultCategory?: BudgetCategory
}

const props = withDefaults(defineProps<Props>(), {
  editExpense: null,
  defaultCategory: 'miscellaneous',
})

const emit = defineEmits<{
  'update:open': [value: boolean]
  save: [data: {
    category: BudgetCategory
    vendor_name: string
    description: string
    amount: number
    is_paid: boolean
    date: string
  }]
}>()

const category = ref<BudgetCategory>('miscellaneous')
const vendorName = ref('')
const description = ref('')
const amount = ref('')
const isPaid = ref(false)
const date = ref('')
const saving = ref(false)

const isEditing = computed(() => !!props.editExpense)
const dialogTitle = computed(() => isEditing.value ? 'Edit Expense' : 'Add Expense')

watch(
  () => props.open,
  (open) => {
    if (open && props.editExpense) {
      category.value = props.editExpense.category
      vendorName.value = props.editExpense.vendor_name
      description.value = props.editExpense.description ?? ''
      amount.value = String(props.editExpense.amount)
      isPaid.value = props.editExpense.is_paid
      date.value = props.editExpense.date ?? ''
    } else if (open) {
      category.value = props.defaultCategory
      vendorName.value = ''
      description.value = ''
      amount.value = ''
      isPaid.value = false
      date.value = ''
    }
  },
)

async function handleSubmit() {
  if (!vendorName.value.trim()) return
  const parsed = parseFloat(amount.value)
  if (isNaN(parsed) || parsed < 0) return

  saving.value = true
  emit('save', {
    category: category.value,
    vendor_name: vendorName.value.trim(),
    description: description.value.trim(),
    amount: parsed,
    is_paid: isPaid.value,
    date: date.value,
  })
  saving.value = false
}
</script>

<template>
  <Dialog :open="open" @update:open="emit('update:open', $event)">
    <DialogContent class="sm:max-w-md bg-surface">
      <DialogHeader>
        <DialogTitle class="font-display text-xl">{{ dialogTitle }}</DialogTitle>
      </DialogHeader>

      <form class="space-y-4" @submit.prevent="handleSubmit">
        <div class="space-y-2">
          <label class="text-sm font-medium text-foreground">Category</label>
          <Select v-model="category">
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem
                v-for="opt in budgetCategoryOptions"
                :key="opt.value"
                :value="opt.value"
              >
                {{ opt.label }}
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div class="space-y-2">
          <label for="expense-vendor" class="text-sm font-medium text-foreground">Vendor Name</label>
          <Input
            id="expense-vendor"
            v-model="vendorName"
            placeholder="e.g. Hotel Manila"
            required
          />
        </div>

        <div class="space-y-2">
          <label for="expense-desc" class="text-sm font-medium text-foreground">Description</label>
          <Textarea
            id="expense-desc"
            v-model="description"
            placeholder="Optional details"
            rows="2"
          />
        </div>

        <div class="grid grid-cols-2 gap-3">
          <div class="space-y-2">
            <label for="expense-amount" class="text-sm font-medium text-foreground">Amount (PHP)</label>
            <Input
              id="expense-amount"
              v-model="amount"
              type="number"
              min="0"
              step="100"
              placeholder="0"
              required
            />
          </div>
          <div class="space-y-2">
            <label for="expense-date" class="text-sm font-medium text-foreground">Date</label>
            <Input
              id="expense-date"
              v-model="date"
              type="date"
            />
          </div>
        </div>

        <div class="flex items-center gap-2">
          <Checkbox
            id="expense-paid"
            :checked="isPaid"
            @update:checked="isPaid = $event as boolean"
          />
          <label for="expense-paid" class="text-sm font-medium text-foreground cursor-pointer">
            Already paid
          </label>
        </div>

        <DialogFooter class="gap-2 sm:gap-0">
          <DialogClose as-child>
            <Button type="button" variant="ghost">Cancel</Button>
          </DialogClose>
          <Button
            type="submit"
            class="bg-primary text-surface hover:bg-primary-dark"
            :disabled="!vendorName.trim() || !amount || saving"
          >
            {{ saving ? 'Saving...' : isEditing ? 'Update' : 'Add Expense' }}
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  </Dialog>
</template>
