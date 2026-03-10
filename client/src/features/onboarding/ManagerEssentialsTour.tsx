import { useEffect, useMemo, useRef, useState } from "react";
import { useLocation } from "wouter";
import Joyride, { ACTIONS, CallBackProps, EVENTS, STATUS } from "react-joyride";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useUser } from "@/contexts/UserContext";
import {
  MANAGER_ESSENTIALS_TOUR_STEPS,
  MANAGER_ESSENTIALS_TOUR_STORAGE_KEY,
} from "./config/managerEssentialsTour";
import {
  ONBOARDING_OPEN_EXECUTIVE_STRATEGIC_TAB_EVENT,
  ONBOARDING_REPLAY_MANAGER_TOUR_EVENT,
} from "./events";

const ROUTE_SETTLE_DELAY_MS = 400;
const TARGET_SETTLE_TIMEOUT_MS = 5000;
const TARGET_POLL_INTERVAL_MS = 120;
const EXECUTIVE_FORECAST_STEP_ID = "mgr-exec-forecast";

function normalizePath(path: string): string {
  const withoutQuery = path.split("?")[0].split("#")[0];
  if (withoutQuery.length > 1 && withoutQuery.endsWith("/")) {
    return withoutQuery.slice(0, -1);
  }
  return withoutQuery;
}

function hasCompletedManagerTour(): boolean {
  return localStorage.getItem(MANAGER_ESSENTIALS_TOUR_STORAGE_KEY) === "completed";
}

function markManagerTourCompleted(): void {
  localStorage.setItem(MANAGER_ESSENTIALS_TOUR_STORAGE_KEY, "completed");
}

function clearManagerTourCompletion(): void {
  localStorage.removeItem(MANAGER_ESSENTIALS_TOUR_STORAGE_KEY);
}

function isSelectorTargetVisible(selector: string): boolean {
  const element = document.querySelector(selector) as HTMLElement | null;
  if (!element) {
    return false;
  }

  const style = window.getComputedStyle(element);
  if (style.display === "none" || style.visibility === "hidden") {
    return false;
  }

  const rect = element.getBoundingClientRect();
  return rect.width > 0 && rect.height > 0;
}

export function ManagerEssentialsTour() {
  const { isLoading, isManager } = useUser();
  const [location, navigate] = useLocation();

  const [showWelcome, setShowWelcome] = useState(false);
  const [dontShowAgain, setDontShowAgain] = useState(false);
  const [runTour, setRunTour] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);
  const [isRouteTransitioning, setIsRouteTransitioning] = useState(false);
  const targetMissCountRef = useRef<Record<number, number>>({});
  const strategicTabOpenedForStepRef = useRef<number | null>(null);

  const steps = useMemo(() => MANAGER_ESSENTIALS_TOUR_STEPS, []);
  const currentStep = steps[stepIndex];

  useEffect(() => {
    if (isLoading) {
      return;
    }

    if (!isManager) {
      setShowWelcome(false);
      setRunTour(false);
      return;
    }

    if (!hasCompletedManagerTour()) {
      setShowWelcome(true);
    }
  }, [isLoading, isManager]);

  useEffect(() => {
    const handleReplay = () => {
      if (!isManager || isLoading) {
        return;
      }
      clearManagerTourCompletion();
      setDontShowAgain(false);
      setStepIndex(0);
      targetMissCountRef.current = {};
      strategicTabOpenedForStepRef.current = null;
      setShowWelcome(true);
      setRunTour(false);
    };

    window.addEventListener(ONBOARDING_REPLAY_MANAGER_TOUR_EVENT, handleReplay);
    return () =>
      window.removeEventListener(ONBOARDING_REPLAY_MANAGER_TOUR_EVENT, handleReplay);
  }, [isLoading, isManager]);

  useEffect(() => {
    if (!runTour || !currentStep) {
      return;
    }

    let cancelled = false;
    let pollTimer: number | undefined;
    setIsRouteTransitioning(true);

    const isOnExpectedRoute =
      normalizePath(currentStep.route) === normalizePath(location);

    if (!isOnExpectedRoute) {
      navigate(currentStep.route);
      // Route has not settled yet; allow step-specific route effects to run after navigation.
      if (currentStep.id === EXECUTIVE_FORECAST_STEP_ID) {
        strategicTabOpenedForStepRef.current = null;
      }
    }

    if (isOnExpectedRoute && currentStep.id === EXECUTIVE_FORECAST_STEP_ID) {
      if (strategicTabOpenedForStepRef.current !== stepIndex) {
        strategicTabOpenedForStepRef.current = stepIndex;
        window.dispatchEvent(
          new CustomEvent(ONBOARDING_OPEN_EXECUTIVE_STRATEGIC_TAB_EVENT)
        );
      }
    } else {
      strategicTabOpenedForStepRef.current = null;
    }

    const startedAt = Date.now();
    const pollForTarget = () => {
      if (cancelled) {
        return;
      }

      const timedOut = Date.now() - startedAt >= TARGET_SETTLE_TIMEOUT_MS;
      const target = currentStep.target;

      if (timedOut) {
        setIsRouteTransitioning(false);
        return;
      }

      if (typeof target !== "string" || isSelectorTargetVisible(target)) {
        setIsRouteTransitioning(false);
        return;
      }

      pollTimer = window.setTimeout(pollForTarget, TARGET_POLL_INTERVAL_MS);
    };

    pollForTarget();

    return () => {
      cancelled = true;
      if (pollTimer) {
        window.clearTimeout(pollTimer);
      }
    };
  }, [currentStep, location, navigate, runTour, stepIndex]);

  const completeTour = () => {
    markManagerTourCompleted();
    setRunTour(false);
    setShowWelcome(false);
    setStepIndex(0);
    targetMissCountRef.current = {};
    strategicTabOpenedForStepRef.current = null;
  };

  const handleWelcomeStart = () => {
    setShowWelcome(false);
    setIsRouteTransitioning(true);
    setRunTour(true);
    setStepIndex(0);
    targetMissCountRef.current = {};
    strategicTabOpenedForStepRef.current = null;
  };

  const handleWelcomeClose = () => {
    if (dontShowAgain) {
      markManagerTourCompleted();
    }
    setShowWelcome(false);
    setRunTour(false);
    setStepIndex(0);
    targetMissCountRef.current = {};
    strategicTabOpenedForStepRef.current = null;
  };

  const handleJoyrideCallback = (data: CallBackProps) => {
    const { action, index, status, type } = data;
    const currentIndex = typeof index === "number" ? index : stepIndex;

    if (status === STATUS.SKIPPED && action === ACTIONS.SKIP) {
      completeTour();
      return;
    }

    // Joyride can emit FINISHED during controlled run/pause transitions.
    // Only complete when we're actually at the final step.
    if (status === STATUS.FINISHED) {
      if (currentIndex >= steps.length - 1) {
        completeTour();
      }
      return;
    }

    if (type === EVENTS.STEP_AFTER) {
      if (currentIndex !== stepIndex) {
        return;
      }

      const delta = action === ACTIONS.PREV ? -1 : 1;
      const nextIndex = currentIndex + delta;

      if (nextIndex < 0 || nextIndex >= steps.length) {
        completeTour();
        return;
      }

      targetMissCountRef.current[nextIndex] = 0;
      setIsRouteTransitioning(true);
      setStepIndex(nextIndex);
      return;
    }

    if (type === EVENTS.TARGET_NOT_FOUND || type === EVENTS.ERROR) {
      // Ignore stale callback events that don't belong to the currently controlled step.
      if (currentIndex !== stepIndex) {
        return;
      }

      // While route is changing, keep the step and let navigation settle.
      if (currentStep && normalizePath(currentStep.route) !== normalizePath(location)) {
        setIsRouteTransitioning(true);
        window.setTimeout(() => setIsRouteTransitioning(false), ROUTE_SETTLE_DELAY_MS);
        return;
      }

      const misses = targetMissCountRef.current[currentIndex] ?? 0;
      if (misses < 10) {
        targetMissCountRef.current[currentIndex] = misses + 1;
        setIsRouteTransitioning(true);
        window.setTimeout(() => setIsRouteTransitioning(false), 300);
        return;
      }

      // After retry budget is exhausted, move forward to avoid a hard stop.
      const nextIndex = currentIndex + 1;
      if (nextIndex < 0 || nextIndex >= steps.length) {
        completeTour();
        return;
      }

      targetMissCountRef.current[nextIndex] = 0;
      setStepIndex(nextIndex);
    }
  };

  if (!isManager) {
      return null;
  }

  return (
    <>
      <Dialog
        open={showWelcome}
        onOpenChange={(open) => {
          setShowWelcome(open);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Welcome to AquaMind</DialogTitle>
            <DialogDescription>
              Want a quick manager essentials tour? It takes about 2-3 minutes and covers
              planning, workflows, batch creation, and live forecast priorities.
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center space-x-2 py-2">
            <Checkbox
              id="onboarding-dont-show"
              checked={dontShowAgain}
              onCheckedChange={(checked) => {
                const nextValue = checked === true;
                setDontShowAgain(nextValue);
                if (nextValue) {
                  markManagerTourCompleted();
                } else {
                  clearManagerTourCompletion();
                }
              }}
            />
            <Label htmlFor="onboarding-dont-show">Don&apos;t show again</Label>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={handleWelcomeClose}>
              Not now
            </Button>
            <Button onClick={handleWelcomeStart}>Start Tour</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Joyride
        callback={handleJoyrideCallback}
        continuous
        disableOverlayClose
        disableScrolling
        hideCloseButton
        run={runTour && !isRouteTransitioning}
        scrollToFirstStep
        showProgress
        showSkipButton
        stepIndex={stepIndex}
        steps={steps}
        locale={{
          back: "Back",
          close: "Close",
          last: "Finish",
          next: "Next",
          nextLabelWithProgress: "Next ({step}/{steps})",
          skip: "Skip",
        }}
        styles={{
          options: {
            arrowColor: "hsl(var(--card))",
            backgroundColor: "hsl(var(--card))",
            overlayColor: "rgba(15, 23, 42, 0.45)",
            primaryColor: "hsl(var(--primary))",
            textColor: "hsl(var(--card-foreground))",
            width: 420,
            zIndex: 99999,
          },
          tooltipContainer: {
            border: "1px solid hsl(var(--border))",
            borderRadius: 12,
            boxShadow: "0 14px 40px rgba(2, 6, 23, 0.22)",
            padding: "14px 16px",
          },
          tooltipTitle: {
            fontSize: 24,
            fontWeight: 700,
            lineHeight: "1.35",
            marginBottom: 8,
          },
          tooltipContent: {
            fontSize: 16,
            lineHeight: "1.6",
            padding: "4px 0 10px",
          },
          tooltipFooter: {
            marginTop: 2,
          },
          buttonNext: {
            backgroundColor: "hsl(var(--primary))",
            borderRadius: 8,
            color: "hsl(var(--primary-foreground))",
            fontSize: 14,
            fontWeight: 600,
            padding: "8px 14px",
          },
          buttonBack: {
            color: "hsl(var(--muted-foreground))",
            fontSize: 14,
            marginRight: 8,
          },
          buttonSkip: {
            color: "hsl(var(--muted-foreground))",
            fontSize: 14,
          },
        }}
      />
    </>
  );
}
