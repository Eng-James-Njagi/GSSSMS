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

export default function TopJuicesChart() {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    toast.info("Loading top juices data...")

    fetch("/api/top-juices")
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
  }, [])

  return (
    <div style={{ width: "100%", height: 400 }}>
      {loading ? (
        <p style={{ textAlign: "center", lineHeight: "400px" }}>Loading chart...</p>
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
