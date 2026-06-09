# AI Chat Desktop

A desktop AI chat client built with Electron, React, and PocketBase. Sign in, create conversations, and chat with an AI assistant. All history is persisted locally via a self-hosted PocketBase instance.

## Stack

Electron · React 19 · TypeScript · Vite · Zustand · React Query · PocketBase · Tailwind CSS

## Setup

### 1. PocketBase

Download the binary for your platform from https://github.com/pocketbase/pocketbase/releases/latest and place it at `./pocketbase/pocketbase` (or `pocketbase.exe` on Windows).

Then start the server:

```bash
./pocketbase/pocketbase serve
```

PocketBase will be available at http://127.0.0.1:8090.

### 2. Mock AI server

```bash
node mock-ai/server.js
```

Starts a local HTTP server on port 3000 that returns canned AI replies.

### 3. App

```bash
npm install && npm run dev
```

