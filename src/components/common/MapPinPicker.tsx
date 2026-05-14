import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix for default marker icons in leaflet with react
delete (L.Icon.Default.prototype as any)._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

interface MapPinPickerProps {
  location: { lat: number; lng: number };
  onChange: (location: { lat: number; lng: number }) => void;
  height?: string;
}

function LocationMarker({ location, onChange }: MapPinPickerProps) {
  useMapEvents({
    click(e) {
      onChange({ lat: e.latlng.lat, lng: e.latlng.lng });
    },
  });

  return location.lat !== 0 ? (
    <Marker position={[location.lat, location.lng]} />
  ) : null;
}

export function MapPinPicker({
  location,
  onChange,
  height = "200px",
}: MapPinPickerProps) {
  // Default to Athens if 0,0
  const defaultPosition: [number, number] = [37.9838, 23.7275];
  const centerPosition: [number, number] =
    location.lat === 0 && location.lng === 0
      ? defaultPosition
      : [location.lat, location.lng];

  return (
    <div
      className="rounded-lg overflow-hidden border border-gray-200"
      style={{ height }}
    >
      <MapContainer
        center={centerPosition}
        zoom={13}
        scrollWheelZoom={true}
        style={{ height: "100%", width: "100%" }}
        className="z-0"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <LocationMarker location={location} onChange={onChange} />
      </MapContainer>
    </div>
  );
}
