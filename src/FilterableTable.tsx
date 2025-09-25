import React, { useState, useMemo, useEffect } from "react";

interface TableData {
  [key: string]: string | number | Date;
}

interface FilterableTableProps {
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
  rowsPerPage = 16,
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
        columns.some((col) => {
          let cellValue = row[col];
          return String(cellValue).toLowerCase().includes(filter.toLowerCase());
        })
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

  const formatCell = (col: string, value: string | number | Date | undefined) => {
    if (value === null || value === undefined) return "";
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
      {/* Barra superiore: filtro + aggiungi */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "12px",
          gap: "12px",
          flexWrap: "wrap",
        }}
      >
        <input
          type="text"
          placeholder="Filtra..."
          value={filter}
          onChange={(e) => {
            setFilter(e.target.value);
            setCurrentPage(1);
          }}
          style={{
            flex: 1,
            minWidth: "200px",
            padding: "8px",
            borderRadius: "8px",
            border: "2px solid #1e3a8a",
            outline: "none",
          }}
        />
        <button
          onClick={onAdd}
          style={{
            padding: "8px 16px",
            borderRadius: "8px",
            border: "1px solid #10b981",
            backgroundColor: "#10b981",
            color: "#ffffff",
            fontWeight: "bold",
            cursor: "pointer",
          }}
        >
          + Aggiungi
        </button>
      </div>

      {/* Conteggio record */}
      <div style={{ marginBottom: "10px", fontSize: "14px", color: "#1e3a8a" }}>
        Record trovati: <strong>{filteredData.length}</strong>
      </div>

      {/* Tabella */}
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          backgroundColor: "white",
          borderRadius: "12px",
          overflow: "hidden",
        }}
      >
        <thead>
          <tr style={{ backgroundColor: "#f3f4f6" }}>
            {columns.map((col) => (
              <th
                key={col}
                onClick={() => handleSort(col)}
                style={{
                  padding: "12px",
                  textAlign: "left",
                  borderBottom: "2px solid #e5e7eb",
                  fontWeight: "bold",
                  color: "#1e3a8a",
                  cursor: "pointer",
                  userSelect: "none",
                }}
              >
                {col}
                {sortColumn === col && (sortDirection === "asc" ? " ▲" : " ▼")}
              </th>
            ))}
            <th
              style={{
                padding: "12px",
                textAlign: "left", // allineata a sinistra
                borderBottom: "2px solid #e5e7eb",
                fontWeight: "bold",
                color: "#1e3a8a",
              }}
            >
              Azioni
            </th>
          </tr>
        </thead>
        <tbody>
          {paginatedData.map((row, i) => (
            <tr
              key={i}
              style={{
                borderBottom: "1px solid #e5e7eb",
                backgroundColor: i % 2 === 0 ? "#ffffff" : "#f9fafb",
              }}
            >
              {columns.map((col) => (
                <td
                  key={col}
                  style={{
                    padding: "10px",
                    textAlign: "left",
                    color: "#1e3a8a",
                  }}
                >
                  {formatCell(col, row[col])}
                </td>
              ))}

              <td style={{ textAlign: "left", padding: "10px", gap: "6px" }}>
                <button
                  onClick={() => onEdit && onEdit(row)}
                  style={{
                    marginRight: "6px",
                    padding: "6px 12px",
                    borderRadius: "6px",
                    border: "1px solid #3b82f6",
                    backgroundColor: "#ffffff",
                    color: "#3b82f6",
                    cursor: "pointer",
                    fontWeight: "bold",
                  }}
                >
                  Modifica
                </button>
                <button
                  onClick={() => onDelete && onDelete(row)}
                  style={{
                    padding: "6px 12px",
                    borderRadius: "6px",
                    border: "1px solid #ef4444",
                    backgroundColor: "#ffffff",
                    color: "#ef4444",
                    cursor: "pointer",
                    fontWeight: "bold",
                  }}
                >
                  Elimina
                </button>
              </td>
            </tr>
          ))}
          {paginatedData.length === 0 && (
            <tr>
              <td
                colSpan={columns.length + 1}
                style={{
                  padding: "12px",
                  textAlign: "center",
                  color: "#6b7280",
                }}
              >
                Nessun risultato trovato
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Navigazione pagine */}
      <div
        style={{
          marginTop: "16px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          position: "relative",
          gap: "20px",
        }}
      >
        {currentPage > 1 && (
          <button
            onClick={() => setCurrentPage((p) => p - 1)}
            style={{
              padding: "8px 16px",
              borderRadius: "6px",
              border: "1px solid #3b82f6",
              backgroundColor: "#ffffff",
              color: "#3b82f6",
              cursor: "pointer",
              fontWeight: "bold",
              position: "absolute",
              left: 0,
            }}
          >
            ◀ Precedente
          </button>
        )}

        <span
          style={{
            fontSize: "14px",
            color: "#1e3a8a",
            fontWeight: "bold",
          }}
        >
          Pagina {currentPage} di {totalPages}
        </span>

        {currentPage < totalPages && (
          <button
            onClick={() => setCurrentPage((p) => p + 1)}
            style={{
              padding: "8px 16px",
              borderRadius: "6px",
              border: "1px solid #3b82f6",
              backgroundColor: "#ffffff",
              color: "#3b82f6",
              cursor: "pointer",
              fontWeight: "bold",
              position: "absolute",
              right: 0,
            }}
          >
            Successiva ▶
          </button>
        )}
      </div>
    </div>
  );
};

export default FilterableTable;
