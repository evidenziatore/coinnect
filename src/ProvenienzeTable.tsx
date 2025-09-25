import React, { useMemo } from "react";
import FilterableTable from "./FilterableTable";
import { Source } from "./types";

interface ProvenienzaTableProps {
  fetchFromDb: () => void,
  sources: Source[],
}

const ProvenienzeTable: React.FC<ProvenienzaTableProps> = (
  { fetchFromDb, sources }
) => {
  const data = useMemo(
    () =>
    sources.map(s => ({
      Nome: s.name ?? "",
      Colore: s?.color ?? "",
    })),
    [sources] // si ricrea solo se cambia products
  );

  const columns = ["Nome", "Colore"];

  return <FilterableTable data={data} columns={columns} />;
};

export default ProvenienzeTable;
