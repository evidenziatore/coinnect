import React, { useMemo, useState } from "react";
import FilterableTable, { TableData } from "./FilterableTable";
import AzioniBase, { ActionType, FieldConfig } from "./AzioniBase";
import { Movement, Product, Category, Source } from "./types";
import { invoke } from "@tauri-apps/api/core";

interface MovimentiTableProps {
  fetchFromDb: () => void;
  movements: Movement[];
  products: Product[];
  categories: Category[];
  sources: Source[];
  userid: number;
}

const MovimentiTable: React.FC<MovimentiTableProps> = ({
  fetchFromDb,
  movements,
  products,
  categories,
  sources,
  userid,
}) => {
  const [modalAction, setModalAction] = useState<ActionType | null>(null);
  const [selectedMovement, setSelectedMovement] = useState<Movement | null>(null);

  const data: TableData[] = useMemo(
    () =>
      movements.map((m) => ({
        Prodotto: m.product?.name ?? "",
        Categoria: m.category?.name ?? "",
        Provenienza: m.source?.name ?? "",
        Peso: m.weight === 0 ? "/" : m.weight,
        Prezzo: m.price != null ? (m.price > 0 ? `+${m.price}` : `${m.price}`) : "0",
        Data: (m.date ?? "").replace(/-/g, "/").substring(0, 10),
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
    );
    setSelectedMovement(movement ?? null);
    setModalAction("edit");
  };

  const handleDelete = (row: TableData) => {
    const movement = movements.find(
      (m) =>
        (m.product?.name ?? "") === row.Prodotto &&
        (m.category?.name ?? "") === row.Categoria &&
        (m.source?.name ?? "") === row.Provenienza
    );
    setSelectedMovement(movement ?? null);
    setModalAction("delete");
  };

  const handleConfirm = async (values: Record<string, any>) => {
    try {
      if (modalAction === "add") {
        await invoke("add_movement", {
          userid: userid,
          productid: Number(values.product),
          categoryid: Number(values.category),
          sourceid: Number(values.source),
          weight: Number(values.weight),
          price: Number(values.price),
          date: values.date || null,
        });
      } else if (modalAction === "edit" && selectedMovement) {
        await invoke("edit_movement", {
          id: selectedMovement.id,
          productid: Number(values.product),
          categoryid: Number(values.category),
          sourceid: Number(values.source),
          weight: Number(values.weight),
          price: Number(values.price),
          date: values.date || null,
        });
      } else if (modalAction === "delete" && selectedMovement) {
        await invoke("remove_movement", { id: selectedMovement.id });
      }
      fetchFromDb();
      setModalAction(null);
    } catch (error) {
      console.error("Errore Tauri:", error);
    }
  };

  const fields: FieldConfig[] = [
    {
      key: "product",
      label: "Prodotto",
      type: "select",
      value: selectedMovement?.product?.id,
      options: products.map((p) => ({ label: p.name, value: p.id })),
    },
    {
      key: "category",
      label: "Categoria",
      type: "select",
      value: selectedMovement?.category?.id,
      options: categories.map((c) => ({ label: c.name, value: c.id })),
    },
    {
      key: "source",
      label: "Provenienza",
      type: "select",
      value: selectedMovement?.source?.id,
      options: sources.map((s) => ({ label: s.name, value: s.id })),
    },
    { key: "weight", label: "Peso", type: "number", value: selectedMovement?.weight },
    { key: "price", label: "Prezzo", type: "number", value: selectedMovement?.price },
    { key: "date", label: "Data", type: "date", value: selectedMovement?.date },
  ];

  return (
    <>
      <FilterableTable
        data={data}
        columns={columns}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
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
