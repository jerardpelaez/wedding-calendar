import { ref, readonly } from 'vue'
import { supabase } from '@/lib/supabase'
import type { AuthState } from '@/types/auth'

const state = ref<AuthState>({
  isAuthenticated: false,
  isLoading: true,
  userId: null,
  coupleId: null,
  displayName: null,
})

let initPromise: Promise<void> | null = null

export function useAuth() {
  async function resolveCouple(userId: string) {
    const { data } = await supabase
      .from('couple_users')
      .select('couple_id, display_name')
      .eq('user_id', userId)
      .single()

    if (data) {
      state.value.coupleId = data.couple_id
      state.value.displayName = data.display_name
    }
  }

  async function init() {
    if (initPromise) return initPromise

    initPromise = (async () => {
      const { data: { session } } = await supabase.auth.getSession()

      if (session?.user) {
        state.value.isAuthenticated = true
        state.value.userId = session.user.id
        await resolveCouple(session.user.id)
      }

      state.value.isLoading = false

      supabase.auth.onAuthStateChange(async (_event, session) => {
        if (session?.user) {
          state.value.isAuthenticated = true
          state.value.userId = session.user.id
          await resolveCouple(session.user.id)
        } else {
          state.value.isAuthenticated = false
          state.value.userId = null
          state.value.coupleId = null
          state.value.displayName = null
        }
      })
    })()

    return initPromise
  }

  async function signIn(email: string, password: string) {
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw error
  }

  async function signOut() {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  }

  return {
    state: readonly(state),
    init,
    signIn,
    signOut,
  }
}
