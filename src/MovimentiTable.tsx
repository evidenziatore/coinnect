import FilterableTable from "./FilterableTable";

const MovimentiTable: React.FC = () => {
  // 👉 questi dati poi li prenderai da API collegate al DB
  const data = [
  { Prodotto: 103, Categoria: 6, Provenienza: 2, Peso: 80, Prezzo: 200, Data: "2023-09-02" },
  { Prodotto: 104, Categoria: 6, Provenienza: 2, Peso: 85, Prezzo: -150, Data: "2023-09-03" },
  { Prodotto: 105, Categoria: 7, Provenienza: 3, Peso: 90, Prezzo: 220, Data: "2023-09-04" },
  { Prodotto: 106, Categoria: 6, Provenienza: 1, Peso: 70, Prezzo: -180, Data: "2023-09-05" },
  { Prodotto: 107, Categoria: 5, Provenienza: 4, Peso: 60, Prezzo: 250, Data: "2023-09-06" },
  { Prodotto: 108, Categoria: 6, Provenienza: 2, Peso: 75, Prezzo: -200, Data: "2023-09-07" },
  { Prodotto: 109, Categoria: 6, Provenienza: 2, Peso: 80, Prezzo: 190, Data: "2023-09-08" },
  { Prodotto: 110, Categoria: 6, Provenienza: 2, Peso: 85, Prezzo: -170, Data: "2023-09-09" },
  { Prodotto: 111, Categoria: 7, Provenienza: 3, Peso: 90, Prezzo: 210, Data: "2023-09-10" },
  { Prodotto: 112, Categoria: 6, Provenienza: 1, Peso: 70, Prezzo: -160, Data: "2023-09-11" },
  { Prodotto: 112, Categoria: 6, Provenienza: 1, Peso: 70, Prezzo: -160, Data: "2023-09-11" },
  { Prodotto: 112, Categoria: 6, Provenienza: 1, Peso: 70, Prezzo: -160, Data: "2023-09-11" },
  { Prodotto: 112, Categoria: 6, Provenienza: 1, Peso: 70, Prezzo: -160, Data: "2023-09-11" },
  { Prodotto: 112, Categoria: 6, Provenienza: 1, Peso: 70, Prezzo: -160, Data: "2023-09-11" },
  { Prodotto: 112, Categoria: 6, Provenienza: 1, Peso: 70, Prezzo: -160, Data: "2023-09-11" },
  { Prodotto: 112, Categoria: 6, Provenienza: 1, Peso: 70, Prezzo: -160, Data: "2023-09-11" },
  { Prodotto: 112, Categoria: 6, Provenienza: 1, Peso: 70, Prezzo: -160, Data: "2023-09-11" },
  { Prodotto: 112, Categoria: 6, Provenienza: 1, Peso: 70, Prezzo: -160, Data: "2023-09-11" },
  ];

  const columns = ["Prodotto", "Categoria", "Provenienza", "Prezzo", "Peso", "Data"];

  return <FilterableTable data={data} columns={columns} />;
};

export default MovimentiTable;
