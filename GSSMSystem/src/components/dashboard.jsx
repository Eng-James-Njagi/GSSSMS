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
  const [selectedMonth, setSelectedMonth] = useState("December");
  const [selectedYear, setSelectedYear] = useState("2024");
  
  // Add state for top juice
  const [topJuice, setTopJuice] = useState({ name: 'Loading...', quantity: 0 });

  useEffect(() => {
    if (highlightArticle) {
      const timer = setTimeout(() => setHighlightArticle(false), 1000);
      return () => clearTimeout(timer);
    }
  }, [highlightArticle]);

  // Fetch top juice when month/year changes
  useEffect(() => {
    if (selectedMonth && selectedYear) {
      fetch(`/api/top-juice?month=${selectedMonth}&year=${selectedYear}`)
        .then(res => res.json())
        .then(data => {
          setTopJuice(data);
        })
        .catch(err => {
          console.error('Failed to fetch top juice:', err);
          setTopJuice({ name: 'Error', quantity: 0 });
        });
    }
  }, [selectedMonth, selectedYear]);

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

        <div className="month-year-row">
          <select
            name="month"
            className="month-year-select"
            value={selectedMonth}
            onChange={(e) => {
              console.log('Month changed to:', e.target.value);
              setSelectedMonth(e.target.value);
            }}
          >
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
            onChange={(e) => {
              console.log('Year changed to:', e.target.value);
              setSelectedYear(e.target.value);
            }}
          >
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
          <p className="juice-name">
            {topJuice.name}
          </p>
          <p className="juice-quantity">
            Quantity: <span>{topJuice.quantity}</span>
          </p>
        </div>
      </div>
      </main>
    </div>
  );
}