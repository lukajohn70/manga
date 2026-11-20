# 008 — Centralize Motion Design Tokens in globals.css

- **Status**: DONE
- **Commit**: 9e1c57c
- **Severity**: LOW
- **Category**: Cohesion & Tokens
- **Estimated scope**: 1 file (`apps/web-store/src/app/globals.css`)

## Problem

Animation timing and bezier curves across `apps/web-store` and `packages/ui` are declared as arbitrary inline strings (`cubic-bezier(0.34, 1.56, 0.64, 1)`, `cubic-bezier(0.16, 1, 0.3, 1)`, `0.25s`, `0.35s`, `0.4s`). There are no centralized easing or duration tokens in `:root`, leading to fragmented feel and inconsistent speed across modal dialogs, cards, dropdowns, and buttons.

```css
/* apps/web-store/src/app/globals.css:5-17 — current */
:root {
  --manga-terracotta: #B5532E;
  --manga-laterite: #8F3B1F;
  --manga-iron: #2A2320;
  --manga-ochre: #D9A441;
  --manga-clay: #F6EDE0;
  --manga-paper: #FFFFFF;
  --manga-sand: #E7D5BC;
  --manga-ash: #8C8279;
  --manga-savanna: #4F6B3A;
  --manga-slate: #3E5C76;
  --manga-ember: #B3261E;
  /* Missing motion tokens */
}
```

## Target

Establish Emil Kowalski's core easing curves and duration tokens in `:root`:

```css
/* target in apps/web-store/src/app/globals.css */
:root {
  /* Brand Color Tokens */
  --manga-terracotta: #B5532E;
  --manga-laterite: #8F3B1F;
  --manga-iron: #2A2320;
  --manga-ochre: #D9A441;
  --manga-clay: #F6EDE0;
  --manga-paper: #FFFFFF;
  --manga-sand: #E7D5BC;
  --manga-ash: #8C8279;
  --manga-savanna: #4F6B3A;
  --manga-slate: #3E5C76;
  --manga-ember: #B3261E;

  /* Emil Kowalski Motion Easing Tokens */
  --ease-out: cubic-bezier(0.23, 1, 0.32, 1);        /* Strong ease-out for entering UI */
  --ease-in-out: cubic-bezier(0.77, 0, 0.175, 1);    /* Strong ease-in-out for on-screen layout shifts */
  --ease-spring: cubic-bezier(0.16, 1, 0.3, 1);      /* Snappy critically-damped spring approximation */
  --ease-drawer: cubic-bezier(0.32, 0.72, 0, 1);     /* iOS-style sheet/drawer curve */

  /* Duration Budget Tokens (UI <= 300ms) */
  --duration-press: 90ms;
  --duration-fast: 160ms;
  --duration-ui: 200ms;
  --duration-modal: 280ms;
}
```

## Repo conventions to follow

- Color tokens are defined directly in `:root` of `apps/web-store/src/app/globals.css`.

## Steps

1. Open `apps/web-store/src/app/globals.css`.
2. Inside `:root`, after line 17 (`--manga-ember: #B3261E;`), insert the motion tokens block:
   ```css
   /* Emil Kowalski Motion Easing Tokens */
   --ease-out: cubic-bezier(0.23, 1, 0.32, 1);
   --ease-in-out: cubic-bezier(0.77, 0, 0.175, 1);
   --ease-spring: cubic-bezier(0.16, 1, 0.3, 1);
   --ease-drawer: cubic-bezier(0.32, 0.72, 0, 1);

   /* Duration Budget Tokens */
   --duration-press: 90ms;
   --duration-fast: 160ms;
   --duration-ui: 200ms;
   --duration-modal: 280ms;
   ```
3. Update `.apple-pressable:active` (lines 102–105) to reference `var(--duration-press)`:
   ```css
   .apple-pressable:active {
     transform: scale(0.975);
     transition: transform var(--duration-press) var(--ease-out);
   }
   ```

## Boundaries

- Do NOT alter any existing color token hex values or font definitions.

## Verification

- **Mechanical**: Run `pnpm --filter @manga/web-store build` and confirm no CSS syntax errors.
- **Feel check**:
  - In DevTools Inspector, inspect `<html>` or `<body>`: verify computed custom properties `--ease-out` and `--duration-ui` are exposed.
- **Done when**: CSS motion tokens are declared and consumable globally.
