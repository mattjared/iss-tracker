"use client"

import { useEffect, useRef } from "react"
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet"
import "leaflet/dist/leaflet.css"
import L from "leaflet"

// Create a blue circle icon using SVG
const blueCircleIcon = new L.Icon({
  iconUrl:
    "data:image/svg+xml;charset=UTF-8," +
    encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="10" fill="#60a5fa" stroke="#2563eb" strokeWidth="2"/>
    </svg>
  `),
  iconSize: [24, 24],
  iconAnchor: [12, 12],
  popupAnchor: [0, -12],
})

function MapEffect({ position }: { position: [number, number] }) {
  const map = useMap()

  useEffect(() => {
    map.flyTo(position, map.getZoom(), { animate: true, duration: 1.5 })
  }, [map, position])

  return null
}

interface ISSMapProps {
  position: [number, number]
}

export default function ISSMap({ position }: ISSMapProps) {
  const mapRef = useRef<L.Map>(null)

  return (
    <MapContainer center={position} zoom={3} style={{ height: "100%", width: "100%" }} ref={mapRef}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
      />
      <Marker position={position} icon={blueCircleIcon}>
        <Popup>
          <div className="text-center font-mono text-xs">
            <p className="font-bold">INTERNATIONAL SPACE STATION</p>
            <p>LAT: {position[0].toFixed(4)}°</p>
            <p>LON: {position[1].toFixed(4)}°</p>
          </div>
        </Popup>
      </Marker>
      <MapEffect position={position} />
    </MapContainer>
  )
}

