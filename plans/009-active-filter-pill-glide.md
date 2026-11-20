# 009 — Active Filter Pill Gliding Indicator via `layoutId`

- **Status**: DONE
- **Commit**: 9e1c57c
- **Severity**: LOW (Missed Opportunity)
- **Category**: Choreography & Physicality
- **Estimated scope**: 2 files (`apps/web-store/src/components/StorefrontClient.tsx`, `apps/web-store/src/app/flash-sales/page.tsx`)

## Problem

In `apps/web-store/src/components/StorefrontClient.tsx:206-226` and `apps/web-store/src/app/flash-sales/page.tsx:155-178`, department filter chips toggle active states abruptly via class swaps (`selectedCategory === c ? 'bg-[#B5532E] ...' : 'bg-white ...'`). The user's eye loses track of the selection indicator, creating visual disconnect rather than fluid tactile responsiveness.

```tsx
/* apps/web-store/src/components/StorefrontClient.tsx:217-222 — current */
className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold capitalize border-0 cursor-pointer apple-pressable transition-colors ${
  selectedCategory === c
    ? 'bg-[#B5532E] text-white shadow-xs'
    : 'bg-white hover:bg-white/90 text-[#1D1917] border border-[#EAE3D9] shadow-[0_1px_2px_rgba(0,0,0,0.03)]'
}`}
```

## Target

Introduce Framer Motion's shared `layoutId` on the active pill background. As the user clicks across category filters, the terracotta pill glides physically across the tabs with a critically-damped spring (`{ type: 'spring', bounce: 0.15, duration: 0.28 }`), keeping text on top via `z-10`.

```tsx
/* target in apps/web-store/src/components/StorefrontClient.tsx */
<div className="flex flex-wrap items-center gap-2 relative">
  {['all', 'computing', 'electronics', 'fashion', 'home', 'digital'].map((c) => {
    const isSelected = selectedCategory === c;
    return (
      <button
        key={c}
        type="button"
        onClick={() => {
          if (c === 'all') setSelectedCategory('all');
          else router.push(`/shop?category=${c}`);
        }}
        className={`relative px-3.5 py-1.5 rounded-xl text-xs font-semibold capitalize border-0 cursor-pointer apple-pressable transition-colors duration-150 z-10 ${
          isSelected ? 'text-white' : 'text-[#1D1917] hover:text-[#B5532E]'
        }`}
      >
        {isSelected && (
          <motion.div
            layoutId="storefrontCategoryPill"
            transition={{ type: 'spring', bounce: 0.15, duration: 0.28 }}
            className="absolute inset-0 bg-[#B5532E] rounded-xl shadow-xs -z-10"
          />
        )}
        {!isSelected && (
          <div className="absolute inset-0 bg-white border border-[#EAE3D9] rounded-xl shadow-[0_1px_2px_rgba(0,0,0,0.03)] -z-10" />
        )}
        {c === 'all' ? 'All Products' : c}
      </button>
    );
  })}
</div>
```

## Repo conventions to follow

- Uses `motion` from `'motion/react'`.
- Matches the pill styling established in the design system.

## Steps

1. In `apps/web-store/src/components/StorefrontClient.tsx`:
   - Replace the filter button loop at lines 207–226 with the `layoutId="storefrontCategoryPill"` implementation above.
2. In `apps/web-store/src/app/flash-sales/page.tsx`:
   - Replace lines 162–178 with an equivalent `layoutId="flashSalesCategoryPill"` structure using `activeCategory === chip.id`.

## Boundaries

- Do NOT alter category click handlers (`setSelectedCategory`, `setActiveCategory`).
- Do NOT remove or reorder categories.

## Verification

- **Mechanical**: Run `pnpm --filter @manga/web-store typecheck`.
- **Feel check**:
  - Click from "All Products" to "Electronics" then "Home": verify the terracotta background smoothly slides across the tabs with natural spring momentum rather than teleporting.
  - Hover unselected tabs: verify text subtly shifts to `#B5532E` without moving the active pill.
- **Done when**: Active category pill slides smoothly between tabs using Motion `layoutId`.
