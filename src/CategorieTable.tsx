import React, { useMemo, useState } from "react";
import FilterableTable, { TableData } from "./FilterableTable";
import AzioniBase, { ActionType, FieldConfig } from "./AzioniBase";
import { Category } from "./types";

interface CategorieTableProps {
  fetchFromDb: () => void;
  categories: Category[];
}

const CategorieTable: React.FC<CategorieTableProps> = ({ fetchFromDb, categories }) => {
  const [modalAction, setModalAction] = useState<ActionType | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);

  const data: TableData[] = useMemo(
    () => categories.map((c) => ({ Nome: c.name ?? "", Colore: c.color ?? "" })),
    [categories]
  );
  const columns = ["Nome", "Colore"];

  const handleAdd = () => {
    setSelectedCategory(null);
    setModalAction("add");
  };

  const handleEdit = (row: TableData) => {
    const category = categories.find((c) => c.name === row.Nome && c.color === row.Colore) ?? null;
    setSelectedCategory(category);
    setModalAction("edit");
  };

  const handleDelete = (row: TableData) => {
    const category = categories.find((c) => c.name === row.Nome && c.color === row.Colore) ?? null;
    setSelectedCategory(category);
    setModalAction("delete");
  };

  const handleConfirm = (values: Record<string, any>) => {
    fetchFromDb();
    setModalAction(null);
  };

  const fields: FieldConfig[] = [
    { key: "name", label: "Nome", value: selectedCategory?.name },
    { key: "color", label: "Colore", value: selectedCategory?.color },
  ];

  return (
    <>
      <FilterableTable data={data} columns={columns} onAdd={handleAdd} onEdit={handleEdit} onDelete={handleDelete} />
      {modalAction && (
        <AzioniBase
          actionType={modalAction}
          entityName="categoria"
          fields={fields}
          onAction={handleConfirm}
          onCancel={() => setModalAction(null)}
        />
      )}
    </>
  );
};

export default CategorieTable;
