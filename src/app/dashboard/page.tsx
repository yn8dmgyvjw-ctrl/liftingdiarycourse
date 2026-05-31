import { format } from "date-fns";
import DatePicker from "./DatePicker";

const MOCK_WORKOUTS = [
  {
    id: "1",
    name: "Back Squat",
    sets: 4,
    reps: 5,
    weightKg: 80,
  },
  {
    id: "2",
    name: "Romanian Deadlift",
    sets: 3,
    reps: 8,
    weightKg: 60,
  },
  {
    id: "3",
    name: "Leg Press",
    sets: 3,
    reps: 12,
    weightKg: 120,
  },
];

export default function DashboardPage({
  searchParams,
}: {
  searchParams: { date?: string };
}) {
  const today = format(new Date(), "yyyy-MM-dd");
  const selectedDate = searchParams.date ?? today;
  const displayDate = format(new Date(`${selectedDate}T00:00:00`), "do MMM yyyy");

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
          Logged exercises
        </h2>

        {MOCK_WORKOUTS.length === 0 ? (
          <p className="text-sm text-zinc-500">No workouts logged for this date.</p>
        ) : (
          <ul className="flex flex-col gap-3">
            {MOCK_WORKOUTS.map((workout) => (
              <li
                key={workout.id}
                className="rounded-xl border border-zinc-200 bg-white px-5 py-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium text-zinc-900 dark:text-zinc-100">
                    {workout.name}
                  </span>
                  <span className="text-sm text-zinc-500 dark:text-zinc-400">
                    {workout.weightKg} kg
                  </span>
                </div>
                <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                  {workout.sets} sets × {workout.reps} reps
                </p>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
