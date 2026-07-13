import { SignIn } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

import { AuthPageLayout } from "@/components/auth/auth-page-layout";
import { AUTH_ROUTES, resolveRoutePath } from "@/lib/auth-routes";

export default async function SignInPage() {
  const { isAuthenticated } = await auth();

  if (isAuthenticated) {
    redirect(AUTH_ROUTES.editor);
  }

  return (
    <AuthPageLayout>
      <SignIn
        routing="path"
        path={AUTH_ROUTES.signIn}
        signUpUrl={resolveRoutePath(
          process.env.NEXT_PUBLIC_CLERK_SIGN_UP_URL,
          AUTH_ROUTES.signUp
        )}
        fallbackRedirectUrl={AUTH_ROUTES.editor}
        forceRedirectUrl={AUTH_ROUTES.editor}
        afterSignOutUrl={AUTH_ROUTES.signIn}
      />
    </AuthPageLayout>
  );
}
