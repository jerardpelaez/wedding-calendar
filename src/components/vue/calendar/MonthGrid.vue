<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useSwipe } from '@vueuse/core'
import { useCalendarUtils } from '@/composables/useCalendarUtils'
import { useEvents } from '@/composables/useEvents'
import { useAuth } from '@/composables/useAuth'
import DayCell from './DayCell.vue'
import { Skeleton } from '@/components/ui/skeleton'
import { ChevronLeft, ChevronRight } from 'lucide-vue-next'
import { YEAR } from '@/data/months'
import type { CalendarEvent } from '@/types/calendar'

interface Props {
  month: number
  year?: number
}

const props = withDefaults(defineProps<Props>(), { year: YEAR })

const { getDaysInMonth, getFirstDayOfMonth, formatDate, isToday, getMonthName } = useCalendarUtils()
const { fetchMonth, subscribe, unsubscribe, loading } = useEvents()
const { state, init } = useAuth()

const monthEvents = ref<CalendarEvent[]>([])
const gridRef = ref<HTMLElement | null>(null)

const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

const daysInMonth = computed(() => getDaysInMonth(props.month, props.year))
const firstDay = computed(() => getFirstDayOfMonth(props.month, props.year))

const prevMonth = computed(() => (props.month === 1 ? 12 : props.month - 1))
const nextMonth = computed(() => (props.month === 12 ? 1 : props.month + 1))

const calendarDays = computed(() => {
  const days = []

  // Previous month padding
  const prevMonthDays = getDaysInMonth(prevMonth.value, props.year)
  for (let i = firstDay.value - 1; i >= 0; i--) {
    const day = prevMonthDays - i
    days.push({
      date: formatDate(props.year, prevMonth.value, day),
      dayOfMonth: day,
      isCurrentMonth: false,
      isToday: false,
      events: [] as CalendarEvent[],
      hasPhotos: false,
    })
  }

  // Current month
  for (let day = 1; day <= daysInMonth.value; day++) {
    const date = formatDate(props.year, props.month, day)
    days.push({
      date,
      dayOfMonth: day,
      isCurrentMonth: true,
      isToday: isToday(date),
      events: monthEvents.value.filter((e) => e.date === date),
      hasPhotos: false,
    })
  }

  // Next month padding
  const remaining = 42 - days.length
  for (let day = 1; day <= remaining; day++) {
    days.push({
      date: formatDate(props.year, nextMonth.value, day),
      dayOfMonth: day,
      isCurrentMonth: false,
      isToday: false,
      events: [] as CalendarEvent[],
      hasPhotos: false,
    })
  }

  return days
})

async function loadEvents() {
  const data = await fetchMonth(props.month, props.year)
  monthEvents.value = data
}

// Swipe navigation
const { direction } = useSwipe(gridRef)

watch(direction, (dir) => {
  if (dir === 'left' && nextMonth.value) {
    window.location.href = `/month/${nextMonth.value}`
  } else if (dir === 'right' && prevMonth.value) {
    window.location.href = `/month/${prevMonth.value}`
  }
})

onMounted(async () => {
  await init()
  if (state.value.isAuthenticated) {
    await loadEvents()
    subscribe(() => loadEvents())
  }
})

onUnmounted(() => {
  unsubscribe()
})
</script>

<template>
  <div>
    <!-- Month navigation -->
    <div class="flex items-center justify-between mb-4">
      <a
        :href="`/month/${prevMonth}`"
        class="p-2 rounded-radius-md hover:bg-day-hover transition-colors text-muted hover:text-foreground"
        aria-label="Previous month"
      >
        <ChevronLeft class="w-5 h-5" />
      </a>
      <h2 class="font-display text-xl sm:text-2xl font-semibold text-foreground">
        {{ getMonthName(month) }} {{ year }}
      </h2>
      <a
        :href="`/month/${nextMonth}`"
        class="p-2 rounded-radius-md hover:bg-day-hover transition-colors text-muted hover:text-foreground"
        aria-label="Next month"
      >
        <ChevronRight class="w-5 h-5" />
      </a>
    </div>

    <!-- Calendar grid -->
    <div ref="gridRef" class="select-none">
      <!-- Weekday headers -->
      <div class="grid grid-cols-7 mb-1">
        <div
          v-for="day in weekdays"
          :key="day"
          class="text-center text-xs font-medium text-muted py-2"
        >
          {{ day }}
        </div>
      </div>

      <!-- Loading state -->
      <div v-if="loading" class="grid grid-cols-7 gap-px">
        <Skeleton v-for="i in 42" :key="i" class="min-h-10 sm:min-h-20 rounded-radius-md" />
      </div>

      <!-- Day cells -->
      <div v-else class="grid grid-cols-7 gap-px">
        <DayCell
          v-for="day in calendarDays"
          :key="day.date"
          v-bind="day"
        />
      </div>
    </div>
  </div>
</template>
