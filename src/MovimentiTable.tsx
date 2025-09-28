import React, { useMemo, useState } from "react";
import FilterableTable, { TableData } from "./FilterableTable";
import AzioniBase, { ActionType, FieldConfig } from "./AzioniBase";
import { Movement } from "./types";

interface MovimentiTableProps {
  fetchFromDb: () => void;
  movements: Movement[];
}

const MovimentiTable: React.FC<MovimentiTableProps> = ({ fetchFromDb, movements }) => {
  const [modalAction, setModalAction] = useState<ActionType | null>(null);
  const [selectedMovement, setSelectedMovement] = useState<Movement | null>(null);

  const data: TableData[] = useMemo(
    () =>
      movements.map((m) => ({
        Prodotto: m.product?.name ?? "",
        Categoria: m.category?.name ?? "",
        Provenienza: m.source?.name ?? "",
        Peso: m.weight ?? 0,
        Prezzo: m.price != null ? (m.price > 0 ? `+${m.price}` : `${m.price}`) : "0",
        Data: (m.date ?? "").replace(/-/g, "/"),
      })),
    [movements]
  );

  const columns = ["Prodotto", "Categoria", "Provenienza", "Prezzo", "Peso", "Data"];

  const handleAdd = () => {
    setSelectedMovement(null);
    setModalAction("add");
  };

  const handleEdit = (row: TableData) => {
    const movement = movements.find(
      (m) =>
        (m.product?.name ?? "") === row.Prodotto &&
        (m.category?.name ?? "") === row.Categoria &&
        (m.source?.name ?? "") === row.Provenienza
    ) ?? null;
    setSelectedMovement(movement);
    setModalAction("edit");
  };

  const handleDelete = (row: TableData) => {
    const movement = movements.find(
      (m) =>
        (m.product?.name ?? "") === row.Prodotto &&
        (m.category?.name ?? "") === row.Categoria &&
        (m.source?.name ?? "") === row.Provenienza
    ) ?? null;
    setSelectedMovement(movement);
    setModalAction("delete");
  };

  const handleConfirm = (values: Record<string, any>) => {
    fetchFromDb();
    setModalAction(null);
  };

  const fields: FieldConfig[] = [
    { key: "product", label: "Prodotto", value: selectedMovement?.product?.name },
    { key: "category", label: "Categoria", value: selectedMovement?.category?.name },
    { key: "source", label: "Provenienza", value: selectedMovement?.source?.name },
    { key: "weight", label: "Peso", type: "number", value: selectedMovement?.weight },
    { key: "price", label: "Prezzo", type: "number", value: selectedMovement?.price },
    { key: "date", label: "Data", type: "date", value: selectedMovement?.date },
  ];

  return (
    <>
      <FilterableTable data={data} columns={columns} onAdd={handleAdd} onEdit={handleEdit} onDelete={handleDelete} />
      {modalAction && (
        <AzioniBase
          actionType={modalAction}
          entityName="movimento"
          fields={fields}
          onAction={handleConfirm}
          onCancel={() => setModalAction(null)}
        />
      )}
    </>
  );
};

export default MovimentiTable;
