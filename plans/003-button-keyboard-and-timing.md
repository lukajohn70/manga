# 003 — Button Keyboard Squish Suppression & Snappy Release

- **Status**: DONE
- **Commit**: 9e1c57c
- **Severity**: HIGH
- **Category**: Purpose & Frequency / Easing & Duration
- **Estimated scope**: 1 file (`packages/ui/src/button.tsx`)

## Problem

In `packages/ui/src/button.tsx`, keyboard interactions (`Enter` and `Space`) trigger visual scale squishing. Under Emil Kowalski's Frequency Rule, keyboard navigation (100+ times/day) must never trigger kinetic deformation because it delays perceived interface response. Additionally, the button release animation uses `350ms cubic-bezier(0.34, 1.56, 0.64, 1)`, which violates the 300ms UI budget and introduces excessive overshoot bounce for a standard button component.

```tsx
/* packages/ui/src/button.tsx:54-66 — current */
const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
  if ((e.key === ' ' || e.key === 'Enter') && !disabled && !isLoading && enableSquish) {
    setIsPressed(true); // Should not animate deformation on keyboard
  }
  onKeyDown?.(e);
};

const handleKeyUp = (e: React.KeyboardEvent<HTMLButtonElement>) => {
  if ((e.key === ' ' || e.key === 'Enter') && enableSquish) {
    setIsPressed(false);
  }
  onKeyUp?.(e);
};

/* packages/ui/src/button.tsx:107-111 — current */
const transformTransition = isPressed
  ? 'transform 0.08s ease-out'
  : 'transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1)';
```

## Target

1. Only pointer events (`PointerDown` / `PointerUp`) should trigger `isPressed`. Do not squish button on keyboard `handleKeyDown`/`handleKeyUp`.
2. Snappy release curve: `180ms cubic-bezier(0.16, 1, 0.3, 1)`.
3. Press compression curve: `90ms ease-out`.
4. Scale deformation: keep subtle at `0.97` (default `squishScale = 0.97`).

```tsx
/* target in packages/ui/src/button.tsx */
const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
  onKeyDown?.(e);
};

const handleKeyUp = (e: React.KeyboardEvent<HTMLButtonElement>) => {
  onKeyUp?.(e);
};

const transformTransition = isPressed
  ? 'transform 0.09s ease-out'
  : 'transform 0.18s cubic-bezier(0.16, 1, 0.3, 1)';
```

## Repo conventions to follow

- Follows the tactile `.apple-pressable` pattern where press is fast and release snaps back without overshoot wobble.

## Steps

1. In `packages/ui/src/button.tsx`, change default `squishScale` prop from `0.95` to `0.97`.
2. In `handleKeyDown` and `handleKeyUp`, remove the `setIsPressed(true)` and `setIsPressed(false)` calls. Keep the event forwarding (`onKeyDown?.(e)` and `onKeyUp?.(e)`).
3. In `transformTransition`, update the release curve:
   ```tsx
   const transformTransition = isPressed
     ? 'transform 0.09s ease-out'
     : 'transform 0.18s cubic-bezier(0.16, 1, 0.3, 1)';
   ```

## Boundaries

- Do NOT alter button color palettes (`variant` styles).
- Do NOT remove pointer listeners (`onPointerDown`, `onPointerUp`, etc.).

## Verification

- **Mechanical**: Run `pnpm --filter @manga/ui typecheck`.
- **Feel check**:
  - Focus a button with the keyboard `Tab` key and press `Space` or `Enter`: confirm the button activates with zero scale deformation/wobble.
  - Click and hold with mouse/pointer: confirm instant subtle press down. Release mouse: confirm snappy return within 180ms with no oscillating bounce.
- **Done when**: Keyboard activates instantly without squishing and mouse press release finishes within 180ms.
