# 012 — Interactive Cart Badge Pop Counter

- **Status**: DONE
- **Commit**: 9e1c57c
- **Severity**: LOW (Missed Opportunity)
- **Category**: Physicality & Feedback
- **Estimated scope**: 1 file (`apps/web-store/src/components/Header.tsx`)

## Problem

In `apps/web-store/src/components/Header.tsx:463-470`, the header cart badge (`#header-cart-badge`) simply renders static inner text `{activeCartCount}`. When products are added or removed, the number switches abruptly without kinetic feedback unless an external DOM script manually adds a class. Emil Kowalski's tactile feedback principle highlights: *Numerical state changes should feel physically acknowledged with an elastic micro-pop (`scale: 0.7 -> 1.0` over ~250ms).*

```tsx
/* apps/web-store/src/components/Header.tsx:463-469 — current */
<span
  id="header-cart-badge"
  className={`bg-[#D9A441] text-[#1D1917] text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[1.25rem] text-center ${
    activeCartCount > 0 ? 'inline-block' : 'hidden'
  }`}
>
  {activeCartCount}
</span>
```

## Target

Wrap the counter in `<AnimatePresence mode="popLayout">` with `key={activeCartCount}`. Every time the item count increments or decrements, the badge pops dynamically with an Apple-style spring (`{ type: 'spring', bounce: 0.35, duration: 0.28 }`).

```tsx
/* target in apps/web-store/src/components/Header.tsx */
<AnimatePresence mode="popLayout">
  {activeCartCount > 0 && (
    <motion.span
      key={activeCartCount}
      id="header-cart-badge"
      initial={{ scale: 0.7, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.7, opacity: 0 }}
      transition={{ type: 'spring', bounce: 0.35, duration: 0.28 }}
      className="bg-[#D9A441] text-[#1D1917] text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[1.25rem] text-center inline-block"
    >
      {activeCartCount}
    </motion.span>
  )}
</AnimatePresence>
```

## Repo conventions to follow

- Header already imports `motion` and `AnimatePresence` from `'motion/react'`.
- Preserves badge ID `#header-cart-badge` so fly-to-cart target positioning remains intact.

## Steps

1. In `apps/web-store/src/components/Header.tsx`, locate lines 463–470.
2. Replace the static `<span>` with the `<AnimatePresence mode="popLayout">` and `<motion.span key={activeCartCount}>` structure above.
3. Apply the same pattern to `#header-wishlist-badge` at lines 442–450 using `key={activeWishlistCount}`.

## Boundaries

- Do NOT change the badge color `#D9A441` or font weight.
- Do NOT remove the element's DOM ID.

## Verification

- **Mechanical**: Run `pnpm --filter @manga/web-store typecheck`.
- **Feel check**:
  - Click "Add to Cart" on a product: observe the header bag badge. As the count increments, the badge should expand with a quick, elastic pop and settle cleanly.
  - Remove an item in the cart drawer: the badge should cleanly pop down to the updated number.
- **Done when**: Cart and wishlist badge counts pop dynamically on every numerical change.
