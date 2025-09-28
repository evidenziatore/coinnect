import React, { useState } from "react";

export type ActionType = "add" | "edit" | "delete";

export interface FieldConfig {
  key: string;
  label: string;
  type?: "text" | "number" | "date";
  value?: string | number;
  placeholder?: string;
}

export interface AzioniBaseProps {
  actionType: ActionType;
  entityName?: string;
  fields: FieldConfig[];
  onAction: (values: Record<string, any>) => void;
  onCancel: () => void;
}

const AzioniBase: React.FC<AzioniBaseProps> = ({
  actionType,
  entityName = "elemento",
  fields,
  onAction,
  onCancel,
}) => {
  const [values, setValues] = useState<Record<string, any>>(() =>
    fields.reduce((acc, f) => {
      acc[f.key] = f.value ?? "";
      return acc;
    }, {} as Record<string, any>)
  );

  const handleChange = (key: string, val: any) => {
    setValues((prev) => ({ ...prev, [key]: val }));
  };

  const actionLabels: Record<ActionType, { title: string; confirm: string }> = {
    add: { title: `Aggiungi ${entityName}`, confirm: "Aggiungi" },
    edit: { title: `Modifica ${entityName}`, confirm: "Salva" },
    delete: { title: `Elimina ${entityName}`, confirm: "Elimina" },
  };

  const { title, confirm } = actionLabels[actionType];

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        background: "rgba(0,0,0,0.25)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
      }}
    >
      <div
        style={{
          background: "#fff",
          borderRadius: 12,
          padding: "32px 28px",
          boxShadow: "0 4px 24px rgba(0,0,0,0.18)",
          minWidth: 320,
          textAlign: "center",
        }}
      >
        <h3 style={{ marginBottom: 12 }}>{title}</h3>

        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {fields.map((f) => (
            <div key={f.key} style={{ display: "flex", flexDirection: "column", textAlign: "left" }}>
              <label style={{ marginBottom: 4 }}>{f.label}</label>
              {actionType === "delete" ? (
                <span
                  style={{
                    padding: "8px",
                    borderRadius: "6px",
                    border: "1px solid #ccc",
                    backgroundColor: "#f3f3f3",
                    display: "inline-block",
                  }}
                >
                  {String(values[f.key])}
                </span>
              ) : (
                <input
                  type={f.type ?? "text"}
                  value={values[f.key]}
                  placeholder={f.placeholder}
                  onChange={(e) =>
                    handleChange(f.key, f.type === "number" ? Number(e.target.value) : e.target.value)
                  }
                  style={{
                    padding: "8px",
                    borderRadius: "6px",
                    border: "1px solid #ccc",
                    outline: "none",
                  }}
                />
              )}
            </div>
          ))}
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "18px",
            marginTop: 18,
          }}
        >
          <button
            className={actionType === "delete" ? "button-red" : "button-green"}
            onClick={() => onAction(values)}
          >
            {confirm}
          </button>
          <button className="button" onClick={onCancel}>
            Annulla
          </button>
        </div>
      </div>
    </div>
  );
};

export default AzioniBase;
