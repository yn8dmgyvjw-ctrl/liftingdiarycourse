import {
  pgTable,
  uuid,
  text,
  timestamp,
  integer,
  numeric,
} from "drizzle-orm/pg-core";

// ---------------------------------------------------------------------------
// workouts
// ---------------------------------------------------------------------------
export const workouts = pgTable("workouts", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: text("user_id").notNull(),
  name: text("name"),
  startedAt: timestamp("started_at").notNull().defaultNow(),
  completedAt: timestamp("completed_at"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export type Workout = typeof workouts.$inferSelect;
export type NewWorkout = typeof workouts.$inferInsert;

// ---------------------------------------------------------------------------
// exercises  (reusable catalog)
// ---------------------------------------------------------------------------
export const exercises = pgTable("exercises", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull().unique(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export type Exercise = typeof exercises.$inferSelect;
export type NewExercise = typeof exercises.$inferInsert;

// ---------------------------------------------------------------------------
// workout_exercises  (junction: workout ↔ exercise, ordered)
// ---------------------------------------------------------------------------
export const workoutExercises = pgTable("workout_exercises", {
  id: uuid("id").primaryKey().defaultRandom(),
  workoutId: uuid("workout_id")
    .notNull()
    .references(() => workouts.id, { onDelete: "cascade" }),
  exerciseId: uuid("exercise_id")
    .notNull()
    .references(() => exercises.id),
  orderIndex: integer("order_index").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export type WorkoutExercise = typeof workoutExercises.$inferSelect;
export type NewWorkoutExercise = typeof workoutExercises.$inferInsert;

// ---------------------------------------------------------------------------
// sets
// ---------------------------------------------------------------------------
export const sets = pgTable("sets", {
  id: uuid("id").primaryKey().defaultRandom(),
  workoutExerciseId: uuid("workout_exercise_id")
    .notNull()
    .references(() => workoutExercises.id, { onDelete: "cascade" }),
  setNumber: integer("set_number").notNull(),
  reps: integer("reps"),
  weightLbs: numeric("weight_lbs", { precision: 6, scale: 2 }),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export type Set = typeof sets.$inferSelect;
export type NewSet = typeof sets.$inferInsert;
