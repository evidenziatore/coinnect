import React, { useState, useMemo, useEffect } from "react";

export interface TableData {
  [key: string]: string | number | Date | null | undefined;
}

export interface FilterableTableProps {
  data: TableData[];
  columns: string[];
  rowsPerPage?: number;
  onEdit?: (row: TableData) => void;
  onDelete?: (row: TableData) => void;
  onAdd?: () => void;
}

const FilterableTable: React.FC<FilterableTableProps> = ({
  data,
  columns,
  rowsPerPage = 7,
  onEdit,
  onDelete,
  onAdd,
}) => {
  const [filter, setFilter] = useState("");
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [currentPage, setCurrentPage] = useState(1);

  const filteredData = useMemo(
    () =>
      data.filter((row) =>
        columns.some((col) =>
          String(row[col] ?? "").toLowerCase().includes(filter.toLowerCase())
        )
      ),
    [data, filter, columns]
  );

  const sortedData = useMemo(() => {
    if (!sortColumn) return filteredData;
    return [...filteredData].sort((a, b) => {
      const valA = a[sortColumn];
      const valB = b[sortColumn];
      if (typeof valA === "number" && typeof valB === "number") {
        return sortDirection === "asc" ? valA - valB : valB - valA;
      }
      return sortDirection === "asc"
        ? String(valA).localeCompare(String(valB))
        : String(valB).localeCompare(String(valA));
    });
  }, [filteredData, sortColumn, sortDirection]);

  const totalPages = Math.max(1, Math.ceil(sortedData.length / rowsPerPage));
  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(totalPages);
    if (currentPage < 1) setCurrentPage(1);
  }, [totalPages, currentPage]);

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * rowsPerPage;
    return sortedData.slice(start, start + rowsPerPage);
  }, [sortedData, currentPage, rowsPerPage]);

  const handleSort = (col: string) => {
    if (sortColumn === col) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortColumn(col);
      setSortDirection("asc");
    }
  };

  const formatCell = (col: string, value: string | number | Date | null | undefined) => {
    if (value === null || value === undefined) return "";

    // Se la colonna contiene "Colore", mostra quadratino
    if (col.toLowerCase().includes("colore") && typeof value === "string") {
      return (
        <div
          style={{
            width: 20,
            height: 20,
            borderRadius: 4,
            backgroundColor: value,
            border: "1px solid #ccc",
          }}
        />
      );
    }

    if (col.toLowerCase().includes("date")) {
      const date = new Date(value);
      if (!isNaN(date.getTime())) {
        return date.toLocaleDateString("it-IT", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        });
      }
    }

    return String(value);
  };

  return (
    <div style={{ width: "100%" }}>
      {/* Filtro e pulsante aggiungi */}
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12, gap: 12, flexWrap: "wrap" }}>
        <input
          type="text"
          placeholder="Filtra..."
          value={filter}
          onChange={(e) => { setFilter(e.target.value); setCurrentPage(1); }}
          style={{ flex: 1, minWidth: 200, padding: 8, borderRadius: 8, border: "2px solid #1e3a8a", outline: "none" }}
        />
        {onAdd && (
          <button
            onClick={onAdd}
            style={{ padding: "8px 16px", borderRadius: 8, border: "1px solid #10b981", backgroundColor: "#10b981", color: "#fff", fontWeight: "bold", cursor: "pointer" }}
          >
            + Aggiungi
          </button>
        )}
      </div>

      {/* Numero record */}
      <div style={{ marginBottom: 10, fontSize: 14, color: "#1e3a8a" }}>
        Record trovati: <strong>{filteredData.length}</strong>
      </div>

      {/* Tabella */}
      <table style={{ width: "100%", borderCollapse: "collapse", backgroundColor: "white", borderRadius: 12, overflow: "hidden" }}>
        <thead>
          <tr style={{ backgroundColor: "#f3f4f6" }}>
            {columns.map((col) => (
              <th
                key={col}
                onClick={() => handleSort(col)}
                style={{ padding: 12, textAlign: "left", borderBottom: "2px solid #e5e7eb", fontWeight: "bold", color: "#1e3a8a", cursor: "pointer", userSelect: "none" }}
              >
                {col} {sortColumn === col && (sortDirection === "asc" ? "▲" : "▼")}
              </th>
            ))}
            {(onEdit || onDelete) && <th style={{ padding: 12, textAlign: "left", borderBottom: "2px solid #e5e7eb", fontWeight: "bold", color: "#1e3a8a" }}>Azioni</th>}
          </tr>
        </thead>
        <tbody>
          {paginatedData.map((row, i) => (
            <tr key={i} style={{ borderBottom: "1px solid #e5e7eb", backgroundColor: i % 2 === 0 ? "#fff" : "#f9fafb" }}>
              {columns.map((col) => (
                <td key={col} style={{ padding: 10, textAlign: "left", color: "#1e3a8a" }}>
                  {formatCell(col, row[col])}
                </td>
              ))}
              {(onEdit || onDelete) && (
                <td style={{ textAlign: "left", padding: 10, display: "flex", gap: 6 }}>
                  {onEdit && (
                    <button
                      onClick={() => onEdit(row)}
                      style={{ padding: "6px 12px", borderRadius: 6, border: "1px solid #3b82f6", backgroundColor: "#fff", color: "#3b82f6", cursor: "pointer", fontWeight: "bold" }}
                    >
                      Modifica
                    </button>
                  )}
                  {onDelete && (
                    <button
                      onClick={() => onDelete(row)}
                      style={{ padding: "6px 12px", borderRadius: 6, border: "1px solid #ef4444", backgroundColor: "#fff", color: "#ef4444", cursor: "pointer", fontWeight: "bold" }}
                    >
                      Elimina
                    </button>
                  )}
                </td>
              )}
            </tr>
          ))}
          {paginatedData.length === 0 && (
            <tr>
              <td colSpan={columns.length + ((onEdit || onDelete) ? 1 : 0)} style={{ padding: 12, textAlign: "center", color: "#6b7280" }}>
                Nessun risultato trovato
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Paginazione */}
      <div style={{ marginTop: 16, display: "flex", justifyContent: "center", alignItems: "center", gap: 20, position: "relative" }}>
        {currentPage > 1 && (
          <button onClick={() => setCurrentPage((p) => p - 1)} style={{ padding: "8px 16px", borderRadius: 6, border: "1px solid #3b82f6", backgroundColor: "#fff", color: "#3b82f6", cursor: "pointer", fontWeight: "bold", position: "absolute", left: 0 }}>
            ◀ Precedente
          </button>
        )}
        <span style={{ fontSize: 14, color: "#1e3a8a", fontWeight: "bold" }}>Pagina {currentPage} di {totalPages}</span>
        {currentPage < totalPages && (
          <button onClick={() => setCurrentPage((p) => p + 1)} style={{ padding: "8px 16px", borderRadius: 6, border: "1px solid #3b82f6", backgroundColor: "#fff", color: "#3b82f6", cursor: "pointer", fontWeight: "bold", position: "absolute", right: 0 }}>
            Successiva ▶
          </button>
        )}
      </div>
    </div>
  );
};

export default FilterableTable;
