# 006 — Header Account Dropdown Menu Origin & Transition

- **Status**: DONE
- **Commit**: 9e1c57c
- **Severity**: MEDIUM
- **Category**: Physicality & Origin / Easing & Duration
- **Estimated scope**: 1 file (`apps/web-store/src/components/Header.tsx`)

## Problem

In `apps/web-store/src/components/Header.tsx:347-428`, the account menu dropdown appears abruptly on click and disappears without exit animation. The class list uses uncompiled Tailwind animation classes (`animate-in fade-in slide-in-from-top-2`) that lack hardware-accelerated origin anchoring. According to Emil Kowalski's Physicality standard: *Popovers, dropdowns, and tooltips must scale from their trigger anchor (`transform-origin: top right`), starting from `scale(0.95–0.97)` + `opacity: 0` over 150–200ms.*

```tsx
/* apps/web-store/src/components/Header.tsx:347-350 — current */
{showAccountMenu && (
  <div
    className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-xl border border-[#E7D5BC] p-2 z-50 animate-in fade-in slide-in-from-top-2"
  >
```

## Target

1. Wrap the dropdown in `<AnimatePresence>` from `'motion/react'`.
2. Convert the dropdown container to `<motion.div>`.
3. Set `transform-origin: top right`.
4. Animate from `opacity: 0, scale: 0.95, y: -4` to `opacity: 1, scale: 1, y: 0`.
5. Animate exit symmetrically back to `opacity: 0, scale: 0.95, y: -4`.
6. Duration: 160ms with cubic-bezier `[0.23, 1, 0.32, 1]` (strong UI ease-out).

```tsx
/* target in apps/web-store/src/components/Header.tsx */
<AnimatePresence>
  {showAccountMenu && (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: -4 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: -4 }}
      transition={{ duration: 0.16, ease: [0.23, 1, 0.32, 1] }}
      style={{ transformOrigin: 'top right' }}
      className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-xl border border-[#E7D5BC] p-2 z-50 text-[#1D1917]"
    >
      {/* Menu items */}
    </motion.div>
  )}
</AnimatePresence>
```

## Repo conventions to follow

- Header uses `'motion/react'` components and React state for toggleable UI.

## Steps

1. In `apps/web-store/src/components/Header.tsx`, import `motion` and `AnimatePresence` from `'motion/react'`.
2. Wrap the `{showAccountMenu && ( ... )}` block with `<AnimatePresence>`.
3. Replace the outer `<div>` with `<motion.div>`:
   - Add `initial={{ opacity: 0, scale: 0.95, y: -4 }}`
   - Add `animate={{ opacity: 1, scale: 1, y: 0 }}`
   - Add `exit={{ opacity: 0, scale: 0.95, y: -4 }}`
   - Add `transition={{ duration: 0.16, ease: [0.23, 1, 0.32, 1] }}`
   - Add `style={{ transformOrigin: 'top right' }}`
4. Remove the unused classes `animate-in fade-in slide-in-from-top-2`.

## Boundaries

- Do NOT alter the user authentication checks or router navigation targets inside the menu.
- Do NOT change the menu items' layout or styling.

## Verification

- **Mechanical**: Run `pnpm --filter @manga/web-store typecheck`.
- **Feel check**:
  - Click the Account avatar icon in the header. The menu should expand fluidly from the top-right trigger corner in 160ms.
  - Click again or click away: the menu should smoothly collapse back into the avatar in 160ms with no jarring visual jump.
  - Slow down animations in Chrome DevTools to 20%: confirm the expansion scales directly from the button origin.
- **Done when**: Account dropdown scales smoothly from `top right` anchor with matching enter and exit transitions.
