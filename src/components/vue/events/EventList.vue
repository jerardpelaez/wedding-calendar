<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useEvents } from '@/composables/useEvents'
import { useAuth } from '@/composables/useAuth'
import EventCard from './EventCard.vue'
import EventForm from './EventForm.vue'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Plus, CalendarX } from 'lucide-vue-next'
import { toast } from 'vue-sonner'
import type { CalendarEvent, EventCategory } from '@/types/calendar'

interface Props {
  date: string
}

const props = defineProps<Props>()

const { events, fetchByDate, create, update, remove, subscribe, unsubscribe, loading } = useEvents()
const { state, init } = useAuth()

const formOpen = ref(false)
const editingEvent = ref<CalendarEvent | null>(null)

function openCreate() {
  editingEvent.value = null
  formOpen.value = true
}

function openEdit(event: CalendarEvent) {
  editingEvent.value = event
  formOpen.value = true
}

async function handleSave(data: {
  title: string
  description: string
  time_start: string
  time_end: string
  category: EventCategory
}) {
  try {
    if (editingEvent.value) {
      await update(editingEvent.value.id, data)
      toast.success('Event updated')
    } else {
      await create({ ...data, date: props.date })
      toast.success('Event created')
    }
    formOpen.value = false
    await fetchByDate(props.date)
  } catch (e) {
    toast.error(e instanceof Error ? e.message : 'Failed to save event')
  }
}

async function handleDelete(id: string) {
  try {
    await remove(id)
    toast.success('Event deleted')
    await fetchByDate(props.date)
  } catch (e) {
    toast.error(e instanceof Error ? e.message : 'Failed to delete event')
  }
}

onMounted(async () => {
  await init()
  if (state.value.isAuthenticated) {
    await fetchByDate(props.date)
    subscribe(() => fetchByDate(props.date))
  }
})

onUnmounted(() => {
  unsubscribe()
})
</script>

<template>
  <div>
    <div class="flex items-center justify-between mb-4">
      <h2 class="font-display text-lg sm:text-xl font-semibold text-foreground">Events</h2>
      <Button
        size="sm"
        class="bg-primary text-surface hover:bg-primary-dark"
        @click="openCreate"
      >
        <Plus class="w-4 h-4 mr-1" />
        Add Event
      </Button>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="space-y-3">
      <Skeleton v-for="i in 3" :key="i" class="h-20 rounded-radius-lg" />
    </div>

    <!-- Empty state -->
    <div
      v-else-if="events.length === 0"
      class="text-center py-8 border border-dashed border-border rounded-radius-lg"
    >
      <CalendarX class="w-10 h-10 text-muted mx-auto mb-2" />
      <p class="text-muted text-sm">No events for this day</p>
      <Button
        variant="ghost"
        size="sm"
        class="mt-2 text-primary hover:text-primary-dark"
        @click="openCreate"
      >
        <Plus class="w-4 h-4 mr-1" />
        Add one
      </Button>
    </div>

    <!-- Event list -->
    <div v-else class="space-y-3">
      <EventCard
        v-for="event in events"
        :key="event.id"
        :event="event"
        @edit="openEdit"
        @delete="handleDelete"
      />
    </div>

    <!-- Mobile FAB -->
    <button
      class="sm:hidden fixed bottom-6 right-6 w-14 h-14 rounded-full bg-primary text-surface shadow-lg hover:bg-primary-dark transition-colors flex items-center justify-center z-30"
      aria-label="Add event"
      @click="openCreate"
    >
      <Plus class="w-6 h-6" />
    </button>

    <!-- Event form dialog -->
    <EventForm
      :open="formOpen"
      :edit-event="editingEvent"
      :date="date"
      @update:open="formOpen = $event"
      @save="handleSave"
    />
  </div>
</template>
