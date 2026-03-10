import type { Placement, Step } from "react-joyride";

export interface RouteTourStep extends Step {
  id: string;
  route: string;
  placement?: Placement;
}

export const MANAGER_ESSENTIALS_TOUR_VERSION = "v1";
export const MANAGER_ESSENTIALS_TOUR_STORAGE_KEY =
  "aquamind:onboarding:mgr-essentials:v1";

export const MANAGER_ESSENTIALS_TOUR_STEPS: RouteTourStep[] = [
  {
    id: "mgr-planner-header",
    route: "/production-planner",
    target: '[data-tour="planner-header"]',
    title: "Production Planner Is Home Base",
    content:
      "Use Production Planner to schedule, monitor, and adjust operational activities across batches.",
    placement: "bottom",
    disableBeacon: true,
  },
  {
    id: "mgr-planner-scenario",
    route: "/production-planner",
    target: '[data-tour="planner-scenario-select"]',
    title: "Scenario Context First",
    content:
      "All planning here is scenario-based. Select a scenario before creating or reviewing activities.",
    placement: "bottom",
    disableBeacon: true,
  },
  {
    id: "mgr-planner-kpis",
    route: "/production-planner",
    target: '[data-tour="planner-kpi-cards"]',
    title: "KPI Cards Are Action Filters",
    content:
      "Upcoming, Overdue, This Month, and Completed cards are clickable filters, not just passive metrics.",
    placement: "bottom",
    disableBeacon: true,
  },
  {
    id: "mgr-planner-timeline",
    route: "/production-planner",
    target: '[data-tour="planner-timeline"]',
    title: "Timeline by Batch",
    content:
      "Use this view to spot overdue items, open activity details, and track execution status per batch.",
    placement: "top",
    disableBeacon: true,
  },
  {
    id: "mgr-planner-transfer-link",
    route: "/production-planner",
    target: '[data-tour="planner-timeline"]',
    title: "From Plan to Workflow",
    content:
      "For TRANSFER activities, open the activity detail and use Create Workflow to move into execution tracking.",
    placement: "top",
    disableBeacon: true,
  },
  {
    id: "mgr-workflow-list",
    route: "/transfer-workflows",
    target: '[data-tour="workflow-header"]',
    title: "Transfer Workflow Board",
    content:
      "Track status, progress, and intercompany markers for active transfers in one place.",
    placement: "top",
    disableBeacon: true,
  },
  {
    id: "mgr-workflow-create",
    route: "/transfer-workflows",
    target: '[data-tour="workflow-header"]',
    title: "Station-to-Sea Dynamic Mode",
    content:
      "Use Create Workflow for operations that may include truck and vessel handoffs. Dynamic mode supports live route legs.",
    placement: "bottom",
    disableBeacon: true,
  },
  {
    id: "mgr-batch-creation",
    route: "/batch-creation-workflows",
    target: '[data-tour="batch-creation-header"]',
    title: "Batch Creation Pipeline",
    content:
      "Manage egg-source workflows and monitor progress from planned egg intake to completed batch creation.",
    placement: "bottom",
    disableBeacon: true,
  },
  {
    id: "mgr-exec-forecast",
    route: "/executive",
    target: '[data-tour="executive-strategic-forecast"]',
    title: "Live Forward Forecast Priority",
    content:
      "In Strategic view, prioritize the Needs Plan tier first. It highlights batches requiring urgent planning.",
    placement: "top",
    disableBeacon: true,
  },
];
