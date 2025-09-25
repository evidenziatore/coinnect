import React, { useState } from "react";
import CategorieTable from "./CategorieTable";
import MovimentiTable from "./MovimentiTable";
import ProdottiTable from "./ProdottiTable";
import ProvenienzeTable from "./ProvenienzeTable";
const tabs = [
  { key: "movimenti", label: "Movimenti" },
  { key: "prodotti", label: "Prodotti" },
  { key: "categorie", label: "Categorie" },
  { key: "provenienze", label: "Provenienze" },
];

const GestioneContent: React.FC = () => {
  const [activeTab, setActiveTab] = useState("movimenti");

  return (
    <div>
      {/* Barra tab */}
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

      {/* Contenuto */}
      <div>
        {activeTab === "movimenti" && <MovimentiTable />}
        {activeTab === "prodotti" && <ProdottiTable />}
        {activeTab === "categorie" && <CategorieTable />}
        {activeTab === "provenienze" && <ProvenienzeTable />}
      </div>
    </div>
  );
};

export default GestioneContent;
