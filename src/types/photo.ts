export interface Photo {
  id: string
  couple_id: string
  date: string
  storage_path: string
  caption: string | null
  uploaded_by: string
  created_at: string
  url?: string
}

export interface PhotoUploadPayload {
  file: File
  date: string
  caption?: string
}
