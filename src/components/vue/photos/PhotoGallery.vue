<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { usePhotos } from '@/composables/usePhotos'
import { useAuth } from '@/composables/useAuth'
import PhotoUpload from './PhotoUpload.vue'
import PhotoViewer from './PhotoViewer.vue'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
import { ImageOff, Trash2 } from 'lucide-vue-next'
import { toast } from 'vue-sonner'

interface Props {
  date: string
}

const props = defineProps<Props>()

const { photos, fetchByDate, upload, remove, subscribe, unsubscribe, loading, uploading } = usePhotos()
const { state, init } = useAuth()

const viewerOpen = ref(false)
const viewerIndex = ref(0)

function openViewer(index: number) {
  viewerIndex.value = index
  viewerOpen.value = true
}

async function handleUpload(file: File, caption: string) {
  try {
    await upload({ file, date: props.date, caption: caption || undefined })
    toast.success('Photo uploaded')
    await fetchByDate(props.date)
  } catch (e) {
    toast.error(e instanceof Error ? e.message : 'Upload failed')
  }
}

async function handleDelete(id: string, storagePath: string) {
  try {
    await remove(id, storagePath)
    toast.success('Photo deleted')
    await fetchByDate(props.date)
  } catch (e) {
    toast.error(e instanceof Error ? e.message : 'Delete failed')
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
    <h2 class="font-display text-lg sm:text-xl font-semibold text-foreground mb-4">Photos</h2>

    <!-- Upload -->
    <div class="mb-6">
      <PhotoUpload :uploading="uploading" @upload="handleUpload" />
    </div>

    <!-- Loading -->
    <div v-if="loading" class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
      <Skeleton v-for="i in 4" :key="i" class="aspect-square rounded-radius-lg" />
    </div>

    <!-- Empty -->
    <div
      v-else-if="photos.length === 0"
      class="text-center py-8 border border-dashed border-border rounded-radius-lg"
    >
      <ImageOff class="w-10 h-10 text-muted mx-auto mb-2" />
      <p class="text-muted text-sm">No photos for this day</p>
    </div>

    <!-- Gallery grid -->
    <div v-else class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
      <div
        v-for="(photo, i) in photos"
        :key="photo.id"
        class="group relative aspect-square rounded-radius-lg overflow-hidden border border-border cursor-pointer"
        @click="openViewer(i)"
      >
        <img
          v-if="photo.url"
          :src="photo.url"
          :alt="photo.caption || 'Photo'"
          class="w-full h-full object-cover transition-transform group-hover:scale-105"
          loading="lazy"
        />
        <div class="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/10 transition-colors" />

        <!-- Delete button -->
        <Button
          variant="ghost"
          size="sm"
          class="absolute top-1 right-1 h-7 w-7 p-0 opacity-0 group-hover:opacity-100 bg-overlay text-surface hover:bg-error hover:text-surface transition-all"
          aria-label="Delete photo"
          @click.stop="handleDelete(photo.id, photo.storage_path)"
        >
          <Trash2 class="w-3.5 h-3.5" />
        </Button>

        <!-- Caption -->
        <div
          v-if="photo.caption"
          class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-foreground/60 to-transparent p-2 pt-6"
        >
          <p class="text-xs text-surface truncate">{{ photo.caption }}</p>
        </div>
      </div>
    </div>

    <!-- Lightbox -->
    <PhotoViewer
      :photos="photos"
      :current-index="viewerIndex"
      :open="viewerOpen"
      @update:open="viewerOpen = $event"
      @update:current-index="viewerIndex = $event"
    />
  </div>
</template>
