import { useEffect, useState } from "react"
import { toast } from "sonner"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from "recharts"

export default function MonthlySummaryChart() {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem("accessToken")
    setLoading(true)
    toast.info("Loading chart data...")

    fetch("/api/monthly-sales")
      .then(r => {
        if (r.status === 401) {
          localStorage.removeItem("accessToken")
          window.location.href = "/LogIn"
          return
        }
        return r.json()
      })
      .then(rawData => {
        if (!rawData) return
        const transformed = rawData.map(item => ({
          month: new Date(item.date).toLocaleString("default", { month: "short" }),
          profit: item.profit
        }))
        setData(transformed)
        setLoading(false)
      })
      .catch(err => {
        console.error(err)
        toast.error("Failed to load chart data")
        setLoading(false)
      })
  }, [])

  return (
    <div style={{ width: "100%", height: 320, padding: "1rem" }}>
      {loading ? (
        <p style={{ textAlign: "center", lineHeight: "320px" }}>Loading chart...</p>
      ) : (
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} barGap={2} barCategoryGap="10%">
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="profit" barSize={20} fill="#4caf50" />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  )
}
