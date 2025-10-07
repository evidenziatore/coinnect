import React, { useMemo, useState } from "react";
import { Movement, Product, Category, Source } from "./types";
import BarChart from "./BarChart";
import Select from "react-select";

interface Props {
  allMovements: Movement[];
  products: Product[];
  categories: Category[];
  sources: Source[];
}

const ConfrontiContent: React.FC<Props> = ({ allMovements, products, categories, sources }) => {
  // 🔹 Tabs
  const tabs = [
    { key: "prodotti", label: "Prodotti", entity: "product" as const },
    { key: "categorie", label: "Categorie", entity: "category" as const },
  ];

  const [activeTab, setActiveTab] = useState<"prodotti" | "categorie">("prodotti");
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const currentEntity: "product" | "category" = tabs.find(t => t.key === activeTab)!.entity;
  const items = currentEntity === "product" ? products : categories;

  // 🔹 Filtra solo prodotti/categorie presenti in più di una provenienza
  const filteredItems = useMemo(() => {
    return items.filter(item => {
      const sourcesSet = new Set(
        allMovements
          .filter(m => (currentEntity === "product" ? m.product_id === item.id : m.category_id === item.id))
          .map(m => m.source_id)
          .filter(Boolean)
      );
      return sourcesSet.size > 1;
    });
  }, [items, allMovements, currentEntity]);

  const options = filteredItems
    .map(i => ({ value: i.id, label: i.name }))
    .sort((a, b) => a.label.localeCompare(b.label));

  // 🔹 Funzioni utili
  const idToName = (id: number, type: "product" | "category" | "source") => {
    if (type === "product") return products.find(p => p.id === id)?.name ?? `#${id}`;
    if (type === "category") return categories.find(c => c.id === id)?.name ?? `#${id}`;
    return sources.find(s => s.id === id)?.name ?? `#${id}`;
  };

  const idToColor = (id: number, type: "product" | "category" | "source") => {
    if (type === "product") return products.find(p => p.id === id)?.color ?? "#2563eb";
    if (type === "category") return categories.find(c => c.id === id)?.color ?? "#2563eb";
    return sources.find(s => s.id === id)?.color ?? "#2563eb";
  };

  // 🔹 Calcolo dataset con media ponderata
  const { labels, values, colors } = useMemo(() => {
    if (selectedId === null) return { labels: [], values: [], colors: [] };

    const map: Record<number, { totalWeighted: number; totalWeight: number }> = {};

    allMovements.forEach(m => {
      const id = currentEntity === "product" ? m.product_id : m.category_id;
      if (id !== selectedId) return;
      if (m.source_id === undefined || m.price === undefined) return;

      const weight = m.weight && m.weight > 0 ? m.weight : 1; // default weight = 1

      if (!map[m.source_id]) map[m.source_id] = { totalWeighted: 0, totalWeight: 0 };
      map[m.source_id].totalWeighted += m.price * weight;
      map[m.source_id].totalWeight += weight;
    });

    const sourceIds = Object.keys(map).map(Number);
    const labels = sourceIds.map(id => idToName(id, "source"));
    const values = sourceIds.map(id => map[id].totalWeighted / map[id].totalWeight);
    const colors = sourceIds.map(id => idToColor(id, "source"));

    return { labels, values, colors };
  }, [allMovements, selectedId, currentEntity]);

  const datasets = labels.map((label, i) => ({
    label,
    data: [values[i]],
    backgroundColor: colors[i],
  }));

  // 🔹 Prodotti confrontabili per categorie
  const productsInCategory = useMemo(() => {
    if (currentEntity !== "category" || selectedId === null) return [];

    const movementsInCat = allMovements.filter(
      m => m.category_id === selectedId && m.source_id && m.price !== undefined
    );

    const prodToSources: Record<number, Set<number>> = {};
    movementsInCat.forEach(m => {
      if (!prodToSources[m.product_id!]) prodToSources[m.product_id!] = new Set();
      prodToSources[m.product_id!].add(m.source_id!);
    });

    // Consideriamo solo i prodotti presenti in più provenienze
    return Object.entries(prodToSources)
      .filter(([_, sourcesSet]) => sourcesSet.size > 1)
      .map(([prodId]) => products.find(p => p.id === Number(prodId))?.name)
      .filter(Boolean) as string[];
  }, [currentEntity, selectedId, allMovements, products]);

  return (
    <div style={{ fontSize: 13, padding: 6 }}>
      {/* Tabs */}
      <div style={{ display: "flex", gap: "8px", marginBottom: "16px" }}>
        {tabs.map(tab => (
          <button
            key={tab.key}
            onClick={() => { setActiveTab(tab.key as "prodotti" | "categorie"); setSelectedId(null); }}
            style={{
              padding: "6px 20px",
              border: "none",
              borderBottom: activeTab === tab.key ? "4px solid #2563eb" : "4px solid transparent",
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

      {/* Selezione */}
      <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 16, flexWrap: "wrap" }}>
        <label>{currentEntity === "product" ? "Prodotto" : "Categoria"}:</label>
        <div style={{ minWidth: 250 }}>
          <Select
            options={options}
            value={options.find(o => o.value === selectedId) || null}
            onChange={v => setSelectedId(v ? v.value : null)}
            placeholder={`Seleziona ${currentEntity === "product" ? "prodotto" : "categoria"}...`}
            isClearable
          />
        </div>
      </div>

      {/* Prodotti confrontabili per categorie */}
      {currentEntity === "category" && selectedId !== null && productsInCategory.length > 0 && (
        <div style={{ marginBottom: 16, color: "#6b7280", fontStyle: "italic" }}>
          Prodotti confrontabili: {productsInCategory.join(", ")}
        </div>
      )}

      {/* Grafico */}
      {selectedId !== null && datasets.length > 0 ? (
        <div style={{ minHeight: 300 }}>
          <BarChart
            labels={["Prezzo medio ponderato"]}
            datasets={datasets}
            title={`Confronto per fonte (Prezzo medio ponderato)`}
            height={300}
          />
        </div>
      ) : (
        <div style={{ padding: 20, color: "#6b7280", fontStyle: "italic" }}>
          Seleziona {currentEntity === "product" ? "un prodotto" : "una categoria"} per visualizzare il grafico.
        </div>
      )}
    </div>
  );
};

export default ConfrontiContent;
