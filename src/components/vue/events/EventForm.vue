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
import { categoryOptions } from '@/data/event-categories'
import type { CalendarEvent, EventCategory } from '@/types/calendar'

interface Props {
  open: boolean
  editEvent?: CalendarEvent | null
  date: string
}

const props = withDefaults(defineProps<Props>(), {
  editEvent: null,
})

const emit = defineEmits<{
  'update:open': [value: boolean]
  save: [data: {
    title: string
    description: string
    time_start: string
    time_end: string
    category: EventCategory
  }]
}>()

const title = ref('')
const description = ref('')
const timeStart = ref('')
const timeEnd = ref('')
const category = ref<EventCategory>('personal')
const saving = ref(false)

const isEditing = computed(() => !!props.editEvent)
const dialogTitle = computed(() => isEditing.value ? 'Edit Event' : 'New Event')

watch(
  () => props.open,
  (open) => {
    if (open && props.editEvent) {
      title.value = props.editEvent.title
      description.value = props.editEvent.description ?? ''
      timeStart.value = props.editEvent.time_start ?? ''
      timeEnd.value = props.editEvent.time_end ?? ''
      category.value = props.editEvent.category
    } else if (open) {
      title.value = ''
      description.value = ''
      timeStart.value = ''
      timeEnd.value = ''
      category.value = 'personal'
    }
  },
)

async function handleSubmit() {
  if (!title.value.trim()) return
  saving.value = true

  emit('save', {
    title: title.value.trim(),
    description: description.value.trim(),
    time_start: timeStart.value || '',
    time_end: timeEnd.value || '',
    category: category.value,
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
          <label for="event-title" class="text-sm font-medium text-foreground">Title</label>
          <Input
            id="event-title"
            v-model="title"
            placeholder="Event title"
            required
          />
        </div>

        <div class="space-y-2">
          <label for="event-desc" class="text-sm font-medium text-foreground">Description</label>
          <Textarea
            id="event-desc"
            v-model="description"
            placeholder="Optional description"
            rows="3"
          />
        </div>

        <div class="grid grid-cols-2 gap-3">
          <div class="space-y-2">
            <label for="event-start" class="text-sm font-medium text-foreground">Start Time</label>
            <Input
              id="event-start"
              v-model="timeStart"
              type="time"
            />
          </div>
          <div class="space-y-2">
            <label for="event-end" class="text-sm font-medium text-foreground">End Time</label>
            <Input
              id="event-end"
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
            :disabled="!title.trim() || saving"
          >
            {{ saving ? 'Saving...' : isEditing ? 'Update' : 'Create' }}
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  </Dialog>
</template>
