import '@testing-library/jest-dom';
import { vi, beforeAll, afterEach, afterAll } from 'vitest';
import { server } from '@/test/msw/server';

// Mock Chart.js to avoid canvas rendering issues in jsdom
vi.mock('chart.js/auto', () => {
  return {
    default: class MockChart {
      // Explicitly declare the property so TypeScript recognizes it
      destroyed: boolean;

      constructor() {
        this.destroyed = false;
      }
      
      destroy() {
        this.destroyed = true;
      }
      
      update() {
        return this;
      }
      
      // Add any other methods tests might need
    }
  };
});

// Establish API mocking before all tests
beforeAll(() => {
  // Fail the test when an unexpected request is made to help surface missing
  // handlers and ensure our mocks stay up-to-date.
  server.listen({ onUnhandledRequest: 'error' });

  /* ------------------------------------------------------------------
   *  Lightweight instrumentation
   * ------------------------------------------------------------------
   *  Log each mocked request/response pair so that, when a test fails
   *  because of an unexpected network interaction, the console output
   *  provides immediate insight into what was requested and what MSW
   *  returned.  The callbacks are intentionally minimal to avoid noisy
   *  output while still being informative.
   */
  server.events.on('request:start', ({ request }) => {
    // Example: [MSW] GET http://localhost:8000/api/v1/batch/batches/
    console.log(`[MSW] ${request.method} ${request.url}`);
  });

  server.events.on('response:mocked', ({ response }) => {
    // Example: [MSW] 200 http://localhost:8000/api/v1/batch/batches/
    console.log(`[MSW] ${response.status} ${response.url}`);
  });
});

// Reset any request handlers that we may add during the tests
afterEach(() => {
  server.resetHandlers();
});

// Clean up after the tests are finished
afterAll(() => {
  server.close();
});

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
