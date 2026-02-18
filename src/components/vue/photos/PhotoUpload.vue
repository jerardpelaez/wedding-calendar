<script setup lang="ts">
import { ref } from 'vue'
import { useDropZone } from '@vueuse/core'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Upload, ImagePlus, X } from 'lucide-vue-next'

interface Props {
  uploading: boolean
}

defineProps<Props>()

const emit = defineEmits<{
  upload: [file: File, caption: string]
}>()

const dropZoneRef = ref<HTMLElement | null>(null)
const fileInput = ref<HTMLInputElement | null>(null)
const selectedFile = ref<File | null>(null)
const caption = ref('')
const previewUrl = ref<string | null>(null)

const { isOverDropZone } = useDropZone(dropZoneRef, {
  onDrop(files) {
    if (files && files.length > 0) {
      handleFile(files[0])
    }
  },
  dataTypes: ['image/jpeg', 'image/png', 'image/webp'],
})

function handleFile(file: File) {
  if (!file.type.startsWith('image/')) return

  selectedFile.value = file

  if (previewUrl.value) {
    URL.revokeObjectURL(previewUrl.value)
  }
  previewUrl.value = URL.createObjectURL(file)
}

function onFileSelect(e: Event) {
  const input = e.target as HTMLInputElement
  if (input.files && input.files.length > 0) {
    handleFile(input.files[0])
  }
}

function clearSelection() {
  selectedFile.value = null
  caption.value = ''
  if (previewUrl.value) {
    URL.revokeObjectURL(previewUrl.value)
    previewUrl.value = null
  }
}

function handleUpload() {
  if (!selectedFile.value) return
  emit('upload', selectedFile.value, caption.value)
  clearSelection()
}
</script>

<template>
  <div>
    <!-- File selected: Preview -->
    <div v-if="selectedFile && previewUrl" class="space-y-3">
      <div class="relative rounded-radius-lg overflow-hidden border border-border">
        <img
          :src="previewUrl"
          :alt="selectedFile.name"
          class="w-full max-h-48 object-cover"
        />
        <button
          class="absolute top-2 right-2 w-8 h-8 rounded-full bg-overlay text-surface flex items-center justify-center hover:bg-foreground/70 transition-colors"
          aria-label="Remove"
          @click="clearSelection"
        >
          <X class="w-4 h-4" />
        </button>
      </div>

      <Input
        v-model="caption"
        placeholder="Add a caption (optional)"
      />

      <Button
        class="w-full bg-primary text-surface hover:bg-primary-dark"
        :disabled="uploading"
        @click="handleUpload"
      >
        <Upload class="w-4 h-4 mr-2" />
        {{ uploading ? 'Uploading...' : 'Upload Photo' }}
      </Button>
    </div>

    <!-- Drop zone -->
    <div
      v-else
      ref="dropZoneRef"
      :class="[
        'border-2 border-dashed rounded-radius-lg p-6 text-center cursor-pointer transition-colors',
        isOverDropZone ? 'border-primary bg-primary/5' : 'border-border hover:border-primary-light',
      ]"
      @click="fileInput?.click()"
    >
      <ImagePlus class="w-8 h-8 text-muted mx-auto mb-2" />
      <p class="text-sm text-muted">
        <span class="text-primary font-medium">Click to upload</span> or drag and drop
      </p>
      <p class="text-xs text-muted mt-1">JPG, PNG, or WebP</p>

      <input
        ref="fileInput"
        type="file"
        accept="image/jpeg,image/png,image/webp"
        class="hidden"
        @change="onFileSelect"
      />
    </div>
  </div>
</template>
