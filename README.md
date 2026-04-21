# Primis Frontend

Next.js frontend for the Primis admin dashboard. This app handles authentication, dashboard views, and user management UI for the backend API.

## Stack

- Next.js 16
- React 19
- TypeScript
- Material UI

## Prerequisites

- Node.js 20+
- npm
- Running Primis backend API

## Environment

Create a local environment file:

```bash
.env.local
```

Expected values:

```env
NEXT_PUBLIC_API_URL=http://localhost:3000
```

## Install

```bash
npm install
```

## Run

```bash
npm run dev
```

App URL:

```text
http://localhost:3001
```

If port `3001` is unavailable, Next.js may choose another free port.

## Build

```bash
npm run build
npm run start
```

## Lint

```bash
npm run lint
```

## Main Areas

- `src/app/login` and `src/app/register`: auth screens
- `src/app/dashboard`: dashboard shell and overview
- `src/app/dashboard/users`: user management page
- `src/components`: shared UI components
- `src/services`: API client and service wrappers
- `src/contexts`: auth state management

## Notes

- The frontend expects backend user fields in snake_case, including `first_name` and `last_name`.
- API validation errors are surfaced as user-friendly messages in the UI.
