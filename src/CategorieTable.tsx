import React, { useMemo } from "react";
import FilterableTable from "./FilterableTable";
import { Category } from "./types";

interface CategorieTableProps {
  fetchFromDb: () => void,
  categories: Category[],
}

const CategorieTable: React.FC<CategorieTableProps> = (
  { fetchFromDb, categories }
) => {
  const data = useMemo(
    () =>
    categories.map(c => ({
      Nome: c.name ?? "",
      Colore: c?.color ?? "",
    })),
    [categories] // si ricrea solo se cambia products
  );

  const columns = ["Nome", "Colore"];

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

export default CategorieTable;
