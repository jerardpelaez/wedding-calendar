<script setup lang="ts">
import { computed } from 'vue'
import { cn, withBase } from '@/lib/utils'
import type { CalendarEvent } from '@/types/calendar'
import { eventCategories } from '@/data/event-categories'
import { Camera } from 'lucide-vue-next'

interface Props {
  date: string
  dayOfMonth: number
  isCurrentMonth: boolean
  isToday: boolean
  events: CalendarEvent[]
  hasPhotos: boolean
}

const props = defineProps<Props>()

const MAX_VISIBLE = 2

const displayedDots = computed(() => {
  const categories = [...new Set(props.events.map((e) => e.category))]
  return categories.slice(0, 3).map((cat) => eventCategories[cat]?.dotColor ?? 'bg-muted')
})

const displayedEvents = computed(() =>
  [...props.events]
    .sort((a, b) => (a.time_start ?? '').localeCompare(b.time_start ?? ''))
    .slice(0, MAX_VISIBLE)
)

const overflowCount = computed(() => Math.max(0, props.events.length - MAX_VISIBLE))

function formatTime(time: string | null): string {
  if (!time) return ''
  const [h, m] = time.split(':')
  const hour = parseInt(h, 10)
  const suffix = hour >= 12 ? 'pm' : 'am'
  const display = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour
  return m === '00' ? `${display}${suffix}` : `${display}:${m}${suffix}`
}
</script>

<template>
  <a
    :href="withBase(`/day/${date}`)"
    :class="cn(
      'relative flex flex-col items-center sm:items-start rounded-radius-md transition-colors min-h-10 sm:min-h-24 p-1 sm:p-2',
      isCurrentMonth ? 'hover:bg-day-hover' : 'opacity-40',
      isToday && 'ring-2 ring-today-ring ring-inset',
    )"
    :aria-label="`${dayOfMonth}, ${events.length} events`"
  >
    <span
      :class="cn(
        'text-xs sm:text-sm font-medium',
        isToday ? 'text-accent-dark font-bold' : isCurrentMonth ? 'text-foreground' : 'text-muted',
      )"
    >
      {{ dayOfMonth }}
    </span>

    <!-- Mobile: event dots -->
    <div v-if="displayedDots.length > 0" class="flex gap-0.5 mt-1 sm:hidden">
      <span
        v-for="(dotClass, i) in displayedDots"
        :key="i"
        :class="cn('w-1.5 h-1.5 rounded-full', dotClass)"
      />
    </div>

    <!-- Desktop: event title bars -->
    <div v-if="events.length > 0" class="hidden sm:flex flex-col gap-0.5 mt-1 w-full min-w-0">
      <div
        v-for="event in displayedEvents"
        :key="event.id"
        :class="cn(
          'flex items-center gap-1 rounded-sm px-1 py-px text-[10px] leading-tight min-w-0',
          eventCategories[event.category]?.bgColor ?? 'bg-muted/10',
          eventCategories[event.category]?.color ?? 'text-muted',
        )"
      >
        <span
          :class="cn('w-1.5 h-1.5 rounded-full shrink-0', eventCategories[event.category]?.dotColor ?? 'bg-muted')"
        />
        <span class="truncate">
          <span v-if="event.time_start" class="font-medium">{{ formatTime(event.time_start) }} </span>{{ event.title }}
        </span>
      </div>
      <span
        v-if="overflowCount > 0"
        class="text-[10px] leading-tight text-muted px-1"
      >
        +{{ overflowCount }} more
      </span>
    </div>

    <!-- Photo indicator -->
    <Camera
      v-if="hasPhotos"
      class="w-3 h-3 text-muted mt-0.5 hidden sm:block"
    />
  </a>
</template>
