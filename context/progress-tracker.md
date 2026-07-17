# Progress Tracker

Update this file whenever the current phase, active feature, or implementation state changes.

## Current Phase

- Wire editor home to real project data and mutations complete

## Current Goal

- No active implementation task.

## Completed

- Implemented the design system foundation from `context/feature-specs/01-design-system.md`.
- Installed and configured shadcn/ui.
- Added shadcn UI primitives: Button, Card, Dialog, Input, Tabs, Textarea, and ScrollArea.
- Installed `lucide-react`.
- Created `lib/utils.ts` with the reusable `cn()` helper.
- Updated `app/globals.css` with the Ghost AI dark-only theme tokens and shadcn variable mappings.
- Verified `npm run lint` and `npm run build`.
- Implemented `context/feature-specs/02-editor.md` editor shell components:
  - `components/editor/editor-navbar.tsx`
  - `components/editor/project-sidebar.tsx`
  - `components/editor/editor-dialog.tsx`
- Verified `context/feature-specs/02-editor.md` with `npm run lint` and `npm run build`.
- Added `components/editor/editor-layout.tsx` to compose the editor navbar and project sidebar into a stateful shell.
- Updated `app/page.tsx` to render the editor layout.
- Verified the editor layout integration with `npm run lint` and `npm run build`.
- Installed `@clerk/ui` for Clerk's built-in dark theme support.
- Wrapped the root layout with `ClerkProvider` using Clerk's `dark` theme and app CSS variable overrides.
- Added `proxy.ts` with protected-by-default Clerk route protection and public auth routes.
- Added sign-in and sign-up pages with the two-panel desktop layout and form-only mobile layout from `context/feature-specs/03-auth.md`.
- Moved the editor shell to `/editor` and updated `/` to redirect signed-in users to `/editor` and signed-out users to `/sign-in`.
- Added Clerk's built-in `UserButton` to the editor navbar.
- Verified the auth integration with `npm run lint` and `npm run build`.
- Added shared auth route helpers that normalize Clerk route env vars to app-relative paths.
- Forced successful Clerk sign-in and sign-up redirects to `/editor`.
- Redirected signed-in users away from `/sign-in` and `/sign-up` before Clerk forms render.
- Directed sign-out fallback behavior to `/sign-in`.
- Updated `proxy.ts` public route matching to normalize configured auth routes before matching.
- Verified redirect stabilization with `npm run lint` and `npm run build`.
- Implemented `context/feature-specs/04-project-dialogs.md` editor home, mock project sidebar actions, and project dialogs.
- Verified `context/feature-specs/04-project-dialogs.md` with `npm run lint` and `npm run build`.
- Implemented `context/feature-specs/05-prisma.md` Prisma data layer.
- Added `Project` and `ProjectCollaborator` models plus `ProjectStatus` enum in `prisma/models/project.prisma`.
- Added `lib/prisma.ts` as a cached Prisma singleton with Prisma Postgres Accelerate and direct Postgres adapter branching.
- Updated `prisma.config.ts` to load `.env` and `.env.local` for Prisma CLI commands and use Prisma 7 `env()` datasource config.
- Generated Prisma Client and applied the first migration at `prisma/migrations/20260716161406_init_project_data/migration.sql`.
- Verified `context/feature-specs/05-prisma.md` with `npx prisma validate`, `npx prisma generate`, `npx prisma migrate dev --name init_project_data`, and `npm run build`.
- Implemented `context/06-project-apis.md` backend project API routes.
- Added authenticated `GET /api/projects` and `POST /api/projects` handlers.
- Added owner-enforced `PATCH /api/projects/[projectId]` and `DELETE /api/projects/[projectId]` handlers with `401`, `403`, and `404` responses.
- Added `lib/project-api.ts` shared request/auth/project serialization helpers for the project routes.
- Normalized the exported Prisma singleton type in `lib/prisma.ts` so route handlers can use a consistent client shape across Accelerate and direct Postgres branches.
- Verified `context/06-project-apis.md` with `npm run build`.
- Implemented `context/feature-specs/07-wire-editor-home.md`.
- Added `lib/project-data.ts` to fetch owned and shared editor projects server-side and validate workspace access.
- Added `hooks/use-project-actions.ts` to manage create, rename, and delete dialogs with real API mutations.
- Wired `app/editor/page.tsx` to load project data server-side and pass it into the editor layout.
- Added `app/editor/[projectId]/page.tsx` so project creation and sidebar navigation can open a real workspace route.
- Updated the editor sidebar and dialogs to use real project data, room ID previews, rename prefills, and active-workspace delete redirects.
- Verified `context/feature-specs/07-wire-editor-home.md` with `npm run build`.
- Implemented `context/feature-specs/08-editor-workspace-shell.md`.
- Added `lib/project-access.ts` to centralize current Clerk identity lookup and project access filtering by owner or collaborator.
- Added `components/editor/access-denied.tsx` for missing or unauthorized workspace access.
- Added `components/editor/workspace-shell.tsx` with the dedicated workspace navbar, canvas placeholder, AI sidebar placeholder, and existing project sidebar/dialog integration.
- Updated `app/editor/[projectId]/page.tsx` to remain server-rendered, redirect unauthenticated users to `/sign-in`, and render `AccessDenied` for missing or unauthorized projects.
- Refactored `lib/project-data.ts` to reuse the shared project access helper.
- Verified `context/feature-specs/08-editor-workspace-shell.md` with `npm run build`.
- Implemented `context/feature-specs/09-share-dialog.md`.
- Added owner-guarded collaborator API routes for listing, inviting, and removing project collaborators.
- Added Clerk Backend API enrichment for collaborator names and avatar images with email-only fallback when no Clerk user is found.
- Added the workspace share dialog with invite, remove, copy-link, and read-only collaborator access states.
- Verified `context/feature-specs/09-share-dialog.md` with `npm run build`.
- Updated the editor workspace shell so the project sidebar closes on outside clicks and the AI Assistant auto-opens on page load, then closes after 2 seconds before returning to normal toggle behavior.
- Verified the workspace shell interaction update with `npm run build`.
- Removed the desktop dimming from the project sidebar click-catcher so the editor canvas stays visually clear while the sidebar is open.
- Verified the sidebar backdrop adjustment with `npm run build`.
- Fixed the workspace AI sidebar auto-close timer so manual interaction cancels the initial pending timeout while preserving the first-load auto-close behavior.
- Verified the AI sidebar timeout fix with `npm run build`.

## In Progress

- No active implementation task.

## Next Up

- Start the next feature unit after selecting its spec.

## Open Questions

- Add unresolved product or implementation questions here.

## Architecture Decisions

- Add decisions that affect the system design or data model.
- Prisma CLI configuration now loads both `.env` and `.env.local` so local app and migration commands resolve the same `DATABASE_URL`.

## Session Notes

- Fixed the verified workspace AI sidebar reopen race by clearing the initial auto-close timeout on manual toggle, then revalidated with `npm run build`.
- Completed implementation of `context/feature-specs/09-share-dialog.md`.
- Initial sandboxed `npm run build` failed because `next/font` could not fetch Google Fonts; rerunning `npm run build` with approved network access passed.
- Started implementation of `context/feature-specs/09-share-dialog.md`.
- Completed implementation of `context/feature-specs/08-editor-workspace-shell.md`.
- Initial sandboxed `npm run build` failed because `next/font` could not fetch Google Fonts; rerunning `npm run build` with approved network access passed.
- Started implementation of `context/feature-specs/08-editor-workspace-shell.md`.
- Completed implementation of `context/feature-specs/07-wire-editor-home.md`.
- The first sandboxed `npm run build` failed because `next/font` could not fetch Google Fonts; rerunning `npm run build` with approved network access passed.
- Started implementation of `context/feature-specs/07-wire-editor-home.md`.
- Started implementation of `context/06-project-apis.md`.
- Completed implementation of `context/06-project-apis.md`.
- Initial sandboxed `npm run build` failed because `next/font` could not reach Google Fonts; rerunning `npm run build` with approved network access passed.
- Started implementation of `context/feature-specs/04-project-dialogs.md`.
- Completed implementation of `context/feature-specs/01-design-system.md`.
- Initial sandboxed build failed because `next/font` could not fetch Google Fonts; rerunning `npm run build` with approved network access passed.
- Started implementation of `context/feature-specs/02-editor.md`.
- Completed the editor navbar, floating project sidebar, and reusable editor dialog pattern implementation pass.
- Verified the editor shell with lint and production build.
- Integrated the editor navbar and project sidebar into a reusable editor layout and mounted it on the home page.
- Verified the editor layout integration with lint and production build.
- Started implementation of `context/feature-specs/03-auth.md`.
- Completed Clerk auth integration and verified with lint and production build.
- Started redirect stabilization for the issues documented in `context/current-issues.md`.
- Completed redirect stabilization and verified with lint and production build.
- Cleared the resolved local issue notes and moved `context/current-issues.md` to the ignored local scratchpad list.
- Completed implementation of `context/feature-specs/04-project-dialogs.md`.
- Initial sandboxed build failed because `next/font` could not fetch Google Fonts; rerunning `npm run build` with approved network access passed.
- Started implementation of `context/feature-specs/05-prisma.md`.
- Corrected the Prisma Accelerate dependency version to the published package release `3.0.1`.
- Updated `prisma.config.ts` so Prisma 7 migration commands load `DATABASE_URL` from `.env.local`.
- Created and applied the initial Prisma migration `20260716161406_init_project_data`.
- Completed implementation of `context/feature-specs/05-prisma.md`.
- Initial sandboxed `npm run build` failed because `next/font` could not fetch Google Fonts; rerunning `npm run build` with approved network access passed.
