# ChartDB Fork - Project Context

## What this is
A fork of ChartDB (github.com/chartdb/chartdb) with custom server-side 
persistence added. Originally IndexedDB-only (browser storage), now uses 
a NestJS + PostgreSQL backend so diagrams persist and can eventually be 
shared across a team (MPWT).

## Structure
- /ui — ChartDB frontend (React/Vite), forked and modified
- /api — NestJS backend, handles diagram CRUD + Postgres

## Current state (update this as things change)
- ✅ Persistence working: diagrams save to Postgres, survive refresh
- ✅ Cleanup done: removed dead IndexedDB/Dexie code, debug logs
- ✅ Git initialized, committed at each major milestone
- ✅ JWT Authentication added: user isolation on diagrams, registration/login, route guards, token persistence, and logout support

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
- ✅ Authentication working: JWT-based login/register, per-user diagram 
  isolation, legacy diagrams (no owner) remain globally visible
- Git initialized, committed at each major milestone

## Current state
- ✅ Persistence working: diagrams save to Postgres, survive refresh
- ✅ Cleanup done: removed dead IndexedDB/Dexie code, debug logs
- ✅ Authentication working: JWT-based login/register, password strength 
  validation, per-user diagram isolation, legacy diagrams remain globally 
  visible
- ✅ Login/Register UI redesigned: floating card layout with branding panel, 
  feature highlights, chart decorations, matches design reference at 
  login-reference.png