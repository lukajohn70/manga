# 010 — Catalog Grid Stagger Fade Transition

- **Status**: DONE
- **Commit**: 9e1c57c
- **Severity**: LOW (Missed Opportunity)
- **Category**: Choreography & Easing/Duration
- **Estimated scope**: 2 files (`apps/web-store/src/components/StorefrontClient.tsx`, `apps/web-store/src/app/shop/page.tsx`)

## Problem

When users switch departments or execute search queries in `StorefrontClient.tsx` and `shop/page.tsx`, the grid of products abruptly swaps in a single frame. Because dozens of elements jump at once, the transition feels mechanical and jarring rather than coherent and continuous.

```tsx
/* apps/web-store/src/components/StorefrontClient.tsx:230-244 — current */
<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
  {filteredProducts.map((item) => (
    <ProductCard key={item.id} item={item} ... />
  ))}
</div>
```

## Target

Implement a tight, sub-250ms staggered entrance when the catalog renders or re-filters:
1. Container variant with `staggerChildren: 0.025` (25ms stagger offset).
2. Child variant with subtle entry: `opacity: 0, y: 6` to `opacity: 1, y: 0` over 200ms using `--ease-out` `[0.23, 1, 0.32, 1]`.
3. Total entrance duration across visible cards stays under 250ms.

```tsx
/* target */
const gridContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.025,
      delayChildren: 0.02,
    },
  },
};

const cardItemVariants = {
  hidden: { opacity: 0, y: 6 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.2, ease: [0.23, 1, 0.32, 1] },
  },
};
```

## Repo conventions to follow

- Uses `motion` from `'motion/react'`.
- Preserves responsive Tailwind grid classes (`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6`).

## Steps

1. In `apps/web-store/src/components/StorefrontClient.tsx`:
   - Declare `gridContainerVariants` and `cardItemVariants` outside the component.
   - Change the grid container `<div>` on line 230 to:
     ```tsx
     <motion.div
       key={selectedCategory}
       variants={gridContainerVariants}
       initial="hidden"
       animate="visible"
       className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
     >
       {filteredProducts.map((item) => (
         <motion.div key={item.id} variants={cardItemVariants}>
           <ProductCard item={item} ... />
         </motion.div>
       ))}
     </motion.div>
     ```
2. In `apps/web-store/src/app/shop/page.tsx`:
   - Apply the same variant wrapping to the product grid at line 401.

## Boundaries

- Do NOT increase `y` offset beyond 8px (avoids dramatic flying-in appearance).
- Do NOT increase `staggerChildren` above 0.035s.

## Verification

- **Mechanical**: Run `pnpm --filter @manga/web-store typecheck`.
- **Feel check**:
  - Click between categories: the cards should cascade gently into place over ~200ms.
  - Set animations to 20% in Chrome DevTools: confirm cards lead from top-left to bottom-right with 25ms offset and 6px vertical rise.
- **Done when**: Product cards enter with a tight, natural stagger fade under 250ms.
