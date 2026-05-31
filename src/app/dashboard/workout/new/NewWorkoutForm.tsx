"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { createWorkoutAction } from "./actions";

export default function NewWorkoutForm({ defaultDate }: { defaultDate: string }) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const name = formData.get("name") as string;
    const startedAt = formData.get("startedAt") as string;

    startTransition(async () => {
      await createWorkoutAction({ name, startedAt });
    });
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <Label htmlFor="name">Workout name</Label>
        <Input
          id="name"
          name="name"
          placeholder="e.g. Upper body, Leg day…"
          required
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="startedAt">Date</Label>
        <Input
          id="startedAt"
          name="startedAt"
          type="date"
          defaultValue={defaultDate}
          required
        />
      </div>

      <div className="flex gap-3">
        <Button type="submit" disabled={isPending}>
          {isPending ? "Saving…" : "Create workout"}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
