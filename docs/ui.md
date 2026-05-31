# UI Coding Standards

## Component Library

**Only shadcn/ui components may be used for UI in this project.**

- Do not create custom components. If something is needed, find the appropriate shadcn/ui component.
- Install new shadcn/ui components via `npx shadcn@latest add <component>`.
- Components live in `src/components/ui/` and must not be modified beyond what shadcn/ui generates.

## Date Formatting

All dates must be formatted using `date-fns`. Do not use `Date.toLocaleDateString`, `Intl.DateTimeFormat`, or any other date formatting approach.

### Format

Dates are displayed in `do MMM yyyy` format (ordinal day, abbreviated month, full year):

```
1st Sep 2025
2nd Aug 2025
3rd Jan 2026
4th Jun 2024
```

### Usage

```ts
import { format } from "date-fns";

format(date, "do MMM yyyy"); // "1st Sep 2025"
```
