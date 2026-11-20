# 007 — Eliminate Unbounded `transition-all` Across Storefront

- **Status**: DONE
- **Commit**: 9e1c57c
- **Severity**: MEDIUM
- **Category**: Performance
- **Estimated scope**: 4 key files (`apps/web-store/src/app/checkout/page.tsx`, `apps/web-store/src/app/cart/page.tsx`, `apps/web-store/src/app/sell/page.tsx`, `apps/web-store/src/components/Header.tsx`)

## Problem

Multiple interactive components across the storefront use Tailwind's unbounded `transition-all` utility. Under Emil Kowalski's Performance rules, `transition: all` is an aggressive escalation trigger: it forces the browser to calculate transitions for layout and paint properties (padding, margin, width, box-shadow, filter) on every style change, increasing composite latency and causing micro-stutter during rapid interactions.

```tsx
/* apps/web-store/src/app/checkout/page.tsx:310 — current */
className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${

/* apps/web-store/src/app/cart/page.tsx:164 — current */
className="h-full bg-gradient-to-r from-[#D9A441] to-[#4F6B3A] transition-all duration-500 rounded-full"

/* apps/web-store/src/components/Header.tsx:156 — current */
className={`sticky top-0 z-50 apple-glass-nav transition-all duration-200 ${
```

## Target

1. On selectable cards (shipping options, payment gateways): replace `transition-all` with targeted `transition-[border-color,background-color,box-shadow] duration-150 ease-out`.
2. On buttons and CTA links: replace with `transition-colors duration-150 ease-out` or `transition-[background-color,border-color,box-shadow,transform] duration-150 ease-out`.
3. On the shipping progress bar: replace `transition-all duration-500` with `transition-[width] duration-300 ease-out`.
4. On `Header.tsx` scroll glass: replace `transition-all duration-200` with `transition-[box-shadow,border-color,background-color] duration-200 ease-out`.

## Repo conventions to follow

- Storefront already uses `transition-colors` cleanly in newer views like `apps/web-store/src/app/flash-sales/page.tsx:169`.

## Steps

1. In `apps/web-store/src/app/checkout/page.tsx`:
   - Replace `transition-all` on lines 310, 332, and 389 with `transition-[border-color,background-color,box-shadow] duration-150 ease-out`.
2. In `apps/web-store/src/app/cart/page.tsx`:
   - Replace line 164 `transition-all duration-500` with `transition-[width] duration-300 ease-out`.
3. In `apps/web-store/src/app/sell/page.tsx`:
   - Replace `transition-all` on lines 150, 158 with `transition-[background-color,box-shadow,transform] duration-150 ease-out`.
4. In `apps/web-store/src/components/Header.tsx`:
   - On line 156, change `transition-all duration-200` to `transition-[box-shadow,border-color,background-color] duration-200 ease-out`.
   - On lines 183 and 485, replace input `transition-all` with `transition-[border-color,box-shadow,background-color] duration-150 ease-out`.

## Boundaries

- Do NOT alter any JSX layout structure, flex arrangements, or grid definitions.
- Do NOT alter border colors or active state classes.

## Verification

- **Mechanical**: Run `pnpm --filter @manga/web-store typecheck`.
- **Feel check**:
  - In checkout, click between different shipping methods and payment gateways: verify crisp instantaneous selection indicator without laggy border/padding transitions.
  - Scroll down page in desktop view: header translucent background and shadow should engage smoothly over 200ms.
- **Done when**: `grep -rn "transition-all" apps/web-store/src/app/checkout apps/web-store/src/app/cart apps/web-store/src/app/sell` returns zero occurrences in those files.
