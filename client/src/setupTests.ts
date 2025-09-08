import '@testing-library/jest-dom';
import { vi } from 'vitest';


// AbortController compatibility for tests
(() => {
  const AC: any = (globalThis as any).AbortController;
  const Req: any = (globalThis as any).Request;
  if (typeof AC === 'function' && typeof Req === 'function') {
    try {
      // Some environments throw when signal is not the exact constructor instance
      new Req('http://localhost', { signal: new AC().signal });
    } catch {
      // Fallback: provide a no-op AbortController with undefined signal
      (globalThis as any).AbortController = class {
        signal: any = undefined;
        abort() {}
      };
    }
  }
})();

// ---------------------------------------------------------------------------
// jsdom doesn't implement matchMedia; provide a minimal mock so that any
// responsive hooks/components relying on it (e.g. useIsMobile) don't crash
// during test execution.  We intentionally keep this stub lean—enough to keep
// React from throwing while remaining easy to inspect and override in an
// individual test if finer-grained behaviour is required.
// ---------------------------------------------------------------------------
if (typeof window.matchMedia !== 'function') {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation((query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(),          // Deprecated
      removeListener: vi.fn(),       // Deprecated
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  });

  // Confirm that the polyfill has been applied
  // eslint-disable-next-line no-console
  console.log('[setupTests] matchMedia:', typeof window.matchMedia);
}

// ---------------------------------------------------------------------------
// Simplified, always–on matchMedia stub
// ---------------------------------------------------------------------------
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    // Legacy APIs
    addListener: vi.fn(),          // Deprecated
    removeListener: vi.fn(),       // Deprecated
    // Modern APIs
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// eslint-disable-next-line no-console
console.log('[setupTests] matchMedia stub installed');

// ---------------------------------------------------------------------------
// Canvas & ResizeObserver shims
// ---------------------------------------------------------------------------

// 1️⃣  Stub `getContext` on <canvas> to avoid JSDOM \"Not implemented\" errors
if (typeof HTMLCanvasElement !== 'undefined') {
  // Override for all tests – keep reference if needed elsewhere.
  // `chart.js` is already mocked above, we just need a harmless object here.
  // Cast ensures TypeScript accepts our stub across all context overloads.
  // We only need a plain object for libraries that check for presence.
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore – we deliberately replace the readonly property in tests
  HTMLCanvasElement.prototype.getContext = vi.fn(
    // Accept any contextId/options pair and return an empty 2D context stub.
    (_contextId: unknown, _options?: unknown) => ({} as CanvasRenderingContext2D)
    // Tell TS this matches the built-in signature set
  ) as unknown as HTMLCanvasElement['getContext'];
}

// 2️⃣  Provide a minimal `ResizeObserver` so libraries like Recharts don't crash
if (typeof (window as any).ResizeObserver === 'undefined') {
  class ResizeObserver {
    observe = vi.fn();
    unobserve = vi.fn();
    disconnect = vi.fn();
  }

  // Attach to global/window
  (window as any).ResizeObserver = ResizeObserver;
  // eslint-disable-next-line no-console
  console.log('[setupTests] ResizeObserver stub installed');
}
