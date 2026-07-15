clerk is already installed and connected. write it into Next.js app: provider, auth page, redirects, route protection, and user menu.

## Design

Use Clerk `dark` theme from `clerk/ui/themes` as the base.

override Clerk appearance using the app's existing CSS variables. Do not hardcode colors.

### Sign-in sign-up pages:

- large screens: simple two-panel layout
- left: compact, tagline, short text-only feature list.
- right: centered Clerk form
- small screens: form only
- no gradients
- no oversized hero sections
- no feature cards
- no scroll-heavy layout

keep the layout minimal and professional

## Implementation

Wrap the root layout with `ClerkProvider` using Clerk's `dark` theme.

Create sign-in and sign-up pages using Clerks components.

Use `proxy.ts` at the project root, not `middleware.ts`

Define public route using the existing sign-in and sign-up env vars. Protect everything else by default.

update `/`:

- authenticated users redirect to `/editor`
- unauthenticated users redirect to `/sign-in`

add Clerk's build-in `UserButton` to the editor navbar right section for profile settings and logout.

keep Clerk's default menu and profile flows intact. do not rebuild heavily customize clerk internals.

use existing env vars. do not rename or invent new ones.

## Dependencies

install: @clerk/ui

## check when done

- `proxy.ts` exists at the root
- all routes are protected except public auth paths.
- auth pages use CSS variables no hardcoded color.
- `npm run build` passes
