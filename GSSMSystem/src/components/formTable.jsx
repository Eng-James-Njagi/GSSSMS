import { useState, useRef } from "react";

export default function AddDataPopover({ open, onClose }) {
  const [selectedTable, setSelectedTable] = useState("");
  const [formValues, setFormValues] = useState({});
  const [confirmSwitch, setConfirmSwitch] = useState(null); // new table to confirm
  const prevTableRef = useRef("");

  if (!open) return null;

  const tableFields = {
    "Expenses Table": [
      { name: "item", type: "text" },
      { name: "category", type: "text" },
      { name: "quantity", type: "number" },
      { name: "unit", type: "text" },
      { name: "amount", type: "number" },
      { name: "expense_date", type: "date" },
      { name: "expense_type", type: "text" },
    ],
    "Product Table": [
      { name: "prod_Name", type: "text" },
      { name: "category", type: "text" },
      { name: "QM", type: "number" },
      { name: "UM", type: "text" },
      { name: "Amount", type: "number" },
      { name: "PT", type: "text" },
      { name: "Date", type: "date" },
    ],
    "Stocks Table": [
      { name: "Item", type: "text" },
      { name: "Category", type: "text" },
      { name: "PQ", type: "number" },
      { name: "IQ", type: "number" },
      { name: "Metrics", type: "text" },
    ],
  };

  const handleChange = (field, value) => {
    setFormValues(prev => ({ ...prev, [field]: value }));
  };

  const handleTableChange = (e) => {
    const newTable = e.target.value;

    if (prevTableRef.current && prevTableRef.current !== newTable) {
      setConfirmSwitch(newTable); 
      return;
    }

    setSelectedTable(newTable);
    setFormValues({});
    prevTableRef.current = newTable;
  };

  const confirmTableSwitch = () => {
    if (!confirmSwitch) return;

    setSelectedTable(confirmSwitch);
    setFormValues({});
    prevTableRef.current = confirmSwitch;
    setConfirmSwitch(null);
  };

  const cancelTableSwitch = () => {
    setConfirmSwitch(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      table: selectedTable,
      data: formValues
    };
    console.log("Payload to send:", payload);
    // fetch("/api/add-data", { method: "POST", body: JSON.stringify(payload), headers: {"Content-Type":"application/json"} })
    //here is where i was to add the api endpoint but supabase requires a subscription
    onClose();
  };
  const DataForm = () => {
    toast.success("Data Passed")
  }

  return (
    <div className="popoverWrapper">
      <div className="popoverContent">
        <button className="closeBtn" onClick={onClose}>×</button>
        <h3>Add Data</h3>

        <div className="field">
          <label>Select Table</label>
          <select value={selectedTable} onChange={handleTableChange}>
            <option value="">-- Select Table --</option>
            {Object.keys(tableFields).map(table => (
              <option key={table} value={table}>{table}</option>
            ))}
          </select>
        </div>

        {confirmSwitch && (
          <div className="confirmationBox">
            <p>
              You are switching from <strong>{prevTableRef.current}</strong> 
              to <strong>{confirmSwitch}</strong>. Unsaved data will be cleared.
            </p>
            <div className="confirmationButtons">
              <button type="button" onClick={confirmTableSwitch}>OK</button>
              <button type="button" onClick={cancelTableSwitch}>Cancel</button>
            </div>
          </div>
        )}

        {selectedTable && !confirmSwitch && (
          <form onSubmit={handleSubmit}>
            {tableFields[selectedTable].map(field => (
              <div className="field" key={field.name}>
                <label>{field.name}</label>
                <input
                  type={field.type}
                  value={formValues[field.name] || ""}
                  onChange={e => handleChange(field.name, e.target.value)}
                />
              </div>
            ))}
            <button 
            type="submit" 
            onClick={DataForm}
            className="submitBtn">Add</button>
          </form>
        )}
      </div>
    </div>
  );
}
