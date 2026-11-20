/**
 * High-performance Cinematic and Magnetic Fly-to-Target Animation Engine
 * - Cart: Cinematic Parabolic Arc (780ms, easeInOutCubic, golden terracotta stardust trail)
 * - Wishlist: Magnetic Pull (650ms, easeInBackSwoop, rose ruby particle trail)
 * Includes procedural Web Audio API & Tone.js synthesis, target catch physics & shockwave ripples.
 */

let soundEnabled = true;
let audioCtx: AudioContext | null = null;

export function setSoundEnabled(enabled: boolean) {
  soundEnabled = enabled;
}

export function isSoundEnabled() {
  return soundEnabled;
}

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  try {
    if (!audioCtx) {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioContextClass) {
        audioCtx = new AudioContextClass();
      }
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    return audioCtx;
  } catch {
    return null;
  }
}

function playToneNotes(frequencies: number[], duration = 0.08, release = 0.25, volume = 0.08) {
  if (!soundEnabled) return;
  const ctx = getAudioContext();
  if (!ctx) return;
  try {
    const now = ctx.currentTime;
    frequencies.forEach((freq) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);

      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(volume, now + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + duration + release);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + duration + release);
    });
  } catch {
    // Gracefully ignore audio issues
  }
}

export function playFlySound(type: 'cart-launch' | 'cart-catch' | 'wishlist-launch' | 'wishlist-catch') {
  if (!soundEnabled) return;

  // If Tone.js is available in window, start context
  if (typeof window !== 'undefined' && (window as any).Tone) {
    try {
      const Tone = (window as any).Tone;
      if (Tone.context && Tone.context.state !== 'running') {
        Tone.start();
      }
    } catch {}
  }

  switch (type) {
    case 'cart-launch':
      // C5 (523.25), G5 (783.99)
      playToneNotes([523.25, 783.99], 0.04, 0.2, 0.07);
      break;
    case 'cart-catch':
      // E5 (659.25), B5 (987.77), E6 (1318.51)
      playToneNotes([659.25, 987.77, 1318.51], 0.06, 0.35, 0.09);
      break;
    case 'wishlist-launch':
      // D5 (587.33), A5 (880.0)
      playToneNotes([587.33, 880.0], 0.04, 0.2, 0.06);
      break;
    case 'wishlist-catch':
      // F#5 (739.99), C#6 (1108.73), F#6 (1479.98)
      playToneNotes([739.99, 1108.73, 1479.98], 0.06, 0.38, 0.09);
      break;
  }
}

// Cubic easing for parabolic arc (anticipation + fast swoop)
function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

// Back swoop easing for magnetic pull (elastic gather momentum + launch)
function easeInBackSwoop(t: number): number {
  const c1 = 1.4;
  const c3 = c1 + 1;
  return c3 * t * t * t - c1 * t * t;
}

// Spawns stardust trail particle along the bezier path
function spawnTrailParticle(x: number, y: number, mode: 'cart' | 'wishlist') {
  if (typeof document === 'undefined') return;

  const particle = document.createElement('div');
  particle.className = 'flight-particle';

  const size = Math.random() * 8 + 4;
  particle.style.width = `${size}px`;
  particle.style.height = `${size}px`;
  particle.style.left = `${x - size / 2}px`;
  particle.style.top = `${y - size / 2}px`;
  particle.style.opacity = '0.9';

  if (mode === 'cart') {
    // Manga terracotta & gold ochre stardust
    particle.style.background = 'radial-gradient(circle, #D9A441 0%, #B5532E 100%)';
    particle.style.boxShadow = '0 0 10px rgba(217, 164, 65, 0.7)';
  } else {
    // Ruby / rose romantic sparks
    particle.style.background = 'radial-gradient(circle, #FDA4AF 0%, #B3261E 100%)';
    particle.style.boxShadow = '0 0 10px rgba(225, 29, 72, 0.7)';
  }

  document.body.appendChild(particle);

  const offsetX = (Math.random() - 0.5) * 28;
  const offsetY = (Math.random() - 0.5) * 28;

  requestAnimationFrame(() => {
    particle.style.transform = `translate(${offsetX}px, ${offsetY}px) scale(0.1)`;
    particle.style.opacity = '0';
  });

  setTimeout(() => {
    if (particle.parentNode) {
      particle.parentNode.removeChild(particle);
    }
  }, 460);
}

// Trigger button catch vibration, badge pop and expanding ripple
export function triggerTargetCatch(type: 'cart' | 'wishlist') {
  if (typeof document === 'undefined') return;

  const btnId = type === 'cart' ? 'header-cart-button' : 'header-wishlist-button';
  const badgeId = type === 'cart' ? 'header-cart-badge' : 'header-wishlist-badge';
  const rippleId = type === 'cart' ? 'header-cart-ripple-container' : 'header-wishlist-ripple-container';

  const btn = document.getElementById(btnId);
  const badge = document.getElementById(badgeId);
  const rippleContainer = document.getElementById(rippleId) || btn;

  playFlySound(type === 'cart' ? 'cart-catch' : 'wishlist-catch');

  if (btn) {
    btn.classList.remove('animate-cart-catch');
    void btn.offsetWidth; // Force reflow
    btn.classList.add('animate-cart-catch');
    setTimeout(() => {
      btn.classList.remove('animate-cart-catch');
    }, 600);
  }

  if (badge) {
    badge.classList.remove('animate-badge-pop');
    void badge.offsetWidth;
    badge.classList.add('animate-badge-pop');
    setTimeout(() => {
      badge.classList.remove('animate-badge-pop');
    }, 450);
  }

  if (rippleContainer) {
    const ripple = document.createElement('div');
    ripple.className = type === 'cart' ? 'cart-ripple' : 'wishlist-ripple';
    rippleContainer.appendChild(ripple);
    setTimeout(() => {
      if (ripple.parentNode) {
        ripple.parentNode.removeChild(ripple);
      }
    }, 680);
  }
}

/**
 * Universal Flight Animation Controller
 */
function runFlightAnimation({
  mode,
  sourceEl,
  product,
  targetId,
  onLanded,
}: {
  mode: 'cart' | 'wishlist';
  sourceEl?: HTMLElement | null;
  product?: any;
  targetId: string;
  onLanded?: () => void;
}) {
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    onLanded?.();
    return;
  }

  // Check prefers-reduced-motion
  const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (mediaQuery.matches) {
    triggerTargetCatch(mode);
    onLanded?.();
    return;
  }

  // Find target element (Cart or Wishlist button in Header)
  const targetEl = document.getElementById(targetId);
  const endRect = targetEl ? targetEl.getBoundingClientRect() : {
    left: window.innerWidth - 70,
    top: 20,
    width: 48,
    height: 48,
  };

  // Find source element or image
  let resolvedSource = sourceEl;
  if (!resolvedSource && product?.id) {
    resolvedSource =
      document.getElementById(`product-visual-${product.id}`) ||
      document.getElementById(`product-card-${product.id}`) ||
      (document.querySelector(`[data-product-id="${product.id}"]`) as HTMLElement | null);
  }

  // Start coordinates
  let startRect: { left: number; top: number; width: number; height: number };
  if (resolvedSource) {
    const imgChild = resolvedSource.querySelector('img');
    const bounds = (imgChild || resolvedSource).getBoundingClientRect();
    startRect = {
      left: bounds.left,
      top: bounds.top,
      width: Math.min(bounds.width || 120, 240),
      height: Math.min(bounds.height || 120, 240),
    };
  } else {
    // Default to center of screen
    const defaultSize = 100;
    startRect = {
      left: window.innerWidth / 2 - defaultSize / 2,
      top: window.innerHeight / 2 - defaultSize / 2,
      width: defaultSize,
      height: defaultSize,
    };
  }

  // Launch sound
  playFlySound(mode === 'cart' ? 'cart-launch' : 'wishlist-launch');

  // Create floating clone
  const clone = document.createElement('div');
  clone.className = `flying-clone ${mode === 'wishlist' ? 'flying-clone-wishlist' : ''}`;

  const imgSrc =
    product?.image ||
    (resolvedSource?.querySelector('img') as HTMLImageElement)?.src ||
    (resolvedSource as HTMLImageElement)?.src;

  if (imgSrc) {
    const img = document.createElement('img');
    img.src = imgSrc;
    img.alt = product?.title || product?.name || 'Product';
    img.className = 'w-full h-full object-cover rounded-xl';
    clone.appendChild(img);

    if (mode === 'wishlist') {
      const heartOverlay = document.createElement('div');
      heartOverlay.className =
        'absolute inset-0 bg-[#B3261E]/25 flex items-center justify-center backdrop-blur-[1px] rounded-xl';
      heartOverlay.innerHTML = '<i class="fas fa-heart text-white text-3xl drop-shadow-lg"></i>';
      clone.appendChild(heartOverlay);
    }
  } else if (product?.svg) {
    clone.innerHTML = product.svg;
  } else {
    const iconPlaceholder = document.createElement('div');
    iconPlaceholder.className =
      'w-full h-full flex items-center justify-center bg-[#FAF6F0] rounded-xl ' +
      (mode === 'cart' ? 'text-[#B5532E]' : 'text-[#B3261E]');
    iconPlaceholder.innerHTML =
      mode === 'cart'
        ? '<i class="fas fa-bag-shopping text-3xl"></i>'
        : '<i class="fas fa-heart text-3xl"></i>';
    clone.appendChild(iconPlaceholder);
  }

  const startWidth = Math.max(startRect.width, 70);
  const startHeight = Math.max(startRect.height, 70);
  const startCenterX = startRect.left + startWidth / 2;
  const startCenterY = startRect.top + startHeight / 2;

  const endCenterX = endRect.left + endRect.width / 2;
  const endCenterY = endRect.top + endRect.height / 2;

  clone.style.width = `${startWidth}px`;
  clone.style.height = `${startHeight}px`;
  clone.style.left = `${startRect.left}px`;
  clone.style.top = `${startRect.top}px`;
  document.body.appendChild(clone);

  // Bezier Control Point Calculation
  let controlX: number;
  let controlY: number;

  if (mode === 'cart') {
    // Cinematic Parabolic Arc: arcs up and outward before swooping smoothly into cart
    controlX = (startCenterX + endCenterX) / 2 - (endCenterX - startCenterX) * 0.25;
    controlY = Math.min(startCenterY, endCenterY) - 180;
  } else {
    // Magnetic Pull: dips slightly down gathering tension/momentum, then rockets directly into wishlist
    controlX = startCenterX + (endCenterX - startCenterX) * 0.15;
    controlY = startCenterY + 110;
  }

  const duration = mode === 'cart' ? 360 : 300; // ms (sub-400ms UI budget)
  const startTime = performance.now();
  let lastParticleTime = 0;

  function animate(currentTime: number) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);

    const ease = mode === 'cart' ? easeInOutCubic(progress) : easeInBackSwoop(progress);

    // Quadratic Bezier formula: B(t) = (1-t)^2 * P0 + 2(1-t)t * P1 + t^2 * P2
    const invT = 1 - ease;
    const currentX = invT * invT * startCenterX + 2 * invT * ease * controlX + ease * ease * endCenterX;
    const currentY = invT * invT * startCenterY + 2 * invT * ease * controlY + ease * ease * endCenterY;

    // Scale calculation
    let scale: number;
    if (progress < 0.15) {
      scale = 1 + (progress / 0.15) * 0.12; // lift-off pop
    } else {
      const shrinkProgress = (progress - 0.15) / 0.85;
      scale = 1.12 * (1 - shrinkProgress * 0.86); // shrinks down to ~0.15
    }

    // Dynamic rotation & tilt
    const rotation =
      mode === 'cart'
        ? ease * 360 * (startCenterX < endCenterX ? 1 : -1)
        : ease * -180 * (startCenterX < endCenterX ? 1 : -1);

    // Pure GPU transform: translate3d + scale + rotate (zero layout reflow)
    const deltaX = currentX - startCenterX;
    const deltaY = currentY - startCenterY;
    clone.style.transform = `translate3d(${deltaX}px, ${deltaY}px, 0) scale(${scale}) rotate(${rotation}deg)`;
    clone.style.opacity = progress > 0.88 ? `${1 - (progress - 0.88) / 0.12}` : '1';

    // Spawn trail particles along flight path
    if (currentTime - lastParticleTime > 26 && progress < 0.9) {
      spawnTrailParticle(currentX, currentY, mode);
      lastParticleTime = currentTime;
    }

    if (progress < 1) {
      requestAnimationFrame(animate);
    } else {
      // Landed!
      if (clone.parentNode) {
        clone.parentNode.removeChild(clone);
      }
      triggerTargetCatch(mode);
      onLanded?.();
    }
  }

  requestAnimationFrame(animate);
}

/**
 * Public trigger: Cinematic Arc to Cart
 */
export function triggerFlyToCart(
  sourceEl?: HTMLElement | null,
  product?: any,
  onLanded?: () => void
) {
  runFlightAnimation({
    mode: 'cart',
    sourceEl,
    product,
    targetId: 'header-cart-button',
    onLanded,
  });
}

/**
 * Public trigger: Magnetic Pull to Wishlist
 */
export function triggerFlyToWishlist(
  sourceEl?: HTMLElement | null,
  product?: any,
  onLanded?: () => void
) {
  runFlightAnimation({
    mode: 'wishlist',
    sourceEl,
    product,
    targetId: 'header-wishlist-button',
    onLanded,
  });
}
