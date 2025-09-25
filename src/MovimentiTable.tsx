import React, { useMemo } from "react";
import FilterableTable from "./FilterableTable";
import { Movement } from "./types";

interface MovimentiTableProps {
  fetchFromDb: () => void,
  movements: Movement[],
}

const MovimentiTable: React.FC<MovimentiTableProps> = (
  { fetchFromDb, movements }
) => {
  const data = useMemo(
    () =>
    movements.map(m => ({
      Prodotto: m.product?.name ?? "",
      Categoria: m.category?.name ?? "",
      Provenienza: m.source?.name ?? "",
      Peso: m.weight ?? 0,
      Prezzo: m.price ?? 0,
      Data: (m.date ?? "").replace(/-/g, "/"),
  })),
    [movements] // si ricrea solo se cambia products
  );

  const columns = ["Prodotto", "Categoria", "Provenienza", "Prezzo", "Peso", "Data"];

  const onEdit = async () => {
    fetchFromDb();
  };

  const onDelete = async () => {
    fetchFromDb();
  };

  const onAdd = async () => {
    fetchFromDb();
  };

  return <FilterableTable data={data} columns={columns} onEdit={onEdit} onDelete={onDelete} onAdd={onAdd} />;
};

export default MovimentiTable;
