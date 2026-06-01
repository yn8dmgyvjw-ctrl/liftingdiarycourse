# Routing

## Route Structure

All application routes must live under `/dashboard`. The `/dashboard` page and all sub-pages are protected and only accessible to authenticated users.

## Route Protection

Route protection is handled in Next.js middleware (`src/proxy.ts`). Do not add per-page auth guards in Server Components — the middleware is the single enforcement point.

The middleware must protect all routes matching `/dashboard` and `/dashboard/(.*)`. Unauthenticated users must be redirected to `/sign-in`.

### Example

```ts
// src/proxy.ts
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isProtectedRoute = createRouteMatcher(["/dashboard(.*)"]);

export default clerkMiddleware(async (auth, req) => {
  if (isProtectedRoute(req)) {
    await auth.protect();
  }
});

export const config = {
  matcher: ["/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)", "/(api|trpc)(.*)"],
};
```

## Adding New Routes

- New pages go under `src/app/dashboard/` (e.g. `src/app/dashboard/workouts/page.tsx`).
- No additional auth checks are needed in the page — middleware handles it.
- Use folder-based routing with `page.tsx` files.
