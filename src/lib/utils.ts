import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

const base = import.meta.env.BASE_URL.replace(/\/$/, '')

export function withBase(path: string): string {
  if (!path.startsWith('/')) path = '/' + path
  return `${base}${path}`
}
