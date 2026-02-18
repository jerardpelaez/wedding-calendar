<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useEvents } from '@/composables/useEvents'
import { useAuth } from '@/composables/useAuth'
import { useCalendarUtils } from '@/composables/useCalendarUtils'
import { months, YEAR } from '@/data/months'
import { eventCategories } from '@/data/event-categories'
import { Skeleton } from '@/components/ui/skeleton'
import { Calendar } from 'lucide-vue-next'
import type { CalendarEvent } from '@/types/calendar'

const { fetchYear, loading } = useEvents()
const { state, init } = useAuth()
const { getDaysInMonth, getFirstDayOfMonth, formatDate, isToday } = useCalendarUtils()

const yearEvents = ref<CalendarEvent[]>([])

function getEventsForDate(date: string) {
  return yearEvents.value.filter((e) => e.date === date)
}

function hasEventsOnDate(date: string) {
  return yearEvents.value.some((e) => e.date === date)
}

const monthCards = computed(() =>
  months.map((m) => {
    const eventCount = yearEvents.value.filter((e) => {
      const eventMonth = parseInt(e.date.split('-')[1])
      return eventMonth === m.number
    }).length

    return { ...m, eventCount }
  }),
)

onMounted(async () => {
  await init()
  if (state.value.isAuthenticated) {
    yearEvents.value = await fetchYear(YEAR)
  }
})
</script>

<template>
  <!-- Loading state -->
  <div v-if="loading" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
    <Skeleton v-for="i in 12" :key="i" class="h-40 rounded-radius-xl" />
  </div>

  <!-- Month cards -->
  <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
    <a
      v-for="month in monthCards"
      :key="month.number"
      :href="`/month/${month.number}`"
      class="group relative bg-surface rounded-radius-xl border border-border p-4 sm:p-5 hover:shadow-md hover:border-primary-light transition-all"
    >
      <div class="flex items-start justify-between">
        <div>
          <h3 class="font-display text-xl font-semibold text-foreground group-hover:text-primary transition-colors">
            {{ month.name }}
          </h3>
          <p class="text-sm text-muted mt-0.5">
            {{ month.daysInMonth }} days
          </p>
        </div>
        <Calendar class="w-5 h-5 text-muted group-hover:text-primary transition-colors" />
      </div>

      <!-- Mini calendar dots: show first 3 weeks of dates with events -->
      <div class="mt-3 flex flex-wrap gap-1">
        <template v-for="day in month.daysInMonth" :key="day">
          <span
            v-if="hasEventsOnDate(formatDate(YEAR, month.number, day))"
            class="w-2 h-2 rounded-full bg-primary"
            :title="`${month.shortName} ${day}`"
          />
        </template>
      </div>

      <div v-if="month.eventCount > 0" class="mt-3">
        <span class="text-xs text-accent-dark font-medium bg-accent/10 px-2 py-0.5 rounded-radius-full">
          {{ month.eventCount }} {{ month.eventCount === 1 ? 'event' : 'events' }}
        </span>
      </div>
    </a>
  </div>
</template>
