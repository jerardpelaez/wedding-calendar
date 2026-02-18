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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type { BudgetCategory } from '@/types/budget'

interface CategoryOption {
  value: BudgetCategory
  label: string
}

interface Props {
  open: boolean
  availableCategories: CategoryOption[]
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'update:open': [value: boolean]
  save: [data: { category: BudgetCategory; amount: number }]
}>()

const category = ref<BudgetCategory | ''>('')
const amount = ref('')
const saving = ref(false)

const isValid = computed(() => category.value !== '' && amount.value && parseFloat(amount.value) >= 0)

watch(
  () => props.open,
  (open) => {
    if (open) {
      category.value = props.availableCategories[0]?.value ?? ''
      amount.value = ''
    }
  },
)

async function handleSubmit() {
  if (!category.value) return
  const parsed = parseFloat(amount.value)
  if (isNaN(parsed) || parsed < 0) return
  saving.value = true
  emit('save', { category: category.value as BudgetCategory, amount: parsed })
  saving.value = false
}
</script>

<template>
  <Dialog :open="open" @update:open="emit('update:open', $event)">
    <DialogContent class="sm:max-w-md bg-surface">
      <DialogHeader>
        <DialogTitle class="font-display text-xl">Add Category</DialogTitle>
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
                v-for="opt in availableCategories"
                :key="opt.value"
                :value="opt.value"
              >
                {{ opt.label }}
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div class="space-y-2">
          <label for="add-category-amount" class="text-sm font-medium text-foreground">
            Estimated Budget (PHP)
          </label>
          <Input
            id="add-category-amount"
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
            :disabled="!isValid || saving"
          >
            {{ saving ? 'Saving...' : 'Add Category' }}
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  </Dialog>
</template>
