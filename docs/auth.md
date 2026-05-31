# Authentication

## RULE: Use Clerk for All Authentication

This app uses **Clerk** for authentication. Do not implement any custom auth logic, session management, or JWT handling. Clerk handles all of it.

**Never use:**
- NextAuth / Auth.js
- Custom session tokens or cookies
- Any other authentication library

## RULE: Wrap the App in `ClerkProvider`

The root layout (`src/app/layout.tsx`) must wrap its children in `<ClerkProvider>`. This is already in place — do not remove or duplicate it.

```tsx
// src/app/layout.tsx
import { ClerkProvider } from "@clerk/nextjs";

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <ClerkProvider>
          {children}
        </ClerkProvider>
      </body>
    </html>
  );
}
```

## RULE: Middleware Lives in `src/proxy.ts`

Clerk middleware must be configured in `src/proxy.ts` (not `middleware.ts` — Next.js 16 renamed the convention). The file exports `clerkMiddleware()` and a `config` matcher.

```ts
// src/proxy.ts
import { clerkMiddleware } from "@clerk/nextjs/server";

export default clerkMiddleware();

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/__clerk/(.*)",
    "/(api|trpc)(.*)",
  ],
};
```

## RULE: Get the Current User in Server Components via `auth()`

In Server Components and server-side code, always use `auth()` from `@clerk/nextjs/server` to get the current user's ID. Redirect unauthenticated users to `/sign-in`.

```ts
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function ProtectedPage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  // userId is now a guaranteed non-null string
}
```

## RULE: UI Auth Components from `@clerk/nextjs`

Use Clerk's built-in components for all sign-in/sign-up/user UI. Do not build custom auth forms.

| Component | Purpose |
|---|---|
| `<SignInButton>` | Triggers sign-in (use `mode="modal"`) |
| `<SignUpButton>` | Triggers sign-up (use `mode="modal"`) |
| `<UserButton>` | Avatar/menu for the signed-in user |
| `<Show when="signed-in">` | Conditionally renders children when signed in |
| `<Show when="signed-out">` | Conditionally renders children when signed out |

```tsx
import { SignInButton, SignUpButton, UserButton, Show } from "@clerk/nextjs";

<Show when="signed-out">
  <SignInButton mode="modal" />
  <SignUpButton mode="modal" />
</Show>
<Show when="signed-in">
  <UserButton />
</Show>
```

## RULE: Never Access User Data Without Scoping to `userId`

The `userId` from `auth()` is the single source of truth for the current user. Every database query must be scoped to this ID. See `docs/data-fetching.md` for the required pattern.
