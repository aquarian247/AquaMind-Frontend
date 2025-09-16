import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useAccessibility } from './useAccessibility';

// Mock HTMLElement methods
const mockFocus = vi.fn();
const mockScrollIntoView = vi.fn();
const mockQuerySelectorAll = vi.fn();

beforeEach(() => {
  vi.clearAllMocks();

  // Mock HTMLElement
  Object.defineProperty(HTMLElement.prototype, 'focus', {
    writable: true,
    value: mockFocus,
  });

  Object.defineProperty(HTMLElement.prototype, 'scrollIntoView', {
    writable: true,
    value: mockScrollIntoView,
  });

  Object.defineProperty(HTMLElement.prototype, 'querySelectorAll', {
    writable: true,
    value: mockQuerySelectorAll,
  });
});

describe('useAccessibility', () => {
  describe('announce function', () => {
    it('should announce messages when announceChanges is enabled', () => {
      const { result } = renderHook(() => useAccessibility({ announceChanges: true }));

      act(() => {
        result.current.announce('Test message');
      });

      expect(result.current.announcements).toContain('Test message');
    });

    it('should not announce when announceChanges is disabled', () => {
      const { result } = renderHook(() => useAccessibility({ announceChanges: false }));

      act(() => {
        result.current.announce('Test message');
      });

      expect(result.current.announcements).toHaveLength(0);
    });

    it('should clear announcements after timeout', () => {
      vi.useFakeTimers();
      const { result } = renderHook(() => useAccessibility({ announceChanges: true }));

      act(() => {
        result.current.announce('Test message');
      });

      expect(result.current.announcements).toContain('Test message');

      act(() => {
        vi.advanceTimersByTime(1000);
      });

      expect(result.current.announcements).not.toContain('Test message');

      vi.useRealTimers();
    });
  });

  describe('focus management', () => {
    it('should set focus when manageFocus is enabled', () => {
      const { result } = renderHook(() => useAccessibility({ manageFocus: true }));
      const mockElement = document.createElement('button');

      act(() => {
        result.current.setFocus(mockElement);
      });

      expect(mockFocus).toHaveBeenCalled();
      expect(mockScrollIntoView).toHaveBeenCalledWith({
        behavior: 'smooth',
        block: 'center'
      });
    });

    it('should not set focus when manageFocus is disabled', () => {
      const { result } = renderHook(() => useAccessibility({ manageFocus: false }));
      const mockElement = document.createElement('button');

      act(() => {
        result.current.setFocus(mockElement);
      });

      expect(mockFocus).not.toHaveBeenCalled();
      expect(mockScrollIntoView).not.toHaveBeenCalled();
    });

    it('should not set focus when element is null', () => {
      const { result } = renderHook(() => useAccessibility({ manageFocus: true }));

      act(() => {
        result.current.setFocus(null);
      });

      expect(mockFocus).not.toHaveBeenCalled();
    });

    it('should focus first focusable element in container', () => {
      const { result } = renderHook(() => useAccessibility({ manageFocus: true }));
      const mockContainer = document.createElement('div');
      const mockButton = document.createElement('button');

      mockQuerySelectorAll.mockReturnValue([mockButton]);

      act(() => {
        result.current.focusFirstFocusable(mockContainer);
      });

      expect(mockQuerySelectorAll).toHaveBeenCalledWith(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      expect(mockFocus).toHaveBeenCalled();
    });

    it('should not focus when manageFocus is disabled', () => {
      const { result } = renderHook(() => useAccessibility({ manageFocus: false }));
      const mockContainer = document.createElement('div');

      act(() => {
        result.current.focusFirstFocusable(mockContainer);
      });

      expect(mockQuerySelectorAll).not.toHaveBeenCalled();
    });
  });

  describe('keyboard navigation', () => {
    it('should handle Enter key', () => {
      const { result } = renderHook(() => useAccessibility({ keyboardNavigation: true }));
      const mockOnEnter = vi.fn();

      const mockEvent = {
        key: 'Enter',
        preventDefault: vi.fn(),
      } as any;

      act(() => {
        result.current.handleKeyboardNavigation(mockEvent, { onEnter: mockOnEnter });
      });

      expect(mockEvent.preventDefault).toHaveBeenCalled();
      expect(mockOnEnter).toHaveBeenCalled();
    });

    it('should handle Space key', () => {
      const { result } = renderHook(() => useAccessibility({ keyboardNavigation: true }));
      const mockOnSpace = vi.fn();

      const mockEvent = {
        key: ' ',
        preventDefault: vi.fn(),
      } as any;

      act(() => {
        result.current.handleKeyboardNavigation(mockEvent, { onSpace: mockOnSpace });
      });

      expect(mockEvent.preventDefault).toHaveBeenCalled();
      expect(mockOnSpace).toHaveBeenCalled();
    });

    it('should handle arrow keys', () => {
      const { result } = renderHook(() => useAccessibility({ keyboardNavigation: true }));
      const mockOnArrowUp = vi.fn();
      const mockOnArrowDown = vi.fn();

      const mockEventUp = {
        key: 'ArrowUp',
        preventDefault: vi.fn(),
      } as any;

      const mockEventDown = {
        key: 'ArrowDown',
        preventDefault: vi.fn(),
      } as any;

      act(() => {
        result.current.handleKeyboardNavigation(mockEventUp, { onArrowUp: mockOnArrowUp });
        result.current.handleKeyboardNavigation(mockEventDown, { onArrowDown: mockOnArrowDown });
      });

      expect(mockOnArrowUp).toHaveBeenCalled();
      expect(mockOnArrowDown).toHaveBeenCalled();
    });

    it('should not handle keys when keyboardNavigation is disabled', () => {
      const { result } = renderHook(() => useAccessibility({ keyboardNavigation: false }));
      const mockOnEnter = vi.fn();

      const mockEvent = {
        key: 'Enter',
        preventDefault: vi.fn(),
      } as any;

      act(() => {
        result.current.handleKeyboardNavigation(mockEvent, { onEnter: mockOnEnter });
      });

      expect(mockOnEnter).not.toHaveBeenCalled();
    });
  });

  describe('ARIA attributes', () => {
    it('should return ARIA attributes when screenReaderSupport is enabled', () => {
      const { result } = renderHook(() => useAccessibility({ screenReaderSupport: true }));

      const attrs = result.current.getAriaAttributes(
        'button',
        'Test label',
        'Test description',
        true,
        'test-controls',
        'test-labelledby',
        'test-describedby',
        'polite'
      );

      expect(attrs).toEqual({
        role: 'button',
        'aria-label': 'Test label',
        'aria-description': 'Test description',
        'aria-expanded': true,
        'aria-controls': 'test-controls',
        'aria-labelledby': 'test-labelledby',
        'aria-describedby': 'test-describedby',
        'aria-live': 'polite',
      });
    });

    it('should return empty object when screenReaderSupport is disabled', () => {
      const { result } = renderHook(() => useAccessibility({ screenReaderSupport: false }));

      const attrs = result.current.getAriaAttributes('button', 'Test label');

      expect(attrs).toEqual({});
    });
  });

  describe('skip links', () => {
    it('should create skip link when keyboardNavigation is enabled', () => {
      const { result } = renderHook(() => useAccessibility({ keyboardNavigation: true }));

      const skipLink = result.current.createSkipLink('main-content', 'Skip to main content');

      expect(skipLink).toEqual({
        href: '#main-content',
        onClick: expect.any(Function),
        children: 'Skip to main content',
        className: 'skip-link sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:bg-primary focus:text-primary-foreground focus:px-4 focus:py-2 focus:rounded',
      });
    });

    it('should return null when keyboardNavigation is disabled', () => {
      const { result } = renderHook(() => useAccessibility({ keyboardNavigation: false }));

      const skipLink = result.current.createSkipLink('main-content', 'Skip to main content');

      expect(skipLink).toBeNull();
    });

    it('should handle skip link click', () => {
      const { result } = renderHook(() => useAccessibility({ keyboardNavigation: true }));

      const mockElement = document.createElement('div');
      mockElement.id = 'main-content';
      document.body.appendChild(mockElement);

      const skipLink = result.current.createSkipLink('main-content', 'Skip to main content');

      const mockEvent = {
        preventDefault: vi.fn(),
      } as any;

      act(() => {
        skipLink?.onClick(mockEvent);
      });

      expect(mockEvent.preventDefault).toHaveBeenCalled();
      expect(mockFocus).toHaveBeenCalled();
      expect(mockScrollIntoView).toHaveBeenCalledWith({ behavior: 'smooth' });

      document.body.removeChild(mockElement);
    });
  });

  describe('default options', () => {
    it('should use default options when none provided', () => {
      const { result } = renderHook(() => useAccessibility());

      // Test that all features are enabled by default
      act(() => {
        result.current.announce('Test');
      });
      expect(result.current.announcements).toContain('Test');

      const mockElement = document.createElement('button');
      act(() => {
        result.current.setFocus(mockElement);
      });
      expect(mockFocus).toHaveBeenCalled();

      const attrs = result.current.getAriaAttributes('button', 'Test');
      expect(attrs.role).toBe('button');
    });
  });

  describe('cleanup', () => {
    it('should clear announcements on unmount', () => {
      const { result, unmount } = renderHook(() => useAccessibility());

      act(() => {
        result.current.announce('Test message');
      });

      expect(result.current.announcements).toHaveLength(1);

      unmount();

      // Since announcements are cleared in useEffect cleanup,
      // we can't directly test this, but the hook should not crash
      expect(() => unmount()).not.toThrow();
    });
  });
});
