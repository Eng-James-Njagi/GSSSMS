import { useState, useEffect } from "react";
import SalesTable from "./salesTable";
import StocksTable from "./stocksTable";
import ExpensesTable from "./expenses"; 
import MonthlySummaryChart from "./profitsBar";
import TopJuiceChart from "./topJuice";
import AddDataPopover from './formTable';
import { toast } from 'sonner';

export default function Dashboard() {
  const [showSalesTable, setShowSalesTable] = useState(false);
  const [showStocksTable, setShowStocksTable] = useState(false);
  const [showExpensesTable, setShowExpensesTable] = useState(false); 
  const [highlightArticle, setHighlightArticle] = useState(false);
  const [showAddPopover, setShowAddPopover] = useState(false);

  // 🔹 NEW: filter state
  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedYear, setSelectedYear] = useState("");

  useEffect(() => {
    if (highlightArticle) {
      const timer = setTimeout(() => setHighlightArticle(false), 1000);
      return () => clearTimeout(timer);
    }
  }, [highlightArticle]);

  const handleLogout = async () => {
    try {
      const response = await fetch('/api/logout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      const data = await response.json();

      if (response.ok) {
        window.location.href = '/login';
        toast.success("Successfully Logged Out");
      } else {
        toast.warning("Failed to Log Out");
      }
    } catch (error) {
      toast.error("Error occurred");
    }
  };

  return (
    <div className="View">
      <div className="sideBar">
        <h1>Gean Sugarcane Sales and Stock Management System</h1>
        <ul>
          <li onClick={() => setHighlightArticle(true)}>Dashboard</li>
          <li>Analytics</li>
        </ul>
      </div>

      <header>
        <button onClick={handleLogout}>Logout</button>

        {/* 🔹 UPDATED: controlled selects */}
        <div className="month-year-row">
          <select
            name="month"
            className="month-year-select"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
          >
            <option value="">Select Month</option>
            <option value="January">January</option>
            <option value="February">February</option>
            <option value="March">March</option>
            <option value="April">April</option>
            <option value="May">May</option>
            <option value="June">June</option>
            <option value="July">July</option>
            <option value="August">August</option>
            <option value="September">September</option>
            <option value="October">October</option>
            <option value="November">November</option>
            <option value="December">December</option>
          </select>

          <select
            name="year"
            className="month-year-select"
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
          >
            <option value="">Select Year</option>
            <option value="2024">2024</option>
            <option value="2025">2025</option>
            <option value="2026">2026</option>
          </select>
        </div>

        <div className="info-set">
          <img src="profile.jpg" />
          <h4>Madam Gean</h4>
        </div>
      </header>

      <article className={highlightArticle ? 'highlight' : ''}>
        <button onClick={() => setShowSalesTable(v => !v)}>Sales Table</button>
        <button onClick={() => setShowStocksTable(v => !v)}>Stocks Table</button>
        <button onClick={() => setShowExpensesTable(v => !v)}>Expenses Table</button>
        <button className="add-button" onClick={() => setShowAddPopover(v => !v)}>
          Add Items
        </button>
      </article>

      <main>
        <div className="chart-column">
          <section className="wrapper">
            <h2>Profit Loss Graph</h2>
            <MonthlySummaryChart
              month={selectedMonth}
              year={selectedYear}
            />
          </section>

          <section className="wrapper">
            <h2>Most Sold Juice</h2>
            <TopJuiceChart
              month={selectedMonth}
              year={selectedYear}
            />
          </section>

          <section className="wrapper">
            <SalesTable
              open={showSalesTable}
              month={selectedMonth}
              year={selectedYear}
            />

            <StocksTable
              open={showStocksTable}
              month={selectedMonth}
              year={selectedYear}
            />

            <ExpensesTable
              open={showExpensesTable}
              month={selectedMonth}
              year={selectedYear}
            />

            <AddDataPopover
              open={showAddPopover}
              onClose={() => setShowAddPopover(false)}
            />
          </section>
        </div>

        <div className="side-panel">
          <div className="facts">
            <h3>The most bought Juice</h3>
          </div>
        </div>
      </main>
    </div>
  );
}
