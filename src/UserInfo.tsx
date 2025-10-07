import React, { useEffect, useState } from 'react';
import { Category, Movement, Product, Source, User } from './types';
import EsportazioniContent from './EsportazioniContent';
import GestioneContent from './GestioneContent';
import StatisticheContent from './StatisticheContent';
import { invoke } from '@tauri-apps/api/core';
import ConfrontiContent from './ConfrontiContent';

interface UserInfoProps {
  user: User;
}

const UserInfo: React.FC<UserInfoProps> = ({ user}) => {
  const [activeTab, setActiveTab] = useState("tab1");
  const [movements, setMovements] = useState<Movement[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [sources, setSources] = useState<Source[]>([]);
  const [products, setProducts] = useState<Product[]>([]);

  const fetchMovements = async () => {
    const categories = (await invoke<Category[]>('list_categories')) || [];
    setCategories(categories);

    const sources = (await invoke<Source[]>('list_sources')) || [];
    setSources(sources);

    const products = (await invoke<Product[]>('list_products')) || [];
    setProducts(products);

    let movements = (await invoke<Movement[]>('list_movements_by_user', { userid: user.id })) || [];
    movements = movements.map(m => ({
      ...m,
      category: categories.find(c => c.id === m.category_id),
      source: sources.find(s => s.id === m.source_id),
      product: products.find(p => p.id === m.product_id),
    }));
    setMovements(movements);
  };

  useEffect(() => { fetchMovements(); }, []);

  const tabs = ["Gestione", "Statistiche", "Confronti", "Esportazioni"];

  return (
    <div style={{ display: "flex", height: "85vh" }}>
      {/* Sidebar verticale */}
      <div
        style={{
          backgroundColor: "#fafbfc",
          display: "flex",
          flexDirection: "column",
          padding: "10px",
          boxSizing: "border-box",
        }}
      >
        {tabs.map((tabLabel, index) => {
          const tabKey = `tab${index + 1}`;
          const isActive = activeTab === tabKey;

          return (
            <button
              key={tabKey}
              onClick={() => setActiveTab(tabKey)}
              style={{
                display: "block",
                width: isActive ? "109%" : "100%",
                padding: "12px",
                marginBottom: "6px",
                marginTop: index === 0 ? "-10px" : "0",
                borderTopLeftRadius: isActive ? (index === 0 ? "24px" : "0px") : "0",
                borderBottomLeftRadius: isActive ? (index === tabs.length - 1 ? "24px" : "0px") : "0",
                backgroundColor: isActive ? "#cce8ff" : "#d1d5db",
                color: isActive ? "#2563eb" : "black",
                border: "none",
                cursor: "pointer",
                fontSize: "18px",
                fontWeight: "bold",
                textAlign: "left",
                boxSizing: "border-box",
              }}
            >
              {tabLabel}
            </button>
          );
        })}
      </div>

      {/* Contenuto */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          backgroundColor: "#cce8ff",
          borderTopRightRadius: "24px",
          borderBottomRightRadius: "24px",
          marginRight: "12px",
          overflow: "hidden",
        }}
      >
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          height: '90%',
          overflowY: 'auto',
          padding: 20,
          boxSizing: 'border-box'
        }}>
          {activeTab === "tab1" && <GestioneContent fetchFromDb={fetchMovements} movements={movements} categories={categories} sources={sources} products={products} userid={user.id} />}
          {activeTab === "tab2" && <StatisticheContent allMovements={movements} products={products} categories={categories} sources={sources} />}
          {activeTab === "tab3" && <ConfrontiContent allMovements={movements} products={products} categories={categories} sources={sources} />}
          {activeTab === "tab4" && <EsportazioniContent/>}
        </div>
      </div>
    </div>
  );
};

export default UserInfo;
