import React, { useState, useMemo } from "react";
import Select, { MultiValue } from "react-select";
import * as XLSX from "xlsx";
import { Movement, Product, Category, Source } from "./types";

interface Props {
  allMovements: Movement[];
  products: Product[];
  categories: Category[];
  sources: Source[];
}

const EsportazioniContent: React.FC<Props> = ({ allMovements, products, categories, sources }) => {
  const [selectedProducts, setSelectedProducts] = useState<number[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
  const [selectedSources, setSelectedSources] = useState<number[]>([]);
  const [dateRange, setDateRange] = useState<{ from: string | null; to: string | null }>({ from: null, to: null });

  const productOptions = products.map(p => ({ value: p.id, label: p.name })).sort((a, b) => a.label.localeCompare(b.label));
  const categoryOptions = categories.map(c => ({ value: c.id, label: c.name })).sort((a, b) => a.label.localeCompare(b.label));
  const sourceOptions = sources.map(s => ({ value: s.id, label: s.name })).sort((a, b) => a.label.localeCompare(b.label));

  // 🔹 Filtra i movimenti
  const filteredMovements = useMemo(() => {
    return allMovements.filter(m => {
      const productOk = selectedProducts.length === 0 || selectedProducts.includes(m.product_id);
      const categoryOk = selectedCategories.length === 0 || selectedCategories.includes(m.category_id);
      const sourceOk = selectedSources.length === 0 || selectedSources.includes(m.source_id);
      const fromOk = !dateRange.from || (m.date && m.date >= dateRange.from);
      const toOk = !dateRange.to || (m.date && m.date <= dateRange.to);
      return productOk && categoryOk && sourceOk && fromOk && toOk;
    });
  }, [allMovements, selectedProducts, selectedCategories, selectedSources, dateRange]);

  // 🔹 Esporta i movimenti in Excel
  const handleExport = async () => {
    if (!filteredMovements.length) return;

    // 🔹 Mappa i movimenti
    const dataToExport = filteredMovements.map(m => ({
      Data: m.date,
      Prodotto: products.find(p => p.id === m.product_id)?.name ?? `#${m.product_id}`,
      Categoria: categories.find(c => c.id === m.category_id)?.name ?? `#${m.category_id}`,
      Provenienza: sources.find(s => s.id === m.source_id)?.name ?? `#${m.source_id}`,
      Prezzo: m.price ?? 0,
      Peso: m.weight ?? 0,
    }));

    // 🔹 Aggiungi riga totale
    const totalePrezzo = filteredMovements.reduce((sum, m) => sum + (m.price ?? 0), 0);
    const totalePeso = filteredMovements.reduce((sum, m) => sum + (m.weight ?? 0), 0);
    dataToExport.push({
      Data: "Totale",
      Prodotto: "",
      Categoria: "",
      Provenienza: "",
      Prezzo: totalePrezzo,
      Peso: totalePeso,
    });

    // 🔹 Crea foglio Excel
    const ws = XLSX.utils.json_to_sheet(dataToExport);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Movimenti");

    const wbout = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const blob = new Blob([wbout], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });

    if ("showSaveFilePicker" in window) {
      try {
        const handle = await (window as any).showSaveFilePicker({
          suggestedName: "movimenti.xlsx",
          types: [
            {
              description: "Excel file",
              accept: { "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [".xlsx"] },
            },
          ],
        });
        const writable = await handle.createWritable();
        await writable.write(blob);
        await writable.close();
      } catch (err) {
        console.error("Salvataggio annullato o fallito:", err);
      }
    } else {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "movimenti.xlsx";
      a.click();
      window.URL.revokeObjectURL(url);
    }
  };


  const handleResetFilters = () => {
    setSelectedProducts([]);
    setSelectedCategories([]);
    setSelectedSources([]);
    setDateRange({ from: null, to: null });
  };

  // 🔹 Prepara preview in stile Excel
  const excelPreview = useMemo(() => {
    return filteredMovements.map(m => [
      m.date,
      products.find(p => p.id === m.product_id)?.name ?? `#${m.product_id}`,
      categories.find(c => c.id === m.category_id)?.name ?? `#${m.category_id}`,
      sources.find(s => s.id === m.source_id)?.name ?? `#${m.source_id}`,
      m.price,
      m.weight ?? ""
    ]);
  }, [filteredMovements, products, categories, sources]);

  return (
    <div style={{ fontSize: 13, padding: 6 }}>
      {/* 🔹 Filtri */}
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center", marginBottom: 16 }}>
        <label>Prodotti:</label>
        <div style={{ minWidth: 200 }}>
          <Select
            isMulti
            options={productOptions}
            value={productOptions.filter(o => selectedProducts.includes(o.value))}
            onChange={(v: MultiValue<{ value: number; label: string }>) => setSelectedProducts(v.map(x => x.value))}
            placeholder="Seleziona prodotti..."
            closeMenuOnSelect={false}
          />
        </div>

        <label>Categorie:</label>
        <div style={{ minWidth: 200 }}>
          <Select
            isMulti
            options={categoryOptions}
            value={categoryOptions.filter(o => selectedCategories.includes(o.value))}
            onChange={(v: MultiValue<{ value: number; label: string }>) => setSelectedCategories(v.map(x => x.value))}
            placeholder="Seleziona categorie..."
            closeMenuOnSelect={false}
          />
        </div>

        <label>Provenienze:</label>
        <div style={{ minWidth: 200 }}>
          <Select
            isMulti
            options={sourceOptions}
            value={sourceOptions.filter(o => selectedSources.includes(o.value))}
            onChange={(v: MultiValue<{ value: number; label: string }>) => setSelectedSources(v.map(x => x.value))}
            placeholder="Seleziona provenienze..."
            closeMenuOnSelect={false}
          />
        </div>

        <label>Intervallo:</label>
        <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
          <input
            type="date"
            value={dateRange.from ?? ""}
            onChange={e => setDateRange(prev => ({ ...prev, from: e.target.value || null }))}
            style={{ padding: "6px 10px", border: "1px solid #d1d5db", borderRadius: 6, fontSize: 14 }}
          />
          <span>–</span>
          <input
            type="date"
            value={dateRange.to ?? ""}
            onChange={e => setDateRange(prev => ({ ...prev, to: e.target.value || null }))}
            style={{ padding: "6px 10px", border: "1px solid #d1d5db", borderRadius: 6, fontSize: 14 }}
          />
        </div>

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

        <button
          className="button-green"
          onClick={handleExport}
          disabled={filteredMovements.length === 0}
          style={{
            marginLeft: 8,
            borderRadius: 6,
            padding: "6px 14px",
            cursor: filteredMovements.length ? "pointer" : "not-allowed",
          }}
        >
          Esporta
        </button>
      </div>

      {/* 🔹 Preview stile Excel aggiornato */}
      <div style={{ maxHeight: 400, overflow: "auto", border: "1px solid #d1d5db", borderRadius: 6 }}>
        {filteredMovements.length > 0 ? (
          <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: "monospace" }}>
            <thead style={{ backgroundColor: "#d9ead3" /* verde chiaro Excel */ }}>
              <tr>
                {["Data", "Prodotto", "Categoria", "Provenienza", "Prezzo", "Peso"].map((h, i) => (
                  <th key={i} style={{ padding: 6, borderBottom: "1px solid #b6d7a8", textAlign: "left" }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {excelPreview.map((row, idx) => (
                <tr
                  key={idx}
                  style={{
                    backgroundColor: idx % 2 === 0 ? "#ffffff" : "#f3f3f3", // righe alternate come Excel
                    borderBottom: "1px solid #e5e7eb"
                  }}
                >
                  {row.map((cell, i) => (
                    <td key={i} style={{ padding: 6, textAlign: "left" }}>{cell}</td>
                  ))}
                </tr>
              ))}
              {/* Riga totale */}
              <tr style={{ backgroundColor: "#ffe599", fontWeight: 600 }}>
                <td style={{ padding: 6 }}>Totale</td>
                <td colSpan={3}></td>
                <td style={{ padding: 6, textAlign: "left" }}>
                  {filteredMovements.reduce((sum, m) => sum + (m.price ?? 0), 0).toFixed(2)}
                </td>
                <td style={{ padding: 6, textAlign: "left" }}>
                  {filteredMovements.reduce((sum, m) => sum + (m.weight ?? 0), 0).toFixed(2)}
                </td>
              </tr>
            </tbody>
          </table>
        ) : (
          <div style={{ padding: 12, textAlign: "center", color: "#6b7280" }}>
            Nessun movimento corrisponde ai filtri selezionati
          </div>
        )}
      </div>
    </div>
  );
};

export default EsportazioniContent;
