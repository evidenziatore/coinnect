import React from "react";
import FilterableTable from "./FilterableTable";

const ProvenienzeTable: React.FC = () => {
  const data = [
    { Nome: "Italia", Colore: "Azzurro" },
    { Nome: "Germania", Colore: "Grigio" },
  ];

  const columns = ["Nome", "Colore"];

  return <FilterableTable data={data} columns={columns} />;
};

export default ProvenienzeTable;
