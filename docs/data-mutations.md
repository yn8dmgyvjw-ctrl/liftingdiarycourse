# Data Mutations

## RULE: Mutations via `/data` Helpers Only

All database mutations (insert, update, delete) MUST go through helper functions in the `/data` directory. These helpers use Drizzle ORM — never write raw SQL or call `db` directly outside of `/data`.

```
src/
  data/
    workouts.ts     # e.g. createWorkout(), deleteWorkout()
    exercises.ts    # e.g. createExercise(), updateExercise()
```

Each mutation helper function:
- Accepts typed parameters (never `FormData`)
- Performs a single, focused database operation
- Is scoped to the authenticated user — always includes the `userId` in writes and filters

## RULE: Server Actions Only — in Colocated `actions.ts` Files

All mutations MUST be triggered via Server Actions. Server Actions must live in a file named `actions.ts` colocated with the route or feature they belong to.

```
src/
  app/
    workouts/
      new/
        page.tsx
        actions.ts    ← server actions for this route
```

**Never mutate data via:**
- Route handlers (`src/app/api/`)
- Client-side `fetch` calls
- `useEffect` or event handlers that call an API directly

## RULE: Server Action Parameters Must Be Typed — No `FormData`

Every Server Action must accept explicitly typed parameters. Never use `FormData` as a parameter type.

**Correct:**
```ts
export async function createWorkout(params: CreateWorkoutParams) { ... }
```

**Never do this:**
```ts
// WRONG — untyped FormData
export async function createWorkout(formData: FormData) { ... }
```

## RULE: All Server Actions Must Validate with Zod

Every Server Action must validate its arguments with a Zod schema before doing anything else. Do not trust the caller.

```ts
import { z } from "zod";

const createWorkoutSchema = z.object({
  name: z.string().min(1),
  date: z.string(),
});
```

Parse inside the action and return early on failure — never proceed with invalid input.

## Full Pattern

**Server Action (`actions.ts`):**

```ts
"use server";

import { z } from "zod";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { createWorkout } from "@/data/workouts";

const createWorkoutSchema = z.object({
  name: z.string().min(1),
  date: z.string(),
});

type CreateWorkoutParams = z.infer<typeof createWorkoutSchema>;

export async function createWorkoutAction(params: CreateWorkoutParams) {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const parsed = createWorkoutSchema.safeParse(params);
  if (!parsed.success) throw new Error("Invalid input");

  await createWorkout({ userId, ...parsed.data });
}
```

**Data helper (`src/data/workouts.ts`):**

```ts
import { db } from "@/db";
import { workouts } from "@/db/schema";

type CreateWorkoutInput = {
  userId: string;
  name: string;
  date: string;
};

export async function createWorkout(input: CreateWorkoutInput) {
  await db.insert(workouts).values(input);
}
```

**Never do this:**

```ts
// WRONG — calling db directly inside a Server Action
export async function createWorkoutAction(params: CreateWorkoutParams) {
  await db.insert(workouts).values(params); // should go through /data helper
}

// WRONG — no Zod validation
export async function createWorkoutAction(params: CreateWorkoutParams) {
  await createWorkout(params); // params not validated
}

// WRONG — FormData parameter
export async function createWorkoutAction(formData: FormData) { ... }

// WRONG — mutation inside a route handler
export async function POST(req: Request) {
  const body = await req.json();
  await db.insert(workouts).values(body);
}
```
