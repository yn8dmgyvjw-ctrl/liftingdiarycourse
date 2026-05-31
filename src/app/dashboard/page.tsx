import { format } from "date-fns";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import DatePicker from "./DatePicker";
import { getWorkoutsForUser } from "@/data/workouts";

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ date?: string }>;
}) {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const { date } = await searchParams;
  const today = format(new Date(), "yyyy-MM-dd");
  const selectedDate = date ?? today;
  const displayDate = format(new Date(`${selectedDate}T00:00:00`), "do MMM yyyy");

  const workoutList = await getWorkoutsForUser(userId, selectedDate);

  return (
    <main className="mx-auto max-w-2xl px-4 py-10">
      <div className="mb-8 flex flex-col gap-2">
        <h1 className="text-2xl font-semibold tracking-tight">Workout Log</h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          Viewing workouts for {displayDate}
        </p>
      </div>

      <div className="mb-8">
        <DatePicker value={selectedDate} />
      </div>

      <section>
        <h2 className="mb-4 text-sm font-medium uppercase tracking-widest text-zinc-400">
          Logged workouts
        </h2>

        {workoutList.length === 0 ? (
          <p className="text-sm text-zinc-500">No workouts logged for this date.</p>
        ) : (
          <ul className="flex flex-col gap-4">
            {workoutList.map((workout) => (
              <li
                key={workout.id}
                className="rounded-xl border border-zinc-200 bg-white px-5 py-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
              >
                <p className="font-semibold text-zinc-900 dark:text-zinc-100">
                  {workout.name ?? "Untitled workout"}
                </p>

                {workout.exercises.length === 0 ? (
                  <p className="mt-2 text-sm text-zinc-400">No exercises added yet.</p>
                ) : (
                  <ul className="mt-3 flex flex-col gap-3">
                    {workout.exercises.map((exercise, index) => (
                      <li key={index}>
                        <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                          {exercise.name}
                        </span>
                        <ul className="mt-1 flex flex-col gap-1">
                          {exercise.sets.map((s) => (
                            <li key={s.setNumber} className="text-sm text-zinc-500 dark:text-zinc-400">
                              Set {s.setNumber}
                              {s.reps != null ? ` — ${s.reps} reps` : ""}
                              {s.weightLbs != null ? ` @ ${s.weightLbs} lbs` : ""}
                            </li>
                          ))}
                        </ul>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
