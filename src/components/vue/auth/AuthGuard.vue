<script setup lang="ts">
import { onMounted, computed } from 'vue'
import { useAuth } from '@/composables/useAuth'
import { Skeleton } from '@/components/ui/skeleton'

const { state, init } = useAuth()

const isLoading = computed(() => state.value.isLoading)
const isAuthenticated = computed(() => state.value.isAuthenticated)

onMounted(() => {
  init()
})
</script>

<template>
  <div v-if="isLoading" class="flex items-center justify-center min-h-[200px]">
    <div class="space-y-3 w-full max-w-md">
      <Skeleton class="h-8 w-3/4" />
      <Skeleton class="h-4 w-full" />
      <Skeleton class="h-4 w-2/3" />
    </div>
  </div>

  <div v-else-if="!isAuthenticated" class="text-center py-12">
    <p class="text-muted mb-4">Please sign in to view the calendar.</p>
    <a
      href="/login"
      class="inline-flex items-center px-4 py-2 rounded-radius-md bg-primary text-surface hover:bg-primary-dark transition-colors"
    >
      Sign In
    </a>
  </div>

  <slot v-else />
</template>
