import type { Metadata } from "next";
import localFont from "next/font/local";
import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/ui/themes";
import { AUTH_ROUTES } from "@/lib/auth-routes";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/geist-sans-latin.woff2",
  variable: "--font-geist-sans",
  display: "swap",
});

const geistMono = localFont({
  src: "./fonts/geist-mono-latin.woff2",
  variable: "--font-geist-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Ghost AI",
  description: "A collaborative system design workspace.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} dark h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <ClerkProvider
          signInFallbackRedirectUrl={AUTH_ROUTES.editor}
          signInForceRedirectUrl={AUTH_ROUTES.editor}
          signUpFallbackRedirectUrl={AUTH_ROUTES.editor}
          signUpForceRedirectUrl={AUTH_ROUTES.editor}
          afterSignOutUrl={AUTH_ROUTES.signIn}
          appearance={{
            theme: dark,
            variables: {
              colorPrimary: "var(--accent-primary)",
              colorPrimaryForeground: "var(--bg-base)",
              colorBackground: "var(--bg-surface)",
              colorForeground: "var(--text-primary)",
              colorMutedForeground: "var(--text-secondary)",
              colorInput: "var(--bg-elevated)",
              colorInputForeground: "var(--text-primary)",
              colorNeutral: "var(--text-muted)",
              colorBorder: "var(--border-default)",
              colorDanger: "var(--state-error)",
              borderRadius: "var(--radius)",
              fontFamily: "var(--font-geist-sans)",
            },
          }}
        >
          {children}
        </ClerkProvider>
      </body>
    </html>
  );
}
