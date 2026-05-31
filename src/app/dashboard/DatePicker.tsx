"use client";

import { useRouter, usePathname } from "next/navigation";

export default function DatePicker({ value }: { value: string }) {
  const router = useRouter();
  const pathname = usePathname();

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const params = new URLSearchParams();
    params.set("date", e.target.value);
    router.push(`${pathname}?${params.toString()}`);
  }

  return (
    <input
      type="date"
      value={value}
      onChange={handleChange}
      className="rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-zinc-400 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
    />
  );
}
