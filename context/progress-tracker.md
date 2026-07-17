# Progress Tracker

Update this file whenever the current phase, active feature, or implementation state changes.

## Current Phase

- Wire editor home to real project data and mutations complete

## Current Goal

- No active implementation task.

## Completed

- Implementing local font migration - switched app fonts to local assets
  - Migrated the app font loading from `next/font/google` to `next/font/local`.
  - Added local Geist Sans and Geist Mono `.woff2` assets under `app/fonts/`.
  - Updated the root layout to keep the existing `--font-geist-sans` and `--font-geist-mono` CSS variables while loading local assets.
  - Updated `context/ui-context.md` to document the local font loading strategy.
- Implementing task 01 - design system foundation
  - Completed `context/feature-specs/01-design-system.md`.
  - Installed and configured shadcn/ui.
  - Added shadcn UI primitives: Button, Card, Dialog, Input, Tabs, Textarea, and ScrollArea.
  - Installed `lucide-react`.
  - Created `lib/utils.ts` with the reusable `cn()` helper.
  - Updated `app/globals.css` with the Ghost AI dark-only theme tokens and shadcn variable mappings.
  - Verified `npm run lint` and `npm run build`.
- Implementing task 02 - editor shell and layout
  - Implemented `context/feature-specs/02-editor.md` editor shell components.
  - Added `components/editor/editor-navbar.tsx`.
  - Added `components/editor/project-sidebar.tsx`.
  - Added `components/editor/editor-dialog.tsx`.
  - Added `components/editor/editor-layout.tsx` to compose the editor navbar and project sidebar into a stateful shell.
  - Updated `app/page.tsx` to render the editor layout.
  - Completed the editor navbar, floating project sidebar, and reusable editor dialog pattern implementation pass.
  - Verified the editor shell with lint and production build.
  - Verified `context/feature-specs/02-editor.md` with `npm run lint` and `npm run build`.
  - Verified the editor layout integration with `npm run lint` and `npm run build`.
- Implementing task 03 - Clerk authentication flow
  - Installed `@clerk/ui` for Clerk's built-in dark theme support.
  - Wrapped the root layout with `ClerkProvider` using Clerk's `dark` theme and app CSS variable overrides.
  - Added `proxy.ts` with protected-by-default Clerk route protection and public auth routes.
  - Added sign-in and sign-up pages with the two-panel desktop layout and form-only mobile layout from `context/feature-specs/03-auth.md`.
  - Moved the editor shell to `/editor` and updated `/` to redirect signed-in users to `/editor` and signed-out users to `/sign-in`.
  - Added Clerk's built-in `UserButton` to the editor navbar.
  - Started implementation of `context/feature-specs/03-auth.md`.
  - Completed Clerk auth integration and verified with lint and production build.
- Implementing task 04 - project dialogs and editor home
  - Implemented `context/feature-specs/04-project-dialogs.md` editor home, mock project sidebar actions, and project dialogs.
  - Verified `context/feature-specs/04-project-dialogs.md` with `npm run lint` and `npm run build`.
  - Started implementation of `context/feature-specs/04-project-dialogs.md`.
  - Completed implementation of `context/feature-specs/04-project-dialogs.md`.
  - Initial sandboxed build failed because `next/font` could not fetch Google Fonts; rerunning `npm run build` with approved network access passed.
- Implementing task 05 - Prisma data layer
  - Implemented `context/feature-specs/05-prisma.md` Prisma data layer.
  - Added `Project` and `ProjectCollaborator` models plus `ProjectStatus` enum in `prisma/models/project.prisma`.
  - Added `lib/prisma.ts` as a cached Prisma singleton with Prisma Postgres Accelerate and direct Postgres adapter branching.
  - Updated `prisma.config.ts` to load `.env` and `.env.local` for Prisma CLI commands and use Prisma 7 `env()` datasource config.
  - Generated Prisma Client and applied the first migration at `prisma/migrations/20260716161406_init_project_data/migration.sql`.
  - Corrected the Prisma Accelerate dependency version to the published package release `3.0.1`.
  - Updated `prisma.config.ts` so Prisma 7 migration commands load `DATABASE_URL` from `.env.local`.
  - Created and applied the initial Prisma migration `20260716161406_init_project_data`.
  - Completed implementation of `context/feature-specs/05-prisma.md`.
  - Verified `context/feature-specs/05-prisma.md` with `npx prisma validate`, `npx prisma generate`, `npx prisma migrate dev --name init_project_data`, and `npm run build`.
  - Initial sandboxed `npm run build` failed because `next/font` could not fetch Google Fonts; rerunning `npm run build` with approved network access passed.
- Implementing task 06 - project API routes
  - Implemented `context/06-project-apis.md` backend project API routes.
  - Added authenticated `GET /api/projects` and `POST /api/projects` handlers.
  - Added owner-enforced `PATCH /api/projects/[projectId]` and `DELETE /api/projects/[projectId]` handlers with `401`, `403`, and `404` responses.
  - Added `lib/project-api.ts` shared request/auth/project serialization helpers for the project routes.
  - Normalized the exported Prisma singleton type in `lib/prisma.ts` so route handlers can use a consistent client shape across Accelerate and direct Postgres branches.
  - Started implementation of `context/06-project-apis.md`.
  - Completed implementation of `context/06-project-apis.md`.
  - Initial sandboxed `npm run build` failed because `next/font` could not reach Google Fonts; rerunning `npm run build` with approved network access passed.
  - Verified `context/06-project-apis.md` with `npm run build`.
- Implementing task 07 - wire editor home to real project data
  - Implemented `context/feature-specs/07-wire-editor-home.md`.
  - Added `lib/project-data.ts` to fetch owned and shared editor projects server-side and validate workspace access.
  - Added `hooks/use-project-actions.ts` to manage create, rename, and delete dialogs with real API mutations.
  - Wired `app/editor/page.tsx` to load project data server-side and pass it into the editor layout.
  - Added `app/editor/[projectId]/page.tsx` so project creation and sidebar navigation can open a real workspace route.
  - Updated the editor sidebar and dialogs to use real project data, room ID previews, rename prefills, and active-workspace delete redirects.
  - Started implementation of `context/feature-specs/07-wire-editor-home.md`.
  - Completed implementation of `context/feature-specs/07-wire-editor-home.md`.
  - The first sandboxed `npm run build` failed because `next/font` could not fetch Google Fonts; rerunning `npm run build` with approved network access passed.
  - Verified `context/feature-specs/07-wire-editor-home.md` with `npm run build`.
- Implementing task 08 - editor workspace shell
  - Implemented `context/feature-specs/08-editor-workspace-shell.md`.
  - Added `lib/project-access.ts` to centralize current Clerk identity lookup and project access filtering by owner or collaborator.
  - Added `components/editor/access-denied.tsx` for missing or unauthorized workspace access.
  - Added `components/editor/workspace-shell.tsx` with the dedicated workspace navbar, canvas placeholder, AI sidebar placeholder, and existing project sidebar/dialog integration.
  - Updated `app/editor/[projectId]/page.tsx` to remain server-rendered, redirect unauthenticated users to `/sign-in`, and render `AccessDenied` for missing or unauthorized projects.
  - Refactored `lib/project-data.ts` to reuse the shared project access helper.
  - Updated the editor workspace shell so the project sidebar closes on outside clicks and the AI Assistant auto-opens on page load, then closes after 2 seconds before returning to normal toggle behavior.
  - Removed the desktop dimming from the project sidebar click-catcher so the editor canvas stays visually clear while the sidebar is open.
  - Fixed the workspace AI sidebar auto-close timer so manual interaction cancels the initial pending timeout while preserving the first-load auto-close behavior.
  - Updated the project sidebar overlay to use `md:backdrop-blur-none` so the mobile blur is fully cleared on desktop.
  - Started implementation of `context/feature-specs/08-editor-workspace-shell.md`.
  - Completed implementation of `context/feature-specs/08-editor-workspace-shell.md`.
  - Initial sandboxed `npm run build` failed because `next/font` could not fetch Google Fonts; rerunning `npm run build` with approved network access passed.
  - Verified `context/feature-specs/08-editor-workspace-shell.md` with `npm run build`.
  - Verified the workspace shell interaction update with `npm run build`.
  - Verified the sidebar backdrop adjustment with `npm run build`.
  - Verified the AI sidebar timeout fix with `npm run build`.
  - Verified the responsive sidebar blur fix with `npm run build`.
- Implementing task 09 - workspace share dialog
  - Implemented `context/feature-specs/09-share-dialog.md`.
  - Added owner-guarded collaborator API routes for listing, inviting, and removing project collaborators.
  - Added Clerk Backend API enrichment for collaborator names and avatar images with email-only fallback when no Clerk user is found.
  - Added the workspace share dialog with invite, remove, copy-link, and read-only collaborator access states.
  - Started implementation of `context/feature-specs/09-share-dialog.md`.
  - Completed implementation of `context/feature-specs/09-share-dialog.md`.
  - Initial sandboxed `npm run build` failed because `next/font` could not fetch Google Fonts; rerunning `npm run build` with approved network access passed.
  - Verified `context/feature-specs/09-share-dialog.md` with `npm run build`.
- Implementing task 10 - Liveblocks setup
  - Implemented `context/feature-specs/10-liveblocks-setup.md`.
  - Added `liveblocks.config.ts` with typed Presence and UserMeta definitions for cursor state, thinking state, and authenticated user metadata.
  - Added `lib/liveblocks.ts` with a cached Liveblocks node client getter and deterministic cursor-color mapping from a fixed palette.
  - Added authenticated `POST /api/liveblocks-auth` with Clerk auth, project membership verification, room provisioning, and user session metadata issuance.
  - Installed the missing `@liveblocks/node` dependency required by the server auth route.
  - Updated the Liveblocks client initialization to be lazy so the build does not require `LIVEBLOCKS_SECRET_KEY` at module evaluation time.
  - Started implementation of `context/feature-specs/10-liveblocks-setup.md`.
  - Completed implementation of `context/feature-specs/10-liveblocks-setup.md`.
  - Verified `context/feature-specs/10-liveblocks-setup.md` with `npm run build`.

## In Progress

- No active implementation task.

## Next Up

- Start the next feature unit after selecting its spec.

## Open Questions

- Add unresolved product or implementation questions here.

## Architecture Decisions

- Prisma CLI configuration now loads both `.env` and `.env.local` so local app and migration commands resolve the same `DATABASE_URL`.

## Session Notes

- Implementing task 01 - design system foundation
  - Completed implementation of `context/feature-specs/01-design-system.md`.
  - Initial sandboxed build failed because `next/font` could not fetch Google Fonts; rerunning `npm run build` with approved network access passed.
- Implementing task 02 - editor shell and layout
  - Started implementation of `context/feature-specs/02-editor.md`.
  - Completed the editor navbar, floating project sidebar, and reusable editor dialog pattern implementation pass.
  - Verified the editor shell with lint and production build.
  - Integrated the editor navbar and project sidebar into a reusable editor layout and mounted it on the home page.
  - Verified the editor layout integration with lint and production build.
- Implementing task 03 - Clerk authentication flow
  - Started implementation of `context/feature-specs/03-auth.md`.
  - Completed Clerk auth integration and verified with lint and production build.
- Implementing task 04 - project dialogs and editor home
  - Started implementation of `context/feature-specs/04-project-dialogs.md`.
  - Completed implementation of `context/feature-specs/04-project-dialogs.md`.
  - Initial sandboxed build failed because `next/font` could not fetch Google Fonts; rerunning `npm run build` with approved network access passed.
- Implementing task 05 - Prisma data layer
  - Started implementation of `context/feature-specs/05-prisma.md`.
  - Corrected the Prisma Accelerate dependency version to the published package release `3.0.1`.
  - Updated `prisma.config.ts` so Prisma 7 migration commands load `DATABASE_URL` from `.env.local`.
  - Created and applied the initial Prisma migration `20260716161406_init_project_data`.
  - Completed implementation of `context/feature-specs/05-prisma.md`.
  - Initial sandboxed `npm run build` failed because `next/font` could not fetch Google Fonts; rerunning `npm run build` with approved network access passed.
- Implementing task 06 - project API routes
  - Started implementation of `context/06-project-apis.md`.
  - Completed implementation of `context/06-project-apis.md`.
  - Initial sandboxed `npm run build` failed because `next/font` could not reach Google Fonts; rerunning `npm run build` with approved network access passed.
- Implementing task 07 - wire editor home to real project data
  - Started implementation of `context/feature-specs/07-wire-editor-home.md`.
  - Completed implementation of `context/feature-specs/07-wire-editor-home.md`.
  - The first sandboxed `npm run build` failed because `next/font` could not fetch Google Fonts; rerunning `npm run build` with approved network access passed.
- Implementing task 08 - editor workspace shell
  - Fixed the verified workspace AI sidebar reopen race by clearing the initial auto-close timeout on manual toggle, then revalidated with `npm run build`.
  - Fixed the verified project sidebar desktop overlay class by replacing `md:backdrop-blur-0` with `md:backdrop-blur-none`, then revalidated with `npm run build`.
  - Completed implementation of `context/feature-specs/08-editor-workspace-shell.md`.
  - Initial sandboxed `npm run build` failed because `next/font` could not fetch Google Fonts; rerunning `npm run build` with approved network access passed.
  - Started implementation of `context/feature-specs/08-editor-workspace-shell.md`.
- Redirect stabilization - auth route behavior fixes
  - Started redirect stabilization for the issues documented in `context/current-issues.md`.
  - Completed redirect stabilization and verified with lint and production build.
  - Cleared the resolved local issue notes and moved `context/current-issues.md` to the ignored local scratchpad list.
- Implementing task 09 - workspace share dialog
  - Started implementation of `context/feature-specs/09-share-dialog.md`.
  - Completed implementation of `context/feature-specs/09-share-dialog.md`.
  - Initial sandboxed `npm run build` failed because `next/font` could not fetch Google Fonts; rerunning `npm run build` with approved network access passed.
- Implementing task 10 - Liveblocks setup
  - Started implementation of `context/feature-specs/10-liveblocks-setup.md`.
  - Added `liveblocks.config.ts`, `lib/liveblocks.ts`, and `app/api/liveblocks-auth/route.ts`.
  - Installed `@liveblocks/node` after the first build failed on the missing module import.
  - Adjusted the Liveblocks `identifyUser` call to match the installed SDK signature.
  - Switched the Liveblocks client to lazy initialization after the build surfaced a module-evaluation requirement for `LIVEBLOCKS_SECRET_KEY`.
  - Completed implementation of `context/feature-specs/10-liveblocks-setup.md`.
  - Verified the feature with `npm run build`.
- Implementing local font migration - switched app fonts to local assets
  - Added local Geist Sans and Geist Mono font assets under `app/fonts/`.
  - Replaced `next/font/google` with `next/font/local` in `app/layout.tsx`.
  - Updated `context/ui-context.md` to reflect the local font loading approach.
