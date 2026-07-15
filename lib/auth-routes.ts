export const AUTH_ROUTES = {
  editor: "/editor",
  signIn: "/sign-in",
  signUp: "/sign-up",
} as const;

export function resolveRoutePath(route: string | undefined, fallback: string) {
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
