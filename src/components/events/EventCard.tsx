import React, { useState, memo } from "react";
import { createPortal } from "react-dom";
import { motion } from "motion/react";
import { Card } from "../common/Card";
import {
  Bookmark,
  Share2,
  Users,
  MapPin,
  Clock,
  ShieldCheck,
  Navigation,
  Link2,
  X,
} from "lucide-react";
import { format, parseISO } from "date-fns";
import { el as elLocale } from "date-fns/locale";
import { useNavigate } from "react-router-dom";
import { useStore } from "../../store";
import type { Event } from "../../types";
import { useLanguage } from "../../lib/i18n";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

interface EventCardProps {
  event: Event;
}

export const EventCard = memo(function EventCard({ event }: EventCardProps) {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const users = useStore((state) => state.users);
  const currentUser = useStore((state) => state.currentUser);
  const groups = useStore((state) => state.groups);
  const savedEvents = useStore((state) => state.savedEvents) || [];
  const toggleSavedEvent = useStore((state) => state.toggleSavedEvent);
  const isSaved = savedEvents.includes(event.id);
  const [imgError, setImgError] = useState(false);

  const userGroup = currentUser ? groups.find(g => g.eventId === event.id && g.members.includes(currentUser.id)) : null;

  // Arrival & Safety State
  const [showSafetyPanel, setShowSafetyPanel] = useState(false);
  const [arrivalStatus, setArrivalStatus] = useState<string | null>(null);
  const [showEtaPrompt, setShowEtaPrompt] = useState(false);
  const [etaValue, setEtaValue] = useState("15 mins");
  const [isSharingLocation, setIsSharingLocation] = useState(false);
  const [showLocationConfigModal, setShowLocationConfigModal] = useState(false);
  const [locationConfig, setLocationConfig] = useState({
    precision: "approximate",
    shareWith: "all",
    duration: "event_end",
  });
  const [showSafetyLinkModal, setShowSafetyLinkModal] = useState(false);

  const organizer = users.find((u) => u.id === event.organizerId);

  const toggleSave = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleSavedEvent(event.id);
  };

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    const url = `${window.location.origin}/events/${event.id}`;
    if (navigator.share) {
      navigator.share({ title: event.title, url }).catch(() => {});
    } else {
      navigator.clipboard.writeText(url);
      alert(t("event_card.copied", "Link copied to clipboard!"));
    }
  };

  const getCalendarUrl = (e: React.MouseEvent) => {
    e.stopPropagation();
    const text = encodeURIComponent(event.title);
    const details = encodeURIComponent(event.description || "");
    const location = encodeURIComponent(
      event.exactLocation || event.locationArea || "",
    );
    const dateStr = event.date.replace(/-/g, "");
    const timeStr = event.time ? event.time.replace(":", "") + "00" : "000000";
    let endHour = parseInt(event.time ? event.time.split(":")[0] : "0") + 2;
    if (endHour >= 24) endHour = endHour - 24;
    const endHourStr = endHour.toString().padStart(2, "0");
    const minStr = event.time ? event.time.split(":")[1] : "00";
    const endTimeStr = `${endHourStr}${minStr}00`;
    const start = `${dateStr}T${timeStr}`;
    const end = `${dateStr}T${endTimeStr}`;
    window.open(
      `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${text}&details=${details}&location=${location}&dates=${start}/${end}`,
      "_blank",
    );
  };

  const eventDate = parseISO(event.date);
  const day = format(eventDate, "d");
  const month = format(eventDate, "MMM", { locale: elLocale }).toUpperCase();
  const weekday = format(eventDate, "EEEE", { locale: elLocale });

  return (
    <Card
      className="flex h-full flex-col overflow-hidden cursor-pointer relative group border-0 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] hover:shadow-xl hover:-translate-y-1 transition-all duration-300 rounded-2xl bg-white p-0"
      onClick={() => navigate(`/events/${event.id}`)}
    >
      {/* Image Section */}
      <div className="relative h-48 w-full overflow-hidden bg-gray-100 shrink-0">
        {!imgError ? (
          <motion.img
            layoutId={`event-image-${event.id}`}
            referrerPolicy="no-referrer"
            src={
              event.imageUrl ||
              "https://picsum.photos/seed/eventdefault/800/600"
            }
            alt={event.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-cyan-100 to-purple-50 flex items-center justify-center p-4 text-center">
            <span className="text-cyan-600 font-bold text-lg capitalize tracking-tight">
              {event.category}
            </span>
          </div>
        )}

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0" />

        {/* Date Badge — top left */}
        <div className="absolute top-3 left-3 flex flex-col items-center justify-center bg-white/95 backdrop-blur-sm rounded-xl w-12 h-[50px] shadow-sm border border-white/20 z-10">
          <span className="text-[10.61px] font-extrabold text-[#0E8B8D] tracking-wide leading-none mb-0.5">
            {month}
          </span>
          <span className="text-lg font-black text-gray-900 leading-none">
            {day}
          </span>
        </div>

        {/* Action buttons — top right */}
        <div className="absolute top-3 right-3 z-10 flex gap-2">
          <button
            className="p-2 rounded-full shadow-sm backdrop-blur-md focus:outline-none transition-colors bg-white/80 hover:bg-white text-gray-900 hover:text-gray-900"
            onClick={handleShare}
            title={t("Κοινοποίηση", "Share")}
          >
            <Share2 className="h-4 w-4" />
          </button>
          <button
            className={`p-2 rounded-full shadow-sm backdrop-blur-md focus:outline-none transition-colors ${isSaved ? "bg-[#18D8DB]/20 text-[#0E8B8D]" : "bg-white/80 hover:bg-white text-gray-900 hover:text-[#0E8B8D]"}`}
            onClick={toggleSave}
            title={t("Αποθήκευση", "Save")}
          >
            <Bookmark
              className="h-4 w-4"
              fill={isSaved ? "currentColor" : "none"}
            />
          </button>
        </div>

        {/* Tags + Price — bottom of image */}
        <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between z-10 gap-2">
          <div className="flex flex-nowrap overflow-hidden gap-1.5 flex-1 w-full max-w-[65%]">
            {(event.tags ?? []).slice(0, 2).map((tag: string) => (
              <span
                key={tag}
                className="bg-black/50 backdrop-blur-md text-white/95 border border-white/20 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-md text-[10.61px] font-semibold capitalize tracking-wide shadow-sm whitespace-nowrap truncate max-w-[100px]"
              >
                {tag}
              </span>
            ))}
          </div>
          <div className="bg-white/95 backdrop-blur-sm px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-lg shadow-lg font-black text-[#111827] text-[11.67px] sm:text-[12.73px] tracking-tight flex flex-col items-end shrink-0 border border-white/60">
            {event.isPaid ? `€${event.price}` : t("event_card.free", "Free")}
            {event.isPaid && event.groupDiscount && (
              <span className="text-[9.55px] text-[#0E8B8D] leading-none block mt-0.5 font-bold">
                -{event.groupDiscount.percentage}% GRP
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-4 flex flex-col flex-1">
        <div className="flex items-start justify-between gap-3 mb-2">
          <h3 className="font-bold text-[15.91px] leading-snug text-[#111827] group-hover:text-[#0E8B8D] transition-colors line-clamp-2">
            {event.title}
          </h3>
          {currentUser && (
            <div className="flex flex-col items-end shrink-0">
              <span className="text-[12.73px] font-black text-[#18D8DB] leading-none">
                {Math.min(
                  99,
                  45 +
                    (event.tags ?? []).filter((t) =>
                      (currentUser.interests || []).includes(t),
                    ).length *
                      15 +
                    (event.category === "All" ? 0 : 10),
                )}
                %
              </span>
              <span className="text-[9.55px] font-semibold text-gray-900 capitalize tracking-wide">
                {t("Ταίριασμα", "Match")}
              </span>
            </div>
          )}
        </div>

        <div className="flex flex-col gap-2 mb-4">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-gray-900 text-[12.73px] font-medium">
            <div className="flex items-center bg-gray-50 px-2 py-1 rounded-md">
              <Clock className="w-3.5 h-3.5 mr-1.5 text-cyan-500 shrink-0" />
              <span>{weekday}, {event.time}</span>
            </div>
            <div className="flex items-center bg-gray-50 px-2 py-1 rounded-md">
              <MapPin className="w-3.5 h-3.5 mr-1.5 text-cyan-500 shrink-0" />
              <span className="truncate max-w-[160px]">{event.locationArea}</span>
            </div>
          </div>
          {event.lat && event.lng ? (
            <div
              className="h-24 w-full rounded-lg overflow-hidden border border-gray-200 mt-1 relative z-0 pointer-events-none"
              onClick={(e) => e.stopPropagation()}
            >
              <MapContainer
                center={[event.lat, event.lng]}
                zoom={14}
                zoomControl={false}
                attributionControl={false}
                style={{ height: "100%", width: "100%" }}
              >
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <Marker position={[event.lat, event.lng]} />
              </MapContainer>
            </div>
          ) : (
            <div className="h-24 w-full rounded-lg border border-gray-200 bg-gray-50 flex items-center justify-center mt-2">
              <span className="text-gray-900 text-xs font-bold flex items-center gap-1">
                <MapPin className="w-4 h-4" /> {event.locationArea}
              </span>
            </div>
          )}
          <div className="flex items-center text-gray-900 text-[12.73px] font-medium mt-2">
            <Users className="w-3.5 h-3.5 mr-2 text-gray-900 shrink-0" />
            <span>
              {(event.maxParticipants || 40) - 12}{" "}
              {t("θέσεις έμειναν", "spots left")}
            </span>
          </div>
          
          {userGroup && (
            <button
               onClick={(e) => {
                 e.stopPropagation();
                 navigate(`/chat/${userGroup.id}`);
               }}
               className="mt-3 w-full bg-cyan-50 hover:bg-cyan-100 text-cyan-700 py-2 rounded-xl text-[12.73px] font-bold transition-colors flex items-center justify-center gap-2 border border-cyan-100"
            >
               <Users className="w-4 h-4" />
               {t('Μετάβαση στο Group Chat', 'View Group Chat')}
            </button>
          )}
        </div>

        {/* Organizer */}
        {organizer && (
          <div className="flex items-center justify-between mb-4 bg-gray-50/50 rounded-xl p-2.5 border border-gray-100 hover:bg-gray-50 transition-colors">
            <div className="flex items-center gap-2.5">
              <div className="relative">
                <img
                  referrerPolicy="no-referrer"
                  src={organizer.photoUrl}
                  alt={organizer.name}
                  className="w-8 h-8 rounded-full object-cover border-2 border-white shadow-sm"
                />
                <div className="absolute -bottom-0.5 -right-0.5 bg-green-500 w-2.5 h-2.5 rounded-full border-2 border-white"></div>
              </div>
              <div className="flex flex-col">
                <span className="text-[10.93px] text-gray-900 font-semibold mb-0.5 capitalize">
                  {t("event_card.organizer", "Organizer")}
                </span>
                <button
                  className="text-xs font-bold text-gray-900 text-left hover:text-cyan-600 transition-colors line-clamp-1"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/organizer/${organizer.id}`);
                  }}
                >
                  {organizer.name}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Arrival & Safety Toggle */}
        <div className="mb-3">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowSafetyPanel(!showSafetyPanel);
            }}
            className="w-full flex items-center justify-between py-1.5 focus:outline-none"
          >
            <span className="text-[12.02px] font-bold text-gray-900 flex items-center gap-1.5 capitalize tracking-tight">
              <ShieldCheck className="w-3.5 h-3.5 text-cyan-600" />
              {t("Άφιξη & Ασφάλεια", "Arrival & Safety")}
            </span>
            <span className="text-[10.93px] text-gray-900 font-medium">
              {showSafetyPanel ? t("Απόκρυψη", "Hide") : t("Εμφάνιση", "Show")}
            </span>
          </button>

          {showSafetyPanel && (
            <div
              className="mt-2 space-y-3 p-3 bg-gray-50 border border-gray-100 rounded-xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* 1. Arrival Status */}
              <div className="space-y-1.5">
                <p className="text-[12.02px] font-semibold text-gray-900 tracking-tight capitalize">
                  {t("Κατάσταση Άφιξης", "Arrival Status")}
                </p>
                <div className="grid grid-cols-2 gap-1.5">
                  {[
                    t("Είμαι καθ' οδόν", "I'm on my way"),
                    t("Θα αργήσω", "I'll be late"),
                    t("Έφτασα στο σημείο", "I arrived at meeting point"),
                    t("Δεν θα τα καταφέρω", "Cannot make it"),
                  ].map((status) => (
                    <button
                      key={status}
                      onClick={() => setArrivalStatus(status)}
                      className={`text-[9.84px] font-bold py-1.5 px-2 rounded-lg border transition-colors ${arrivalStatus === status ? "bg-cyan-600 text-white border-cyan-600" : "bg-white text-gray-900 border-gray-200 hover:border-cyan-300"}`}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              </div>

              {/* 2. Share ETA */}
              <div className="space-y-1.5">
                <div className="flex gap-1.5">
                  <button
                    onClick={() => setShowEtaPrompt(!showEtaPrompt)}
                    className="flex-1 text-[10.93px] font-bold py-1.5 px-2 bg-white text-cyan-700 border border-cyan-100 rounded-lg hover:bg-cyan-50 flex items-center justify-center gap-1"
                  >
                    <Clock className="w-3 h-3" />{" "}
                    {t("Κοινοποίηση ETA", "Share ETA")}
                  </button>
                  <button
                    onClick={() => setShowSafetyLinkModal(true)}
                    className="flex-1 text-[10.93px] font-bold py-1.5 px-2 bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-lg hover:bg-emerald-100 flex items-center justify-center gap-1"
                  >
                    <Link2 className="w-3 h-3" />{" "}
                    {t("Επαφή Εμπιστοσύνης", "Trusted Contact")}
                  </button>
                </div>
                {showEtaPrompt && (
                  <div className="flex gap-2 items-center bg-white p-2 rounded border border-gray-200 mt-1.5 shadow-sm">
                    <input
                      type="text"
                      value={etaValue}
                      onChange={(e) => setEtaValue(e.target.value)}
                      className="flex-1 text-[11px] font-medium p-1 border-b border-gray-200 focus:border-cyan-600 outline-none"
                      placeholder={t("π.χ. 15 λεπτά", "e.g. 15 mins")}
                    />
                    <button
                      onClick={() => {
                        setArrivalStatus(`${t("ETA")}: ${etaValue}`);
                        setShowEtaPrompt(false);
                      }}
                      className="text-[10px] font-bold bg-cyan-600 text-white px-3 py-1 rounded"
                    >
                      {t("Αποστολή", "Send")}
                    </button>
                  </div>
                )}
              </div>

              {/* 3 & 4. Location Sharing */}
              <div className="pt-1.5">
                <button
                  onClick={() => setShowLocationConfigModal(true)}
                  className={`w-full flex items-center justify-between px-3 py-2 border rounded-lg transition-colors text-left shadow-sm ${isSharingLocation ? "bg-cyan-50 border-cyan-200 hover:bg-cyan-100" : "bg-white hover:bg-gray-50 border-gray-200"}`}
                >
                  <div>
                    <p
                      className={`text-[11px] font-bold ${isSharingLocation ? "text-cyan-700" : "text-[#111827]"}`}
                    >
                      {isSharingLocation
                        ? t("Η τοποθεσία κοινοποιείται", "Location Shared")
                        : t(
                            "Κοινοποίηση Ζωντανής Τοποθεσίας",
                            "Share Live Location",
                          )}
                    </p>
                    <p
                      className={`text-[9px] mt-0.5 ${isSharingLocation ? "text-cyan-600/80" : "text-gray-900"}`}
                    >
                      {isSharingLocation
                        ? t(
                            "Πατήστε για διαχείριση ή διακοπή",
                            "Tap to manage or stop",
                          )
                        : t(
                            "Προαιρετική, προσωρινή κοινοποίηση",
                            "Opt-in, temporary sharing",
                          )}
                    </p>
                  </div>
                  <MapPin
                    className={`w-3.5 h-3.5 ${isSharingLocation ? "text-cyan-600" : "text-gray-900"}`}
                  />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Group progress + Join */}
        <div className="mt-auto pt-3 border-t border-gray-100">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[12.02px] font-bold text-gray-900 tracking-tight capitalize">
              {t("event_card.forming", "Forming")}
            </span>
          </div>
          <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden mb-3">
            <div className="bg-[#18D8DB] h-full w-[45%] rounded-full" />
          </div>
          <div className="flex items-center justify-between">
            <div className="flex gap-2">
              <button
                className="text-[10.93px] text-gray-900 hover:text-[#0E8B8D] transition-colors font-medium underline underline-offset-2"
                onClick={getCalendarUrl}
                title={t(
                  "Προσθήκη στο Google Calendar",
                  "Add to Google Calendar",
                )}
              >
                + Cal
              </button>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/events/${event.id}`);
                }}
                className="px-4 py-2 bg-gray-100 text-gray-900 text-[12.02px] font-bold rounded-full hover:bg-gray-200 transition-colors tracking-tight"
                title={t("Λεπτομέρειες", "View Details")}
              >
                {t("Λεπτομέρειες", "View Details")}
              </button>
              <button className="px-5 py-2 bg-[#111827] text-white text-[12.02px] font-bold rounded-full shadow-sm hover:bg-black transition-colors tracking-tight">
                {t("event_card.join", "Join")}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modals via Portal */}
      {showLocationConfigModal &&
        typeof document !== "undefined" &&
        createPortal(
          <div
            className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className="bg-white rounded-2xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto custom-scrollbar border border-gray-100 animate-in zoom-in-95 duration-200"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-5 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white/95 backdrop-blur-sm z-10">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-cyan-50 rounded-full flex items-center justify-center text-cyan-600">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-[#111827]">
                      {t(
                        "Κοινοποίηση Ζωντανής Τοποθεσίας",
                        "Live Location Sharing",
                      )}
                    </h3>
                    <p className="text-[11px] font-medium text-gray-900">
                      {t("Προαιρετικό & Προσωρινό", "Optional & temporary")}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowLocationConfigModal(false)}
                  className="text-gray-900 hover:text-gray-900 p-1.5 rounded-full hover:bg-gray-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-5 space-y-6">
                {isSharingLocation && (
                  <div className="bg-cyan-50 border border-cyan-100 rounded-xl p-4 flex flex-col gap-3">
                    <div className="flex items-center gap-2 text-cyan-700">
                      <Navigation className="w-4 h-4 animate-pulse" />
                      <span className="text-sm font-bold">
                        {t(
                          "Αυτή τη στιγμή κοινοποιείτε την τοποθεσία σας",
                          "You are currently sharing location",
                        )}
                      </span>
                    </div>
                    <button
                      onClick={() => {
                        setIsSharingLocation(false);
                        setShowLocationConfigModal(false);
                      }}
                      className="w-full bg-white text-red-600 border border-red-200 hover:bg-red-50 py-2 rounded-lg text-[11px] font-bold tracking-tight capitalize"
                    >
                      {t("Διακοπή Κοινοποίησης", "Stop Sharing Now")}
                    </button>
                  </div>
                )}

                <div className="space-y-3">
                  <h4 className="text-xs font-bold capitalize text-gray-900 tracking-tight">
                    {t("1. Ακρίβεια", "1. Precision")}
                  </h4>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() =>
                        setLocationConfig({
                          ...locationConfig,
                          precision: "approximate",
                        })
                      }
                      className={`p-3 rounded-xl border text-left flex flex-col h-full transition-all ${locationConfig.precision === "approximate" ? "border-[#111827] bg-gray-50 ring-1 ring-[#111827]" : "border-gray-200 hover:border-gray-300"}`}
                    >
                      <span
                        className={`text-[13px] font-bold ${locationConfig.precision === "approximate" ? "text-[#111827]" : "text-gray-900"}`}
                      >
                        {t("Κατά προσέγγιση", "Approximate")}
                      </span>
                      <span className="text-[10px] text-gray-900 mt-1 leading-relaxed">
                        {t(
                          "Μόνο απόσταση & ETA, χωρίς χάρτη",
                          "Distance & ETA only, no map pin",
                        )}
                      </span>
                    </button>
                    <button
                      onClick={() =>
                        setLocationConfig({
                          ...locationConfig,
                          precision: "exact",
                        })
                      }
                      className={`p-3 rounded-xl border text-left flex flex-col h-full transition-all ${locationConfig.precision === "exact" ? "border-[#111827] bg-gray-50 ring-1 ring-[#111827]" : "border-gray-200 hover:border-gray-300"}`}
                    >
                      <span
                        className={`text-[13px] font-bold ${locationConfig.precision === "exact" ? "text-[#111827]" : "text-gray-900"}`}
                      >
                        {t("Ακριβής", "Exact")}
                      </span>
                      <span className="text-[10px] text-gray-900 mt-1 leading-relaxed">
                        {t(
                          "Ακριβής παρακολούθηση GPS",
                          "Precise GPS live tracking",
                        )}
                      </span>
                    </button>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="text-xs font-bold capitalize text-gray-900 tracking-tight">
                    {t("2. Κοινοποίηση Σε", "2. Share With")}
                  </h4>
                  <div className="flex flex-col gap-2">
                    {["organizer", "selected", "all"].map((option) => (
                      <label
                        key={option}
                        className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${locationConfig.shareWith === option ? "border-cyan-600 bg-cyan-50/30" : "border-gray-200 hover:bg-gray-50"}`}
                      >
                        <div className="flex items-center justify-center relative">
                          <input
                            type="radio"
                            name="shareWith"
                            className="sr-only"
                            checked={locationConfig.shareWith === option}
                            onChange={() =>
                              setLocationConfig({
                                ...locationConfig,
                                shareWith: option,
                              })
                            }
                          />
                          <div
                            className={`w-5 h-5 rounded-full border flex items-center justify-center ${locationConfig.shareWith === option ? "border-cyan-600 bg-cyan-600" : "border-gray-300"}`}
                          >
                            {locationConfig.shareWith === option && (
                              <span className="w-2 h-2 rounded-full bg-white"></span>
                            )}
                          </div>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-sm font-bold text-[#111827]">
                            {option === "organizer" &&
                              t("Μόνο Διοργανωτής", "Organizer Only")}
                            {option === "selected" &&
                              t("Επιλεγμένα Μέλη", "Selected Members")}
                            {option === "all" &&
                              t(
                                "Όλη η Επιβεβαιωμένη Ομάδα",
                                "Entire Confirmed Group",
                              )}
                          </span>
                          {option === "organizer" && (
                            <span className="text-[10px] text-gray-900 leading-relaxed">
                              {t(
                                "Ιδανικό για ξεναγήσεις & πεζοπορίες",
                                "Best for guided hikes or escapes",
                              )}
                            </span>
                          )}
                          {option === "all" && (
                            <span className="text-[10px] text-amber-600 leading-relaxed">
                              {t(
                                "Όλοι σε αυτό το chat βλέπουν την τοποθεσία σας",
                                "Everyone in this chat will see your location",
                              )}
                            </span>
                          )}
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="text-xs font-bold capitalize text-gray-900 tracking-tight">
                    {t("3. Αυτόματη Λήξη", "3. Auto-Expiry")}
                  </h4>
                  <select
                    value={locationConfig.duration}
                    onChange={(e) =>
                      setLocationConfig({
                        ...locationConfig,
                        duration: e.target.value,
                      })
                    }
                    className="w-full border border-gray-200 rounded-xl p-3 text-sm font-medium focus:ring-2 focus:ring-[#111827] bg-white outline-none"
                  >
                    <option value="arrival">
                      {t(
                        "Μέχρι να φτάσω στο σημείο",
                        "Until I arrive at meeting point",
                      )}
                    </option>
                    <option value="event_start">
                      {t("Μέχρι να ξεκινήσει η εκδήλωση", "Until event starts")}
                    </option>
                    <option value="event_end">
                      {t("Μέχρι το τέλος της εκδήλωσης", "Until event ends")}
                    </option>
                    <option value="1hr">{t("Για 1 ώρα", "For 1 hour")}</option>
                  </select>
                </div>
              </div>

              <div className="p-5 border-t border-gray-100 bg-gray-50/50">
                <button
                  onClick={() => {
                    setIsSharingLocation(true);
                    setShowLocationConfigModal(false);
                  }}
                  className="w-full px-4 py-3 text-sm font-bold text-white bg-[#111827] hover:bg-gray-900 rounded-xl transition-all shadow-sm active:scale-[0.98]"
                >
                  {isSharingLocation
                    ? t("Ενημέρωση", "Update Configuration")
                    : t("Έναρξη", "Start Sharing")}
                </button>
              </div>
            </div>
          </div>,
          document.body,
        )}

      {showSafetyLinkModal &&
        typeof document !== "undefined" &&
        createPortal(
          <div
            className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className="bg-white rounded-2xl shadow-xl max-w-sm w-full p-6 text-center border border-gray-100 animate-in zoom-in-95 duration-200"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="w-12 h-12 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-4 text-emerald-600">
                <Link2 className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-[#111827] mb-2">
                {t("Σύνδεσμος Επαφής Εμπιστοσύνης", "Trusted Contact Link")}
              </h3>
              <p className="text-xs font-medium leading-relaxed text-gray-900 mb-6">
                {t(
                  "Αυτό δημιουργεί έναν προσωρινό σύνδεσμο ασφαλείας. Μοιραστείτε τον με ένα φίλο. Θα βλέπει την τοποθεσία σας μέχρι το τέλος της εκδήλωσης.",
                  "This creates a temporary safety link. Share this securely with a trusted friend or family member outside of Nakamas. They will see your live location until the event ends.",
                )}
              </p>
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 flex items-center justify-between mb-6">
                <span className="text-xs font-medium text-gray-900 truncate mr-2">
                  https://nakamas.app/safe/r9x2p
                </span>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(
                      "https://nakamas.app/safe/r9x2p",
                    );
                    alert(t("Ο σύνδεσμος αντιγράφηκε", "Copied to clipboard"));
                  }}
                  className="text-[#0E8B8D] font-bold text-[11px] hover:bg-cyan-50 px-2 py-1 rounded transition-colors"
                >
                  {t("Αντιγραφη", "Copy")}
                </button>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowSafetyLinkModal(false)}
                  className="flex-1 px-4 py-3 text-sm font-bold text-gray-900 hover:bg-gray-50 rounded-xl transition-all active:scale-[0.98]"
                >
                  {t("Ακύρωση", "Cancel")}
                </button>
                <button
                  onClick={() => {
                    if (navigator.share) {
                      navigator.share({
                        title: "Tracking Link",
                        url: "https://nakamas.app/safe/r9x2p",
                      });
                    } else {
                      navigator.clipboard.writeText(
                        "https://nakamas.app/safe/r9x2p",
                      );
                      alert(t("Ο σύνδεσμος αντιγράφηκε", "Copied"));
                    }
                    setShowSafetyLinkModal(false);
                  }}
                  className="flex-1 px-4 py-3 text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition-all shadow-sm active:scale-[0.98]"
                >
                  {t("Κοινοποιηση", "Share")}
                </button>
              </div>
            </div>
          </div>,
          document.body,
        )}
    </Card>
  );
});
