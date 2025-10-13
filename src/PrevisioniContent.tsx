import React, { useState, useMemo } from "react";
import { Movement } from "./types";

interface Props {
  allMovements: Movement[];
}

const PrevisioniContent: React.FC<Props> = ({ allMovements }) => {
  const [toDate, setToDate] = useState<string | null>(null);
  const [result, setResult] = useState<{
    baseAmount: number;
    totalNow: number;
    totalPredicted?: number;
    daysProjected?: number;
  } | null>(null);

  const today = new Date().toISOString().split("T")[0];

  // 🔹 Filtra i movimenti fino alla data scelta
  const filteredMovements = useMemo(() => {
    return allMovements.filter((m) => !toDate || (m.date && m.date <= toDate));
  }, [allMovements, toDate]);

  // 🔹 Calcola previsioni
  const handlePrevedi = () => {
    const sorted = allMovements
      .filter((m) => m.date)
      .sort((a, b) => (a.date! > b.date! ? 1 : -1));

    if (sorted.length === 0) return;

    // Il primo movimento è il saldo iniziale
    const baseAmount = sorted[0].price ?? 0;

    // Movimenti passati (escludendo il primo)
    const pastMovements = sorted.slice(1).filter((m) => m.date && m.date <= today);

    // Somma giornaliera
    const dailyTotals: Record<string, number> = {};
    for (const m of pastMovements) {
      const day = m.date!;
      dailyTotals[day] = (dailyTotals[day] || 0) + (m.price ?? 0);
    }

    const days = Object.keys(dailyTotals).sort();
    const values = days.map((d) => dailyTotals[d]);

    // Totale attuale
    const totalNow = baseAmount + values.reduce((a, b) => a + b, 0);

    // Crescita media giornaliera
    let dailyGrowth = 0;
    if (values.length > 1) {
      const firstDate = new Date(days[0]);
      const lastDate = new Date(days[days.length - 1]);
      const diffDays = (lastDate.getTime() - firstDate.getTime()) / (1000 * 3600 * 24);
      const growth = values[values.length - 1] - values[0];
      dailyGrowth = growth / diffDays;
    }

    // 🔮 Se la data scelta è nel futuro → proiezione
    let totalPredicted = totalNow;
    let daysProjected = 0;

    if (toDate && toDate > today) {
      const futureDays =
        (new Date(toDate).getTime() - new Date(today).getTime()) / (1000 * 3600 * 24);
      totalPredicted = totalNow + dailyGrowth * futureDays;
      daysProjected = Math.round(futureDays);
    }

    setResult({
      baseAmount,
      totalNow,
      totalPredicted,
      daysProjected,
    });
  };

  const handleReset = () => {
    setToDate(null);
    setResult(null);
  };

  return (
    <div style={{ fontSize: 13, padding: 6 }}>
      {/* 🔹 Filtro: solo data di fine */}
      <div
        style={{
          display: "flex",
          gap: 12,
          flexWrap: "wrap",
          alignItems: "center",
          marginBottom: 16,
        }}
      >
        <label>Data di previsione:</label>
        <input
          type="date"
          value={toDate ?? ""}
          onChange={(e) => setToDate(e.target.value || null)}
          style={{
            padding: "6px 10px",
            border: "1px solid #d1d5db",
            borderRadius: 6,
            fontSize: 14,
          }}
        />

        <button
          onClick={handleReset}
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
          }}
        >
          Reset
        </button>

        <button
          onClick={handlePrevedi}
          disabled={!toDate || filteredMovements.length === 0}
          style={{
            marginLeft: 8,
            backgroundColor:
              !toDate || filteredMovements.length === 0 ? "#9ca3af" : "#10b981",
            color: "white",
            border: "none",
            borderRadius: 6,
            padding: "6px 14px",
            cursor:
              !toDate || filteredMovements.length === 0 ? "not-allowed" : "pointer",
            fontSize: 13,
            fontWeight: 600,
          }}
        >
          Prevedi
        </button>
      </div>

      {/* 🔹 Risultato */}
      {result && (
        <div style={{ marginTop: 16, textAlign: "left" }}>
          <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 6 }}>
            💼 Saldo iniziale: € {result.baseAmount.toFixed(2)}
          </h3>

          <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 6 }}>
            💰 Totale attuale: € {result.totalNow.toFixed(2)}
          </h3>

          {result.totalPredicted && result.totalPredicted !== result.totalNow && (
            <p style={{ fontSize: 16, fontWeight: 600, marginBottom: 6 }}>
              🔮 Previsione al {toDate}:{" "}
              <strong>€ {result.totalPredicted.toFixed(2)}</strong>{" "}
              ({result.daysProjected} giorni da oggi)
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default PrevisioniContent;
