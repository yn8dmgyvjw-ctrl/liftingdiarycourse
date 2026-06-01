"use server";

import { z } from "zod";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { updateWorkout } from "@/data/workouts";

const updateWorkoutSchema = z.object({
  workoutId: z.string().uuid(),
  name: z.string().min(1, "Workout name is required"),
  startedAt: z.string().min(1, "Date is required"),
});

type UpdateWorkoutParams = z.infer<typeof updateWorkoutSchema>;

export async function updateWorkoutAction(params: UpdateWorkoutParams) {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const parsed = updateWorkoutSchema.safeParse(params);
  if (!parsed.success) throw new Error("Invalid input");

  await updateWorkout(parsed.data.workoutId, userId, {
    name: parsed.data.name,
    startedAt: new Date(`${parsed.data.startedAt}T00:00:00`),
  });

  redirect("/dashboard");
}
