import React, { useMemo, useState } from "react";
import { Movement, Product, Category, Source } from "./types";
import LineChart from "./LineChart";
import PieChart from "./PieChart";
import BarChart from "./BarChart";
import Select, { MultiValue } from "react-select";
import { topNFromMap } from "./aggregation";

const tabs = [
  { key: "prodotti", label: "Prodotti", entity: "product" as const },
  { key: "categorie", label: "Categorie", entity: "category" as const },
  { key: "provenienze", label: "Provenienze", entity: "source" as const },
];

const metricLabels = {
  price: "Prezzo (somma)",
  count: "Conteggio movimenti",
};

const granularityOptions = [
  { value: "day", label: "Giorno" },
  { value: "month", label: "Mese" },
  { value: "year", label: "Anno" },
];

interface Props {
  allMovements: Movement[];
  products: Product[];
  categories: Category[];
  sources: Source[];
}

const StatisticheContent: React.FC<Props> = ({
  allMovements,
  products,
  categories,
  sources,
}) => {
  const [activeTab, setActiveTab] = useState<typeof tabs[number]["key"]>(
    "prodotti"
  );
  const [selectedIdsMap, setSelectedIdsMap] = useState<
    Record<string, number[]>
  >({
    prodotti: [],
    categorie: [],
    provenienze: [],
  });
  const [metric, setMetric] = useState<"price" | "count">("price");
  const [granularity, setGranularity] = useState<"day" | "month" | "year">(
    "day"
  );

  // 🔹 Filtro per intervallo di tempo
  const [dateRange, setDateRange] = useState<{
    from: string | null;
    to: string | null;
  }>({
    from: null,
    to: null,
  });

  const currentEntity = tabs.find((t) => t.key === activeTab)!.entity;
  const items =
    currentEntity === "product"
      ? products
      : currentEntity === "category"
      ? categories
      : sources;

  const options = items
    .map((it) => ({ value: it.id, label: it.name }))
    .sort((a, b) => a.label.localeCompare(b.label));

  const metricOptions = [
    { value: "price", label: metricLabels.price },
    { value: "count", label: metricLabels.count },
  ];

  const idToName = (id: number) =>
    items.find((it) => it.id === id)?.name ?? `#${id}`;
  const idToColor = (id: number) =>
    items.find((it) => it.id === id)?.color ?? "#2563eb";

  const entityIdKeyMap: Record<typeof currentEntity, keyof Movement> = {
    product: "product_id",
    category: "category_id",
    source: "source_id",
  };
  const entityIdKey = entityIdKeyMap[currentEntity];

  const selectedIds = selectedIdsMap[activeTab] || [];

  const handleSelectChange = (
    newValue: MultiValue<{ value: number; label: string }>
  ) => {
    const values = newValue.map((s) => s.value);
    setSelectedIdsMap((prev) => ({
      ...prev,
      [activeTab]: values,
    }));
  };

  // 🔹 Funzione reset filtri
  const handleResetFilters = () => {
    setSelectedIdsMap({ prodotti: [], categorie: [], provenienze: [] });
    setMetric("price");
    setGranularity("day");
    setDateRange({ from: null, to: null });
  };

  const { timeLabels, datasets, distLabels, distValues, distColors } =
    useMemo(() => {
      const filteredMovements = allMovements.filter((m) => {
        if (!m.date) return false;

        const movementDate = m.date.slice(0, 10); // YYYY-MM-DD

        const fromDate = dateRange.from ?? null; // YYYY-MM-DD o null
        const toDate = dateRange.to ?? null;     // YYYY-MM-DD o null

        const fromOk = !fromDate || movementDate >= fromDate;
        const toOk = !toDate || movementDate <= toDate;

        return fromOk && toOk;
      });

      const labelMapPerId: Record<number, Record<string, number>> = {};
      const allLabelsSet = new Set<string>();

      const formatLabel = (dateStr?: string) => {
        if (!dateStr) return "";
        const d = new Date(dateStr);
        switch (granularity) {
          case "day":
            return dateStr.slice(0, 10);
          case "month":
            return `${d.getFullYear()}-${(d.getMonth() + 1)
              .toString()
              .padStart(2, "0")}`;
          case "year":
            return `${d.getFullYear()}`;
          default:
            return "";
        }
      };

      filteredMovements.forEach((m) => {
        const label = formatLabel(m.date);
        const val = metric === "count" ? 1 : m[metric] ?? 0;
        const id = selectedIds.length === 0 ? 0 : (m[entityIdKey] as number);

        if (selectedIds.length === 0 || selectedIds.includes(id)) {
          labelMapPerId[id] = labelMapPerId[id] || {};
          labelMapPerId[id][label] =
            (labelMapPerId[id][label] || 0) + val;
        }

        allLabelsSet.add(label);
      });

      const sortedLabels = Array.from(allLabelsSet).sort();

      const datasets =
        selectedIds.length > 0
          ? selectedIds.map((id) => {
              let cumulative = 0;
              return {
                id,
                label: idToName(id),
                data: sortedLabels.map((l) => {
                  cumulative += labelMapPerId[id]?.[l] ?? 0;
                  return cumulative;
                }),
                fill: false,
                tension: 0.2,
                borderColor: idToColor(id),
                backgroundColor: idToColor(id) + "33",
              };
            })
          : (() => {
              let cumulative = 0;
              return [
                {
                  label: `Totale ${metricLabels[metric]}`,
                  data: sortedLabels.map((l) => {
                    cumulative += labelMapPerId[0]?.[l] ?? 0;
                    return cumulative;
                  }),
                  borderColor: "#2563eb",
                  backgroundColor: "#2563eb33",
                  fill: false,
                  tension: 0.2,
                },
              ];
            })();

      const distLabels: string[] = [];
      const distValues: number[] = [];
      const distColors: string[] = [];

      if (selectedIds.length === 0) {
        const absAggregateMap: Record<number, number> = {};

        // 🔹 Ordina per data crescente
        const sorted = [...filteredMovements].sort((a, b) =>
          (a.date ?? "").localeCompare(b.date ?? "")
        );

        // 🔹 Escludi il primo movimento (saldo iniziale)
        const movementsForPie = sorted.slice(1);

        // 🔹 Calcolo aggregato sui movimenti rimanenti
        movementsForPie.forEach((m) => {
          const id = m[entityIdKey] as number;
          const val = metric === "count" ? 1 : Math.abs(m[metric] ?? 0);
          absAggregateMap[id] = (absAggregateMap[id] || 0) + val;
        });

        // 🔹 Costruzione topN + "Altro" escluso primo movimento
        const top = topNFromMap(absAggregateMap, (id) => idToName(id), 10);
        let altroTotal = 0;
        Object.keys(absAggregateMap).forEach((idStr) => {
          const id = Number(idStr);
          if (!top.ids.includes(id)) {
            const realVal = movementsForPie
              .filter((m) => (m[entityIdKey] as number) === id)
              .reduce(
                (sum, m) => sum + (metric === "count" ? 1 : m[metric] ?? 0),
                0
              );
            altroTotal += realVal;
          }
        });

        top.ids.forEach((id, i) => {
          const realVal = movementsForPie
            .filter((m) => (m[entityIdKey] as number) === id)
            .reduce(
              (sum, m) => sum + (metric === "count" ? 1 : m[metric] ?? 0),
              0
            );
          distLabels.push(top.labels[i]);
          distValues.push(realVal);
          distColors.push(idToColor(id));
        });

        if (altroTotal !== 0) {
          distLabels.push("Altro");
          distValues.push(altroTotal);
          distColors.push("#000000");
        }
      }

      return { timeLabels: sortedLabels, datasets, distLabels, distValues, distColors };
    }, [
      allMovements,
      currentEntity,
      selectedIds,
      metric,
      granularity,
      dateRange,
      products,
      categories,
      sources,
    ]);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: "top" as const },
      tooltip: { mode: "index" as const, intersect: false },
    },
    scales: {
      x: {
        ticks: {
          autoSkip: true,
          maxTicksLimit:
            granularity === "day"
              ? 15
              : granularity === "month"
              ? 12
              : 10,
        },
      },
      y: { beginAtZero: true },
    },
  };

  return (
    <div style={{ fontSize: 13, padding: 6 }}>
      {/* Tabs */}
      <div style={{ display: "flex", marginBottom: "16px", gap: "8px" }}>
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            style={{
              padding: "6px 20px",
              border: "none",
              borderBottom:
                activeTab === tab.key
                  ? "4px solid #2563eb"
                  : "4px solid transparent",
              background: "none",
              cursor: "pointer",
              fontSize: "16px",
              fontWeight: activeTab === tab.key ? "bold" : "normal",
              color: activeTab === tab.key ? "#2563eb" : "#374151",
              transition: "all 0.2s ease",
              lineHeight: "1.2",
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Filtri */}
      <div
        style={{
          display: "flex",
          gap: 12,
          alignItems: "center",
          marginBottom: 16,
          flexWrap: "wrap",
        }}
      >
        <label>
          <strong>{tabs.find((x) => x.key === activeTab)!.label}:</strong>
        </label>
        <div style={{ minWidth: 250 }}>
          <Select
            options={options}
            isMulti
            value={options.filter((o) => selectedIds.includes(o.value))}
            onChange={handleSelectChange}
            placeholder="Seleziona..."
            closeMenuOnSelect={false}
          />
        </div>

        <label>Metrica:</label>
        <div style={{ minWidth: 200 }}>
          <Select
            options={metricOptions}
            value={metricOptions.find((m) => m.value === metric)}
            onChange={(selected) =>
              setMetric(selected!.value as "price" | "count")
            }
            placeholder="Seleziona metrica..."
            isClearable={false}
          />
        </div>

        <label>Granularità:</label>
        <div style={{ minWidth: 150 }}>
          <Select
            options={granularityOptions}
            value={granularityOptions.find((g) => g.value === granularity)}
            onChange={(selected) =>
              setGranularity(selected!.value as "day" | "month" | "year")
            }
            placeholder="Seleziona granularità..."
            isClearable={false}
          />
        </div>

        {/* 🔹 Intervallo date ingrandito */}
        <label>Intervallo:</label>
        <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
          <input
            type="date"
            value={dateRange.from ?? ""}
            onChange={(e) =>
              setDateRange((prev) => ({ ...prev, from: e.target.value || null }))
            }
            style={{
              padding: "6px 10px",
              border: "1px solid #d1d5db",
              borderRadius: 6,
              fontSize: 14,
            }}
          />
          <span>–</span>
          <input
            type="date"
            value={dateRange.to ?? ""}
            onChange={(e) =>
              setDateRange((prev) => ({ ...prev, to: e.target.value || null }))
            }
            style={{
              padding: "6px 10px",
              border: "1px solid #d1d5db",
              borderRadius: 6,
              fontSize: 14,
            }}
          />
        </div>

        {/* 🔹 Pulsante di reset */}
        <button
          onClick={handleResetFilters}
          style={{
            marginLeft: 8,
            backgroundColor: "#3b82f6",
            color: "white",
            border: "none",
            borderRadius: 6,
            padding: "6px 14px",
            cursor: "pointer",
            fontSize: 13,
            fontWeight: 600,
            transition: "background 0.2s ease",
          }}
        >
          Reset filtri
        </button>
      </div>

      {/* Charts */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 10 }}>
        {selectedIds.length > 0 ? (
          <div style={{ minHeight: 220 }}>
            <h4 style={{ margin: "4px 0 6px 0", fontSize: 13 }}>
              {selectedIds.map((id) => idToName(id)).join(", ")} — andamento{" "}
              {metricLabels[metric]}
            </h4>
            <LineChart
              labels={timeLabels}
              datasets={datasets}
              title={`Andamento ${metricLabels[metric]}`}
              options={chartOptions}
            />
          </div>
        ) : (
          <>
            <div style={{ minHeight: 200 }}>
              <h4 style={{ margin: "4px 0 6px 0", fontSize: 13 }}>
                Distribuzione
              </h4>
              <PieChart
                labels={distLabels}
                values={distValues}
                colors={distColors}
                title={`Distribuzione ${metricLabels[metric]}`}
              />
            </div>

            <div style={{ minHeight: 220 }}>
              <h4 style={{ margin: "6px 0 6px 0", fontSize: 13 }}>
                Andamento totale ({metricLabels[metric]})
              </h4>
              <BarChart
                labels={timeLabels}
                datasets={datasets}
                title={`Andamento totale ${metricLabels[metric]}`}
                height={220}
                options={{
                  scales: {
                    x: { stacked: false },
                    y: { beginAtZero: true },
                  },
                  plugins: {
                    legend: { position: "top" },
                    tooltip: { mode: "index", intersect: false },
                  },
                }}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default StatisticheContent;
