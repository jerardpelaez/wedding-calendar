# CLAUDE.md

> AI Assistant Configuration for Jerard & Joana Wedding Calendar 2026

## Quick Start

```bash
bun install          # Install dependencies
bun run dev          # Start dev server
bun run build        # Production build
```

## Project Context

| Attribute     | Value                                           |
|---------------|-------------------------------------------------|
| Project Type  | Shared wedding calendar (Astro + Vue islands)   |
| Users         | Jerard & Joana (couple-scoped)                  |
| Year Scope    | 2026                                            |
| Backend       | Supabase (PostgreSQL + Storage + Auth + Realtime)|

## Tech Stack

| Layer      | Technology                                       |
|------------|--------------------------------------------------|
| Framework  | Astro 5.x (SSG + islands)                       |
| UI Islands | Vue 3 Composition API (`<script setup>`)         |
| Styling    | Tailwind CSS v4 (`@theme` directive)             |
| Language   | TypeScript (strict)                              |
| UI Kit     | shadcn-vue (Radix Vue)                           |
| Icons      | lucide-vue-next                                  |
| Backend    | Supabase                                         |
| Fonts      | @fontsource (Cormorant, Nunito Sans, Italiana)   |
| Package    | bun                                              |

## Critical Rules

1. **Spec First** — All design values from `src/assets/styles/theme.css`
2. **No Hardcoded Values** — Use design tokens only
3. **Strict TypeScript** — No `any`, no `@ts-ignore`
4. **Mobile-First** — Base styles → `sm:` → `md:` → `lg:`
5. **Composition API Only** — `<script setup lang="ts">` exclusively
6. **No Additional UI Libraries** — shadcn-vue + custom only
7. **No `<style>` Blocks** — Use Tailwind utility classes exclusively
8. **Islands Architecture** — Astro renders static shell; Vue handles interactivity

## Architecture

- **Pages** (`src/pages/`): Astro static pages with `getStaticPaths()`
- **Vue Islands** (`src/components/vue/`): Interactive components with `client:load` or `client:visible`
- **Astro Components** (`src/components/astro/`): Static server-rendered (zero JS)
- **Composables** (`src/composables/`): Shared Vue logic (useAuth, useEvents, usePhotos)
- **Types** (`src/types/`): TypeScript interfaces
- **Data** (`src/data/`): Static data files

## Component Template

```vue
<script setup lang="ts">
// 1. Imports
// 2. Props & Emits
// 3. Composables
// 4. Reactive state
// 5. Computed
// 6. Functions
// 7. Lifecycle
</script>

<template>
  <!-- Single root, semantic HTML -->
</template>
```

## Naming Conventions

| Type             | Convention    | Example            |
|------------------|---------------|--------------------|
| Layout component | `The` prefix  | `TheNavbar.vue`    |
| Page component   | PascalCase    | `YearOverview.vue` |
| Composable       | `use` prefix  | `useEvents.ts`     |
| Type file        | lowercase     | `calendar.ts`      |

## Common Commands

```bash
bunx shadcn-vue@latest add <component>  # Add shadcn-vue component
bun run dev                              # Dev server
bun run build                            # Production build
```

## Environment Variables

- `PUBLIC_SUPABASE_URL` — Supabase project URL
- `PUBLIC_SUPABASE_ANON_KEY` — Supabase anon key (PUBLIC_ prefix required by Astro)
