import React, { useState } from "react";
import CategorieTable from "./CategorieTable";
import MovimentiTable from "./MovimentiTable";
import ProdottiTable from "./ProdottiTable";
import ProvenienzeTable from "./ProvenienzeTable";
import { Category, Movement, Product, Source } from "./types";
const tabs = [
  { key: "movimenti", label: "Movimenti" },
  { key: "prodotti", label: "Prodotti" },
  { key: "categorie", label: "Categorie" },
  { key: "provenienze", label: "Provenienze" },
];

interface GestioneContentProps {
  fetchFromDb: () => void;
  movements: Movement[];
  categories: Category[];
  sources: Source[];
  products: Product[];
  userid: number;
}

const GestioneContent: React.FC<GestioneContentProps> = (
  { fetchFromDb, movements, categories, sources, products, userid }
) => {
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
        {activeTab === "movimenti" && <MovimentiTable fetchFromDb={fetchFromDb} movements={movements} products={products} categories={categories} sources={sources} userid={userid}/>}
        {activeTab === "prodotti" && <ProdottiTable fetchFromDb={fetchFromDb} products={products} />}
        {activeTab === "categorie" && <CategorieTable fetchFromDb={fetchFromDb} categories={categories} />}
        {activeTab === "provenienze" && <ProvenienzeTable fetchFromDb={fetchFromDb} sources={sources} />}
      </div>
    </div>
  );
};

export default GestioneContent;
