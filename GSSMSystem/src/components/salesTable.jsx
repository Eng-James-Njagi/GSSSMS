import { useState, useEffect } from "react";

export default function SalesTable({ open, month, year }) {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open) return;

    if (!month || !year) {
      setRows([]);
      return;
    }

    setLoading(true);
    setRows([]);

    fetch(`/api/monthly-sales-products?month=${month}&year=${year}`)
      .then(res => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then(data => {
        // Ensure data is an array before setting
        setRows(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(err => {
        console.error('Fetch error:', err);
        setRows([]);
        setLoading(false);
      });
  }, [open, month, year]);

  if (!open) return null;

  return (
    <div className="salesTableWrapper">
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Product</th>
            <th>Category</th>
            <th>Quantity</th>
            <th>Unit</th>
            <th>Amount</th>
            <th>Payment Type</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr className="loadingRow">
              <td colSpan={7} style={{ textAlign: "center", padding: "1rem" }}>
                Loading table...
              </td>
            </tr>
          ) : rows.length === 0 ? (
            <tr className="loadingRow">
              <td colSpan={7} style={{ textAlign: "center", padding: "1rem" }}>
                No data for selected month and year
              </td>
            </tr>
          ) : (
            rows.map(r => (
              <tr key={r.id}>
                <td>{r.id}</td>
                <td>{r.product}</td>
                <td>{r.category}</td>
                <td>{r.quantity}</td>
                <td>{r.unit}</td>
                <td>{r.total}</td>
                <td>{r.paymentType}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      <style>{`
        .loadingRow {
          color: #555;
          font-style: italic;
          background: rgba(0,0,0,0.02);
        }
      `}</style>
    </div>
  );
}