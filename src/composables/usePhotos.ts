import { ref } from 'vue'
import { supabase } from '@/lib/supabase'
import { useAuth } from './useAuth'
import type { Photo, PhotoUploadPayload } from '@/types/photo'
import type { RealtimeChannel } from '@supabase/supabase-js'

const photos = ref<Photo[]>([])
let channel: RealtimeChannel | null = null

export function usePhotos() {
  const { state } = useAuth()
  const loading = ref(false)
  const uploading = ref(false)
  const error = ref<string | null>(null)

  async function fetchByDate(date: string) {
    const coupleId = state.value.coupleId
    if (!coupleId) return []

    loading.value = true
    error.value = null

    const { data, error: err } = await supabase
      .from('photos')
      .select('*')
      .eq('couple_id', coupleId)
      .eq('date', date)
      .order('created_at', { ascending: false })

    if (err) {
      error.value = err.message
    } else {
      const photosWithUrls = await Promise.all(
        (data as Photo[]).map(async (photo) => {
          const { data: urlData } = await supabase.storage
            .from('photos')
            .createSignedUrl(photo.storage_path, 3600)
          return { ...photo, url: urlData?.signedUrl }
        }),
      )
      photos.value = photosWithUrls
    }

    loading.value = false
    return photos.value
  }

  async function upload(payload: PhotoUploadPayload) {
    const coupleId = state.value.coupleId
    const userId = state.value.userId
    if (!coupleId || !userId) throw new Error('Not authenticated')

    uploading.value = true
    error.value = null

    try {
      const timestamp = Date.now()
      const fileName = `${timestamp}-${payload.file.name}`
      const storagePath = `${coupleId}/${payload.date}/${fileName}`

      const { error: uploadErr } = await supabase.storage
        .from('photos')
        .upload(storagePath, payload.file)

      if (uploadErr) throw uploadErr

      const { data, error: insertErr } = await supabase
        .from('photos')
        .insert({
          couple_id: coupleId,
          date: payload.date,
          storage_path: storagePath,
          caption: payload.caption ?? null,
          uploaded_by: userId,
        })
        .select()
        .single()

      if (insertErr) throw insertErr
      return data as Photo
    } finally {
      uploading.value = false
    }
  }

  async function remove(id: string, storagePath: string) {
    const { error: storageErr } = await supabase.storage
      .from('photos')
      .remove([storagePath])

    if (storageErr) throw storageErr

    const { error: dbErr } = await supabase
      .from('photos')
      .delete()
      .eq('id', id)

    if (dbErr) throw dbErr
  }

  function subscribe(onchange: () => void) {
    const coupleId = state.value.coupleId
    if (!coupleId) return

    channel = supabase
      .channel('photos-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'photos',
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
    photos,
    loading,
    uploading,
    error,
    fetchByDate,
    upload,
    remove,
    subscribe,
    unsubscribe,
  }
}
