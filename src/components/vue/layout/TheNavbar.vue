<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useAuth } from '@/composables/useAuth'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from '@/components/ui/sheet'
import { Menu, Calendar, LogOut, Heart } from 'lucide-vue-next'
import { withBase } from '@/lib/utils'

const { state, init, signOut } = useAuth()

const mobileOpen = ref(false)

const isAuthenticated = computed(() => state.value.isAuthenticated)
const displayName = computed(() => state.value.displayName)

const today = new Date()
const currentMonth = today.getMonth() + 1
const todayDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`

const navLinks = [
  { href: withBase('/'), label: 'Year' },
  { href: withBase(`/month/${currentMonth}`), label: 'This Month' },
  { href: withBase(`/day/${todayDate}`), label: 'Today' },
]

async function handleSignOut() {
  await signOut()
  window.location.href = withBase('/login')
}

onMounted(() => {
  init()
})
</script>

<template>
  <nav class="sticky top-0 z-40 bg-surface/80 backdrop-blur-sm border-b border-border">
    <div class="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-14">
        <!-- Logo -->
        <a :href="withBase('/')" class="flex items-center gap-2 text-foreground hover:text-primary transition-colors">
          <Heart class="w-5 h-5 text-primary" :stroke-width="2" />
          <span class="font-display text-lg font-semibold">J & J</span>
        </a>

        <!-- Desktop Nav -->
        <div class="hidden sm:flex items-center gap-1">
          <a
            v-for="link in navLinks"
            :key="link.href"
            :href="link.href"
            class="px-3 py-2 text-sm text-muted hover:text-foreground rounded-radius-md hover:bg-day-hover transition-colors"
          >
            {{ link.label }}
          </a>
        </div>

        <!-- Desktop Auth -->
        <div class="hidden sm:flex items-center gap-3">
          <template v-if="isAuthenticated">
            <span class="text-sm text-muted">{{ displayName }}</span>
            <Button
              variant="ghost"
              size="sm"
              class="text-muted hover:text-foreground"
              @click="handleSignOut"
            >
              <LogOut class="w-4 h-4" />
            </Button>
          </template>
          <a v-else :href="withBase('/login')">
            <Button variant="ghost" size="sm">Sign In</Button>
          </a>
        </div>

        <!-- Mobile Menu -->
        <div class="sm:hidden">
          <Sheet v-model:open="mobileOpen">
            <SheetTrigger as-child>
              <Button variant="ghost" size="sm" aria-label="Open menu">
                <Menu class="w-5 h-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" class="w-64 bg-surface">
              <SheetHeader>
                <SheetTitle class="font-display text-lg">
                  <Heart class="w-4 h-4 text-primary inline mr-1" />
                  J & J 2026
                </SheetTitle>
              </SheetHeader>
              <div class="mt-6 flex flex-col gap-1">
                <SheetClose as-child v-for="link in navLinks" :key="link.href">
                  <a
                    :href="link.href"
                    class="flex items-center gap-3 px-3 py-3 text-sm text-foreground hover:bg-day-hover rounded-radius-md transition-colors"
                  >
                    <Calendar class="w-4 h-4 text-muted" />
                    {{ link.label }}
                  </a>
                </SheetClose>
              </div>
              <div class="mt-auto pt-6 border-t border-border">
                <template v-if="isAuthenticated">
                  <p class="px-3 py-2 text-sm text-muted">{{ displayName }}</p>
                  <SheetClose as-child>
                    <button
                      class="flex items-center gap-3 w-full px-3 py-3 text-sm text-error hover:bg-error/5 rounded-radius-md transition-colors"
                      @click="handleSignOut"
                    >
                      <LogOut class="w-4 h-4" />
                      Sign Out
                    </button>
                  </SheetClose>
                </template>
                <SheetClose v-else as-child>
                  <a
                    :href="withBase('/login')"
                    class="flex items-center gap-3 px-3 py-3 text-sm text-primary hover:bg-primary/5 rounded-radius-md"
                  >
                    Sign In
                  </a>
                </SheetClose>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </div>
  </nav>
</template>
