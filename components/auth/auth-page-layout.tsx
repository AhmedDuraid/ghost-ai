import type { ReactNode } from "react";

interface AuthPageLayoutProps {
  children: ReactNode;
}

const featureItems = [
  "Create architecture projects from plain English.",
  "Collaborate on a shared technical canvas.",
  "Generate implementation-ready specifications.",
];

export function AuthPageLayout({ children }: AuthPageLayoutProps) {
  return (
    <main className="min-h-screen bg-base text-copy-primary">
      <div className="mx-auto grid min-h-screen w-full max-w-6xl grid-cols-1 lg:grid-cols-[0.9fr_1.1fr]">
        <section className="hidden border-r border-surface-border px-10 py-12 lg:flex lg:flex-col lg:justify-between">
          <div>
            <p className="font-mono text-sm uppercase tracking-normal text-brand">
              Ghost AI
            </p>
            <div className="mt-8 max-w-sm">
              <h1 className="text-3xl font-semibold tracking-normal text-copy-primary">
                System design work, mapped as fast as you can think.
              </h1>
              <p className="mt-4 text-sm leading-6 text-copy-secondary">
                Sign in to create projects, shape architecture diagrams with your team,
                and turn the final graph into a technical spec.
              </p>
            </div>
          </div>

          <ul className="space-y-3 text-sm text-copy-secondary">
            {featureItems.map((item) => (
              <li key={item} className="flex gap-3">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brand" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="flex min-h-screen items-center justify-center px-4 py-8 sm:px-6">
          {children}
        </section>
      </div>
    </main>
  );
}
