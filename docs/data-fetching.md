# Data Fetching

## RULE: Server Components Only

All data fetching in this app MUST be done exclusively via Server Components.

**Never fetch data via:**
- Route handlers (`src/app/api/`)
- Client components (`"use client"`)
- `useEffect` + `fetch`
- SWR, React Query, or any client-side fetching library
- Any other mechanism

**Always fetch data via:**
- Server Components that call helper functions from the `/data` directory

## RULE: Database Queries via `/data` Helpers Only

All database queries MUST go through helper functions in the `/data` directory. These helpers use Drizzle ORM — never write raw SQL.

```
src/
  data/
    workouts.ts     # e.g. getWorkoutsForUser(userId)
    exercises.ts    # e.g. getExercisesForUser(userId)
```

Each helper function:
- Accepts the current user's ID as a parameter
- Queries only that user's data using a `.where(eq(table.userId, userId))` clause
- Returns typed results via Drizzle's inferred types

## RULE: Users Can Only Access Their Own Data

**This is a hard security requirement.** Every query must be scoped to the authenticated user.

- Always obtain the user ID from the auth session (e.g. Clerk's `auth()`) in the Server Component
- Always pass the user ID into the `/data` helper
- The helper must always filter by `userId` — no exceptions

**Correct pattern:**

```ts
// src/app/dashboard/page.tsx (Server Component)
import { auth } from "@clerk/nextjs/server";
import { getWorkoutsForUser } from "@/data/workouts";

export default async function DashboardPage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const workouts = await getWorkoutsForUser(userId);
  return <WorkoutList workouts={workouts} />;
}
```

```ts
// src/data/workouts.ts
import { db } from "@/db";
import { workouts } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function getWorkoutsForUser(userId: string) {
  return db.select().from(workouts).where(eq(workouts.userId, userId));
}
```

**Never do this:**
```ts
// WRONG — fetches all rows, not scoped to the user
return db.select().from(workouts);

// WRONG — fetching in a client component
const [data, setData] = useState([]);
useEffect(() => { fetch("/api/workouts").then(...) }, []);

// WRONG — querying the DB directly in a page without a /data helper
const workouts = await db.select().from(workoutsTable);
```
