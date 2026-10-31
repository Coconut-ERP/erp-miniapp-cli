# Recipe: Chart page

## Goal

Compose dashboard charts from `@erp/miniapp-ui` — **do not** hand-roll bar/donut/line markup in the mini app.

## Library

| Need | Component |
| --- | --- |
| Grouped / single bars | `BarChart` |
| Distribution ring | `DonutChart` |
| Trend sparkline | `LineChart` |

Host inside `DashboardCard` / `Card`. Keep fetching + copy in the app; pass series config only.

## Example

```tsx
import { BarChart, DashboardCard, DonutChart, LineChart } from "@erp/miniapp-ui";

<DashboardCard title="Leads Generated">
  <BarChart
    categories={months}
    series={[
      { name: "Expected", data: expected, className: "bg-muted-foreground/30" },
      { name: "Generated", data: generated, className: "bg-primary" },
    ]}
    showLegend
    height={192}
  />
</DashboardCard>

<DonutChart
  segments={departments}
  center={<span className="text-2xl font-bold tabular-nums">{total}</span>}
  showLegend
/>

<LineChart data={payrollTrend} stroke="#34d399" aria-label="Payroll trend" />
```

## Don't

- Don't copy SVG circles / `items-end` bar divs into `features/*`.
- Don't add a second chart library in the mini app unless the design system adopts it.
