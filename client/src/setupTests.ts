import '@testing-library/jest-dom';
import { vi, beforeAll, afterEach, afterAll } from 'vitest';
import { server } from '@/test/msw/server';

// Mock Chart.js to avoid canvas rendering issues in jsdom
vi.mock('chart.js/auto', () => {
  return {
    default: class MockChart {
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
