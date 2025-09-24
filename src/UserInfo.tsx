import React, { useState } from 'react';
import { User } from './types';
import EsportazioniContent from './EsportazioniContent';
import GestioneContent from './GestioneContent';
import StatisticheContent from './StatisticheContent';

interface UserInfoProps {
  user: User;
}

const UserInfo: React.FC<UserInfoProps> = ({ }) => {
  const [activeTab, setActiveTab] = useState("tab1");

  const tabs = ["Gestione", "Statistiche", "Esportazioni"];

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
                color: isActive ? "white" : "black",
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
        <div
          style={{
            flex: 1,
            padding: "20px",
            overflowY: "auto",
            boxSizing: "border-box",
          }}
        >
          {activeTab === "tab1" && <GestioneContent />}
          {activeTab === "tab2" && <StatisticheContent />}
          {activeTab === "tab3" && <EsportazioniContent />}
        </div>
      </div>
    </div>
  );
};

export default UserInfo;
