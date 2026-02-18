<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Dialog,
  DialogScrollContent,
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
import { categoryOptions } from '@/data/event-categories'
import { useEvents } from '@/composables/useEvents'
import { useCalendarUtils } from '@/composables/useCalendarUtils'
import { toast } from 'vue-sonner'
import type { EventCategory } from '@/types/calendar'

interface Props {
  open: boolean
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'update:open': [value: boolean]
}>()

const { createBulk } = useEvents()
const { generateDateRange } = useCalendarUtils()

const MAX_RANGE_DAYS = 90

const startDate = ref('')
const endDate = ref('')
const title = ref('')
const description = ref('')
const timeStart = ref('')
const timeEnd = ref('')
const category = ref<EventCategory>('personal')
const saving = ref(false)

const dateRange = computed(() => {
  if (!startDate.value || !endDate.value) return []
  if (endDate.value < startDate.value) return []
  return generateDateRange(startDate.value, endDate.value)
})

const rangeCount = computed(() => dateRange.value.length)
const rangeTooLarge = computed(() => rangeCount.value > MAX_RANGE_DAYS)
const canSubmit = computed(() =>
  title.value.trim()
  && startDate.value
  && endDate.value
  && rangeCount.value > 0
  && !rangeTooLarge.value
  && !saving.value,
)

watch(
  () => props.open,
  (open) => {
    if (open) {
      startDate.value = ''
      endDate.value = ''
      title.value = ''
      description.value = ''
      timeStart.value = ''
      timeEnd.value = ''
      category.value = 'personal'
    }
  },
)

async function handleSubmit() {
  if (!canSubmit.value) return
  saving.value = true

  try {
    const events = dateRange.value.map((date) => ({
      date,
      title: title.value.trim(),
      description: description.value.trim() || undefined,
      time_start: timeStart.value || undefined,
      time_end: timeEnd.value || undefined,
      category: category.value,
    }))

    await createBulk(events)
    toast.success(`Created ${events.length} events`)
    emit('update:open', false)
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to create events'
    toast.error(message)
  } finally {
    saving.value = false
  }
}
</script>

<template>
  <Dialog :open="open" @update:open="emit('update:open', $event)">
    <DialogScrollContent class="sm:max-w-md bg-surface">
      <DialogHeader>
        <DialogTitle class="font-display text-xl">Bulk Add Events</DialogTitle>
      </DialogHeader>

      <form class="space-y-4" @submit.prevent="handleSubmit">
        <div class="grid grid-cols-2 gap-3">
          <div class="space-y-2">
            <label for="bulk-start-date" class="text-sm font-medium text-foreground">Start Date</label>
            <Input
              id="bulk-start-date"
              v-model="startDate"
              type="date"
              min="2026-01-01"
              max="2026-12-31"
              required
            />
          </div>
          <div class="space-y-2">
            <label for="bulk-end-date" class="text-sm font-medium text-foreground">End Date</label>
            <Input
              id="bulk-end-date"
              v-model="endDate"
              type="date"
              :min="startDate || '2026-01-01'"
              max="2026-12-31"
              required
            />
          </div>
        </div>

        <div v-if="rangeCount > 0" class="text-sm">
          <span
            v-if="rangeTooLarge"
            class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-error/10 text-error"
          >
            Range too large ({{ rangeCount }} days, max {{ MAX_RANGE_DAYS }})
          </span>
          <span
            v-else
            class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-accent/10 text-accent-dark"
          >
            Will create {{ rangeCount }} {{ rangeCount === 1 ? 'event' : 'events' }}
          </span>
        </div>

        <div class="space-y-2">
          <label for="bulk-title" class="text-sm font-medium text-foreground">Title</label>
          <Input
            id="bulk-title"
            v-model="title"
            placeholder="Event title"
            required
          />
        </div>

        <div class="space-y-2">
          <label for="bulk-desc" class="text-sm font-medium text-foreground">Description</label>
          <Textarea
            id="bulk-desc"
            v-model="description"
            placeholder="Optional description"
            rows="3"
          />
        </div>

        <div class="grid grid-cols-2 gap-3">
          <div class="space-y-2">
            <label for="bulk-start-time" class="text-sm font-medium text-foreground">Start Time</label>
            <Input
              id="bulk-start-time"
              v-model="timeStart"
              type="time"
            />
          </div>
          <div class="space-y-2">
            <label for="bulk-end-time" class="text-sm font-medium text-foreground">End Time</label>
            <Input
              id="bulk-end-time"
              v-model="timeEnd"
              type="time"
            />
          </div>
        </div>

        <div class="space-y-2">
          <label class="text-sm font-medium text-foreground">Category</label>
          <Select v-model="category">
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem
                v-for="opt in categoryOptions"
                :key="opt.value"
                :value="opt.value"
              >
                {{ opt.label }}
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <DialogFooter class="gap-2 sm:gap-0">
          <DialogClose as-child>
            <Button type="button" variant="ghost">Cancel</Button>
          </DialogClose>
          <Button
            type="submit"
            class="bg-primary text-surface hover:bg-primary-dark"
            :disabled="!canSubmit"
          >
            {{ saving ? 'Creating...' : `Create ${rangeCount || ''} Events` }}
          </Button>
        </DialogFooter>
      </form>
    </DialogScrollContent>
  </Dialog>
</template>
