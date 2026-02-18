<script setup lang="ts">
import { ref, watch } from 'vue'
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

interface Props {
  open: boolean
  currentAmount: number
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'update:open': [value: boolean]
  save: [amount: number]
}>()

const amount = ref('')
const saving = ref(false)

watch(
  () => props.open,
  (open) => {
    if (open) {
      amount.value = props.currentAmount > 0 ? String(props.currentAmount) : ''
    }
  },
)

async function handleSubmit() {
  const parsed = parseFloat(amount.value)
  if (isNaN(parsed) || parsed < 0) return
  saving.value = true
  emit('save', parsed)
  saving.value = false
}
</script>

<template>
  <Dialog :open="open" @update:open="emit('update:open', $event)">
    <DialogContent class="sm:max-w-md bg-surface">
      <DialogHeader>
        <DialogTitle class="font-display text-xl">Set Wedding Budget</DialogTitle>
      </DialogHeader>

      <form class="space-y-4" @submit.prevent="handleSubmit">
        <div class="space-y-2">
          <label for="budget-amount" class="text-sm font-medium text-foreground">
            Total Budget (PHP)
          </label>
          <Input
            id="budget-amount"
            v-model="amount"
            type="number"
            min="0"
            step="1000"
            placeholder="e.g. 500000"
            required
          />
          <p class="text-xs text-muted">
            Set the overall budget cap for your wedding.
          </p>
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
            {{ saving ? 'Saving...' : 'Save Budget' }}
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  </Dialog>
</template>
