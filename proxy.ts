import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

function resolveRoutePath(route: string | undefined, fallback: string) {
  if (!route) {
    return fallback;
  }

  if (route.startsWith("/")) {
    return route;
  }

  try {
    const parsedRoute = new URL(route);
    return `${parsedRoute.pathname}${parsedRoute.search}${parsedRoute.hash}`;
  } catch {
    return fallback;
  }
}

const signInUrl = resolveRoutePath(
  process.env.NEXT_PUBLIC_CLERK_SIGN_IN_URL,
  "/sign-in"
);
const signUpUrl = resolveRoutePath(
  process.env.NEXT_PUBLIC_CLERK_SIGN_UP_URL,
  "/sign-up"
);

const isPublicRoute = createRouteMatcher([
  "/",
  `${signInUrl}(.*)`,
  `${signUpUrl}(.*)`,
]);

export default clerkMiddleware(async (auth, request) => {
  if (!isPublicRoute(request)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
