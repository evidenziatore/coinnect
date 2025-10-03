import React, { useMemo, useState } from "react";
import FilterableTable, { TableData } from "./FilterableTable";
import AzioniBase, { ActionType, FieldConfig } from "./AzioniBase";
import { Source } from "./types";
import { invoke } from "@tauri-apps/api/core";

interface ProvenienzeTableProps {
  fetchFromDb: () => void;
  sources: Source[];
}

const ProvenienzeTable: React.FC<ProvenienzeTableProps> = ({ fetchFromDb, sources }) => {
  const [modalAction, setModalAction] = useState<ActionType | null>(null);
  const [selectedSource, setSelectedSource] = useState<Source | null>(null);

  const data: TableData[] = useMemo(
    () => sources.map((s) => ({ Id: s.id, Nome: s.name ?? "", Colore: s.color ?? "" })),
    [sources]
  );
  const columns = ["Nome", "Colore"];

  const handleAdd = () => {
    setSelectedSource(null);
    setModalAction("add");
  };

  const handleEdit = (row: TableData) => {
    const source = sources.find((s) => s.id === row.Id) ?? null;
    setSelectedSource(source);
    setModalAction("edit");
  };

  const handleDelete = (row: TableData) => {
    const source = sources.find((s) => s.id === row.Id) ?? null;
    setSelectedSource(source);
    setModalAction("delete");
  };

  const handleConfirm = async (values: Record<string, any>) => {
    try {
      if (modalAction === "add") {
        await invoke("add_source", { name: values.name, color: values.color });
      } else if (modalAction === "edit" && selectedSource) {
        await invoke("edit_source", { id: selectedSource.id, name: values.name, color: values.color });
      } else if (modalAction === "delete" && selectedSource) {
        await invoke("remove_source", { id: selectedSource.id });
      }
      fetchFromDb();
      setModalAction(null);
    } catch (error) {
      console.error("Errore Tauri:", error);
    }
  };

  const fields: FieldConfig[] = [
    { key: "name", label: "Nome", value: selectedSource?.name },
    { key: "color", label: "Colore", type: "color", value: selectedSource?.color },
  ];

  return (
    <>
      <FilterableTable data={data} columns={columns} onAdd={handleAdd} onEdit={handleEdit} onDelete={handleDelete} />
      {modalAction && (
        <AzioniBase
          actionType={modalAction}
          entityName="provenienza"
          fields={fields}
          onAction={handleConfirm}
          onCancel={() => setModalAction(null)}
        />
      )}
    </>
  );
};

export default ProvenienzeTable;
