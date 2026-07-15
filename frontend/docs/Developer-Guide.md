# Developer Guide — ServiceHub Frontend

This guide documents the engineering conventions, rules, and patterns that every developer working on this project must follow. Consistency with these conventions is **mandatory** — not advisory.

---

## 1. The Golden Rules

These rules are non-negotiable and apply to every line of code in this project:

> **1. The backend is the single source of truth.**
>
> Do not invent API capabilities that do not exist. Do not create frontend workarounds for missing backend features. If an endpoint does not exist, the feature does not get built.

> **2. Axios lives only in Feature Services and infrastructure utilities.**
>
> No component, no hook, no page, no mapper may import from `axios` or reference `AxiosError`. The only files that may import Axios are:
> - `src/lib/api.ts` (the Axios singleton)
> - `src/features/<name>/services/<name>.service.ts` (feature API calls)
> - `src/utils/parseApiError.ts` (infrastructure error utility)

> **3. Backend DTOs never reach the UI.**
>
> Components only consume **Domain Models** (clean TypeScript types defined in `domain.types.ts`). API DTOs (`api.types.ts`) are transformed to domain models by a **Mapper** before reaching any hook, and they reach components only through hooks.

> **4. No business logic in components.**
>
> Components accept props and render JSX. They do not contain conditional logic that belongs in a service or hook. They do not make decisions about API structure.

> **5. Never copy-paste around the architecture.**
>
> If a feature needs a capability from another feature (e.g. mapping a booking), import the existing mapper — do not re-implement the same mapping in a new place.

---

## 2. Adding a New Feature — Step-by-Step

Follow this exact sequence when implementing a new feature:

### Step 1 — Research the backend

Before writing a single line of code:
1. Read the backend route handlers for the feature.
2. Identify every HTTP method, path, query parameter, and request body shape.
3. Identify every response DTO shape.
4. Identify authorization rules (which role can call which endpoint).
5. Identify validation rules and error response shapes.

If a required endpoint does not exist → **STOP. Do not implement the feature.**

### Step 2 — Create the feature folder

```
src/features/<feature-name>/
├── types/
│   ├── api.types.ts
│   └── domain.types.ts
├── mappers/
│   └── <name>.mapper.ts
├── services/
│   └── <name>.service.ts
├── hooks/
│   ├── <feature>.keys.ts       (query key factory)
│   └── use<FeatureName>.ts
└── components/
    └── <ComponentName>.tsx
```

### Step 3 — Define API types (bottom-up)

In `types/api.types.ts`, define TypeScript interfaces that **exactly match** what the backend returns:

```typescript
// types/api.types.ts
export interface ApiWidgetItem {
  id: number;
  widget_name: string;         // exactly as the backend returns it
  created_at: string;          // ISO string — not Date
}

export interface ApiWidgetListResponse {
  success: boolean;
  data: {
    widgets: ApiWidgetItem[];
    pagination: { ... };
  };
}
```

### Step 4 — Define Domain types

In `types/domain.types.ts`, define the clean model that the UI will use:

```typescript
// types/domain.types.ts
export interface Widget {
  id: number;
  name: string;        // renamed from widget_name
  createdAt: Date;     // parsed from ISO string
}
```

### Step 5 — Write the Mapper

In `mappers/<name>.mapper.ts`, write a **pure function** that transforms DTO → Domain:

```typescript
// mappers/widget.mapper.ts
import type { ApiWidgetItem } from '../types/api.types';
import type { Widget } from '../types/domain.types';

export function mapWidgetToDomain(dto: ApiWidgetItem): Widget {
  return {
    id: dto.id,
    name: dto.widget_name,
    createdAt: new Date(dto.created_at),
  };
}
```

Rules for mappers:
- Pure functions only — no side effects, no async, no API calls.
- Never `throw` — if a field is missing, provide a safe default.
- Co-located with their feature.

### Step 6 — Write the Service

In `services/<name>.service.ts`, write async functions that call the API and return **mapped domain models**:

```typescript
// services/widget.service.ts
import api from '@/lib/api';
import { mapWidgetToDomain } from '../mappers/widget.mapper';
import type { Widget } from '../types/domain.types';

export const widgetService = {
  async getWidgets(): Promise<Widget[]> {
    const { data } = await api.get<ApiWidgetListResponse>('/widgets');
    return data.data.widgets.map(mapWidgetToDomain);
  },
};
```

Rules for services:
- The **only** place where `api` (Axios) is imported.
- Always return **Domain Models**, never raw DTOs.
- Group related endpoints in one service object.
- Use the API path constants from `src/constants/apiRoutes.ts`.

### Step 7 — Write Query Keys

```typescript
// hooks/widget.keys.ts
export const widgetKeys = {
  all: ['widgets'] as const,
  lists: () => [...widgetKeys.all, 'list'] as const,
  detail: (id: number) => [...widgetKeys.all, 'detail', id] as const,
};
```

### Step 8 — Write React Query Hooks

```typescript
// hooks/useWidgets.ts
import { useQuery } from '@tanstack/react-query';
import { widgetService } from '../services/widget.service';
import { widgetKeys } from './widget.keys';

export function useWidgets() {
  return useQuery({
    queryKey: widgetKeys.lists(),
    queryFn: () => widgetService.getWidgets(),
  });
}
```

Rules for hooks:
- Do not call Axios — call the service.
- Use `widgetKeys` for consistent cache management.
- `onError` callbacks must use `parseApiError(error)` — never inspect `AxiosError` directly.

### Step 9 — Build Components

```tsx
// components/WidgetList.tsx
'use client';

import { useWidgets } from '../hooks/useWidgets';
import type { Widget } from '../types/domain.types';

export function WidgetList() {
  const { data: widgets, isLoading, isError } = useWidgets();

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Failed to load widgets.</div>;

  return (
    <ul>
      {widgets?.map((w: Widget) => (
        <li key={w.id}>{w.name}</li>
      ))}
    </ul>
  );
}
```

Rules for components:
- **Never** import `axios`, `api`, or any service directly.
- **Never** import `AxiosError` or any HTTP-layer type.
- Receive domain model props — not raw DTOs.
- Loading and error states come from React Query, not from `useState`.

### Step 10 — Wire the Page

```tsx
// app/(customer)/widgets/page.tsx
import { WidgetList } from '@/features/widgets/components/WidgetList';

export default function WidgetsPage() {
  return (
    <div>
      <h1>Widgets</h1>
      <WidgetList />
    </div>
  );
}
```

---

## 3. Naming Conventions

| Item | Convention | Example |
|------|-----------|---------|
| API DTO types | `Api` prefix + PascalCase | `ApiBookingListResponse` |
| Domain model types | PascalCase, no prefix | `BookingSummary`, `Dispute` |
| Mapper functions | `map` + Entity + `ToDomain` | `mapBookingToDomain` |
| Service files | kebab-case | `booking.service.ts` |
| Hook files | `use` + PascalCase | `useBookings.ts`, `useCancelBooking.ts` |
| Query key files | `<feature>.keys.ts` | `booking.keys.ts` |
| React components | PascalCase | `BookingCard.tsx` |
| Page files | `page.tsx` (App Router convention) | `page.tsx` |
| Constants | `SCREAMING_SNAKE_CASE` | `ROUTES.BOOKINGS`, `STORAGE_KEYS.AUTH_TOKEN` |

---

## 4. Import Order Convention

Keep imports in this order (enforced by ESLint):

```typescript
// 1. React / Next.js built-ins
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

// 2. Third-party libraries
import { useQuery } from '@tanstack/react-query';
import { z } from 'zod';

// 3. Internal — absolute paths with @/ alias
import { ROUTES } from '@/constants/routes';
import { parseApiError } from '@/utils/parseApiError';
import type { Widget } from '@/features/widgets/types/domain.types';

// 4. Internal — relative paths (within same feature)
import { widgetService } from '../services/widget.service';
import { widgetKeys } from './widget.keys';
```

---

## 5. Error Handling Convention

Always use `parseApiError()` for error messages in hooks and components:

```typescript
// ✅ Correct
onError: (error: unknown) => {
  toast.error(parseApiError(error));
}

// ❌ Wrong — AxiosError in a hook
onError: (error: AxiosError) => {
  toast.error(error.response?.data?.message || 'Failed');
}

// ❌ Wrong — AxiosError in a component
if (error instanceof AxiosError) {
  return <div>{error.response?.data?.message}</div>;
}
```

---

## 6. React Query Conventions

### Cache Invalidation

After a mutation that changes data, always invalidate the relevant query cache:

```typescript
useMutation({
  mutationFn: (id: string) => widgetService.deleteWidget(id),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: widgetKeys.lists() });
  },
});
```

When a mutation changes a specific item AND affects lists, invalidate both:

```typescript
onSuccess: (data, variables) => {
  queryClient.invalidateQueries({ queryKey: widgetKeys.lists() });
  queryClient.invalidateQueries({ queryKey: widgetKeys.detail(variables.id) });
},
```

### Query Key Factories

Always define query keys as factory functions — never as plain string arrays:

```typescript
// ✅ Correct
queryKey: bookingKeys.detail(bookingId)

// ❌ Wrong
queryKey: ['bookings', 'detail', bookingId]
```

---

## 7. Form Conventions

All forms use **React Hook Form** + **Zod**:

```typescript
const schema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  email: z.string().email('Invalid email address'),
});

type FormValues = z.infer<typeof schema>;

const { register, handleSubmit, formState: { errors } } = useForm<FormValues>({
  resolver: zodResolver(schema),
});
```

- Always define a Zod schema for every form.
- Always use `zodResolver` from `@hookform/resolvers/zod`.
- Never manually validate form inputs — let Zod handle it.
- Use `useWatch` (not `watch`) inside render loops or inside field arrays to avoid React Compiler warnings.

---

## 8. Route Constants

Never hard-code URL strings. Always use the `ROUTES` constant:

```typescript
// ✅ Correct
router.push(ROUTES.BOOKINGS);
<Link href={ROUTES.BOOKING_DETAIL(booking.id)}>View</Link>

// ❌ Wrong
router.push('/bookings');
<Link href={`/bookings/${booking.id}`}>View</Link>
```

---

## 9. TypeScript Rules

- **No `any`** — use `unknown` when the type is genuinely unknown, then narrow with type guards.
- **No type assertions (`as Type`)** unless absolutely necessary (e.g. DOM event casting).
- **No `@ts-ignore` or `@ts-expect-error`** unless accompanied by a comment explaining why.
- **Explicit return types** on all service functions.
- **`type` imports** for type-only imports: `import type { Widget } from './domain.types'`.

---

## 10. Git Workflow

| Branch | Purpose |
|--------|---------|
| `main` | Production-ready code only |
| `develop` | Integration branch for all features |
| `feature/<name>` | Individual feature branches |
| `fix/<name>` | Bug fix branches |

Commit message format:
```
feat: add provider availability management page
fix: remove axios from ProviderDocumentsManager component
docs: add Phase 5B documentation files
chore: update dependencies
```

---

## 11. Pre-Commit Checklist

Before committing any code:

```
□ npm run lint    — zero errors, zero warnings
□ npm run build   — zero TypeScript errors, successful build
□ No console.log statements left in code
□ No TODO comments without a tracking issue
□ No AxiosError or axios imports in components or hooks
□ All new features follow the DTO → Mapper → Domain pattern
□ Query cache is properly invalidated in all mutations
```
