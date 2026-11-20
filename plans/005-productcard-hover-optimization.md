# 005 — ProductCard Hover Duration & Touch Gating

- **Status**: DONE
- **Commit**: 9e1c57c
- **Severity**: MEDIUM
- **Category**: Easing & Duration / Performance
- **Estimated scope**: 3 files (`apps/web-store/src/components/ProductCard.tsx`, `apps/web-store/src/app/shop/page.tsx`, `apps/web-store/src/app/flash-sales/page.tsx`)

## Problem

In `apps/web-store/src/components/ProductCard.tsx`, `apps/web-store/src/app/shop/page.tsx`, and `apps/web-store/src/app/flash-sales/page.tsx`, each product card defines `whileHover={{ y: -4 }}` with a duration of 350ms, and image scaling `whileHover={{ scale: 1.04 }}` with a duration of 400ms. On a busy marketplace page with dozens of products, hovering across items triggers multiple 400ms spring animations simultaneously. This exceeds the 300ms UI budget for high-frequency browsing interactions and feels floaty rather than crisp.

```tsx
/* apps/web-store/src/components/ProductCard.tsx:64-80 — current */
<motion.div
  whileHover={{ y: -4 }}
  transition={{ type: 'spring', bounce: 0, duration: 0.35 }}
...
  <motion.img
    src={item.image}
    alt={item.title}
    whileHover={{ scale: 1.04 }}
    transition={{ type: 'spring', bounce: 0, duration: 0.4 }}
    className="w-full h-full object-cover"
  />
```

## Target

1. Card lift: `y: -3px` with a crisp duration of 200ms (`{ type: 'spring', bounce: 0, duration: 0.2 }`).
2. Image zoom: subtle `scale: 1.03` with duration 220ms (`{ type: 'spring', bounce: 0, duration: 0.22 }`).
3. Apply identical tuned parameters across `ProductCard.tsx`, `shop/page.tsx`, and `flash-sales/page.tsx`.

```tsx
/* target */
<motion.div
  whileHover={{ y: -3 }}
  transition={{ type: 'spring', bounce: 0, duration: 0.2 }}
...
  <motion.img
    src={item.image}
    alt={item.title}
    whileHover={{ scale: 1.03 }}
    transition={{ type: 'spring', bounce: 0, duration: 0.22 }}
    className="w-full h-full object-cover"
  />
```

## Repo conventions to follow

- Product cards in `apps/web-store` use Motion's `whileHover` prop and Tailwind shadow utilities.

## Steps

1. In `apps/web-store/src/components/ProductCard.tsx`:
   - Change `whileHover={{ y: -4 }}` transition duration from `0.35` to `0.2`. Change `y` to `-3`.
   - Change image `whileHover={{ scale: 1.04 }}` transition duration from `0.4` to `0.22`. Change `scale` to `1.03`.
2. In `apps/web-store/src/app/shop/page.tsx`:
   - Update lines 413–427 to use `whileHover={{ y: -3 }}` with `duration: 0.2` and `whileHover={{ scale: 1.03 }}` with `duration: 0.22`.
3. In `apps/web-store/src/app/flash-sales/page.tsx`:
   - Update lines 203–217 to match the same `0.2s` and `0.22s` parameters.

## Boundaries

- Do NOT alter card pricing, badge formatting, or click handling.
- Do NOT remove the card shadow hover utilities (`hover:shadow-[0_12px_28px_rgba(0,0,0,0.06)]`).

## Verification

- **Mechanical**: Run `pnpm --filter @manga/web-store typecheck`.
- **Feel check**:
  - Rapidly move the mouse across multiple cards in `/shop`: each card should react immediately and settle in ~200ms without feeling sticky or floating slowly.
  - Image expansion should look sharp and subtle without blurring edges.
- **Done when**: All product card hovers complete within 220ms.
