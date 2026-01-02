import { useState, useEffect } from "react";

export default function ExpensesTable({ open }) {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!open || loaded) return;

    setLoading(true);
    fetch("/api/expenses-table")
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setRows(data);
          setLoaded(true);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [open, loaded]);

  if (!open) return null;

  return (
    <div className="salesTableWrapper">
      <table className="sales-table">
        <thead>
          <tr>
            <th>Item</th>
            <th>Category</th>
            <th>Quantity</th>
            <th>Unit</th>
            <th>Amount</th>
            <th>Date</th>
            <th>Type</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr className="loadingRow">
              <td colSpan={7} style={{ textAlign: "center", padding: "1rem" }}>
                Loading table...
              </td>
            </tr>
          ) : (
            rows.map(r => (
              <tr key={r.id}>
                <td>{r.item}</td>
                <td>{r.category}</td>
                <td>{r.quantity}</td>
                <td>{r.unit}</td>
                <td>{r.amount}</td>
                <td>{r.date}</td>
                <td>{r.type}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* Scoped CSS for placeholder */}
      <style jsx>{`
        .loadingRow {
          color: #555;
          font-style: italic;
          background: rgba(0,0,0,0.02);
        }
      `}</style>
    </div>
  );
}
