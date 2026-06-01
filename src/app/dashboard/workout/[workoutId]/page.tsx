import { auth } from "@clerk/nextjs/server";
import { redirect, notFound } from "next/navigation";
import { format } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getWorkoutById } from "@/data/workouts";
import EditWorkoutForm from "./EditWorkoutForm";

type Props = {
  params: Promise<{ workoutId: string }>;
};

export default async function EditWorkoutPage({ params }: Props) {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const { workoutId } = await params;
  const workout = await getWorkoutById(workoutId, userId);
  if (!workout) notFound();

  const defaultDate = format(workout.startedAt, "yyyy-MM-dd");

  return (
    <main className="mx-auto max-w-lg px-4 py-10">
      <Card>
        <CardHeader>
          <CardTitle>Edit workout</CardTitle>
        </CardHeader>
        <CardContent>
          <EditWorkoutForm
            workoutId={workout.id}
            defaultName={workout.name ?? ""}
            defaultDate={defaultDate}
          />
        </CardContent>
      </Card>
    </main>
  );
}
