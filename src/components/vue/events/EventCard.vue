<script setup lang="ts">
import type { CalendarEvent } from '@/types/calendar'
import { eventCategories } from '@/data/event-categories'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Clock, Pencil, Trash2 } from 'lucide-vue-next'
import { cn } from '@/lib/utils'

interface Props {
  event: CalendarEvent
}

defineProps<Props>()
const emit = defineEmits<{
  edit: [event: CalendarEvent]
  delete: [id: string]
}>()

function formatTime(time: string | null): string {
  if (!time) return ''
  const [h, m] = time.split(':')
  const hour = parseInt(h)
  const ampm = hour >= 12 ? 'PM' : 'AM'
  const displayHour = hour % 12 || 12
  return `${displayHour}:${m} ${ampm}`
}
</script>

<template>
  <div class="bg-surface border border-border rounded-radius-lg p-3 sm:p-4 hover:shadow-sm transition-shadow">
    <div class="flex items-start justify-between gap-2">
      <div class="flex-1 min-w-0">
        <div class="flex items-center gap-2 mb-1">
          <span
            :class="cn('w-2 h-2 rounded-full flex-shrink-0', eventCategories[event.category]?.dotColor)"
          />
          <h3 class="font-medium text-foreground truncate">{{ event.title }}</h3>
        </div>

        <div v-if="event.time_start" class="flex items-center gap-1 text-sm text-muted mb-1">
          <Clock class="w-3.5 h-3.5" />
          <span>{{ formatTime(event.time_start) }}</span>
          <template v-if="event.time_end">
            <span>-</span>
            <span>{{ formatTime(event.time_end) }}</span>
          </template>
        </div>

        <p v-if="event.description" class="text-sm text-muted line-clamp-2">
          {{ event.description }}
        </p>

        <Badge
          :class="cn(
            'mt-2 text-xs',
            eventCategories[event.category]?.bgColor,
            eventCategories[event.category]?.color,
          )"
          variant="secondary"
        >
          {{ eventCategories[event.category]?.label }}
        </Badge>
      </div>

      <div class="flex items-center gap-1 flex-shrink-0">
        <Button
          variant="ghost"
          size="sm"
          class="h-8 w-8 p-0 text-muted hover:text-foreground"
          aria-label="Edit event"
          @click="emit('edit', event)"
        >
          <Pencil class="w-3.5 h-3.5" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          class="h-8 w-8 p-0 text-muted hover:text-error"
          aria-label="Delete event"
          @click="emit('delete', event.id)"
        >
          <Trash2 class="w-3.5 h-3.5" />
        </Button>
      </div>
    </div>
  </div>
</template>
