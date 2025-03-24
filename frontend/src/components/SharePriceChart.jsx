"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts"
import { format } from "date-fns"
import { Skeleton } from "@/components/ui/skeleton"

/**
 * @typedef {Object} PriceHistory
 * @property {string} _id
 * @property {string} companyId
 * @property {number} price
 * @property {string} timestamp
 */

/**
 * Share Price Chart Component
 * @param {Object} props
 * @param {string} props.companyId - Company ID
 * @param {string} props.companyName - Company name
 * @param {number} props.currentPrice - Current share price
 * @param {Function} props.onFetchHistory - Function to fetch price history
 */
export const SharePriceChart = ({ companyId, companyName, currentPrice, onFetchHistory }) => {
  const [priceHistory, setPriceHistory] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (companyId) {
      fetchPriceHistory()
    }
  }, [companyId, currentPrice])

  const fetchPriceHistory = async () => {
    try {
      setIsLoading(true)
      const history = await onFetchHistory(companyId)

      // Add current price if it's not in the history
      const lastHistoryItem = history[history.length - 1]
      if (!lastHistoryItem || lastHistoryItem.price !== currentPrice) {
        history.push({
          _id: "current",
          companyId,
          price: currentPrice,
          timestamp: new Date().toISOString(),
        })
      }

      setPriceHistory(history)
    } catch (error) {
      console.error("Error fetching price history:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const formatData = () => {
    return priceHistory.map((item) => ({
      date: format(new Date(item.timestamp), "MMM d, HH:mm"),
      price: item.price,
    }))
  }

  const getMinMaxPrice = () => {
    if (priceHistory.length === 0) return { min: 0, max: 0 }

    const prices = priceHistory.map((item) => item.price)
    const min = Math.min(...prices)
    const max = Math.max(...prices)

    // Add 10% padding to min and max
    const padding = (max - min) * 0.1
    return {
      min: Math.max(0, min - padding),
      max: max + padding,
    }
  }

  const { min, max } = getMinMaxPrice()
  const chartData = formatData()

  return (
    <Card className="border-none shadow-lg bg-white dark:bg-slate-800">
      <CardHeader>
        <CardTitle className="text-xl text-slate-800 dark:text-slate-100">{companyName} - Price History</CardTitle>
        <CardDescription>Track share price changes over time</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <Skeleton className="h-[300px] w-full" />
        ) : priceHistory.length <= 1 ? (
          <div className="flex items-center justify-center h-[300px] text-slate-500 dark:text-slate-400">
            Not enough price history data available
          </div>
        ) : (
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ccc" opacity={0.3} />
                <XAxis dataKey="date" tick={{ fill: "#888", fontSize: 12 }} tickMargin={10} />
                <YAxis
                  domain={[min, max]}
                  tick={{ fill: "#888", fontSize: 12 }}
                  tickMargin={10}
                  tickFormatter={(value) => `$${value.toFixed(2)}`}
                />
                <Tooltip
                  formatter={(value) => [`$${Number(value).toFixed(2)}`, "Price"]}
                  labelFormatter={(label) => `Date: ${label}`}
                  contentStyle={{
                    backgroundColor: "rgba(255, 255, 255, 0.9)",
                    border: "1px solid #ccc",
                    borderRadius: "4px",
                    padding: "10px",
                  }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="price"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  dot={{ r: 4, strokeWidth: 2 }}
                  activeDot={{ r: 6, strokeWidth: 2 }}
                  name="Share Price"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

