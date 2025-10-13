import React, { useState, useEffect, useRef } from "react";
import { HexColorPicker } from "react-colorful";

export type ActionType = "add" | "edit" | "delete";

interface FieldOption {
  value: string | number;
  label: string;
}

export interface FieldConfig {
  key: string;
  label: string;
  type?: "text" | "number" | "date" | "select" | "color";
  placeholder?: string;
  value?: string | number;
  options?: FieldOption[];
}

interface AzioniBaseProps {
  actionType: ActionType;
  onAction: (values: Record<string, any>) => void;
  onCancel: () => void;
  entityName?: string;
  message?: string;
  fields?: FieldConfig[];
}

const AzioniBase: React.FC<AzioniBaseProps> = ({
  actionType,
  onAction,
  onCancel,
  entityName = "elemento",
  message,
  fields = [],
}) => {
  const actionLabels: Record<ActionType, { title: string; confirm: string }> = {
    add: { title: `Aggiungi ${entityName}`, confirm: "Aggiungi" },
    edit: { title: `Modifica ${entityName}`, confirm: "Salva" },
    delete: { title: `Elimina ${entityName}`, confirm: "Elimina" },
  };

  const { title, confirm } = actionLabels[actionType];
  const [values, setValues] = useState<Record<string, any>>({});
  const [searchText, setSearchText] = useState<Record<string, string>>({});
  const [colorPickersOpen, setColorPickersOpen] = useState<Record<string, boolean>>({});
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [isFormValid, setIsFormValid] = useState(false);

  useEffect(() => {
    const valid = fields.every((f) => {
      if (f.key === "weight") return true;
      const val = values[f.key];
      if (f.type === "number") return val !== undefined && val !== null && val !== "";
      return String(val).trim() !== "";
    });
    setIsFormValid(valid);
  }, [values, fields]);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const dropdownRefs = useRef<Record<string, HTMLDivElement | null>>({});

  useEffect(() => {
    const initialValues: Record<string, any> = {};
    const initialSearch: Record<string, string> = {};
    const initialPickers: Record<string, boolean> = {};

    fields.forEach((f) => {
      if (f.type === "date" && f.value) {
        const d = new Date(f.value);
        initialValues[f.key] = !isNaN(d.getTime())
          ? d.toISOString().slice(0, 10)
          : "";
      } else {
        initialValues[f.key] = f.value ?? (f.type === "color" ? "#000000" : "");
      }

      if (f.type === "select" && f.options) {
        const selectedLabel =
          f.options.find((o) => String(o.value) === String(f.value))?.label || "";
        initialSearch[f.key] = selectedLabel;
      }

      if (f.type === "color") initialPickers[f.key] = false;
    });

    setValues(initialValues);
    setSearchText(initialSearch);
    setColorPickersOpen(initialPickers);
  }, [fields, actionType]);

  useEffect(() => {
    const handleDocumentClick = (event: MouseEvent) => {
      if (!openDropdown) return;

      const activeWrapper = dropdownRefs.current[openDropdown];
      if (!activeWrapper) {
        setOpenDropdown(null);
        return;
      }

      if (!activeWrapper.contains(event.target as Node)) {
        const field = fields.find((f) => f.key === openDropdown);
        if (field?.type === "select" && field.options) {
          const selectedLabel =
            field.options.find(
              (o) => String(o.value) === String(values[openDropdown])
            )?.label || "";
          setSearchText((prev) => ({ ...prev, [openDropdown]: selectedLabel }));
        }
        setOpenDropdown(null);
      }
    };

    document.addEventListener("mousedown", handleDocumentClick);
    return () => document.removeEventListener("mousedown", handleDocumentClick);
  }, [openDropdown, values, fields]);

  const handleChange = (key: string, value: any) => {
    setValues((prev) => ({ ...prev, [key]: value }));
  };

  const toggleColorPicker = (key: string) => {
    setColorPickersOpen((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const generateRandomColor = () => {
    return `#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, "0")}`;
  };

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
        ref={containerRef}
        style={{
          background: "#fff",
          borderRadius: 12,
          padding: "32px 28px",
          boxShadow: "0 4px 24px rgba(0,0,0,0.18)",
          minWidth: 360,
          textAlign: "center",
          maxHeight: "90vh",
          overflowY: "auto",
        }}
      >
        <h3 style={{ marginBottom: 12 }}>{title}</h3>
        {message && <p style={{ marginBottom: 18 }}>{message}</p>}

        {fields.map((f) => (
          <div key={f.key} style={{ marginBottom: 16, textAlign: "left" }}>
            <label
              style={{
                display: "block",
                marginBottom: 6,
                fontWeight: "bold",
                color: "#1e3a8a",
              }}
            >
              {f.label}
            </label>

            {actionType === "delete" ? (
              f.type === "color" ? (
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: 4,
                      border: "1px solid #ccc",
                      backgroundColor: values[f.key] || "#000000",
                    }}
                  />
                  <span>{values[f.key]}</span>
                </div>
              ) : (
                <span
                  style={{
                    padding: "8px",
                    borderRadius: "6px",
                    border: "1px solid #ccc",
                    backgroundColor: "#f3f3f3",
                    display: "inline-block",
                    width: "100%",
                  }}
                >
                  {f.type === "select" && f.options
                    ? f.options.find(
                        (opt) => String(opt.value) === String(values[f.key])
                      )?.label
                    : String(values[f.key])}
                </span>
              )
            ) : f.type === "select" && f.options ? (
              <div
                ref={(el) => void (dropdownRefs.current[f.key] = el)}
                style={{ position: "relative" }}
              >
                <input
                  type="text"
                  placeholder="Cerca..."
                  value={searchText[f.key] ?? ""}
                  onFocus={() => setOpenDropdown(f.key)}
                  onChange={(e) => {
                    setSearchText((prev) => ({ ...prev, [f.key]: e.target.value }));
                    setOpenDropdown(f.key);
                  }}
                  style={{
                    padding: "8px",
                    borderRadius: "6px",
                    border: "1px solid #ccc",
                    outline: "none",
                    width: "100%",
                  }}
                />

                {openDropdown === f.key && (
                  <div
                    style={{
                      position: "absolute",
                      top: "100%",
                      left: 0,
                      right: 0,
                      maxHeight: 150,
                      overflowY: "auto",
                      border: "1px solid #ccc",
                      borderRadius: "6px",
                      background: "#fff",
                      zIndex: 200,
                      marginTop: 6,
                    }}
                  >
                    {f.options
                      .slice()
                      .sort((a, b) => a.label.localeCompare(b.label))
                      .filter((opt) =>
                        opt.label
                          .toLowerCase()
                          .includes((searchText[f.key] ?? "").toLowerCase())
                      )
                      .map((opt) => (
                        <div
                          key={opt.value}
                          onClick={() => {
                            handleChange(f.key, opt.value);
                            setSearchText((prev) => ({ ...prev, [f.key]: opt.label }));
                            setOpenDropdown(null);
                          }}
                          style={{
                            padding: "8px",
                            cursor: "pointer",
                            background:
                              String(opt.value) === String(values[f.key])
                                ? "#e5f3ff"
                                : "white",
                          }}
                        >
                          {opt.label}
                        </div>
                      ))}
                  </div>
                )}
              </div>
            ) : f.type === "color" ? (
              <div style={{ position: "relative", display: "flex", alignItems: "center", gap: 8 }}>
                <button
                  type="button"
                  onClick={() => toggleColorPicker(f.key)}
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 4,
                    border: "1px solid #ccc",
                    backgroundColor: values[f.key] || "#000000",
                    cursor: "pointer",
                  }}
                />
                <span>{values[f.key]}</span>

                <span
                  onClick={() => handleChange(f.key, generateRandomColor())}
                  style={{
                    cursor: "pointer",
                    fontSize: "2.0rem", // dimensione dell'icona
                    userSelect: "none",
                  }}
                  title="Colore casuale"
                >
                  🔀
                </span>

                {colorPickersOpen[f.key] && (
                  <div
                    style={{
                      position: "relative",
                      zIndex: 100,
                      marginTop: 20,
                      marginBottom: 20,
                    }}
                  >
                    <HexColorPicker
                      color={values[f.key]}
                      onChange={(color: string) => handleChange(f.key, color)}
                    />
                  </div>
                )}
              </div>
            ) : (
              <input
                type={f.type ?? "text"}
                value={values[f.key]}
                placeholder={f.placeholder}
                onChange={(e) =>
                  handleChange(
                    f.key,
                    f.type === "number" ? Number(e.target.value) : e.target.value
                  )
                }
                style={{
                  padding: "8px",
                  borderRadius: "6px",
                  border: "1px solid #ccc",
                  outline: "none",
                  width: "100%",
                }}
              />
            )}
          </div>
        ))}

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "18px",
            marginTop: 24,
          }}
        >
          <button
            className={actionType === "delete" ? "button-red" : "button-green"}
            onClick={() => onAction(values)}
            disabled={actionType !== "delete" && !isFormValid}
            style={{
              opacity: actionType !== "delete" && !isFormValid ? 0.5 : 1,
              cursor: actionType !== "delete" && !isFormValid ? "not-allowed" : "pointer",
            }}
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
