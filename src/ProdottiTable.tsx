import React from "react";
import FilterableTable from "./FilterableTable";

const ProdottiTable: React.FC = () => {
  const data = [
    { Nome: "Prodotto A", Colore: "Rosso" },
    { Nome: "Prodotto B", Colore: "Blu" },
  ];

  const columns = ["Nome", "Colore"];

  return  <FilterableTable data={data} columns={columns} />;
};

export default ProdottiTable;
