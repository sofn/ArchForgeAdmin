# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

ArchSmithAdmin is an admin management UI based on [vue-pure-admin](https://github.com/pure-admin/vue-pure-admin). It serves as the frontend for the ArchSmith backend management system.

## Build Commands

- `pnpm dev`: Start development server (port 8848)
- `pnpm build`: Production build
- `pnpm build:staging`: Staging build
- `pnpm typecheck`: TypeScript type checking
- `pnpm lint`: Run all linters (ESLint + Prettier + Stylelint)
- `pnpm lint:eslint`: ESLint only
- `pnpm lint:prettier`: Prettier only
- `pnpm lint:stylelint`: Stylelint only
- `pnpm preview`: Preview production build
- Requires Node.js >= 20.19.0 or >= 22.13.0, pnpm >= 9

## Tech Stack

- **Framework:** Vue 3.5 + TypeScript 6
- **Build Tool:** Vite 8
- **UI Library:** Element Plus 2.13
- **State Management:** Pinia 3
- **Router:** Vue Router 5
- **HTTP Client:** Axios 1.14
- **CSS:** TailwindCSS 4 + SCSS
- **i18n:** vue-i18n 11
- **Charts:** ECharts 6
- **Icons:** @iconify/vue + Remix Icons
- **Mock:** vite-plugin-fake-server (dev only)

## Architecture

### Directory Structure

- `src/api/` - API call definitions (user, system, routes, etc.)
- `src/components/` - Reusable components (ReDialog, ReIcon, RePureTableBar, etc.)
- `src/config/` - Platform configuration loader
- `src/directives/` - Custom Vue directives (auth, copy, perms, ripple)
- `src/layout/` - App layout (navbar, sidebar, content, panel, search)
- `src/plugins/` - Plugins (i18n)
- `src/router/` - Route definitions and utilities
- `src/store/modules/` - Pinia stores (user, permission, app, settings, multiTags, epTheme)
- `src/utils/` - Utilities (auth, http, message, tree)
- `src/views/` - Page components organized by feature
- `mock/` - Mock API data (login, system, asyncRoutes, refreshToken)
- `types/` - TypeScript type definitions
- `build/` - Build plugins and utilities
- `locales/` - i18n translation files

### Key Patterns

- **Authentication:** JWT-based with accessToken/refreshToken pattern
  - Tokens stored in Cookie (`authorized-token`) and localStorage (`user-info`)
  - Auto-refresh when accessToken expires using refreshToken
  - `Authorization: Bearer <token>` header format
- **API Layer:** Centralized HTTP client in `src/utils/http/index.ts`
  - Auto-attaches JWT token to requests
  - Token refresh interceptor with request queuing
  - White-listed endpoints: `/refresh-token`, `/login`
- **Permission System:**
  - Page-level: Role-based via `roles` array from login response
  - Button-level: Permission-based via `permissions` array (e.g., `permission:btn:add`)
  - `hasPerms()` utility and `v-perms` directive for button-level checks
- **Dynamic Routing:** Backend returns async routes via `/get-async-routes`, frontend builds sidebar menu
- **Mock Data:** `vite-plugin-fake-server` provides mock APIs in development; disabled when connecting to real backend

### API Response Format

All API responses follow this format:

```json
{
  "code": 0,
  "message": "操作成功",
  "data": { ... }
}
```

- `code: 0` = success
- Paginated list responses: `data: { list: [], total: number, pageSize: number, currentPage: number }`

### System Management Views

- **User Management:** `src/views/system/user/` - CRUD with dept tree filter
- **Role Management:** `src/views/system/role/` - CRUD with menu permission tree
- **Menu Management:** `src/views/system/menu/` - Tree-structured CRUD
- **Dept Management:** `src/views/system/dept/` - Tree-structured CRUD

## Environment Configuration

- `.env` - Common settings (port, hide home)
- `.env.development` - Dev settings (public path, router history mode)
- `.env.production` - Production settings (CDN, compression)
- `.env.staging` - Staging settings
- `public/platform-config.json` - Runtime platform configuration

## Code Style

- ESLint + Prettier + Stylelint enforced
- Vue SFC format with `<script setup lang="ts">`
- Composition API preferred
- Use `@/` path alias for `src/` imports
