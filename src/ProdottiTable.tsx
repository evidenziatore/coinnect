import React, { useMemo } from "react";
import FilterableTable from "./FilterableTable";
import { Product } from "./types";

interface ProdottiTableProps {
  fetchFromDb: () => void,
  products: Product[],
}

const ProdottiTable: React.FC<ProdottiTableProps> = (
  { fetchFromDb, products }
) => {
  const data = useMemo(
    () =>
      products.map(p => ({
        Nome: p.name ?? "",
        Colore: p.color ?? "",
      })),
    [products] // si ricrea solo se cambia products
  );

  const columns = ["Nome", "Colore"];

  return  <FilterableTable data={data} columns={columns} />;
};

export default ProdottiTable;
