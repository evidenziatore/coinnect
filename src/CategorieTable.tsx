import React from "react";
import FilterableTable from "./FilterableTable";

const CategorieTable: React.FC = () => {
  const data = [
    { Nome: "Categoria 1", Colore: "Verde" },
    { Nome: "Categoria 2", Colore: "Giallo" },
  ];

  const columns = ["Nome", "Colore"];

  return <FilterableTable data={data} columns={columns} />;
};

export default CategorieTable;
