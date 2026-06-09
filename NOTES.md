# Notes

## Structure

Three separate processes: Electron, mock AI server, PocketBase. Files are organised by feature and process - this makes it easy to find and change things in isolation.

- **Electron main** — IPC handlers, safeStorage, proxying requests to the AI server
- **Preload** — typed `window.electron` bridge, no direct Node access from the renderer
- **Renderer** — React app, files grouped by feature (`features/auth`, `features/chat`) and by process role

## Key decisions

**Zustand + React Query** — Zustand handles client-only UI state (active conversation, sending flag), React Query handles everything server-related. This means caching, deduplication, and abort controllers are taken care of without extra boilerplate. Optimistic updates on message send give instant feedback, with automatic rollback if the server doesn't respond.

## Scope

Completed all core requirements. Skipped all optional items due to time — realtime sync, OAuth, single-instance, and bonus tasks.

## What I would improve

- **Conversation navigation history** — back/forward between conversations like browser history
- **Design** — the UI is functional but minimal; I'd invest more in polish and visual consistency
- **Resizable sidebar** — draggable conversation panel width
- **Error handling** — better organisation and display of errors throughout the app
- **Realtime sync** — live message updates via PocketBase subscriptions, so history stays in sync across windows without a reload
- **AI response streaming** — currently the full reply arrives at once after a delay; streaming would feel much more responsive
