"use server";

import { z } from "zod";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { createWorkout } from "@/data/workouts";

const createWorkoutSchema = z.object({
  name: z.string().min(1, "Workout name is required"),
  startedAt: z.string().min(1, "Date is required"),
});

type CreateWorkoutParams = z.infer<typeof createWorkoutSchema>;

export async function createWorkoutAction(params: CreateWorkoutParams) {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const parsed = createWorkoutSchema.safeParse(params);
  if (!parsed.success) throw new Error("Invalid input");

  await createWorkout({
    userId,
    name: parsed.data.name,
    startedAt: new Date(`${parsed.data.startedAt}T00:00:00`),
  });

  redirect("/dashboard");
}
