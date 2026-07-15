import { SignUp } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

import { AuthPageLayout } from "@/components/auth/auth-page-layout";
import { AUTH_ROUTES, resolveRoutePath } from "@/lib/auth-routes";

export default async function SignUpPage() {
  const { isAuthenticated } = await auth();

  if (isAuthenticated) {
    redirect(AUTH_ROUTES.editor);
  }

  return (
    <AuthPageLayout>
      <SignUp
        routing="path"
        path={AUTH_ROUTES.signUp}
        signInUrl={resolveRoutePath(
          process.env.NEXT_PUBLIC_CLERK_SIGN_IN_URL,
          AUTH_ROUTES.signIn
        )}
        fallbackRedirectUrl={AUTH_ROUTES.editor}
        forceRedirectUrl={AUTH_ROUTES.editor}
        signInFallbackRedirectUrl={AUTH_ROUTES.editor}
        signInForceRedirectUrl={AUTH_ROUTES.editor}
        afterSignOutUrl={AUTH_ROUTES.signIn}
      />
    </AuthPageLayout>
  );
}
