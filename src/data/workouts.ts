import { db } from "@/db";
import { workouts, workoutExercises, exercises, sets } from "@/db/schema";
import { eq, and, gte, lt } from "drizzle-orm";

export async function getWorkoutsForUser(userId: string, date: string) {
  const dayStart = new Date(`${date}T00:00:00`);
  const dayEnd = new Date(`${date}T00:00:00`);
  dayEnd.setDate(dayEnd.getDate() + 1);

  const rows = await db
    .select({
      workoutId: workouts.id,
      workoutName: workouts.name,
      exerciseName: exercises.name,
      workoutExerciseId: workoutExercises.id,
      orderIndex: workoutExercises.orderIndex,
      setNumber: sets.setNumber,
      reps: sets.reps,
      weightLbs: sets.weightLbs,
    })
    .from(workouts)
    .innerJoin(workoutExercises, eq(workoutExercises.workoutId, workouts.id))
    .innerJoin(exercises, eq(exercises.id, workoutExercises.exerciseId))
    .leftJoin(sets, eq(sets.workoutExerciseId, workoutExercises.id))
    .where(
      and(
        eq(workouts.userId, userId),
        gte(workouts.startedAt, dayStart),
        lt(workouts.startedAt, dayEnd)
      )
    )
    .orderBy(workoutExercises.orderIndex, sets.setNumber);

  // Group into exercises with their sets
  const exerciseMap = new Map<
    string,
    { name: string; sets: { setNumber: number; reps: number | null; weightLbs: string | null }[] }
  >();

  for (const row of rows) {
    if (!exerciseMap.has(row.workoutExerciseId)) {
      exerciseMap.set(row.workoutExerciseId, {
        name: row.exerciseName,
        sets: [],
      });
    }
    if (row.setNumber !== null) {
      exerciseMap.get(row.workoutExerciseId)!.sets.push({
        setNumber: row.setNumber,
        reps: row.reps,
        weightLbs: row.weightLbs,
      });
    }
  }

  return Array.from(exerciseMap.values());
}
