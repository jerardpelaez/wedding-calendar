import { ref } from 'vue'
import { supabase } from '@/lib/supabase'
import { useAuth } from './useAuth'
import type { CalendarEvent, EventCategory } from '@/types/calendar'
import type { RealtimeChannel } from '@supabase/supabase-js'

const events = ref<CalendarEvent[]>([])
let channel: RealtimeChannel | null = null

export function useEvents() {
  const { state } = useAuth()
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function fetchByDate(date: string) {
    const coupleId = state.value.coupleId
    if (!coupleId) return []

    loading.value = true
    error.value = null

    const { data, error: err } = await supabase
      .from('events')
      .select('*')
      .eq('couple_id', coupleId)
      .eq('date', date)
      .order('time_start', { ascending: true, nullsFirst: false })

    if (err) {
      error.value = err.message
    } else {
      events.value = data as CalendarEvent[]
    }

    loading.value = false
    return events.value
  }

  async function fetchMonth(month: number, year: number = 2026) {
    const coupleId = state.value.coupleId
    if (!coupleId) return []

    loading.value = true
    error.value = null

    const startDate = `${year}-${String(month).padStart(2, '0')}-01`
    const endDate = `${year}-${String(month).padStart(2, '0')}-${new Date(year, month, 0).getDate()}`

    const { data, error: err } = await supabase
      .from('events')
      .select('*')
      .eq('couple_id', coupleId)
      .gte('date', startDate)
      .lte('date', endDate)
      .order('date')
      .order('time_start', { ascending: true, nullsFirst: false })

    if (err) {
      error.value = err.message
    } else {
      events.value = data as CalendarEvent[]
    }

    loading.value = false
    return events.value
  }

  async function fetchYear(year: number = 2026) {
    const coupleId = state.value.coupleId
    if (!coupleId) return []

    loading.value = true
    error.value = null

    const { data, error: err } = await supabase
      .from('events')
      .select('*')
      .eq('couple_id', coupleId)
      .gte('date', `${year}-01-01`)
      .lte('date', `${year}-12-31`)
      .order('date')

    if (err) {
      error.value = err.message
    } else {
      events.value = data as CalendarEvent[]
    }

    loading.value = false
    return events.value
  }

  async function create(event: {
    date: string
    title: string
    description?: string
    time_start?: string
    time_end?: string
    category: EventCategory
  }) {
    const coupleId = state.value.coupleId
    const userId = state.value.userId
    if (!coupleId || !userId) throw new Error('Not authenticated')

    const { data, error: err } = await supabase
      .from('events')
      .insert({
        couple_id: coupleId,
        created_by: userId,
        ...event,
      })
      .select()
      .single()

    if (err) throw err
    return data as CalendarEvent
  }

  async function createBulk(eventList: {
    date: string
    title: string
    description?: string
    time_start?: string
    time_end?: string
    category: EventCategory
  }[]) {
    const coupleId = state.value.coupleId
    const userId = state.value.userId
    if (!coupleId || !userId) throw new Error('Not authenticated')

    const rows = eventList.map((event) => ({
      couple_id: coupleId,
      created_by: userId,
      ...event,
    }))

    const { data, error: err } = await supabase
      .from('events')
      .insert(rows)
      .select()

    if (err) throw err
    return data as CalendarEvent[]
  }

  async function update(id: string, updates: Partial<Pick<CalendarEvent, 'title' | 'description' | 'time_start' | 'time_end' | 'category'>>) {
    const { data, error: err } = await supabase
      .from('events')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single()

    if (err) throw err
    return data as CalendarEvent
  }

  async function remove(id: string) {
    const { error: err } = await supabase
      .from('events')
      .delete()
      .eq('id', id)

    if (err) throw err
  }

  function subscribe(onchange: () => void) {
    const coupleId = state.value.coupleId
    if (!coupleId) return

    channel = supabase
      .channel('events-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'events',
          filter: `couple_id=eq.${coupleId}`,
        },
        () => {
          onchange()
        },
      )
      .subscribe()
  }

  function unsubscribe() {
    if (channel) {
      supabase.removeChannel(channel)
      channel = null
    }
  }

  return {
    events,
    loading,
    error,
    fetchByDate,
    fetchMonth,
    fetchYear,
    create,
    createBulk,
    update,
    remove,
    subscribe,
    unsubscribe,
  }
}
