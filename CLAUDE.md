# ChartDB Fork - Project Context

## What this is
A fork of ChartDB (github.com/chartdb/chartdb) with custom server-side 
persistence added. Originally IndexedDB-only (browser storage), now uses 
a NestJS + PostgreSQL backend so diagrams persist and can eventually be 
shared across a team (MPWT).

## Structure
- /ui — ChartDB frontend (React/Vite), forked and modified
- /api — NestJS backend, handles diagram CRUD + Postgres

## Known history / bugs already fixed (don't reintroduce)
- Tables previously saved as empty {} — fixed, verify full diagram state 
  (tables, columns, relationships, positions) is included in save payload
- Tables previously appeared in sidebar but failed to render on canvas — 
  was a position data issue during API round-trip, now fixed
- "Open Database" list previously rendered blank despite API returning 
  real data — fixed

## Rules for working on this project
- Don't modify persistence/storage logic unless explicitly asked — it's 
  fragile and took multiple rounds to get right
- Always verify changes yourself (create diagram, refresh, confirm) before 
  reporting something as "done" — don't just report code was written
- Commit to git after each verified milestone

## Current state
- ✅ Persistence working: diagrams save to Postgres, survive refresh
- ✅ Cleanup done: removed dead IndexedDB/Dexie code, debug logs
- ✅ Authentication working: JWT-based login/register, password strength 
  validation, per-user diagram isolation, legacy diagrams remain globally 
  visible
- ✅ Login/Register UI redesigned: floating card layout with branding panel, 
  feature highlights, chart decorations, matches design reference at 
  login-reference.png
- ✅ Local dev workflow: API + DB run via Docker Compose, Frontend runs 
  separately via `npm run dev` pointing to API at http://localhost:3000
- ✅ Git initialized, committed at each major milestone
- ✅ Login/Register UX: added password visibility toggle and real-time password requirement checklist for registration.


- ✅ Login/Register UI redesigned: floating card layout with frosted-glass 
  transparency, chart decorations, matches design reference. Both light 
  and dark mode verified consistent.