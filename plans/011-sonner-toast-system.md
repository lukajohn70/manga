# 011 — Modern Physical Toast System via Sonner

- **Status**: DONE
- **Commit**: 9e1c57c
- **Severity**: MEDIUM (Missed Opportunity)
- **Category**: Physicality & Interruptibility / Library Choice
- **Estimated scope**: 3 files (`apps/web-store/package.json`, `apps/web-store/src/app/layout.tsx`, `apps/web-store/src/context/StoreContext.tsx`)

## Problem

Throughout `apps/web-store`, user actions (adding to cart, updating profile, applying coupon codes, copying order numbers) call `showToast(msg)`. However, `toastMessage` is stored in a disconnected `useState` in `StoreContext.tsx` that is never rendered in the main layout. When notifications do appear elsewhere, they rely on single-string timeouts with no stacking, no swipe-to-dismiss gestures, and no interruptibility. Emil Kowalski's Toast Standard highlights Sonner as the gold standard for tactile feedback: *Toasts must stack with physical depth, support 1:1 gesture flick-to-dismiss, and animate on/off screen over 400ms ease.*

```tsx
/* apps/web-store/src/context/StoreContext.tsx:99, 271-275 — current */
const [toastMessage, setToastMessage] = useState<string | null>(null);

const showToast = (msg: string) => {
  setToastMessage(msg);
  setTimeout(() => {
    setToastMessage((curr) => (curr === msg ? null : curr));
  }, 3500);
};
```

## Target

1. Add `sonner` to `apps/web-store/package.json`.
2. Mount `<Toaster position="bottom-right" />` in `apps/web-store/src/app/layout.tsx` with terracotta brand accent styling.
3. Wire `showToast` in `StoreContext.tsx` directly to Sonner's `toast(msg)` / `toast.success(msg)`.
4. Users gain automatic gesture swipe-to-dismiss, multi-toast stacking, and physical expansion on hover.

```tsx
/* target in apps/web-store/src/app/layout.tsx */
import { Toaster } from 'sonner';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <StoreProvider>
          {children}
          <Toaster
            position="bottom-right"
            toastOptions={{
              style: {
                borderRadius: '16px',
                border: '1px solid #EAE3D9',
                background: '#FAF7F2',
                color: '#1D1917',
                fontSize: '13px',
                boxShadow: '0 12px 32px rgba(42, 35, 32, 0.08)',
              },
            }}
          />
        </StoreProvider>
      </body>
    </html>
  );
}
```

```tsx
/* target in apps/web-store/src/context/StoreContext.tsx */
import { toast } from 'sonner';

const showToast = (msg: string) => {
  toast(msg);
};
```

## Repo conventions to follow

- App root layout lives in `apps/web-store/src/app/layout.tsx`.
- Toast color scheme matches the warm sand/terracotta palette (`#FAF7F2`, `#EAE3D9`, `#B5532E`).

## Steps

1. In `apps/web-store/package.json`, add `"sonner": "^2.0.0"` under `dependencies`.
2. Run `pnpm install` from the repository root.
3. In `apps/web-store/src/app/layout.tsx`, import `Toaster` from `'sonner'` and render it within the body.
4. In `apps/web-store/src/context/StoreContext.tsx`, import `toast` from `'sonner'` and update `showToast`:
   ```tsx
   const showToast = (msg: string) => {
     setToastMessage(msg);
     toast(msg);
   };
   ```

## Boundaries

- Do NOT alter the call sites of `showToast` across product, checkout, cart, or account pages—preserving API compatibility.

## Verification

- **Mechanical**: Run `pnpm --filter @manga/web-store build`.
- **Feel check**:
  - Add two items to cart in quick succession: confirm toasts stack behind each other with natural depth and slight scale step.
  - Hover over the stacked toasts: confirm they expand vertically with spring physics.
  - Swipe a toast to the right: confirm it tracks finger/cursor 1:1 and dismisses with momentum.
- **Done when**: All `showToast` invocations render interactive Sonner toast notifications.
