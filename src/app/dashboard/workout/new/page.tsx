import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { format } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import NewWorkoutForm from "./NewWorkoutForm";

export default async function NewWorkoutPage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const today = format(new Date(), "yyyy-MM-dd");

  return (
    <main className="mx-auto max-w-lg px-4 py-10">
      <Card>
        <CardHeader>
          <CardTitle>New workout</CardTitle>
        </CardHeader>
        <CardContent>
          <NewWorkoutForm defaultDate={today} />
        </CardContent>
      </Card>
    </main>
  );
}
