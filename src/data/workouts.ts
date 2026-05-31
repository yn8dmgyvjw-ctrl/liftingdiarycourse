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
    .leftJoin(workoutExercises, eq(workoutExercises.workoutId, workouts.id))
    .leftJoin(exercises, eq(exercises.id, workoutExercises.exerciseId))
    .leftJoin(sets, eq(sets.workoutExerciseId, workoutExercises.id))
    .where(
      and(
        eq(workouts.userId, userId),
        gte(workouts.startedAt, dayStart),
        lt(workouts.startedAt, dayEnd)
      )
    )
    .orderBy(workoutExercises.orderIndex, sets.setNumber);

  // Group into workouts, each with their exercises and sets
  const workoutMap = new Map<
    string,
    {
      id: string;
      name: string | null;
      exercises: Map<string, { name: string; sets: { setNumber: number; reps: number | null; weightLbs: string | null }[] }>;
    }
  >();

  for (const row of rows) {
    if (!workoutMap.has(row.workoutId)) {
      workoutMap.set(row.workoutId, { id: row.workoutId, name: row.workoutName, exercises: new Map() });
    }
    const workout = workoutMap.get(row.workoutId)!;

    if (row.workoutExerciseId && row.exerciseName) {
      if (!workout.exercises.has(row.workoutExerciseId)) {
        workout.exercises.set(row.workoutExerciseId, { name: row.exerciseName, sets: [] });
      }
      if (row.setNumber !== null) {
        workout.exercises.get(row.workoutExerciseId)!.sets.push({
          setNumber: row.setNumber,
          reps: row.reps,
          weightLbs: row.weightLbs,
        });
      }
    }
  }

  return Array.from(workoutMap.values()).map((w) => ({
    id: w.id,
    name: w.name,
    exercises: Array.from(w.exercises.values()),
  }));
}

export async function createWorkout(input: {
  userId: string;
  name: string;
  startedAt: Date;
}) {
  const [workout] = await db.insert(workouts).values(input).returning({ id: workouts.id });
  return workout;
}
