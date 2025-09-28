import React, { useMemo, useState } from "react";
import FilterableTable, { TableData } from "./FilterableTable";
import AzioniBase, { ActionType, FieldConfig } from "./AzioniBase";
import { Category } from "./types";
import { invoke } from "@tauri-apps/api/core";

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

  const handleConfirm = async (values: Record<string, any>) => {
    try {
      if (modalAction === "add") {
        await invoke("add_category", { name: values.name, color: values.color });
      } else if (modalAction === "edit" && selectedCategory) {
        await invoke("edit_category", { id: selectedCategory.id, name: values.name, color: values.color });
      } else if (modalAction === "delete" && selectedCategory) {
        await invoke("remove_category", { id: selectedCategory.id });
      }
      fetchFromDb();
      setModalAction(null);
    } catch (error) {
      console.error("Errore Tauri:", error);
    }
  };

  const fields: FieldConfig[] = [
    { key: "name", label: "Nome", value: selectedCategory?.name },
    { key: "color", label: "Colore", type: "color", value: selectedCategory?.color },
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
