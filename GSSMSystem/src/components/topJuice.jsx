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

export default function TopJuicesChart({ month, year }) { // ← ADD PROPS HERE
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Only fetch if both month and year are provided
    if (!month || !year) {
      setData([])
      setLoading(false)
      return
    }

    setLoading(true)
    toast.info("Loading top juices data...")

    // ← ADD QUERY PARAMETERS HERE
    fetch(`/api/top-juices?month=${month}&year=${year}`)
      .then(res => res.json())
      .then(fetchedData => {
        setData(fetchedData)
        setLoading(false)
      })
      .catch(err => {
        console.error("Failed to fetch juice data:", err)
        toast.error("Failed to load top juices data")
        setLoading(false)
      })
  }, [month, year]) // ← ADD DEPENDENCIES HERE

  return (
    <div style={{ width: "100%", height: 400 }}>
      {loading ? (
        <p style={{ textAlign: "center", lineHeight: "400px" }}>Loading chart...</p>
      ) : data.length === 0 ? (
        <p style={{ textAlign: "center", lineHeight: "400px" }}>No data for selected month and year</p>
      ) : (
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} barCategoryGap="5%">
            <XAxis dataKey="prod_Name" />
            <YAxis />
            <Tooltip contentStyle={{ background: 'transparent', border: 'none' }} />
            <Bar dataKey="totalQM" fill="#7cb342" barSize={50} />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  )
}