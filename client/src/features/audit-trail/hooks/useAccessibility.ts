import { useCallback, useEffect, useRef, useState } from 'react';

export interface AccessibilityOptions {
  announceChanges?: boolean;
  manageFocus?: boolean;
  keyboardNavigation?: boolean;
  screenReaderSupport?: boolean;
}

export function useAccessibility(options: AccessibilityOptions = {}) {
  const {
    announceChanges = true,
    manageFocus = true,
    keyboardNavigation = true,
    screenReaderSupport = true,
  } = options;

  const [announcements, setAnnouncements] = useState<string[]>([]);
  const announcementRef = useRef<HTMLDivElement>(null);
  const focusRef = useRef<HTMLElement>(null);

  // Announce changes to screen readers
  const announce = useCallback((message: string, priority: 'polite' | 'assertive' = 'polite') => {
    if (!announceChanges) return;

    setAnnouncements(prev => [...prev, message]);

    // Clear announcement after it's been read
    setTimeout(() => {
      setAnnouncements(prev => prev.filter(msg => msg !== message));
    }, 1000);
  }, [announceChanges]);

  // Focus management
  const setFocus = useCallback((element: HTMLElement | null) => {
    if (!manageFocus || !element) return;

    element.focus();
    element.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }, [manageFocus]);

  const focusFirstFocusable = useCallback((container: HTMLElement) => {
    if (!manageFocus) return;

    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstFocusable = focusableElements[0] as HTMLElement;
    if (firstFocusable) {
      setFocus(firstFocusable);
    }
  }, [manageFocus, setFocus]);

  // Keyboard navigation helpers
  const handleKeyboardNavigation = useCallback((
    event: React.KeyboardEvent,
    actions: {
      onEnter?: () => void;
      onSpace?: () => void;
      onEscape?: () => void;
      onArrowUp?: () => void;
      onArrowDown?: () => void;
      onArrowLeft?: () => void;
      onArrowRight?: () => void;
      onHome?: () => void;
      onEnd?: () => void;
    }
  ) => {
    if (!keyboardNavigation) return;

    switch (event.key) {
      case 'Enter':
        event.preventDefault();
        actions.onEnter?.();
        break;
      case ' ':
        event.preventDefault();
        actions.onSpace?.();
        break;
      case 'Escape':
        event.preventDefault();
        actions.onEscape?.();
        break;
      case 'ArrowUp':
        event.preventDefault();
        actions.onArrowUp?.();
        break;
      case 'ArrowDown':
        event.preventDefault();
        actions.onArrowDown?.();
        break;
      case 'ArrowLeft':
        event.preventDefault();
        actions.onArrowLeft?.();
        break;
      case 'ArrowRight':
        event.preventDefault();
        actions.onArrowRight?.();
        break;
      case 'Home':
        event.preventDefault();
        actions.onHome?.();
        break;
      case 'End':
        event.preventDefault();
        actions.onEnd?.();
        break;
    }
  }, [keyboardNavigation]);

  // ARIA attributes helper
  const getAriaAttributes = useCallback((
    role?: string,
    label?: string,
    description?: string,
    expanded?: boolean,
    controls?: string,
    labelledBy?: string,
    describedBy?: string,
    live?: 'polite' | 'assertive' | 'off'
  ) => {
    if (!screenReaderSupport) return {};

    const attrs: Record<string, any> = {};

    if (role) attrs.role = role;
    if (label) attrs['aria-label'] = label;
    if (description) attrs['aria-description'] = description;
    if (expanded !== undefined) attrs['aria-expanded'] = expanded;
    if (controls) attrs['aria-controls'] = controls;
    if (labelledBy) attrs['aria-labelledby'] = labelledBy;
    if (describedBy) attrs['aria-describedby'] = describedBy;
    if (live) attrs['aria-live'] = live;

    return attrs;
  }, [screenReaderSupport]);

  // Skip link functionality
  const createSkipLink = useCallback((targetId: string, label: string) => {
    if (!keyboardNavigation) return null;

    return {
      href: `#${targetId}`,
      onClick: (e: React.MouseEvent) => {
        e.preventDefault();
        const target = document.getElementById(targetId);
        if (target) {
          target.focus();
          target.scrollIntoView({ behavior: 'smooth' });
        }
      },
      children: label,
      className: 'skip-link sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:bg-primary focus:text-primary-foreground focus:px-4 focus:py-2 focus:rounded',
    };
  }, [keyboardNavigation]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      setAnnouncements([]);
    };
  }, []);

  return {
    announce,
    setFocus,
    focusFirstFocusable,
    handleKeyboardNavigation,
    getAriaAttributes,
    createSkipLink,
    announcementRef,
    focusRef,
    announcements,
  };
}
