# Broken Features Inventory  
_Tracking UI components that still rely on missing or legacy API endpoints (Phase-2 backlog)_  
Last generated: **2025-08-14**

> Legend for “Priority”  
> • **H** – must fix before GA  
> • **M** – nice-to-have or blocked by product decision  
> • **L** – low user impact / candidate for removal

---

## Dashboard

| Feature (UI Location) | Missing Endpoint(s) | Impact | Work-around | Priority | Recommended Resolution |
|-----------------------|---------------------|--------|-------------|----------|------------------------|
| KPI Cards (Dashboard homepage) | — (computed client-side) | Metrics populate normally | — | — | **RESOLVED by PR #15** |
| Farm-site selector & site list | `/api/dashboard/farm-sites/` | Farm-site filter empty | Uses `/api/v1/infrastructure/areas/` via **ApiService** (requires auth) | M | Re-use `/api/v1/infrastructure/geographies/` & `/areas/` as hierarchy. |
| Alerts panel | `/api/dashboard/alerts/` | Panel hidden | None | M | Decide if real-time alerts belong to backend; if not, drop feature for v1. |

---

## Batch Management

| Feature | Missing Endpoint(s) | Impact | Work-around | Prio. | Resolution |
|---------|---------------------|--------|-------------|-------|------------|
| Batch list (table filters) | `/api/batches/` (non-v1) | Loads but 404 ➜ blank table | Switch to mock API | H | Replace with `/api/v1/batch/batches/` + filters. |
| Species & Stage dropdowns | `/api/species/`, `/api/stages/` | Dropdowns empty | Hard-coded test options | H | Use `/api/v1/batch/species/` and `/lifecycle-stages/`. |
| Container dropdown | `/api/containers/` | Assignments impossible | — | H | `/api/v1/infrastructure/containers/`. |
| Traceability view | `/api/batch/container-assignments/`, `/api/batch/transfers/`, `/growth-samples/`, `/mortality-events/` | History tab broken | — | M | Point to `/api/v1/batch/*` equivalents or aggregate client-side. |
| Analytics view (growth/performance) | `/api/batch/growth-metrics/`, `/performance-metrics/`, `/predictive-insights/`, `/environmental-correlations/`, `/benchmarks/` | Analytics cards empty | — | M | Open BE tickets or hide feature (Phase-3). |
| Feed History view | `/api/batch/feeding-events/`, `/feeding-summaries/` | Graphs empty | Pull data from inventory endpoints | M | Map to `/api/v1/inventory/feeding-events/` + `/batch-feeding-summaries/`. |
| Health tab (batch detail) | `/api/health/records/`, `/assessments/`, `/lab-samples/` | Health section blank | — | M | Replace with granular health endpoints (`journal-entries/`, `health-lab-samples/`, etc.). |

---

## Health

| Feature | Missing Endpoint(s) | Impact | Work-around | Prio. | Resolution |
|---------|---------------------|--------|-------------|-------|------------|
| Summary widgets | `/api/health/summary/` | Tiles show “N/A” | — | M | Aggregate in FE using granular endpoints. |
| Critical alerts list | `/api/health/alerts/critical/` | List empty | — | M | Derive alerts client-side or design BE endpoint. |
| Active treatments list | `/api/health/treatments/active/` | Section blank | Filter `/api/v1/health/treatments/` client-side | M | Implement client-side filter or BE query param. |
| Recent mortality & lice widgets | `/api/health/mortality/recent/`, `/api/health/lice/recent/` | Widgets hidden | — | M | Replace by querying respective resources with `?ordering=-date&limit=`. |

---

## Inventory

| Feature | Missing Endpoint(s) | Impact | Work-around | Prio. | Resolution |
|---------|---------------------|--------|-------------|-------|------------|
| Inventory-simple page (deprecated demo) | `/api/v1/inventory/feed-types/`, `/feed-containers/` | Page errors | Use new inventory page | L | Remove deprecated page or refactor to correct endpoints. |

---

## Infrastructure

| Feature | Missing Endpoint(s) | Impact | Work-around | Prio. | Resolution |
|---------|---------------------|--------|-------------|-------|------------|
| Overview dash (`infrastructure.tsx`) | `/api/v1/infrastructure/summary/`, `/alerts/` | Summary & alerts cards hidden | — | M | Compute summary client-side; alerts pending product decision. |
| Sensors overview page | `/api/v1/infrastructure/sensors/overview` (+ query) | Table shows spinner forever | None | M | Use `/api/v1/infrastructure/sensors/` & aggregate in FE. |
| Containers overview page | `/api/v1/infrastructure/containers/overview` (+ query) | Same as above | — | M | Same fix as sensors. |
| Rings resource | `/api/v1/infrastructure/rings/` | Ring views 404 | — | L | If rings will be added to BE, create spec; else drop feature. |
| Dynamic nested endpoints | `/stations/{id}/halls`, `/areas/{id}/rings` | Nested pages broken | — | M | Build FE filter over generic list endpoints (`/halls/` with `?station=`). |

---

## Scenario Planning

| Feature | Missing Endpoint(s) | Impact | Work-around | Prio. | Resolution |
|---------|---------------------|--------|-------------|-------|------------|
| KPI cards | `/api/v1/scenario/dashboard/kpis/` | Cards hidden | — | M | Decide if KPI endpoint needed; else remove cards. |
| Temperature profile CRUD | `/api/v1/scenario/temperature-profiles/${id}/readings/` | Readings dialog fails | None | H | Implement readings endpoint (BE) or adjust UI scope. |
| Biological constraints list | `/api/v1/scenario/biological-constraints/` | List empty | — | H | Endpoint exists in spec; ensure backend implementation. |
| Model creation dialogs (TGC/FCR/Mortality) | Stage list `/stages/` missing | Dropdown empty | — | H | Add `/api/v1/batch/lifecycle-stages/` to dialog queries. |
| Scenario table (filters, duplication) | `/configuration/`, `/projections/`, `/duplicate/`, `/run-projection/` | Advanced actions disabled | Basic list works | M | Keep core CRUD; advanced actions require BE support (Phase-3). |

---

## Broodstock

| Feature | Missing Endpoint(s) | Impact | Work-around | Prio. | Resolution |
|---------|---------------------|--------|-------------|-------|------------|
| Dashboard KPI cards & charts | `/api/v1/broodstock/dashboard/kpis/`, `/genetic/traits/` | Placeholder zeros | Static placeholders | M | Plan dedicated BE endpoints or hide until implemented. |
| Maintenance tasks & activities widgets | `/api/v1/broodstock/tasks/`, `/activities/` | Sections blank | — | L | Move to Phase-3 after product review. |
| Container list pages | `/api/v1/broodstock/containers/` | Lists empty | Use infrastructure containers | M | Decide ownership: reuse `/infrastructure/containers/` or add alias in BE. |

---

## Miscellaneous

| Feature | Missing Endpoint(s) | Impact | Work-around | Prio. | Resolution |
|---------|---------------------|--------|-------------|-------|------------|
| CSRF fetch utility | `/api/v1/auth/csrf/` | Extra network 404 in dev | Token still set by cookies | L | Remove request; CSRF cookie is auto-set. |
| Farm-site dropdown in Mortality Reporting | `/api/farm-sites/` | Filter disabled | Use “all sites” | L | Replace by `/api/v1/infrastructure/areas/` hierarchy or drop filter. |

---

### Next Steps
1. Create GitHub issues for every **High** and **Medium** item; link to this document.  
2. Schedule Phase 2 refactor sprints per feature-area.  
3. Flip validation script back to **blocking** when this list is fully resolved.  
4. Delete or archive this file in Phase 3 once no broken features remain.
