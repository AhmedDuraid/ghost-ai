import Link from "next/link"
import { Lock } from "lucide-react"

import { buttonVariants } from "@/components/ui/button"
import { AUTH_ROUTES } from "@/lib/auth-routes"

export function AccessDenied() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-base px-6 py-12 text-copy-primary">
      <div className="flex max-w-md flex-col items-center rounded-3xl border border-surface-border bg-surface px-8 py-10 text-center shadow-2xl">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-surface-border bg-elevated text-copy-secondary">
          <Lock className="h-7 w-7" />
        </div>
        <h1 className="mt-5 text-2xl font-semibold">Workspace unavailable</h1>
        <p className="mt-3 text-sm leading-6 text-copy-muted">
          You do not have access to this workspace, or it no longer exists.
        </p>
        <Link
          href={AUTH_ROUTES.editor}
          className={buttonVariants({ className: "mt-6" })}
        >
          Back to editor
        </Link>
      </div>
    </div>
  )
}
