# 002 — BuyBoxModal Exit Animation with AnimatePresence

- **Status**: DONE
- **Commit**: 9e1c57c
- **Severity**: HIGH
- **Category**: Physicality & Interruptibility
- **Estimated scope**: 1 file (`apps/web-store/src/components/BuyBoxModal.tsx`)

## Problem

In `apps/web-store/src/components/BuyBoxModal.tsx:22`, the component abruptly unmounts with `if (!isOpen || !product) return null;`. Because there is no `<AnimatePresence>` wrapping the conditional render, the `exit={{ scale: 0.96, opacity: 0 }}` on `<motion.div>` is completely unreachable. When a user closes the modal (or picks an offer), the dialog vanishes instantaneously, violating Emil Kowalski's rule on spatial consistency and physical transitions.

```tsx
/* apps/web-store/src/components/BuyBoxModal.tsx:22 — current */
export const BuyBoxModal: React.FC<BuyBoxModalProps> = ({
  product,
  isOpen,
  onClose,
  onSelectOffer,
  currency,
}) => {
  if (!isOpen || !product) return null; // Abrupt unmount; exit animations never fire!

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop with Soft Blur */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
```

## Target

1. Import `AnimatePresence` from `'motion/react'`.
2. Move the conditional check `{isOpen && product && ( ... )}` inside `<AnimatePresence>` so that unmounting is intercepted until exit animations finish.
3. Keep modal dialog spring duration at 280ms (`{ type: 'spring', bounce: 0, duration: 0.28 }`), and backdrop fade at 180ms ease-out.

```tsx
/* target in apps/web-store/src/components/BuyBoxModal.tsx */
import { motion, AnimatePresence } from 'motion/react';

export const BuyBoxModal: React.FC<BuyBoxModalProps> = ({
  product,
  isOpen,
  onClose,
  onSelectOffer,
  currency,
}) => {
  const showModal = Boolean(isOpen && product);

  return (
    <AnimatePresence mode="wait">
      {showModal && product && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ scale: 0.96, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.96, opacity: 0 }}
            transition={{ type: 'spring', bounce: 0, duration: 0.28 }}
            className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl z-10 overflow-hidden border border-[#EAE3D9] text-[#1D1917]"
          >
            {/* Modal Body */}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
```

## Repo conventions to follow

- Uses `'motion/react'` throughout `apps/web-store`.
- Apple modal pattern: centered origin, subtle scale entry `0.96 -> 1.0` and exit `1.0 -> 0.96` with matching backdrop fade.

## Steps

1. In `apps/web-store/src/components/BuyBoxModal.tsx`, update import:
   ```tsx
   import { motion, AnimatePresence } from 'motion/react';
   ```
2. Remove the early return `if (!isOpen || !product) return null;` on line 22.
3. Wrap the returned JSX in `<AnimatePresence mode="wait">` and conditionally render `{Boolean(isOpen && product) && ( ... )}`.
4. Set backdrop exit transition duration to 180ms ease-out:
   `transition={{ duration: 0.18, ease: 'easeOut' }}`.
5. Set modal container spring transition to 280ms:
   `transition={{ type: 'spring', bounce: 0, duration: 0.28 }}`.

## Boundaries

- Do NOT change offer selection callbacks or styling inside the modal content.
- Do NOT change the props interface `BuyBoxModalProps`.

## Verification

- **Mechanical**: Run `pnpm --filter @manga/web-store typecheck`.
- **Feel check**:
  - Open the Buy-Box comparison modal from a product card with multiple offers.
  - Press the "X" close button or click the backdrop: the modal should smoothly scale down to 0.96 and fade out over ~200ms rather than vanishing in a single frame.
  - Test keyboard `Escape` to close: confirm the exit animation plays smoothly.
- **Done when**: BuyBoxModal plays symmetric entry and exit animations using `AnimatePresence`.
