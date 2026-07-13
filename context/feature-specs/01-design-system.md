Read `AGENT.md` before starting

we're adding the design system and UI primitive component

Install and configure `shadcn/ui`

add these shadcn component
-Button
-card
-dialog
-input
-Tabs
-Textarea
-ScrollArea

do not modify the generated `component/ui/*` files after installation

also install `lucide-react`.

create `lib/utils.ts` with a reusable `cn()` helper for merging Tailwind classes

ensure all components match the existing dark them in `globals.css`

### Check when done

- All components import without errors
- `cn()` works properly
  -no default light styling appears
