"use client"

import { useState, useEffect } from "react"
import dynamic from "next/dynamic"
import { Loader2, RefreshCw, Satellite, Globe, Clock, Wifi } from "lucide-react"

const ISSMap = dynamic(() => import("@/components/iss-map"), { ssr: false })

interface ISSData {
  latitude: number
  longitude: number
  altitude: number
  velocity: number
  visibility: string
  timestamp: number
}

export default function Home() {
  const [issData, setISSData] = useState<ISSData | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchISSData = async () => {
    setLoading(true)
    try {
      const response = await fetch("https://api.wheretheiss.at/v1/satellites/25544")
      if (!response.ok) {
        throw new Error("Failed to fetch ISS data")
      }
      const data = await response.json()
      setISSData({
        latitude: data.latitude,
        longitude: data.longitude,
        altitude: data.altitude,
        velocity: data.velocity,
        visibility: data.visibility,
        timestamp: data.timestamp,
      })
      setError(null)
    } catch (err) {
      setError("Error fetching ISS data")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchISSData()
    const interval = setInterval(fetchISSData, 10000)
    return () => clearInterval(interval)
  }, [])

  return (
    <main className="min-h-screen bg-slate-900 text-blue-300 p-4 font-mono">
      <div className="max-w-6xl mx-auto bg-slate-800 border border-blue-500 rounded-lg shadow-2xl p-4">
        <h1 className="text-3xl md:text-4xl font-bold mb-4 text-center text-blue-400 ">ISS TRACKER</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-4">
            <div className="bg-slate-800 border border-blue-500 rounded p-4">
              <h2 className="text-xl font-semibold mb-2 flex items-center">
                <Satellite className="mr-2" />
                CURRENT STATUS
              </h2>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <DataPoint icon={Globe} label="LAT" value={issData?.latitude} />
                <DataPoint icon={Globe} label="LON" value={issData?.longitude} />
                <DataPoint icon={Wifi} label="ALT" value={issData?.altitude} unit="km" />
                <DataPoint icon={RefreshCw} label="VEL" value={issData?.velocity} unit="km/h" />
                <DataPoint icon={Clock} label="TIME" value={issData?.timestamp} isTime />
                <DataPoint icon={Wifi} label="VIS" value={issData?.visibility} />
              </div>
            </div>
            <button
              className="w-full px-4 py-2 bg-blue-700 hover:bg-blue-600 rounded flex items-center justify-center transition-colors text-sm font-semibold"
              onClick={fetchISSData}
              disabled={loading}
            >
              {loading ? <Loader2 className="animate-spin mr-2" /> : <RefreshCw className="mr-2" />}
              {loading ? "UPDATING..." : "REFRESH DATA"}
            </button>
          </div>
          <div className="h-[400px] rounded overflow-hidden shadow-lg relative border border-blue-500">
            {issData && <ISSMap position={[issData.latitude, issData.longitude]} />}
            <div className="absolute bottom-0 left-0 right-0 bg-slate-800 bg-opacity-75 text-blue-300 p-1 text-center text-xs">
              ISS LOCATION
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

function DataPoint({
  icon: Icon,
  label,
  value,
  unit = "",
  isTime = false,
}: {
  icon: any
  label: string
  value: number | string | undefined
  unit?: string
  isTime?: boolean
}) {
  const [displayValue, setDisplayValue] = useState("--")

  useEffect(() => {
    if (value !== undefined) {
      if (isTime) {
        setDisplayValue(new Date((value as number) * 1000).toLocaleTimeString())
      } else if (typeof value === "number") {
        setDisplayValue(value.toFixed(2))
      } else {
        setDisplayValue(value.toString().toUpperCase())
      }
    }
  }, [value, isTime])

  return (
    <div className="flex items-center space-x-2">
      <Icon className="text-blue-400 w-4 h-4 flex-shrink-0" />
      <div className="flex justify-between w-full">
        <span className="text-purple-300 flex-shrink-0">{label}:</span>
        <span className="text-right w-24 overflow-hidden text-ellipsis whitespace-nowrap">
          {displayValue}
          {unit}
        </span>
      </div>
    </div>
  )
}

