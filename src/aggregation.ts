// aggregation.ts
import { Movement } from "./types";
type Metric = "price" | "weight" | "count";
type Entity = "product" | "category" | "source";

/**
 * formatDateToMonth: "YYYY-MM"
 */
function formatDateToMonth(dateStr?: string) {
  if (!dateStr) return null;
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return null;
  const y = d.getFullYear();
  const m = (d.getMonth() + 1).toString().padStart(2, "0");
  return `${y}-${m}`;
}

/**
 * aggregateMonthlyForEntity
 * If itemId provided => returns monthly time series for that item.
 * If itemId is null => returns totals per entity (useful for pie/top-bar).
 */
export function aggregateMonthlyForEntity(
  movements: Movement[],
  entity: Entity,
  itemId: number | null,
  metric: Metric = "price"
) {
  if (itemId != null) {
    // timeseries for one item: map month -> sum
    const map: Record<string, number> = {};
    movements.forEach((m) => {
      const matches =
        entity === "product"
          ? m.product_id === itemId
          : entity === "category"
          ? m.category_id === itemId
          : m.source_id === itemId;
      if (!matches) return;
      const month = formatDateToMonth(m.date);
      if (!month) return;
      const val = metric === "count" ? 1 : (m[metric] ?? 0);
      map[month] = (map[month] || 0) + val;
    });
    const labels = Object.keys(map).sort();
    const data = labels.map((k) => map[k]);
    return { labels, data };
  } else {
    // totals per entity across all time
    const map: Record<number, number> = {};
    movements.forEach((m) => {
      const id =
        entity === "product" ? m.product_id : entity === "category" ? m.category_id : m.source_id;
      if (id == null) return;
      const val = metric === "count" ? 1 : (m[metric] ?? 0);
      map[id] = (map[id] || 0) + val;
    });
    return map; // caller will map ids -> names
  }
}

/**
 * topNFromMap: given id->value map and id->name map, returns sorted arrays
 */
export function topNFromMap(
  map: Record<number, number>,
  idToName: (id: number) => string,
  n: number
): { labels: string[]; values: number[]; ids: number[] } {
  const sorted = Object.entries(map)
    .sort((a, b) => b[1] - a[1])
    .slice(0, n);
  return {
    labels: sorted.map(([id]) => idToName(Number(id))),
    values: sorted.map(([_, val]) => val),
    ids: sorted.map(([id]) => Number(id)),
  };
}
