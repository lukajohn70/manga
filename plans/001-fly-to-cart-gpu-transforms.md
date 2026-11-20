# 001 — Fly-to-Cart GPU Transforms & Sub-400ms Duration

- **Status**: DONE
- **Commit**: 9e1c57c
- **Severity**: HIGH
- **Category**: Performance & Easing/Duration
- **Estimated scope**: 2 files (`apps/web-store/src/lib/flyAnimations.ts`, `apps/web-store/src/app/globals.css`)

## Problem

In `apps/web-store/src/lib/flyAnimations.ts`, the flying cart/wishlist clone mutates layout properties (`width`, `height`, `left`, `top`) every single frame inside a `requestAnimationFrame` loop lasting 780ms. This causes browser layout recalcs and style thrashing 60 to 120 times per second while keeping the user waiting almost a full second before action confirmation.

```ts
/* apps/web-store/src/lib/flyAnimations.ts:361-368 — current */
const currentWidth = startWidth * scale;
const currentHeight = startHeight * scale;

clone.style.width = `${currentWidth}px`;
clone.style.height = `${currentHeight}px`;
clone.style.left = `${currentX - currentWidth / 2}px`;
clone.style.top = `${currentY - currentHeight / 2}px`;
clone.style.transform = `rotate(${rotation}deg)`;
```

In `apps/web-store/src/app/globals.css:206`:
```css
/* apps/web-store/src/app/globals.css:206 — current */
will-change: transform, left, top, width, height, opacity;
```

## Target

1. Set `left`, `top`, `width`, and `height` once at initialization using `startRect`.
2. Drive the entire trajectory via GPU composite properties using `translate3d`, `scale`, and `rotate`:
   `transform: translate3d(${deltaX}px, ${deltaY}px, 0) scale(${scale}) rotate(${rotation}deg)`.
3. Reduce duration from 780ms to 360ms for cart and 300ms for wishlist.
4. Check `prefers-reduced-motion` at the beginning of `runFlightAnimation`. If active, immediately trigger `triggerTargetCatch(mode)` and `onLanded?.()`, skipping flight.
5. In `globals.css`, restrict `will-change` strictly to `transform, opacity`.

```ts
/* target in apps/web-store/src/lib/flyAnimations.ts */
if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  triggerTargetCatch(mode);
  onLanded?.();
  return;
}

const duration = mode === 'cart' ? 360 : 300; // ms

// Inside animate():
const deltaX = currentX - startCenterX;
const deltaY = currentY - startCenterY;
clone.style.transform = `translate3d(${deltaX}px, ${deltaY}px, 0) scale(${scale}) rotate(${rotation}deg)`;
```

```css
/* target in apps/web-store/src/app/globals.css:206 */
will-change: transform, opacity;
```

## Repo conventions to follow

- Fly trajectory calculations use quadratic bezier curves defined in `apps/web-store/src/lib/flyAnimations.ts`.
- CSS animations in `apps/web-store/src/app/globals.css` use standard hardware acceleration conventions.

## Steps

1. In `apps/web-store/src/lib/flyAnimations.ts`, add an accessibility check at the top of `runFlightAnimation`:
   ```ts
   if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
     triggerTargetCatch(mode);
     onLanded?.();
     return;
   }
   ```
2. Update the duration in `apps/web-store/src/lib/flyAnimations.ts:331`:
   Change:
   `const duration = mode === 'cart' ? 780 : 650;`
   To:
   `const duration = mode === 'cart' ? 360 : 300;`
3. Remove layout property mutations in the `animate` loop (`apps/web-store/src/lib/flyAnimations.ts:361-368`):
   Delete lines setting `clone.style.width`, `clone.style.height`, `clone.style.left`, and `clone.style.top`.
   Replace with:
   ```ts
   const deltaX = currentX - startCenterX;
   const deltaY = currentY - startCenterY;
   clone.style.transform = `translate3d(${deltaX}px, ${deltaY}px, 0) scale(${scale}) rotate(${rotation}deg)`;
   ```
4. In `apps/web-store/src/app/globals.css:206`, change:
   `will-change: transform, left, top, width, height, opacity;`
   To:
   `will-change: transform, opacity;`

## Boundaries

- Do NOT remove audio feedback synthesizers (`playAddToCartTone`, `playToneNotes`).
- Do NOT alter cart state operations in `apps/web-store/src/context/StoreContext.tsx`.
- Do NOT change the visual badge pop or ripple keyframes.

## Verification

- **Mechanical**: Run `pnpm --filter @manga/web-store typecheck` and confirm clean compilation.
- **Feel check**:
  - Click "Add to Cart" on any product. The item should arc snappily to the header in ~360ms without hitching or frame drops.
  - Open Chrome DevTools > Rendering, turn on "Rendering > Layout Shift Regions" and "Paint flashing". Confirm zero layout reflow flashes during the item flight.
  - In DevTools Rendering, emulate `prefers-reduced-motion: reduce`. Click "Add to Cart": the flying clone should not appear; the header cart badge should increment immediately.
- **Done when**: Flying clone animation runs solely via `transform` and `opacity` with 0 layout reflows and duration <= 360ms.
