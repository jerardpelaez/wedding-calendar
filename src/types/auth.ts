export interface Couple {
  id: string
  name: string
  created_at: string
}

export interface CoupleUser {
  couple_id: string
  user_id: string
  display_name: string
}

export interface AuthState {
  isAuthenticated: boolean
  isLoading: boolean
  userId: string | null
  coupleId: string | null
  displayName: string | null
}
