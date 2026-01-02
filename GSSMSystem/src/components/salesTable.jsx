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
      .then(res => res.json())
      .then(data => {
        setRows(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
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
            <th>Product</th>
            <th>Quantity</th>
            <th>Total</th>
          </tr>
        </thead>
       <tbody>
        {loading ? (
          <tr className="loadingRow">
            <td colSpan={3} style={{ textAlign: "center", padding: "1rem" }}>
              Loading table...
            </td>
          </tr>
        ) : rows.length === 0 ? (
          <tr className="loadingRow">
            <td colSpan={3} style={{ textAlign: "center", padding: "1rem" }}>
              No data for selected month and year
            </td>
          </tr>
        ) : (
          rows.map(r => (
            <tr key={r.id}>
              <td>{r.product}</td>
              <td>{r.quantity}</td>
              <td>{r.total}</td>
            </tr>
          ))
        )}
      </tbody>

      </table>

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
