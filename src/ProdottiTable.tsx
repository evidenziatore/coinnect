import React, { useMemo, useState } from "react";
import FilterableTable, { TableData } from "./FilterableTable";
import AzioniBase, { ActionType, FieldConfig } from "./AzioniBase";
import { Product } from "./types";

interface ProdottiTableProps {
  fetchFromDb: () => void;
  products: Product[];
}

const ProdottiTable: React.FC<ProdottiTableProps> = ({ fetchFromDb, products }) => {
  const [modalAction, setModalAction] = useState<ActionType | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const data: TableData[] = useMemo(
    () => products.map((p) => ({ Nome: p.name ?? "", Colore: p.color ?? "" })),
    [products]
  );
  const columns = ["Nome", "Colore"];

  const handleAdd = () => {
    setSelectedProduct(null);
    setModalAction("add");
  };

  const handleEdit = (row: TableData) => {
    const product = products.find((p) => p.name === row.Nome && p.color === row.Colore) ?? null;
    setSelectedProduct(product);
    setModalAction("edit");
  };

  const handleDelete = (row: TableData) => {
    const product = products.find((p) => p.name === row.Nome && p.color === row.Colore) ?? null;
    setSelectedProduct(product);
    setModalAction("delete");
  };

  const handleConfirm = (values: Record<string, any>) => {
    // Qui puoi chiamare createProduct/updateProduct/deleteProduct
    fetchFromDb();
    setModalAction(null);
  };

  const fields: FieldConfig[] = [
    { key: "name", label: "Nome", value: selectedProduct?.name },
    { key: "color", label: "Colore", value: selectedProduct?.color },
  ];

  return (
    <>
      <FilterableTable data={data} columns={columns} onAdd={handleAdd} onEdit={handleEdit} onDelete={handleDelete} />
      {modalAction && (
        <AzioniBase
          actionType={modalAction}
          entityName="prodotto"
          fields={fields}
          onAction={handleConfirm}
          onCancel={() => setModalAction(null)}
        />
      )}
    </>
  );
};

export default ProdottiTable;
