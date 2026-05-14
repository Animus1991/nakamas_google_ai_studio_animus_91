import React, { useState, useEffect, useRef } from "react";
import {
  MapPin,
  Search,
  Compass,
  Navigation,
  Crosshair,
  Map as MapIcon,
  SlidersHorizontal,
  AlertTriangle,
  Info,
  Maximize,
  Minimize,
  ChevronUp,
  ChevronDown,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useStore } from "../store";
import { Badge } from "../components/common/Badge";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { ErrorBoundary } from "../components/common/ErrorBoundary";
import { useLanguage } from "../lib/i18n";

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

function MapController({ center }: { center: { lat: number; lng: number } }) {
  const map = useMap();
  useEffect(() => {
    map.setView([center.lat, center.lng], map.getZoom(), { animate: true });
  }, [center, map]);
  return null;
}

const GroupImage = ({
  src,
  alt,
  className,
}: {
  src: string;
  alt: string;
  className?: string;
}) => {
  const [error, setError] = useState(false);
  return error ? (
    <div
      className={`flex items-center justify-center bg-cyan-50 text-cyan-300 ${className}`}
    >
      <MapIcon className="w-8 h-8 opacity-50" />
    </div>
  ) : (
    <img
      referrerPolicy="no-referrer"
      src={src}
      alt={alt}
      onError={() => setError(true)}
      className={className}
    />
  );
};

export default function NearbyGroupsVibrant() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const events = useStore((state) => state.events);
  const [radius, setRadius] = useState<number>(5);
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [mapCenter, setMapCenter] = useState({ lat: 37.9838, lng: 23.7275 });
  const [userLocation, setUserLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [isPanelExpanded, setIsPanelExpanded] = useState(false);
  const [isMapFullscreen, setIsMapFullscreen] = useState(false);
  const [sidebarWidth, setSidebarWidth] = useState(() =>
    window.innerWidth < 1024 ? 320 : 384,
  );
  const [isDragging, setIsDragging] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      let newWidth = e.clientX;
      // Adjust min/max bounds based on screen size
      const minBound = window.innerWidth < 1024 ? 280 : 300;
      if (newWidth < minBound) newWidth = minBound;
      if (newWidth > window.innerWidth - 100)
        newWidth = window.innerWidth - 100;
      if (newWidth > 600) newWidth = 600;
      setSidebarWidth(newWidth);
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      document.body.style.cursor = "ew-resize";
      document.body.style.userSelect = "none";
    } else {
      document.body.style.cursor = "default";
      document.body.style.userSelect = "";
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging]);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const loc = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setMapCenter(loc);
          setUserLocation(loc);
        },
        (error) => console.warn("Geolocation permission denied:", error),
      );
    }
  }, []);

  const handleLocateMe = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const loc = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setMapCenter(loc);
          setUserLocation(loc);
        },
        () => {
          setLocationError(
            t(
              "Δεν ήταν δυνατή η εύρεση της τοποθεσίας σας. Ελέγξτε τα δικαιώματα του προγράμματος περιήγησης.",
              "Couldn't get your location. Check browser permissions.",
            ),
          );
          setTimeout(() => setLocationError(null), 4000);
        },
      );
    } else {
      setLocationError(
        t(
          "Η γεωτοποθεσία δεν υποστηρίζεται από το πρόγραμμα περιήγησής σας.",
          "Geolocation is not supported by your browser.",
        ),
      );
      setTimeout(() => setLocationError(null), 4000);
    }
  };

  const handleImageError = (
    e: React.SyntheticEvent<HTMLImageElement, Event>,
  ) => {
    const target = e.currentTarget;
    target.style.color = "transparent"; // Hides the alt text
    if (!target.src.includes("placehold.co")) {
      target.src = `https://placehold.co/400x300/eef2ff/4f46e5?text=Event`;
    }
  };

  const apiKey = (import.meta as any).env?.VITE_GOOGLE_MAPS_API_KEY || "";
  const hasValidKey =
    Boolean(apiKey) && typeof apiKey === "string" && apiKey.startsWith("AIza");

  const localGroups = events
    .filter((e) => e.maxParticipants && e.maxParticipants > 0)
    .slice(0, 8)
    .map((e) => ({
      ...e,
      lat: e.lat || mapCenter.lat,
      lng: e.lng || mapCenter.lng,
    }));

  const getMarkerColor = (category: string) => {
    switch (category) {
      case "Stand-up":
        return "#4f46e5";
      case "Board games":
        return "#059669";
      case "Hiking":
        return "#ea580c";
      case "Nearby escapes":
        return "#0891b2";
      default:
        return "#e11d48";
    }
  };

  // Mock map render removed for brevity, assuming apiKey is usually present or we can just simplify it.
  // We'll keep the full logic since it's important for the case where there's no API key.

  if (!hasValidKey) {
    return (
      <div
        className={`overflow-hidden rounded-none md:rounded-xl lg:rounded-none z-0 ${isMapFullscreen ? "fixed !inset-0 !z-[9999] bg-black" : "absolute inset-0 animate-in fade-in duration-500"}`}
      >
        {/* Map Background Mock */}
        <div className="absolute inset-0 bg-[#e5e3df] z-0 flex items-center justify-center">
          <div
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M10 10h80v80h-80z' stroke='%23000' stroke-width='1' fill='none'/%3E%3C/svg%3E")`,
              backgroundSize: "100px 100px",
            }}
          />
          {/* Map Streets Mock */}
          <svg
            className="absolute inset-0 w-full h-full opacity-30"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M0,50 Q100,60 200,30 T400,80 T600,40 T800,90 T1000,50"
              stroke="#fff"
              strokeWidth="8"
              fill="none"
            />
            <path
              d="M100,0 Q120,100 80,200 T150,400 T100,600 T200,800 T50,1000"
              stroke="#fff"
              strokeWidth="6"
              fill="none"
            />
            <path
              d="M300,0 Q320,100 380,200 T350,400 T400,600 T300,800 T350,1000"
              stroke="#fff"
              strokeWidth="5"
              fill="none"
            />
          </svg>

          {/* Map Pins */}
          {localGroups.map((group, idx) => {
            const topPositions = ["30%", "60%", "20%", "70%", "40%"];
            const leftPositions = ["40%", "60%", "70%", "30%", "50%"];
            const isSelected = selectedEventId === group.id;

            return (
              <div
                key={group.id}
                className="absolute transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center group cursor-pointer z-10"
                style={{
                  top: topPositions[idx % 5],
                  left: leftPositions[idx % 5],
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedEventId(group.id);
                }}
              >
                {!isSelected && (
                  <div className="bg-white text-black text-xs font-bold px-2 py-1 rounded shadow-lg mb-1 group-hover:-translate-y-1 transition-transform whitespace-nowrap border border-gray-200">
                    {group.category} • {(1.2 + idx * 0.8).toFixed(1)}km
                  </div>
                )}

                {isSelected && (
                  <div className="absolute bottom-full mb-2 bg-white rounded-lg shadow-xl border border-gray-200 p-3 w-48 z-20">
                    <button
                      className="absolute top-1 right-1 text-black hover:text-black"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedEventId(null);
                      }}
                    >
                      &times;
                    </button>
                    <div className="font-bold text-[10px] text-black tracking-widest mb-1">
                      {group.category}
                    </div>
                    <GroupImage
                      src={group.imageUrl ?? ""}
                      alt={group.title}
                      className="w-full h-24 object-cover rounded-md mb-2 shadow-sm"
                    />
                    <h3 className="font-bold text-sm text-[#111827] mb-1 line-clamp-1">
                      {group.title}
                    </h3>
                    <p className="text-xs text-black mb-3 truncate">
                      <MapPin className="inline w-3 h-3 mr-0.5" />{" "}
                      {group.locationArea}
                    </p>
                    <button
                      className="w-full bg-slate-900 text-white text-[10px] font-bold tracking-wide py-1.5 rounded-md hover:bg-slate-800 transition-colors"
                      onClick={() => navigate(`/events/${group.id}`)}
                    >
                      {t("Προβολή Εκδήλωσης", "View Event")}
                    </button>
                    <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[8px] border-t-white"></div>
                  </div>
                )}

                <div
                  className="w-4 h-4 rounded-full border-2 border-white shadow-md relative z-10"
                  style={{ backgroundColor: getMarkerColor(group.category) }}
                ></div>
              </div>
            );
          })}

          {/* Default close mechanism when clicking map bg */}
          <div
            className="absolute inset-0 z-0"
            onClick={() => setSelectedEventId(null)}
          ></div>

          {/* User Location */}
          <div className="absolute top-[50%] left-[50%] transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
            <div className="w-8 h-8 bg-blue-500/20 rounded-full animate-ping absolute"></div>
            <div className="w-4 h-4 bg-blue-600 rounded-full border-2 border-white shadow-md relative z-10 transition-transform hover:scale-125"></div>
            <div className="w-32 h-32 border border-blue-500/30 rounded-full absolute bg-blue-500/5 pointer-events-none"></div>
          </div>

          <div className="absolute top-[80px] left-[50%] transform -translate-x-1/2 bg-white/90 backdrop-blur text-black text-xs px-3 py-1.5 rounded-full border border-gray-200 shadow-sm z-10">
            {t(
              "Ο διαδραστικός χάρτης απαιτεί API Key της Google Maps",
              "Interactive map requires Google Maps API Key",
            )}
          </div>
        </div>

        {/* Floating Header */}
        <div className="absolute top-4 left-4 right-4 z-10 flex gap-2 pointer-events-none">
          <div className="relative flex-1 max-w-sm pointer-events-auto">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-black" />
            <input
              type="text"
              placeholder={t(
                "Αναζήτηση κοντινών περιοχών ή ομάδων...",
                "Search nearby areas or groups...",
              )}
              className="w-full h-11 pl-10 pr-4 rounded-xl border-0 bg-white/95 backdrop-blur shadow-lg focus:outline-none focus:ring-2 focus:ring-cyan-600 text-sm font-medium"
            />
          </div>
          <button className="h-11 px-4 bg-white/95 backdrop-blur rounded-xl shadow-lg flex items-center justify-center text-black hover:text-cyan-600 transition-colors pointer-events-auto">
            <SlidersHorizontal className="h-5 w-5" />
          </button>
        </div>

        {/* Slide-up Panel for Mobile, Sidebar for Desktop */}
        <div className="absolute bottom-0 left-0 right-0 md:top-0 md:bottom-0 md:right-auto md:w-96 bg-white shadow-[0_-10px_40px_rgba(0,0,0,0.1)] md:shadow-[10px_0_40px_rgba(0,0,0,0.1)] z-20 flex flex-col rounded-t-3xl md:rounded-none transition-transform duration-300 transform translate-y-0 max-h-[60vh] md:max-h-full">
          <div className="w-12 h-1.5 bg-gray-200 rounded-full mx-auto my-3 md:hidden shrink-0"></div>

          <div className="p-4 md:p-6 border-b border-gray-100 shrink-0">
            <h2 className="text-xl font-bold text-[#111827]">
              {t("Τοπικές Ομάδες", "Local Groups")}
            </h2>
            <p className="text-xs text-black mt-1 font-medium flex items-center gap-1">
              <Navigation className="h-3 w-3" />{" "}
              {t("Εμφάνιση αποτελεσμάτων εντός", "Showing results within")}{" "}
              {radius}
              km
            </p>

            <div className="mt-4 flex items-center gap-3">
              <input
                type="range"
                min="1"
                max="25"
                value={radius}
                onChange={(e) => setRadius(parseInt(e.target.value))}
                className="flex-1 accent-cyan-600"
              />
              <span className="text-xs font-bold text-cyan-600 w-8">
                {radius}km
              </span>
            </div>

            <div className="flex gap-2 mt-4 overflow-x-auto noscrollbar pb-1">
              <button className="px-3 py-1.5 bg-cyan-600 text-white rounded-full text-xs font-bold whitespace-nowrap shadow-sm">
                {t("Όλα", "All Matches")}
              </button>
              <button className="px-3 py-1.5 bg-gray-50 text-black border border-gray-200 rounded-full text-xs font-bold whitespace-nowrap hover:bg-gray-100">
                {t("Σήμερα", "Today")}
              </button>
              <button className="px-3 py-1.5 bg-gray-50 text-black border border-gray-200 rounded-full text-xs font-bold whitespace-nowrap hover:bg-gray-100">
                {t("Φίλοι Συμμετέχουν", "Friends Going")}
              </button>
            </div>
          </div>

          <div className="overflow-y-auto flex-1 p-4 space-y-3 text-left">
            {localGroups.map((group, idx) => (
              <div
                key={idx}
                className={`p-3 border ${selectedEventId === group.id ? "border-cyan-500 shadow-md ring-1 ring-cyan-500" : "border-gray-100"} rounded-xl hover:border-cyan-300 hover:shadow-md transition-all cursor-pointer group flex gap-3 bg-white`}
                onClick={() => {
                  setSelectedEventId(group.id);
                  setMapCenter({ lat: group.lat, lng: group.lng });
                  // On mobile, scroll up so the top of the map is visible
                  if (window.innerWidth < 768) {
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }
                }}
              >
                <div className="w-16 h-16 rounded-lg bg-gray-100 overflow-hidden shrink-0">
                  <GroupImage
                    src={group.imageUrl ?? ""}
                    alt={group.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
                  <div>
                    <h3 className="font-bold text-sm text-[#111827] line-clamp-1 group-hover:text-cyan-600 transition-colors">
                      {group.title}
                    </h3>
                    <p className="text-xs text-black mt-0.5 max-w-[200px] truncate">
                      {group.locationArea}
                    </p>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <Badge variant="neutral" className="text-[9px] px-1.5 py-0">
                      {group.category}
                    </Badge>
                    <div className="flex items-center text-[10px] font-bold text-cyan-600 bg-cyan-50 px-1.5 py-0.5 rounded">
                      <MapPin className="h-2.5 w-2.5 mr-1" />{" "}
                      {(1.2 + idx * 0.8).toFixed(1)}km
                    </div>
                  </div>
                </div>
              </div>
            ))}

            <div className="p-6 text-center border border-dashed border-gray-200 rounded-xl bg-gray-50">
              <div className="w-12 h-12 bg-cyan-100 text-cyan-600 rounded-full flex items-center justify-center mx-auto mb-3">
                <MapIcon className="h-6 w-6" />
              </div>
              <h3 className="text-sm font-bold text-[#111827]">
                Expand your radius
              </h3>
              <p className="text-xs text-black mt-1 mb-4">
                Discover more local groups by increasing your search area.
              </p>
              <button
                onClick={() => setRadius(15)}
                className="text-xs font-bold text-white bg-slate-900 text-white px-4 py-2 rounded-full hover:bg-slate-800 transition-colors"
              >
                Set radius to 15km
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`overflow-hidden rounded-none md:rounded-xl lg:rounded-none ${isMapFullscreen ? "fixed !inset-0 !z-[9999] bg-black" : "absolute inset-0 animate-in fade-in duration-500"}`}
      style={
        {
          "--sidebar-width": isMapFullscreen ? "0px" : `${sidebarWidth}px`,
        } as React.CSSProperties
      }
    >
      <div className={`absolute inset-0 z-0 bg-[#e5e3df]`}>
        <ErrorBoundary
          fallback={
            <div className="w-full h-full flex items-center justify-center bg-[#e5e3df] p-8 text-center">
              <div className="bg-white p-6 rounded-xl shadow-lg max-w-sm border border-red-100">
                <AlertTriangle className="w-10 h-10 text-red-500 mx-auto mb-3" />
                <h3 className="font-bold text-black mb-2">Map Error</h3>
                <p className="text-xs text-black">
                  There was a problem loading the map.
                </p>
              </div>
            </div>
          }
        >
          <MapContainer
            center={[mapCenter.lat, mapCenter.lng]}
            zoom={13}
            zoomControl={false}
            style={{ height: "100%", width: "100%", zIndex: 0 }}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <MapController center={mapCenter} />

            {localGroups.map((group, idx) => (
              <Marker
                key={group.id}
                position={[group.lat, group.lng]}
                eventHandlers={{
                  click: () => {
                    setSelectedEventId(group.id);
                  },
                }}
              >
                <Popup>
                  <div className="font-bold text-xs text-[#111827] mb-1">
                    {group.category}
                  </div>
                  <div
                    className="max-w-[180px] cursor-pointer outline-none"
                    onClick={() => navigate(`/events/${group.id}`)}
                  >
                    <GroupImage
                      src={group.imageUrl ?? ""}
                      alt={group.title}
                      className="w-full h-20 object-cover rounded-md mb-2 shadow-sm"
                    />
                    <h3 className="font-bold text-xs text-[#111827] mb-1 line-clamp-1">
                      {group.title}
                    </h3>
                    <p className="text-[10px] text-black mb-2 truncate">
                      <MapPin className="inline w-3 h-3 mr-0.5" />{" "}
                      {group.locationArea}
                    </p>
                    <button className="w-full bg-slate-900 text-white text-[10px] font-bold tracking-wide py-1.5 rounded-md hover:bg-slate-800 transition-colors">
                      View Event
                    </button>
                  </div>
                </Popup>
              </Marker>
            ))}

            {userLocation && (
              <Marker position={[userLocation.lat, userLocation.lng]}>
                <Popup>{t("Η τοποθεσία σας", "Your Location")}</Popup>
              </Marker>
            )}
          </MapContainer>
        </ErrorBoundary>
      </div>

      <div
        className={`absolute top-4 left-4 right-4 z-10 flex gap-2 pointer-events-none transition-all duration-300 md:left-[calc(var(--sidebar-width)+16px)]`}
      >
        {!isMapFullscreen && (
          <div className="relative flex-1 max-w-sm pointer-events-auto shadow-lg bg-white/95 backdrop-blur rounded-xl">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-black" />
            <input
              type="text"
              placeholder="Search nearby areas or groups..."
              className="w-full h-11 pl-10 pr-4 rounded-xl border-0 bg-transparent focus:outline-none focus:ring-2 focus:ring-cyan-600 text-sm font-medium"
            />
          </div>
        )}
        {!isMapFullscreen && (
          <button
            onClick={() => alert("Search filters coming soon")}
            className="h-11 px-4 bg-white/95 backdrop-blur rounded-xl shadow-lg flex items-center justify-center text-black hover:text-cyan-600 transition-colors pointer-events-auto shrink-0"
          >
            <SlidersHorizontal className="h-5 w-5" />
          </button>
        )}
        <button
          onClick={handleLocateMe}
          className="h-11 px-4 bg-white/95 backdrop-blur rounded-xl shadow-lg flex items-center justify-center text-cyan-600 hover:text-cyan-800 transition-colors pointer-events-auto shrink-0 ml-auto"
          title="Locate Me"
        >
          <Crosshair className="h-5 w-5" />
        </button>
        {locationError && (
          <div className="absolute bottom-20 left-1/2 -translate-x-1/2 bg-red-600 text-white text-xs font-bold px-4 py-2 rounded-full shadow-lg pointer-events-none whitespace-nowrap z-50">
            {locationError}
          </div>
        )}
        <button
          onClick={() => setIsMapFullscreen(!isMapFullscreen)}
          className="h-11 px-4 bg-slate-900 text-white rounded-xl shadow-lg flex items-center justify-center hover:bg-slate-800 transition-colors pointer-events-auto shrink-0"
          title={isMapFullscreen ? "Exit Fullscreen" : "Fullscreen Map"}
        >
          {isMapFullscreen ? (
            <Minimize className="h-5 w-5" />
          ) : (
            <Maximize className="h-5 w-5" />
          )}
        </button>
      </div>

      {/* Slide-up Panel for Mobile, Sidebar for Desktop */}
      <div
        className={`absolute bottom-0 left-0 right-0 md:top-0 md:bottom-0 md:right-auto bg-white shadow-[0_-10px_40px_rgba(0,0,0,0.1)] md:shadow-[10px_0_40px_rgba(0,0,0,0.1)] z-20 flex flex-col rounded-t-3xl md:rounded-none transition-transform duration-300 transform translate-y-0 dynamic-sidebar-width ${isMapFullscreen ? "translate-y-full md:-translate-x-full" : isPanelExpanded ? "top-0 md:h-full" : "max-h-[60vh] md:max-h-full"} ${isDragging ? "transition-none" : ""}`}
      >
        {/* Style tag just for the desktop media query targeting the sidebar width safely without overriding mobile */}
        <style
          dangerouslySetInnerHTML={{
            __html: `
          @media (min-width: 768px) {
            .dynamic-sidebar-width { width: var(--sidebar-width) !important; }
          }
        `,
          }}
        />
        <div
          className="absolute top-0 bottom-0 -right-2 w-4 cursor-ew-resize hover:bg-cyan-500/10 transition-all hidden md:block z-50 pointer-events-auto"
          onMouseDown={() => setIsDragging(true)}
        />

        <div
          className="w-full py-3 cursor-pointer flex justify-center items-center md:hidden shrink-0"
          onClick={() => setIsPanelExpanded(!isPanelExpanded)}
        >
          <div className="w-12 h-1.5 bg-gray-300 hover:bg-gray-400 rounded-full flex items-center justify-center relative">
            <span className="absolute -top-3 text-black">
              {isPanelExpanded ? (
                <ChevronDown className="w-4 h-4" />
              ) : (
                <ChevronUp className="w-4 h-4" />
              )}
            </span>
          </div>
        </div>

        <div className="p-4 md:p-6 border-b border-gray-100 shrink-0">
          <h2 className="text-xl font-bold text-[#111827]">
            {t("Τοπικές Ομάδες", "Local Groups")}
          </h2>
          <p className="text-xs text-black mt-1 font-medium flex items-center gap-1">
            <Navigation className="h-3 w-3" />{" "}
            {t("Εμφάνιση αποτελεσμάτων εντός", "Showing results within")}{" "}
            {radius}km
          </p>

          <div className="mt-4 flex items-center gap-3">
            <input
              type="range"
              min="1"
              max="25"
              value={radius}
              onChange={(e) => setRadius(parseInt(e.target.value))}
              className="flex-1 accent-cyan-600"
            />
            <span className="text-xs font-bold text-cyan-600 w-8">
              {radius}km
            </span>
          </div>

          <div className="flex gap-2 mt-4 overflow-x-auto noscrollbar pb-1">
            <button className="px-3 py-1.5 bg-cyan-600 text-white rounded-full text-xs font-bold whitespace-nowrap shadow-sm">
              {t("Όλα", "All Matches")}
            </button>
            <button className="px-3 py-1.5 bg-gray-50 text-black border border-gray-200 rounded-full text-xs font-bold whitespace-nowrap hover:bg-gray-100">
              {t("Σήμερα", "Today")}
            </button>
            <button className="px-3 py-1.5 bg-gray-50 text-black border border-gray-200 rounded-full text-xs font-bold whitespace-nowrap hover:bg-gray-100">
              {t("Φίλοι Συμμετέχουν", "Friends Going")}
            </button>
          </div>
        </div>

        <div className="overflow-y-auto flex-1 p-4 space-y-3 text-left">
          {localGroups.map((group, idx) => (
            <div
              key={idx}
              className="p-3 border border-gray-100 rounded-xl hover:border-cyan-300 hover:shadow-md transition-all cursor-pointer group flex gap-3 bg-white"
              onClick={() => navigate(`/events/${group.id}`)}
            >
              <div className="w-16 h-16 rounded-lg bg-gray-100 overflow-hidden shrink-0">
                <GroupImage
                  src={group.imageUrl ?? ""}
                  alt={group.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
              </div>
              <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
                <div>
                  <h3 className="font-bold text-sm text-[#111827] line-clamp-1 group-hover:text-cyan-600 transition-colors">
                    {group.title}
                  </h3>
                  <p className="text-xs text-black mt-0.5 max-w-[200px] truncate">
                    {group.locationArea}
                  </p>
                </div>
                <div className="flex items-center justify-between mt-2">
                  <Badge variant="neutral" className="text-[9px] px-1.5 py-0">
                    {group.category}
                  </Badge>
                  <div className="flex items-center text-[10px] font-bold text-cyan-600 bg-cyan-50 px-1.5 py-0.5 rounded">
                    <MapPin className="h-2.5 w-2.5 mr-1" />{" "}
                    {(1.2 + idx * 0.8).toFixed(1)}km
                  </div>
                </div>
              </div>
            </div>
          ))}

          <div className="p-6 text-center border border-dashed border-gray-200 rounded-xl bg-gray-50">
            <div className="w-12 h-12 bg-cyan-100 text-cyan-600 rounded-full flex items-center justify-center mx-auto mb-3">
              <MapIcon className="h-6 w-6" />
            </div>
            <h3 className="text-sm font-bold text-[#111827]">
              {t("Επέκταση ακτίνας", "Expand your radius")}
            </h3>
            <p className="text-xs text-black mt-1 mb-4">
              {t(
                "Ανακαλύψτε περισσότερες τοπικές ομάδες αυξάνοντας την περιοχή αναζήτησης.",
                "Discover more local groups by increasing your search area.",
              )}
            </p>
            <button
              onClick={() => setRadius(15)}
              className="text-xs font-bold text-white bg-gradient-to-br from-violet-600 via-fuchsia-600 to-orange-500 text-white px-4 py-2 rounded-full hover:bg-gray-800 transition-colors"
            >
              {t("Ορισμός ακτίνας στα 15km", "Set radius to 15km")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
