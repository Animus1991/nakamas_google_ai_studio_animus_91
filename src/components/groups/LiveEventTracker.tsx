import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useStore } from "../../store";
import { useLanguage } from "../../lib/i18n";
import type { MemberLocation } from "../../types";
import {
  Navigation,
  Users,
  ShieldCheck,
  WifiOff,
  AlertTriangle,
} from "lucide-react";
import { Button } from "../common/Button";

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

// A custom map view controller to focus bounds
function MapBoundsController({
  markers,
}: {
  markers: { lat: number; lng: number }[];
}) {
  const map = useMap();

  useEffect(() => {
    if (markers.length === 0) return;
    const bounds = L.latLngBounds(markers.map((m) => [m.lat, m.lng]));
    if (markers.length === 1) {
      map.setView([markers[0].lat, markers[0].lng], 15);
    } else {
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [markers, map]);

  return null;
}

export function LiveEventTracker({ groupId }: { groupId: string }) {
  const { t } = useLanguage();
  const currentUser = useStore((state) => state.currentUser);
  const group = useStore((state) => state.groups.find((g) => g.id === groupId));
  const users = useStore((state) => state.users);
  const toggleLiveTracking = useStore((state) => state.toggleLiveTracking);
  const updateMemberLocation = useStore((state) => state.updateMemberLocation);

  const [isSharing, setIsSharing] = useState(false);
  const [sosActive, setSosActive] = useState(false);

  useEffect(() => {
    if (!isSharing || !currentUser || !group?.isLiveTrackingActive) return;

    // Simulate realtime location updates for the current user and bot users
    const interval = setInterval(() => {
      // Simulate user's location (slightly randomizing around a fixed point)
      // Base point: Syntagma Square for demo
      const baseLat = 37.9753;
      const baseLng = 23.7361;

      // Update current user
      updateMemberLocation(groupId, currentUser.id, {
        lat: baseLat + (Math.random() - 0.5) * 0.002,
        lng: baseLng + (Math.random() - 0.5) * 0.002,
        sos: sosActive,
      });

      // Update a few other members if they are in the group to simulate real-time
      const otherMembers = group.members.filter((m) => m !== currentUser.id);
      otherMembers.forEach((memberId) => {
        // give each member a slight deterministic offset so they don't jump completely randomly
        const offsetLat = (memberId.charCodeAt(0) % 10) * 0.0005;
        const offsetLng = (memberId.charCodeAt(1) % 10) * 0.0005;

        updateMemberLocation(groupId, memberId, {
          lat: baseLat + offsetLat + (Math.random() - 0.5) * 0.0005,
          lng: baseLng + offsetLng + (Math.random() - 0.5) * 0.0005,
        });
      });
    }, 3000);

    return () => clearInterval(interval);
  }, [
    isSharing,
    currentUser,
    group?.isLiveTrackingActive,
    groupId,
    updateMemberLocation,
    group?.members,
    sosActive,
  ]);

  if (!group || !currentUser) return null;

  const isHost = group.hostId === currentUser.id;
  const isTrackingActive = group.isLiveTrackingActive;

  // Simple haversine formula to check distance
  const getDistanceFromLatLonInMeters = (
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number,
  ) => {
    const R = 6371e3; // Radius of the earth in m
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const eventLat = 37.9753; // using baseLat for the geofence center for demo
  const eventLng = 23.7361;

  // Aggregate data for map
  const activeLocations = Object.entries(group.membersLocations || {} as Record<string, MemberLocation>)
    .filter(([userId, loc]) => Date.now() - (loc as MemberLocation).timestamp < 60000)
    .map(([userId, loc]) => {
      const location = loc as MemberLocation;
      const user = users.find((u) => u.id === userId);
      const dist = getDistanceFromLatLonInMeters(
        eventLat,
        eventLng,
        location.lat,
        location.lng,
      );
      return {
        userId,
        name: user?.name || "Unknown",
        photoUrl: user?.photoUrl,
        lat: location.lat,
        lng: location.lng,
        sos: location.sos,
        isOutOfBounds: dist > 500,
        isMe: userId === currentUser.id,
      };
    });

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden flex flex-col h-[500px]">
      <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
        <div>
          <h3 className="font-bold text-[#111827] flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            {t("Nakama Safety Shield", "Nakama Safety Shield")}
          </h3>
          <p className="text-xs text-black mt-1 flex items-center gap-1.5">
            <Navigation className="w-3.5 h-3.5 text-emerald-600" />
            {t(
              "Οπτική επαφή με την ομάδα για ασφάλεια.",
              "Visual contact with the group for safety.",
            )}
          </p>
        </div>

        {isHost ? (
          <Button
            size="sm"
            variant={isTrackingActive ? "outline" : "primary"}
            onClick={() => toggleLiveTracking(groupId, !isTrackingActive)}
            className={
              isTrackingActive
                ? "text-red-600 border-red-200 hover:bg-red-50"
                : "bg-emerald-600 hover:bg-emerald-700 text-white"
            }
          >
            {isTrackingActive
              ? t("Λήξη", "End Mode")
              : t("Ενεργοποίηση", "Enable Mode")}
          </Button>
        ) : (
          <div
            className={`px-2.5 py-1 text-xs font-bold rounded-full tracking-wider ${isTrackingActive ? "bg-emerald-50 text-emerald-700" : "bg-gray-100 text-black"}`}
          >
            {isTrackingActive
              ? t("Ενεργό", "Active")
              : t("Ανενεργό", "Inactive")}
          </div>
        )}
      </div>

      <div className="flex-1 relative bg-gray-100">
        {isHost && activeLocations.some((l) => l.isOutOfBounds) && (
          <div className="absolute top-4 left-4 right-4 z-[1000] bg-amber-50 border border-amber-200 text-amber-800 px-4 py-3 rounded-xl shadow-lg flex items-start gap-3 pointer-events-auto">
            <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5 text-amber-600" />
            <div>
              <p className="text-sm font-bold m-0">
                {t("Ειδοποίηση Ασφαλείας", "Safety Alert")}
              </p>
              <p className="text-xs mt-1 text-amber-700 leading-relaxed">
                {t(
                  "Ορισμένα μέλη βρίσκονται εκτός της ακτίνας 500μ από το σημείο συνάντησης.",
                  "Some members are outside the 500m radius from the meeting point.",
                )}
              </p>
            </div>
          </div>
        )}
        {!isTrackingActive ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 bg-gray-50/90 z-10">
            <WifiOff className="w-12 h-12 text-black mb-3" />
            <p className="text-black font-medium">
              {t(
                "Η λειτουργία συντονισμού δεν είναι ενεργή. Ο διοργανωτής μπορεί να την ξεκινήσει.",
                "Coordination mode is inactive. The organizer can start it.",
              )}
            </p>
          </div>
        ) : !isSharing && !isHost ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 bg-white/80 backdrop-blur-sm z-10">
            <Users className="w-12 h-12 text-indigo-200 mb-4" />
            <h4 className="font-bold text-[#111827] mb-2">
              {t("Συνδεθείτε στον Χάρτη", "Join the Map")}
            </h4>
            <p className="text-xs text-black mb-4 max-w-[250px]">
              {t(
                "Κοινοποιήστε την τοποθεσία σας προσωρινά σε αυτήν την ομάδα με δική σας επιλογή, για εύκολη συνάντηση.",
                "Temporarily share your location with this group, at your choice, to easily meet up.",
              )}
            </p>
            <div className="flex flex-col gap-2 w-full max-w-[200px]">
              <Button
                onClick={() => setIsSharing(true)}
                className="w-full text-[11px]"
              >
                {t("Κοινοποίηση (30 Λεπτά)", "Share (30 Mins)")}
              </Button>
              <Button
                onClick={() => setIsSharing(true)}
                variant="outline"
                className="w-full text-[11px]"
              >
                {t("Κοινοποίηση μέχρι το τέλος", "Share until event ends")}
              </Button>
            </div>
          </div>
        ) : null}

        <MapContainer
          center={[37.9753, 23.7361]}
          zoom={15}
          style={{ height: "100%", width: "100%", zIndex: 0 }}
          zoomControl={false}
        >
          <TileLayer
            attribution="&copy; OpenStreetMap"
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {activeLocations.length > 0 && (
            <MapBoundsController markers={activeLocations} />
          )}

          {activeLocations.map((loc) => (
            <Marker key={loc.userId} position={[loc.lat, loc.lng]}>
              <Popup className="custom-popup">
                <div className="flex items-center gap-2 min-w-[120px]">
                  <div className="w-8 h-8 rounded-full overflow-hidden bg-indigo-100 shrink-0">
                    {loc.photoUrl ? (
                      <img
                        src={loc.photoUrl}
                        alt={loc.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-indigo-600 font-bold text-xs">
                        {loc.name.substring(0, 2)}
                      </div>
                    )}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-[#111827] leading-none mb-1">
                      {loc.name} {loc.isMe ? "(Εσείς)" : ""}
                    </p>
                    <p className="text-[9px] text-emerald-600 font-bold tracking-wide flex items-center gap-1">
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${loc.sos ? "bg-red-500" : loc.isOutOfBounds ? "bg-amber-500" : "bg-emerald-500"} animate-pulse`}
                      ></span>
                      {loc.sos
                        ? t("SOS / HELP", "SOS / HELP")
                        : loc.isOutOfBounds
                          ? t("ΕΚΤΟΣ ΟΡΙΩΝ", "OUT OF BOUNDS")
                          : "Live"}
                    </p>
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>

        {isTrackingActive && (isSharing || isHost) && (
          <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end pointer-events-none z-[1000]">
            <div className="bg-white/90 backdrop-blur-md px-3 py-2 rounded-xl shadow-lg border border-gray-100 pointer-events-auto flex items-center gap-2">
              <Users className="w-4 h-4 text-indigo-600" />
              <span className="text-xs font-bold text-[#111827]">
                {activeLocations.length} / {group.members.length}{" "}
                {t("Ορατοί", "Visible")}
              </span>
            </div>

            <div className="flex flex-col gap-2 items-end pointer-events-auto">
              {!isHost && isSharing && (
                <Button
                  size="sm"
                  variant={sosActive ? "primary" : "outline"}
                  className={`border-red-200 transition-colors ${sosActive ? "bg-red-600 text-white hover:bg-red-700" : "bg-red-50 text-red-600 hover:bg-red-100"}`}
                  onClick={() => setSosActive(!sosActive)}
                >
                  <AlertTriangle className="w-4 h-4 mr-1" />
                  {sosActive
                    ? t("Λήξη SOS", "End SOS")
                    : t("SOS / Χάθηκα", "SOS / Lost")}
                </Button>
              )}
              {!isHost && isSharing && (
                <Button
                  size="sm"
                  variant="outline"
                  className="bg-white text-black hover:bg-gray-50 border-gray-200"
                  onClick={() => setIsSharing(false)}
                >
                  {t("Διακοπή Radar", "Stop Radar")}
                </Button>
              )}
              {isHost && !isSharing && (
                <Button size="sm" onClick={() => setIsSharing(true)}>
                  {t("Εμφάνισή μου", "Show Me")}
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
