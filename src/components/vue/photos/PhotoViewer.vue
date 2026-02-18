<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useSwipe } from '@vueuse/core'
import type { Photo } from '@/types/photo'
import { Button } from '@/components/ui/button'
import { X, ChevronLeft, ChevronRight } from 'lucide-vue-next'

interface Props {
  photos: Photo[]
  currentIndex: number
  open: boolean
}

const props = defineProps<Props>()
const emit = defineEmits<{
  'update:open': [value: boolean]
  'update:currentIndex': [value: number]
}>()

const viewerRef = ref<HTMLElement | null>(null)
const index = ref(props.currentIndex)

const currentPhoto = computed(() => props.photos[index.value])
const hasPrev = computed(() => index.value > 0)
const hasNext = computed(() => index.value < props.photos.length - 1)

watch(
  () => props.currentIndex,
  (val) => { index.value = val },
)

watch(
  () => props.open,
  (open) => {
    if (open) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
  },
)

function prev() {
  if (hasPrev.value) {
    index.value--
    emit('update:currentIndex', index.value)
  }
}

function next() {
  if (hasNext.value) {
    index.value++
    emit('update:currentIndex', index.value)
  }
}

function close() {
  emit('update:open', false)
}

function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape') close()
  if (e.key === 'ArrowLeft') prev()
  if (e.key === 'ArrowRight') next()
}

const { direction } = useSwipe(viewerRef)

watch(direction, (dir) => {
  if (dir === 'left') next()
  if (dir === 'right') prev()
})
</script>

<template>
  <Teleport to="body">
    <div
      v-if="open && currentPhoto"
      ref="viewerRef"
      class="fixed inset-0 z-50 bg-foreground/95 flex items-center justify-center"
      tabindex="0"
      @keydown="onKeydown"
    >
      <!-- Close -->
      <Button
        variant="ghost"
        class="absolute top-4 right-4 text-surface/80 hover:text-surface z-10"
        aria-label="Close"
        @click="close"
      >
        <X class="w-6 h-6" />
      </Button>

      <!-- Prev -->
      <button
        v-if="hasPrev"
        class="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 p-2 text-surface/60 hover:text-surface transition-colors z-10"
        aria-label="Previous photo"
        @click="prev"
      >
        <ChevronLeft class="w-8 h-8" />
      </button>

      <!-- Image -->
      <img
        :src="currentPhoto.url"
        :alt="currentPhoto.caption || 'Photo'"
        class="max-w-full max-h-[85vh] object-contain select-none"
      />

      <!-- Next -->
      <button
        v-if="hasNext"
        class="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 p-2 text-surface/60 hover:text-surface transition-colors z-10"
        aria-label="Next photo"
        @click="next"
      >
        <ChevronRight class="w-8 h-8" />
      </button>

      <!-- Caption -->
      <div
        v-if="currentPhoto.caption"
        class="absolute bottom-4 left-1/2 -translate-x-1/2 bg-foreground/80 text-surface/90 px-4 py-2 rounded-radius-md text-sm max-w-md text-center"
      >
        {{ currentPhoto.caption }}
      </div>

      <!-- Counter -->
      <div class="absolute bottom-4 right-4 text-surface/50 text-xs">
        {{ index + 1 }} / {{ photos.length }}
      </div>
    </div>
  </Teleport>
</template>
