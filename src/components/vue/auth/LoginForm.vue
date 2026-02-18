<script setup lang="ts">
import { ref } from 'vue'
import { useAuth } from '@/composables/useAuth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

const { signIn } = useAuth()

const email = ref('')
const password = ref('')
const error = ref('')
const loading = ref(false)

async function handleSubmit() {
  error.value = ''
  loading.value = true

  try {
    await signIn(email.value, password.value)
    window.location.href = '/'
  } catch (e) {
    error.value = e instanceof Error ? e.message : 'Sign in failed'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <form
    class="w-full max-w-sm mx-auto space-y-4"
    @submit.prevent="handleSubmit"
  >
    <div class="space-y-2">
      <label for="email" class="block text-sm font-medium text-foreground">
        Email
      </label>
      <Input
        id="email"
        v-model="email"
        type="email"
        placeholder="you@example.com"
        required
        autocomplete="email"
      />
    </div>

    <div class="space-y-2">
      <label for="password" class="block text-sm font-medium text-foreground">
        Password
      </label>
      <Input
        id="password"
        v-model="password"
        type="password"
        placeholder="Your password"
        required
        autocomplete="current-password"
      />
    </div>

    <div
      v-if="error"
      class="rounded-radius-md bg-error/10 px-3 py-2 text-sm text-error"
      role="alert"
    >
      {{ error }}
    </div>

    <Button
      type="submit"
      class="w-full bg-primary text-surface hover:bg-primary-dark"
      :disabled="loading"
    >
      {{ loading ? 'Signing in...' : 'Sign In' }}
    </Button>
  </form>
</template>
