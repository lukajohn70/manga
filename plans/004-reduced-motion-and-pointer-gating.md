# 004 — Humanized Reduced Motion & Pointer Hover Gating

- **Status**: DONE
- **Commit**: 9e1c57c
- **Severity**: HIGH
- **Category**: Accessibility
- **Estimated scope**: 1 file (`apps/web-store/src/app/globals.css`)

## Problem

In `apps/web-store/src/app/globals.css:252-262`, a blunt blanket CSS reset forces `animation-duration: 0.01ms !important` and `transition-duration: 0.01ms !important` on all elements when `prefers-reduced-motion: reduce` is detected. This strips all visual comprehension (color crossfades, background hover feedback, modal fades), turning the UI into an abrupt flickering experience. Emil Kowalski's accessibility standard mandates: *Reduced motion means fewer and gentler animations, not zero—keep opacity and color transitions, drop spatial position movement and scale.*

```css
/* apps/web-store/src/app/globals.css:252-258 — current */
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
  .apple-pressable:active {
    transform: none !important;
  }
}
```

## Target

1. Prevent spatial translations, rotations, and scale animations under `prefers-reduced-motion: reduce`.
2. Preserve gentle opacity and color fades (150ms ease) so state transitions remain comprehensible.
3. Add a global `@media (hover: none)` rule preventing sticky hover styles on mobile and touch devices.

```css
/* target in apps/web-store/src/app/globals.css */
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    scroll-behavior: auto !important;
  }

  /* Allow gentle color and opacity changes */
  * {
    transition-property: opacity, background-color, border-color, color, fill, stroke !important;
    transition-duration: 150ms !important;
    transform: none !important;
  }

  .apple-pressable:active {
    transform: none !important;
    opacity: 0.7;
  }
}

/* Guard hover states on touch screens */
@media (hover: none) and (pointer: coarse) {
  .hover\:scale-105:hover,
  .hover\:-translate-y-1:hover {
    transform: none !important;
  }
}
```

## Repo conventions to follow

- Accessibility overrides reside in `apps/web-store/src/app/globals.css` below line 250.

## Steps

1. In `apps/web-store/src/app/globals.css`, locate the `@media (prefers-reduced-motion: reduce)` block (lines 252–262).
2. Replace the blanket `transition-duration: 0.01ms !important` with preserved opacity/color property transitions:
   ```css
   @media (prefers-reduced-motion: reduce) {
     *, *::before, *::after {
       animation-duration: 0.01ms !important;
       animation-iteration-count: 1 !important;
       scroll-behavior: auto !important;
     }

     * {
       transition-property: opacity, background-color, border-color, color, fill, stroke !important;
       transition-duration: 150ms !important;
       transform: none !important;
     }

     .apple-pressable:active {
       transform: none !important;
       opacity: 0.75;
     }
   }
   ```
3. Add touch pointer guard at the end of `globals.css`:
   ```css
   @media (hover: none) and (pointer: coarse) {
     .group:hover .group-hover\:scale-105,
     .group:hover .group-hover\:-translate-y-1 {
       transform: none !important;
     }
   }
   ```

## Boundaries

- Do NOT remove `prefers-reduced-transparency` or `prefers-contrast` rules in `globals.css`.

## Verification

- **Mechanical**: Run `pnpm --filter @manga/web-store typecheck` and verify CSS compiles.
- **Feel check**:
  - Open DevTools > Rendering, set `prefers-reduced-motion: reduce`.
  - Hover or click navigation links and buttons: verify that background color and text color gently transition over 150ms without spatial jumps or scale bounce.
  - Open mobile emulation in Chrome DevTools: tap product cards, verify they do not remain permanently scaled up or shifted upwards after tapping.
- **Done when**: Reduced motion eliminates spatial translation while retaining gentle color/opacity transitions.
