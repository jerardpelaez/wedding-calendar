<script setup lang="ts">
import { computed } from 'vue'
import { cn } from '@/lib/utils'
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

const displayedDots = computed(() => {
  const categories = [...new Set(props.events.map((e) => e.category))]
  return categories.slice(0, 3).map((cat) => eventCategories[cat]?.dotColor ?? 'bg-muted')
})
</script>

<template>
  <a
    :href="`/day/${date}`"
    :class="cn(
      'relative flex flex-col items-center rounded-radius-md transition-colors min-h-10 sm:min-h-20 p-1 sm:p-2',
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

    <!-- Event dots -->
    <div v-if="displayedDots.length > 0" class="flex gap-0.5 mt-1">
      <span
        v-for="(dotClass, i) in displayedDots"
        :key="i"
        :class="cn('w-1.5 h-1.5 rounded-full', dotClass)"
      />
    </div>

    <!-- Photo indicator -->
    <Camera
      v-if="hasPhotos"
      class="w-3 h-3 text-muted mt-0.5 hidden sm:block"
    />
  </a>
</template>
