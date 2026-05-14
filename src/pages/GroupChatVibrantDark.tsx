import React, { useState, useRef, useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useStore } from "../store";
import {
  Send,
  Users,
  ArrowLeft,
  Info,
  MapPin,
  Calendar,
  ShieldCheck,
  Tag,
  X,
  Clock,
  Filter,
  Search,
  Navigation,
  Link2,
  Compass,
  UserPlus,
  Check,
  AlertTriangle,
} from "lucide-react";
import { Virtuoso } from "react-virtuoso";
import { useLanguage } from "../lib/i18n";
import { LiveEventTracker } from "../components/groups/LiveEventTracker";

interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  text: string;
  timestamp: string;
  type?: "text" | "system" | "location";
}

export default function GroupChatVibrantDark() {
  const { t } = useLanguage();
  const { groupId } = useParams();
  const navigate = useNavigate();
  const events = useStore((state) => state.events);
  const groups = useStore((state) => state.groups);
  const users = useStore((state) => state.users);
  const currentUser = useStore((state) => state.currentUser);

  // Ensure we default to an array even if map fails, though mock data shouldn't
  const group =
    groups.find((g) => g.id === groupId) ||
    groups.find((g) => g.eventId === groupId); // Fallback if routing passes eventId
  const event = events.find((e) => e.id === group?.eventId);

  // Lazy initializer: the 1000-message array is built only once on mount
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    const msgs: ChatMessage[] = Array.from({ length: 1000 }).map((_, i) => ({
      id: `m${i}`,
      senderId: i % 2 === 0 ? "u2" : i % 3 === 0 ? "u3" : currentUser.id,
      senderName:
        i % 2 === 0 ? "Maria" : i % 3 === 0 ? "Nikos" : currentUser.name,
      text: t(
        `Μήνυμα ${i} από προηγούμενες συνομιλίες. ${i % 5 === 0 ? "Ανυπομονώ!" : ""}`,
        `Test message ${i} from previous conversations. ${i % 5 === 0 ? "Looking forward to it!" : ""}`,
      ),
      timestamp: new Date(Date.now() - (1000 - i) * 60000).toISOString(),
    }));
    msgs.push(
      {
        id: "system1",
        senderId: "system",
        senderName: "System",
        text: t(
          "Η ομάδα επιβεβαιώθηκε! Πείτε γεια στα νέα σας Nakamas. Οι λεπτομέρειες συνάντησης είναι διαθέσιμες στο πάνελ πληροφοριών.",
          "Group confirmed! Say hi to your new Nakamas. Meeting details are available in the info panel.",
        ),
        timestamp: new Date(Date.now() - 86400000).toISOString(),
      },
      {
        id: "msg-maria",
        senderId: "u2",
        senderName: "Maria",
        text: t(
          "Γεια σε όλους! Είμαι ενθουσιασμένη γι' αυτό!",
          "Hey everyone! Excited for this.",
        ),
        timestamp: new Date(Date.now() - 3600000).toISOString(),
      },
    );
    return msgs;
  });
  const [newMessage, setNewMessage] = useState("");
  const [showInfo, setShowInfo] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [showLeaveModal, setShowLeaveModal] = useState(false);
  const [showSearchMobile, setShowSearchMobile] = useState(false);
  const [showEphemeralBanner, setShowEphemeralBanner] = useState(true);
  const [isEphemeral, setIsEphemeral] = useState(true);
  const [showDisableEphemeralModal, setShowDisableEphemeralModal] =
    useState(false);
  const [isSharingLocation, setIsSharingLocation] = useState(false);
  const [showLocationConfigModal, setShowLocationConfigModal] = useState(false);
  const [showLiveRadarModal, setShowLiveRadarModal] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [showSafetyLinkModal, setShowSafetyLinkModal] = useState(false);
  const [locationConfig, setLocationConfig] = useState({
    precision: "approximate",
    shareWith: "all",
    duration: "event_end",
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [memberSearchQuery, setMemberSearchQuery] = useState("");
  const [showAddMemberModal, setShowAddMemberModal] = useState(false);
  const [memberAddSearchQuery, setMemberAddSearchQuery] = useState("");
  const [renderTrigger, setRenderTrigger] = useState(0);
  const [senderFilter, setSenderFilter] = useState<string>("all");
  const virtuosoRef = useRef<any>(null);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const msg: ChatMessage = {
      id: Date.now().toString(),
      senderId: currentUser.id,
      senderName: currentUser.name,
      text: newMessage,
      timestamp: new Date().toISOString(),
    };

    setMessages([...messages, msg]);
    setNewMessage("");

    // Scroll to bottom after state update
    setTimeout(() => {
      if (virtuosoRef.current) {
        virtuosoRef.current.scrollToIndex({
          index: "LAST",
          align: "end",
          behavior: "smooth",
        });
      }
    }, 50);
  };

  const handleDeleteMessage = (id: string) => {
    setMessages(messages.filter((m) => m.id !== id));
  };

  const filteredMessages = useMemo(() => {
    return messages
      .filter((m) => senderFilter === "all" || m.senderId === senderFilter)
      .filter((m) => m.text.toLowerCase().includes(searchQuery.toLowerCase()));
  }, [messages, senderFilter, searchQuery]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (virtuosoRef.current) {
        virtuosoRef.current.scrollToIndex({
          index: "LAST",
          align: "end",
          behavior: "auto",
        });
      }
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  if (!group || !event) {
    return (
      <div className="p-8 text-center text-white">
        {t(
          "Το Chat δεν βρέθηκε ή η ομάδα δεν επιβεβαιώθηκε.",
          "Chat not found or group not confirmed.",
        )}
      </div>
    );
  }

  // Determine if the current user is an admin of the group
  const isGroupAdmin =
    currentUser.id === group.hostId ||
    currentUser.id === event.organizerId ||
    currentUser.isOrganizer;

  // Track the actual members. We depend on renderTrigger to update
  const currentMembersStr = group.members.join(",");
  const groupMembersDetailed = group.members.map(
    (mId) => users.find((u) => u.id === mId) || currentUser,
  );
  const potentialNewMembers = users.filter(
    (u) => !group.members.includes(u.id) && !u.isOrganizer,
  );

  const renderMessage = (index: number, msg: ChatMessage) => {
    const isSystem = msg.senderId === "system" && msg.type !== "location";
    const isLocationMsg = msg.type === "location";
    const isMe = msg.senderId === currentUser.id;

    if (isSystem) {
      return (
        <div
          key={msg.id}
          className="text-center my-6 flex justify-center w-full px-4"
        >
          <span className="text-[11px] font-semibold tracking-tight capitalize text-white bg-gray-900 px-4 py-2 rounded-full shadow-sm max-w-sm text-center leading-relaxed">
            {msg.text}
          </span>
        </div>
      );
    }

    if (isLocationMsg) {
      return (
        <div
          key={msg.id}
          className="text-center my-6 flex justify-center w-full px-4 animate-in fade-in duration-300"
        >
          <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-100 px-4 py-2.5 rounded-full shadow-sm max-w-sm">
            <Compass className="h-4 w-4 text--400 animate-pulse" />
            <span className="text-[12px] font-medium text--400 leading-tight">
              {msg.text}
            </span>
          </div>
        </div>
      );
    }

    return (
      <div
        key={msg.id}
        className={`flex flex-col group py-2.5 w-full px-4 md:px-6 ${isMe ? "items-end" : "items-start"} animate-in fade-in slide-in-from-bottom-2 duration-300`}
      >
        <span className="text-[11px] font-semibold tracking-tight capitalize text-white ml-1 mb-1">
          {isMe ? t("Εσείς", "You") : msg.senderName}
        </span>
        <div className="flex items-center gap-2">
          {isMe && (
            <button
              onClick={() => handleDeleteMessage(msg.id)}
              className="opacity-0 group-hover:opacity-100 p-1.5 text-white hover:text-red-500 hover:bg-red-50 transition-all rounded-full"
              title={t("Διαγραφή μηνύματος", "Delete message")}
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
          <div
            className={`max-w-[85%] sm:max-w-[75%] md:max-w-[65%] rounded-2xl px-4 py-2.5 text-[15px] leading-relaxed relative ${
              isMe
                ? "bg-gradient-to-br from-red-900 via-rose-900 to-red-800 text-white rounded-tr-sm shadow-sm"
                : "bg-gray-800 border border-gray-700 text-white rounded-tl-sm shadow-sm"
            }`}
          >
            {msg.text}
          </div>
        </div>
        <span className="text-[10px] text-white mt-1 mr-1 font-medium tracking-wide">
          {new Date(msg.timestamp).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </span>
      </div>
    );
  };

  return (
    <div className="w-full h-full px-[5px] md:px-0 mx-auto max-w-[1200px]">
      <div className="w-full h-[calc(100dvh-5rem)] md:h-[calc(100dvh-6rem)] flex bg-gray-800 border border-gray-700 rounded-xl shadow-sm overflow-hidden relative">
        <div
          className={`flex flex-col flex-1 h-full min-w-0 ${showInfo ? "hidden md:flex border-r border-gray-700" : "flex"}`}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-3 md:px-5 py-3 border-b border-gray-700 bg-gray-800 shrink-0 relative z-20">
            {showSearchMobile ? (
              <div className="flex items-center gap-2 w-full animate-in fade-in slide-in-from-right-4 duration-200">
                <button
                  onClick={() => {
                    setShowSearchMobile(false);
                    setSearchQuery("");
                  }}
                  className="p-2 text-white hover:text-white"
                >
                  <ArrowLeft className="h-5 w-5" />
                </button>
                <input
                  autoFocus
                  type="text"
                  placeholder={t("Αναζήτηση συνομιλίας...", "Search chat...")}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#111827] bg-gray-900"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="p-2 text-white hover:text-white"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
            ) : (
              <>
                <div className="flex items-center gap-3 overflow-hidden">
                  <button
                    onClick={() => navigate(-1)}
                    className="text-white hover:text-white transition-colors p-1 shrink-0"
                  >
                    <ArrowLeft className="h-5 w-5" />
                  </button>
                  <div className="min-w-0">
                    <h2 className="text-sm md:text-base font-bold text-white truncate">
                      {event.title}
                    </h2>
                    <p className="text-[10px] md:text-[11px] text-white tracking-wide font-bold truncate flex items-center gap-1.5 mt-0.5">
                      <Users className="h-3 w-3 shrink-0" />{" "}
                      {group.members.length} {t("Μέλη", "Members")}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-1 sm:gap-2 shrink-0">
                  {/* Desktop Search & Filter */}
                  <div className="hidden md:flex items-center gap-3 mr-2">
                    <select
                      value={senderFilter}
                      onChange={(e) => setSenderFilter(e.target.value)}
                      className="text-[11px] font-bold border border-gray-700 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-cyan-500 bg-gray-900 text-white hover:bg-gray-700 cursor-pointer transition-colors max-w-[120px] truncate"
                    >
                      <option value="all">
                        {t("Όλοι οι Αποστολείς", "All Senders")}
                      </option>
                      {groupMembersDetailed.map((m) => (
                        <option key={m.id} value={m.id}>
                          {m.name}
                        </option>
                      ))}
                    </select>
                    <div className="relative group">
                      <Search className="h-3.5 w-3.5 text-white absolute left-2.5 top-1/2 -translate-y-1/2 group-focus-within:text-cyan-400 transition-colors" />
                      <input
                        type="text"
                        placeholder={t("Αναζήτηση...", "Search...")}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-8 pr-3 py-1.5 text-xs border border-gray-700 rounded-lg focus:outline-none focus:ring-1 focus:ring-cyan-500 w-32 xl:w-48 bg-gray-900 focus:bg-gray-800 transition-all"
                      />
                    </div>
                  </div>

                  {/* Mobile Search Toggle */}
                  <button
                    onClick={() => setShowSearchMobile(true)}
                    className="text-white hover:text-white hover:bg-gray-700 rounded-full transition-colors p-2 md:hidden"
                  >
                    <Search className="h-5 w-5" />
                  </button>

                  {/* Info Toggle */}
                  <button
                    onClick={() => setShowInfo(!showInfo)}
                    className={`transition-colors p-2 rounded-full ${showInfo ? "text-cyan-400 bg-emerald-900/30" : "text-white hover:text-white hover:bg-gray-700"}`}
                  >
                    <Info className="h-5 w-5" />
                  </button>
                </div>
              </>
            )}
          </div>

          {/* Ephemeral Notice */}
          {isEphemeral && showEphemeralBanner && (
            <div className="w-full shrink-0 border-b border-amber-200/60 bg-amber-50/80 px-2 py-2 sm:px-3 text-center shadow-sm z-10 backdrop-blur-sm flex items-center justify-center relative">
              <div className="flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 text-[10px] sm:text-[11px] font-bold tracking-wide text-amber-800 pr-6 w-full">
                <span className="flex items-center justify-center gap-1.5 whitespace-nowrap">
                  <ShieldCheck className="h-3.5 w-3.5 shrink-0" />{" "}
                  {t("Εφήμερη Λειτουργία", "Ephemeral Mode")}
                </span>
                <span className="hidden sm:inline w-1 h-1 rounded-full bg-amber-300 opacity-60 shrink-0"></span>
                <span className="font-medium text-amber-700/80 flex items-center justify-center gap-1 leading-tight w-full max-w-full overflow-hidden">
                  <Clock className="h-3 w-3 shrink-0" />{" "}
                  <span className="truncate whitespace-normal sm:whitespace-nowrap">
                    {t(
                      "Η συνομιλία διαγράφεται 24 ώρες μετά την εκδήλωση",
                      "Chat destructs 24h after event",
                    )}
                  </span>
                </span>
              </div>
              <button
                onClick={() => setShowEphemeralBanner(false)}
                className="p-1.5 text-amber-600/80 hover:bg-amber-200 hover:text-amber-800 rounded-full transition-colors absolute right-1 sm:right-2 top-1/2 -translate-y-1/2 shrink-0"
                title={t("Κλείσιμο Ειδοποίησης", "Close Banner")}
              >
                <X className="h-4 w-4 sm:h-5 sm:w-5" />
              </button>
            </div>
          )}

          {/* Messages Virtualized */}
          <div className="flex-1 min-h-0 bg-[#F9FAFB] relative shadow-inner">
            {isSharingLocation && (
              <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20">
                <button
                  onClick={() => setShowLocationConfigModal(true)}
                  className="bg-gray-800/90 backdrop-blur-sm border border-emerald-200 text--400 shadow-sm px-4 py-2 rounded-full text-xs font-bold flex items-center gap-2"
                >
                  <span className="flex h-2 w-2 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                  {t("Κοινοποίηση Τοποθεσίας", "Sharing Location")}
                </button>
              </div>
            )}
            <Virtuoso
              ref={virtuosoRef}
              data={filteredMessages}
              itemContent={renderMessage}
              className="h-full w-full custom-scrollbar"
              alignToBottom={true}
            />
          </div>

          {/* Input */}
          <form
            onSubmit={handleSend}
            className="p-3 sm:p-4 border-t border-gray-700 bg-gray-800 shrink-0 relative z-20"
          >
            <div className="flex items-center gap-2 md:gap-3 max-w-4xl mx-auto w-full relative">
              <button
                type="button"
                onClick={() => setShowLocationConfigModal(true)}
                className={`p-2.5 rounded-full transition-all flex items-center justify-center shrink-0 border hidden sm:flex ${
                  isSharingLocation
                    ? "bg-emerald-50 text--400 border-emerald-200 ring-2 ring-emerald-500/20"
                    : "bg-gray-900 text-white border-gray-700 hover:bg-gray-700 hover:text-white"
                }`}
                title={t("Τοποθεσία & Ασφάλεια", "Location & Safety")}
              >
                <Compass
                  className={`h-5 w-5 ${isSharingLocation ? "animate-pulse" : ""}`}
                />
              </button>
              <button
                type="button"
                onClick={() => {
                  const isSos = useStore
                    .getState()
                    .groups.find((g) => g.id === group.id)?.membersLocations?.[
                    currentUser.id
                  ]?.sos;
                  useStore
                    .getState()
                    .triggerSos(group.id, currentUser.id, !isSos);
                  setMessages((prev) => [
                    ...prev,
                    {
                      id: Date.now().toString(),
                      senderId: "system",
                      senderName: "System",
                      text: !isSos
                        ? `${currentUser.name} ${t("ενεργοποίησε το SOS Flare! Βρίσκεται σε ανάγκη.", "triggered the SOS flare! They need help.")}`
                        : `${currentUser.name} ${t("απενεργοποίησε το SOS.", "deactivated the SOS.")}`,
                      timestamp: new Date().toISOString(),
                    },
                  ]);
                }}
                className={`p-2.5 rounded-full transition-all flex items-center justify-center shrink-0 border ${
                  group.membersLocations?.[currentUser.id]?.sos
                    ? "bg-red-600 text-white border-red-700 ring-2 ring-red-500 animate-pulse"
                    : "bg-red-50 text--400 border-red-200 hover:bg-red-100"
                }`}
                title={t("SOS / Βοήθεια", "SOS / Help")}
              >
                <AlertTriangle className="h-5 w-5" />
              </button>
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder={t(
                    "Πληκτρολογήστε ένα μήνυμα...",
                    "Type a message...",
                  )}
                  className="w-full bg-gray-700 border border-transparent rounded-full py-3 md:py-3.5 pl-5 pr-14 text-sm focus:bg-gray-800 focus:ring-2 focus:ring-[#111827] focus:border-[#111827] outline-none transition-all shadow-sm"
                />
                <button
                  type="submit"
                  disabled={!newMessage.trim()}
                  className="absolute right-1.5 top-1/2 -translate-y-1/2 p-2 bg-gradient-to-br from-red-900 via-rose-900 to-red-800 text-white rounded-full hover:bg-gray-800 disabled:opacity-40 disabled:hover:bg-gradient-to-br from-red-900 via-rose-900 to-red-800 text-white transition-all shadow-sm"
                >
                  <Send className="h-4 w-4 md:h-4.5 md:w-4.5" />
                </button>
              </div>
            </div>
          </form>
        </div>

        {showInfo && (
          <div className="w-full md:w-[320px] lg:w-[380px] bg-gray-800 shrink-0 flex flex-col absolute md:relative z-30 h-full border-l border-gray-700 animate-in slide-in-from-right-8 duration-200">
            <div className="flex items-center justify-between p-4 border-b border-gray-700 bg-gray-800 sticky top-0 z-10 shadow-sm">
              <h3 className="font-bold text-white text-[14.85px] tracking-wide">
                {t("Λεπτομέρειες Ομάδας", "Group Details")}
              </h3>
              <button
                onClick={() => setShowInfo(false)}
                className="text-white hover:text-white p-1 rounded-full hover:bg-gray-700 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar p-5 space-y-6 bg-gray-900/50">
              {/* Event Summary */}
              <div className="bg-gray-800 rounded-xl shadow-sm border border-gray-700 overflow-hidden">
                <div className="relative h-28 w-full group">
                  <img
                    referrerPolicy="no-referrer"
                    src={event.imageUrl}
                    alt={event.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                  <div className="absolute bottom-3 left-4 right-4">
                    <h4 className="font-bold text-white text-sm line-clamp-1">
                      {event.title}
                    </h4>
                  </div>
                </div>

                <div className="p-4 space-y-3">
                  {event.tags && event.tags.length > 0 && (
                    <div className="flex gap-1.5 flex-wrap">
                      {event.tags.map((tag: string) => (
                        <span
                          key={tag}
                          className="bg-emerald-900/30 text-cyan-400 px-2.5 py-1 rounded-md text-[9px] font-bold tracking-wide border border-emerald-800"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="space-y-2.5 text-[13px] font-medium text-white">
                    <div className="flex items-start gap-3">
                      <div className="p-1.5 bg-gray-700 rounded-md text-white shrink-0">
                        <Calendar className="h-3.5 w-3.5" />
                      </div>
                      <span className="pt-0.5">
                        {new Date(event.date).toLocaleDateString()}{" "}
                        {t("στις", "at")} {event.time}
                      </span>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="p-1.5 bg-gray-700 rounded-md text-white shrink-0">
                        <MapPin className="h-3.5 w-3.5" />
                      </div>
                      <span className="pt-0.5 text-white font-semibold">
                        {event.exactLocation || event.locationArea}
                      </span>
                    </div>
                  </div>

                  <div className="mt-4 bg-blue-50/80 text--400 p-3 rounded-lg border border-blue-100 flex items-start gap-2">
                    <Info className="h-4 w-4 shrink-0 mt-0.5 text--400" />
                    <span className="text-[11px] font-semibold tracking-wide">
                      {t(
                        "Άφιξη: 20 λεπτά πριν την εκδήλωση",
                        "Target Arrival: 20 mins before event",
                      )}
                    </span>
                  </div>
                </div>
              </div>

              {event.groupDiscount && (
                <div
                  className={`p-4 rounded-xl border shadow-sm ${group.discountUnlocked ? "bg-emerald-50 border-emerald-200" : "bg-gray-800 border-gray-700"}`}
                >
                  <div className="flex items-center gap-2.5 mb-2">
                    <div
                      className={`p-1.5 rounded-full ${group.discountUnlocked ? "bg-emerald-100 text--400" : "bg-gray-700 text-white"}`}
                    >
                      <Tag className="h-4 w-4" />
                    </div>
                    <span
                      className={`font-bold text-sm ${group.discountUnlocked ? "text--400" : "text-white"}`}
                    >
                      {t("Ομαδική Έκπτωση", "Group Discount")}
                    </span>
                  </div>
                  <p
                    className={`text-xs font-medium leading-relaxed ${group.discountUnlocked ? "text--400" : "text-white"}`}
                  >
                    {group.discountUnlocked
                      ? t(
                          `Ξεκλειδώθηκε! ${event.groupDiscount.percentage}% έκπτωση εφαρμόστηκε.`,
                          `Unlocked! ${event.groupDiscount.percentage}% off applied to your tickets.`,
                        )
                      : t(
                          `Χρειάζονται ${event.groupDiscount.minSize} μέλη για να ξεκλειδωθεί έκπτωση ${event.groupDiscount.percentage}%.`,
                          `Need ${event.groupDiscount.minSize} members to unlock ${event.groupDiscount.percentage}% off.`,
                        )}
                  </p>
                </div>
              )}

              <div className="bg-gray-800 rounded-xl shadow-sm border border-gray-700 p-4">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-bold text-[13px] capitalize tracking-tight text-white">
                    {t("Μέλη Ομάδας", "Group Members")}
                  </h4>
                  <div className="flex items-center gap-2">
                    {isGroupAdmin && (
                      <button
                        onClick={() => setShowAddMemberModal(true)}
                        className="flex items-center gap-1 text-[10px] font-bold text-cyan-400 hover:text-cyan-400 bg-emerald-900/30 hover:bg-emerald-900/50 px-2 py-1 rounded border border-emerald-800 transition-colors"
                      >
                        <UserPlus className="w-3 h-3" />{" "}
                        {t("Προσθήκη Μελών", "Add Members")}
                      </button>
                    )}
                    <span className="text-[11px] font-bold text-white bg-gray-700 px-2 py-0.5 rounded-full">
                      {group.members.length}/{group.targetSize}
                    </span>
                  </div>
                </div>
                <div className="relative mb-4">
                  <Search className="h-3.5 w-3.5 text-white absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder={t("Αναζήτηση μελών...", "Search members...")}
                    value={memberSearchQuery}
                    onChange={(e) => setMemberSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-[13px] border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#111827] bg-gray-900 transition-all font-medium"
                  />
                </div>
                <div className="space-y-4 max-h-[300px] overflow-y-auto custom-scrollbar pr-1">
                  {groupMembersDetailed
                    .filter((m) =>
                      m.name
                        .toLowerCase()
                        .includes(memberSearchQuery.toLowerCase()),
                    )
                    .map((member) => {
                      const isCloseToEvent = false;
                      return (
                        <div
                          key={member.id}
                          className="flex items-center gap-3 p-2 hover:bg-gray-900 rounded-lg transition-colors border border-transparent hover:border-gray-800"
                        >
                          <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden shrink-0 relative group shadow-sm border border-gray-800">
                            {member.photoUrl ? (
                              <img
                                referrerPolicy="no-referrer"
                                src={member.photoUrl}
                                alt={member.name}
                                className={`w-full h-full object-cover transition-all ${!isCloseToEvent && member.id !== currentUser.id ? "blur-sm grayscale opacity-80" : ""}`}
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-white font-bold text-xs bg-emerald-900/30 text-cyan-400">
                                {member.name.substring(0, 2)}
                              </div>
                            )}
                            {!isCloseToEvent &&
                              member.id !== currentUser.id && (
                                <div className="absolute inset-0 bg-black/20 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-[1px]">
                                  <ShieldCheck className="w-4 h-4 text-white mb-0.5" />
                                  <span className="text-[7px] font-bold text-white tracking-wide text-center px-1">
                                    {t("Κρυφό", "Hidden")}
                                  </span>
                                </div>
                              )}
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2 mb-0.5">
                              <p className="text-[13px] font-bold text-white truncate">
                                {member.name}{" "}
                                {member.id === currentUser.id && (
                                  <span className="text-white font-medium ml-1">
                                    ({t("Εσείς", "You")})
                                  </span>
                                )}
                              </p>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <span
                                className={`px-1.5 py-0.5 text-[8px] font-bold flex shrink-0 tracking-wide rounded-md items-center gap-1 border ${member.reliabilityScore >= 80 ? "bg-emerald-50 text--400 border-emerald-100" : member.reliabilityScore >= 50 ? "bg-blue-50 text--400 border-blue-100" : "bg-amber-50 text-amber-700 border-amber-100"}`}
                              >
                                <ShieldCheck className="h-2.5 w-2.5" />
                                {member.reliabilityScore}%
                              </span>
                              <p
                                className={`text-[9px] font-bold tracking-wide truncate ${member.reliabilityScore >= 80 ? "text--400" : member.reliabilityScore >= 50 ? "text--400" : "text-amber-600"}`}
                              >
                                {member.reliabilityScore >= 80
                                  ? t("Υψηλή Αξιοπιστία", "Highly Reliable")
                                  : member.reliabilityScore >= 50
                                    ? t("Συχνός", "Frequent")
                                    : t("Χρειάζεται Βελτίωση", "Needs Work")}
                              </p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>

              {/* Chat Settings */}
              <div className="bg-gray-800 rounded-xl shadow-sm border border-gray-700 p-4 space-y-5">
                <div>
                  <h4 className="font-bold text-[13px] capitalize tracking-tight text-white mb-3 flex items-center gap-1.5">
                    <ShieldCheck className="h-3.5 w-3.5 text-white" />{" "}
                    {t("Ιδιωτικότητα Συνομιλίας", "Chat Privacy")}
                  </h4>
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex-1">
                      <p className="text-[13px] font-bold text-white">
                        {t("Εφήμερη Λειτουργία", "Ephemeral Mode")}
                      </p>
                      <p className="text-[11px] text-white mt-1 leading-relaxed">
                        {t(
                          "Το ιστορικό διαγράφεται 24 ώρες μετά. Πρέπει να συμφωνήσουν όλοι για διατήρηση.",
                          "Chat history deletes automatically 24h after the event. All members must agree to keep it permanently.",
                        )}
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        if (isEphemeral) {
                          setShowDisableEphemeralModal(true);
                        } else {
                          setIsEphemeral(true);
                        }
                      }}
                      role="switch"
                      aria-checked={isEphemeral}
                      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-[#111827] focus:ring-offset-2 ${isEphemeral ? "bg-gradient-to-br from-red-900 via-rose-900 to-red-800 text-white" : "bg-gray-200"}`}
                    >
                      <span className="sr-only">Toggle ephemeral mode</span>
                      <span
                        aria-hidden="true"
                        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-gray-800 shadow ring-0 transition duration-200 ease-in-out ${isEphemeral ? "translate-x-5" : "translate-x-0"}`}
                      />
                    </button>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-800">
                  <h4 className="font-bold text-[13px] capitalize tracking-tight text-white mb-3 flex items-center gap-1.5">
                    <Navigation className="h-3.5 w-3.5 text-white" />{" "}
                    {t("Άφιξη & Ασφάλεια", "Arrival & Safety")}
                  </h4>
                  <div className="space-y-2">
                    <button
                      onClick={() => setShowStatusModal(true)}
                      className="w-full flex items-center justify-between px-3 py-2.5 bg-gray-900 hover:bg-gray-700 border border-gray-700 rounded-lg transition-colors text-left"
                    >
                      <div>
                        <p className="text-[12px] font-bold text-white">
                          {t("Κατάσταση Άφιξης", "Share Arrival Status")}
                        </p>
                        <p className="text-[10px] text-white mt-0.5">
                          {t(
                            "Γρήγορη ενημέρωση χωρίς χάρτη",
                            "Quickly update the group without map",
                          )}
                        </p>
                      </div>
                      <Clock className="w-4 h-4 text-white" />
                    </button>

                    <button
                      onClick={() => setShowLocationConfigModal(true)}
                      className={`w-full flex items-center justify-between px-3 py-2.5 border rounded-lg transition-colors text-left ${isSharingLocation ? "bg-emerald-900/30 border-cyan-200 hover:bg-emerald-900/50" : "bg-gray-900 hover:bg-gray-700 border-gray-700"}`}
                    >
                      <div>
                        <p
                          className={`text-[12px] font-bold ${isSharingLocation ? "text-cyan-400" : "text-white"}`}
                        >
                          {isSharingLocation
                            ? t("Η Τοποθεσία Κοινοποιείται", "Location Shared")
                            : t(
                                "Κοινοποίηση τοποθεσίας",
                                "Share live location",
                              )}
                        </p>
                        <p
                          className={`text-[10px] mt-0.5 ${isSharingLocation ? "text-cyan-400/80" : "text-white"}`}
                        >
                          {isSharingLocation
                            ? t("Διαχείριση ή Διακοπή", "Tap to manage or stop")
                            : t(
                                "Προσωρινή, προαιρετική κοινοποίηση",
                                "Temporary, optional sharing",
                              )}
                        </p>
                      </div>
                      <MapPin
                        className={`w-4 h-4 ${isSharingLocation ? "text-cyan-400" : "text-white"}`}
                      />
                    </button>

                    <button
                      onClick={() => setShowLiveRadarModal(true)}
                      className="w-full flex items-center justify-between px-3 py-2.5 bg-gray-900 hover:bg-gray-700 border border-gray-700 rounded-lg transition-colors text-left"
                    >
                      <div>
                        <p className="text-[12px] font-bold text-white">
                          {t("Nakama Safety Shield", "Nakama Safety Shield")}
                        </p>
                        <p className="text-[10px] text-white mt-0.5">
                          {t(
                            "Χάρτης ασφαλείας & SOS Flare",
                            "Safety map & SOS Flare",
                          )}
                        </p>
                      </div>
                      <ShieldCheck className="w-4 h-4 text--400" />
                    </button>

                    <button
                      onClick={() => setShowSafetyLinkModal(true)}
                      className="w-full flex items-center justify-between px-3 py-2.5 bg-emerald-50/50 hover:bg-emerald-50 border border-emerald-100 rounded-lg transition-colors text-left text--400"
                    >
                      <div>
                        <p className="text-[12px] font-bold text--400">
                          {t(
                            "Σύνδεσμος Έμπιστης Επαφής",
                            "Trusted Contact Link",
                          )}
                        </p>
                        <p className="text-[10px] text--400/80 mt-0.5">
                          {t(
                            "Ασφαλής κοινοποίηση εκτός εφαρμογής",
                            "Share securely outside app",
                          )}
                        </p>
                      </div>
                      <Link2 className="h-4 w-4 text--400" />
                    </button>
                  </div>
                </div>
              </div>

              <div className="space-y-2 pt-2">
                <button
                  onClick={() => setShowReportModal(true)}
                  className="w-full py-2.5 px-4 text-[11px] font-bold tracking-wide text--400 bg-red-50/50 hover:bg-red-50 border border-red-100 rounded-lg transition-colors flex justify-center items-center gap-2"
                >
                  {t("Αναφορά Προβλήματος", "Report Safety Issue")}
                </button>
                <button
                  onClick={() => setShowLeaveModal(true)}
                  className="w-full py-2.5 px-4 text-[11px] font-bold tracking-wide text-white bg-gray-800 hover:bg-gray-900 border border-gray-700 rounded-lg transition-colors"
                >
                  {t("Αποχώρηση", "Leave Group")}
                </button>
              </div>
            </div>
          </div>
        )}

        {showStatusModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-gray-800 rounded-2xl shadow-xl max-w-sm w-full p-6 text-center border border-gray-800 animate-in zoom-in-95 duration-200">
              <div className="w-12 h-12 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4 text-white">
                <Clock className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">
                {t("Κοινοποίηση Κατάστασης", "Share Arrival Status")}
              </h3>
              <p className="text-xs font-medium leading-relaxed text-white mb-6">
                {t(
                  "Γρήγορη ενημέρωση ομάδας χωρίς κοινοποίηση της ακριβούς τοποθεσίας σας.",
                  "Quickly update the group on your status without sharing your exact location.",
                )}
              </p>
              <div className="flex flex-col gap-2.5 mb-6">
                {[
                  {
                    label: t("Είμαι καθ' οδόν", "I'm on my way"),
                    icon: <Navigation className="w-4 h-4" />,
                  },
                  {
                    label: t("Θα καθυστερήσω 10 λέπτα", "Running 10 mins late"),
                    icon: <Clock className="w-4 h-4" />,
                  },
                  {
                    label: t("Κόντευω", "Almost there"),
                    icon: <MapPin className="w-4 h-4" />,
                  },
                  {
                    label: t(
                      "Έφτασα στο σημείο συνάντησης",
                      "I arrived at the meeting point",
                    ),
                    icon: <ShieldCheck className="w-4 h-4" />,
                  },
                  {
                    label: t(
                      "Δεν θα τα καταφέρω",
                      "I won't be able to make it",
                    ),
                    icon: <X className="w-4 h-4" />,
                  },
                ].map((status) => (
                  <button
                    key={status.label}
                    onClick={() => {
                      setMessages((prev) => [
                        ...prev,
                        {
                          id: Date.now().toString(),
                          senderId: "system",
                          senderName: "System",
                          text: `${currentUser.name} ${t("ενημέρωσε την κατάστασή του:", "updated status:")} "${status.label}"`,
                          timestamp: new Date().toISOString(),
                          type: "location",
                        },
                      ]);
                      setShowStatusModal(false);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 bg-gray-900 hover:bg-gray-700 border border-gray-700 rounded-xl transition-colors text-sm font-bold text-white"
                  >
                    <span className="text-white">{status.icon}</span>
                    {status.label}
                  </button>
                ))}
              </div>
              <button
                onClick={() => setShowStatusModal(false)}
                className="w-full px-4 py-3 text-sm font-bold text-white hover:bg-gray-900 rounded-xl transition-all border border-transparent active:scale-[0.98]"
              >
                {t("Ακύρωση", "Cancel")}
              </button>
            </div>
          </div>
        )}

        {showLocationConfigModal && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-gray-800 rounded-2xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto custom-scrollbar border border-gray-800 animate-in zoom-in-95 duration-200">
              <div className="p-5 border-b border-gray-800 flex items-center justify-between sticky top-0 bg-gray-800/95 backdrop-blur-sm z-10">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-emerald-900/30 rounded-full flex items-center justify-center text-cyan-400">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white">
                      {t("Live Τοποθεσία", "Live Location Sharing")}
                    </h3>
                    <p className="text-[11px] font-medium text-white">
                      {t("Προαιρετικό & προσωρινό", "Optional & temporary")}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowLocationConfigModal(false)}
                  className="text-white hover:text-white p-1.5 rounded-full hover:bg-gray-700"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-5 space-y-6">
                {isSharingLocation && (
                  <div className="bg-emerald-900/30 border border-emerald-800 rounded-xl p-4 flex flex-col gap-3">
                    <div className="flex items-center gap-2 text-cyan-400">
                      <Navigation className="w-4 h-4 animate-pulse" />
                      <span className="text-sm font-bold">
                        {t(
                          "Η τοποθεσία σας κοινοποιείται",
                          "You are currently sharing location",
                        )}
                      </span>
                    </div>
                    <button
                      onClick={() => {
                        setIsSharingLocation(false);
                        setShowLocationConfigModal(false);
                        setMessages((prev) => [
                          ...prev,
                          {
                            id: Date.now().toString(),
                            senderId: "system",
                            senderName: "System",
                            text: t(
                              `${currentUser.name} σταμάτησε την κοινοποίηση τοποθεσίας.`,
                              `${currentUser.name} stopped sharing their location.`,
                            ),
                            timestamp: new Date().toISOString(),
                            type: "location",
                          },
                        ]);
                      }}
                      className="w-full bg-gray-800 text--400 border border-red-200 hover:bg-red-50 py-2 rounded-lg text-xs font-bold tracking-wide"
                    >
                      {t("Διακοπή Κοινοποίησης", "Stop Sharing Now")}
                    </button>
                  </div>
                )}

                <div className="space-y-3">
                  <h4 className="text-[11px] font-bold tracking-wide text-white">
                    1. {t("Ακρίβεια", "Precision")}
                  </h4>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() =>
                        setLocationConfig({
                          ...locationConfig,
                          precision: "approximate",
                        })
                      }
                      className={`p-3 rounded-xl border text-left flex flex-col h-full transition-all ${locationConfig.precision === "approximate" ? "border-[#111827] bg-gray-900 ring-1 ring-[#111827]" : "border-gray-700 hover:border-gray-300"}`}
                    >
                      <span
                        className={`text-[13px] font-bold ${locationConfig.precision === "approximate" ? "text-white" : "text-white"}`}
                      >
                        {t("Κατά προσέγγιση", "Approximate")}
                      </span>
                      <span className="text-[10px] text-white mt-1 leading-relaxed">
                        {t(
                          "Μόνο απόσταση & ETA, όχι live τοποθεσία",
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
                      className={`p-3 rounded-xl border text-left flex flex-col h-full transition-all ${locationConfig.precision === "exact" ? "border-[#111827] bg-gray-900 ring-1 ring-[#111827]" : "border-gray-700 hover:border-gray-300"}`}
                    >
                      <span
                        className={`text-[13px] font-bold ${locationConfig.precision === "exact" ? "text-white" : "text-white"}`}
                      >
                        {t("Ακριβής", "Exact")}
                      </span>
                      <span className="text-[10px] text-white mt-1 leading-relaxed">
                        {t(
                          "Ακριβές GPS live tracking",
                          "Precise GPS live tracking",
                        )}
                      </span>
                    </button>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="text-[11px] font-bold tracking-wide text-white">
                    2. {t("Ορατότητα", "Share With")}
                  </h4>
                  <div className="flex flex-col gap-2">
                    {["organizer", "selected", "all"].map((option) => (
                      <label
                        key={option}
                        className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${locationConfig.shareWith === option ? "border-cyan-600 bg-emerald-900/30/30" : "border-gray-700 hover:bg-gray-900"}`}
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
                              <span className="w-2 h-2 rounded-full bg-gray-800"></span>
                            )}
                          </div>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-sm font-bold text-white">
                            {option === "organizer" &&
                              t("Μόνο στον Διοργανωτή", "Organizer Only")}
                            {option === "selected" &&
                              t("Επιλεγμένα Μέλη", "Selected Members")}
                            {option === "all" &&
                              t("Ολόκληρη η Ομάδα", "Entire Confirmed Group")}
                          </span>
                          {option === "organizer" && (
                            <span className="text-[10px] text-white leading-relaxed">
                              {t(
                                "Ιδανικό για ξεναγήσεις ή πεζοπορίες",
                                "Best for guided hikes or escapes",
                              )}
                            </span>
                          )}
                          {option === "all" && (
                            <span className="text-[10px] text-amber-600 leading-relaxed">
                              {t(
                                "Όλοι θα βλέπουν την τοποθεσία σας",
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
                  <h4 className="text-[11px] font-bold tracking-wide text-white">
                    3. {t("Αυτόματη Λήξη", "Auto-Expiry")}
                  </h4>
                  <select
                    value={locationConfig.duration}
                    onChange={(e) =>
                      setLocationConfig({
                        ...locationConfig,
                        duration: e.target.value,
                      })
                    }
                    className="w-full border border-gray-700 rounded-xl p-3 text-sm font-medium focus:ring-2 focus:ring-[#111827] bg-gray-800 outline-none"
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
                      {t(
                        "Μέχρι το τέλος της εκδήλωσης",
                        "Until event ends (or organizer marks complete)",
                      )}
                    </option>
                    <option value="1hr">{t("Για 1 ώρα", "For 1 hour")}</option>
                  </select>
                </div>
              </div>

              <div className="p-5 border-t border-gray-800 bg-gray-900/50">
                <button
                  onClick={() => {
                    setIsSharingLocation(true);
                    setShowLocationConfigModal(false);
                    let msg = t(
                      "ξεκίνησε να κοινοποιεί τοποθεσία",
                      "started sharing location",
                    );
                    if (locationConfig.precision === "approximate")
                      msg = t(
                        "κοινοποιεί το ETA/απόσταση",
                        "is sharing their ETA/distance",
                      );
                    if (locationConfig.shareWith === "organizer")
                      msg += t(" (Μόνο στον Διοργανωτή)", " (Organizer only)");
                    else if (locationConfig.shareWith === "selected")
                      msg += t(
                        " (με επιλεγμένα μέλη)",
                        " (with selected members)",
                      );

                    setMessages((prev) => [
                      ...prev,
                      {
                        id: Date.now().toString(),
                        senderId: "system",
                        senderName: "System",
                        text: `${currentUser.name} ${msg}.`,
                        timestamp: new Date().toISOString(),
                        type: "location",
                      },
                    ]);
                  }}
                  className="w-full px-4 py-3 text-sm font-bold text-white bg-gradient-to-br from-red-900 via-rose-900 to-red-800 text-white hover:bg-gray-900 rounded-xl transition-all shadow-sm active:scale-[0.98]"
                >
                  {isSharingLocation
                    ? t("Ενημέρωση Ρυθμίσεων", "Update Configuration")
                    : t("Έναρξη Κοινοποίησης", "Start Sharing")}
                </button>
              </div>
            </div>
          </div>
        )}

        {showSafetyLinkModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-gray-800 rounded-2xl shadow-xl max-w-sm w-full p-6 text-center border border-gray-800 animate-in zoom-in-95 duration-200">
              <div className="w-12 h-12 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-4 text--400">
                <Link2 className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">
                {t("Σύνδεσμος Έμπιστης Επαφής", "Trusted Contact Link")}
              </h3>
              <p className="text-xs font-medium leading-relaxed text-white mb-6">
                {t(
                  "Αυτό δημιουργεί έναν προσωρινό σύνδεσμο ασφαλείας. Μοιραστείτε τον με ασφάλεια εκτός Nakamas. Θα βλέπουν την τοποθεσία σας μέχρι το τέλος. Ανακαλέστε τον όποτε θέλετε.",
                  "This creates a temporary safety link. Share this securely with a trusted friend or family member outside of Nakamas. They will be able to see your live location until the event ends. You can revoke it anytime.",
                )}
              </p>
              <div className="bg-gray-900 border border-gray-700 rounded-lg p-3 flex items-center justify-between mb-6">
                <span className="text-xs font-medium text-white truncate mr-2">
                  https://nakamas.app/safe/r9x2p
                </span>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(
                      "https://nakamas.app/safe/r9x2p",
                    );
                    alert(
                      t("Αντιγράφηκε στο πρόχειρο!", "Copied to clipboard!"),
                    );
                  }}
                  className="text-xs font-bold text-cyan-400"
                >
                  {t("Αντιγραφή", "Copy")}
                </button>
              </div>
              <button
                onClick={() => setShowSafetyLinkModal(false)}
                className="w-full px-4 py-3 text-sm font-bold text-white bg-gradient-to-br from-red-900 via-rose-900 to-red-800 text-white hover:bg-gray-900 rounded-xl transition-all shadow-sm active:scale-[0.98]"
              >
                {t("Τέλος", "Done")}
              </button>
            </div>
          </div>
        )}

        {showLeaveModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-gray-800 rounded-2xl shadow-xl max-w-sm w-full p-6 text-center border border-gray-800 animate-in zoom-in-95 duration-200">
              <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4 text-red-500">
                <ArrowLeft className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">
                {t("Αποχώρηση από την ομάδα;", "Leave Group?")}
              </h3>
              <p className="text-xs font-medium leading-relaxed text-white mb-6">
                {t(
                  "Είστε σίγουροι ότι θέλετε να αποχωρήσετε από",
                  "Are you sure you want to leave",
                )}{" "}
                <span className="font-bold text-white">{event.title}</span>?{" "}
                {t(
                  "Μπορεί να μην μπορέσετε να ξαναμπείτε εάν η ομάδα γεμίσει.",
                  "You might not be able to rejoin if the group is full.",
                )}
              </p>
              <div className="flex flex-col gap-2.5">
                <button
                  onClick={() => {
                    alert(
                      t(
                        "Αποχωρήσατε από την ομάδα.",
                        "You have left the group.",
                      ),
                    );
                    setShowLeaveModal(false);
                    navigate(-1);
                  }}
                  className="w-full px-4 py-3 text-sm font-bold text-white bg-red-600 hover:bg-red-700 rounded-xl transition-all shadow-sm active:scale-[0.98]"
                >
                  {t("Ναι, Αποχώρηση", "Yes, Leave Group")}
                </button>
                <button
                  onClick={() => setShowLeaveModal(false)}
                  className="w-full px-4 py-3 text-sm font-bold text-white bg-gray-900 hover:bg-gray-700 rounded-xl transition-all border border-gray-700 active:scale-[0.98]"
                >
                  {t("Ακύρωση", "Cancel")}
                </button>
              </div>
            </div>
          </div>
        )}

        {showDisableEphemeralModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-gray-800 rounded-2xl shadow-xl max-w-sm w-full p-6 text-center border border-gray-800 animate-in zoom-in-95 duration-200">
              <div className="w-12 h-12 bg-emerald-900/30 rounded-full flex items-center justify-center mx-auto mb-4 text-cyan-400">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">
                {t("Διατήρηση Ιστορικού;", "Keep Chat History?")}
              </h3>
              <p className="text-xs font-medium leading-relaxed text-white mb-6">
                {t(
                  "Προτείνετε να απενεργοποιηθεί η Εφήμερη Λειτουργία. Αν όλα τα μέλη συμφωνήσουν, η συνομιλία θα διατηρηθεί μόνιμα.",
                  "You are proposing to turn off Ephemeral Mode. If all group members agree, this chat will be kept permanently instead of being deleted automatically.",
                )}
              </p>
              <div className="flex flex-col gap-2.5">
                <button
                  onClick={() => {
                    setMessages((prev) => [
                      ...prev,
                      {
                        id: Date.now().toString(),
                        senderId: "system",
                        senderName: "System",
                        text: `${currentUser.name} ${t("πρότεινε να απενεργοποιηθεί η Εφήμερη Λειτουργία. Η ψηφοφορία θα ξεκινήσει σύντομα.", "proposed to disable Ephemeral Mode. Voting will begin shortly.")}`,
                        timestamp: new Date().toISOString(),
                      },
                    ]);
                    setIsEphemeral(false);
                    setShowDisableEphemeralModal(false);
                    setShowInfo(false);
                  }}
                  className="w-full px-4 py-3 text-sm font-bold text-white bg-gradient-to-br from-red-900 via-rose-900 to-red-800 text-white hover:bg-gray-900 rounded-xl transition-all shadow-sm active:scale-[0.98]"
                >
                  {t("Πρόταση στην Ομάδα", "Propose to Group")}
                </button>
                <button
                  onClick={() => setShowDisableEphemeralModal(false)}
                  className="w-full px-4 py-3 text-sm font-bold text-white bg-gray-900 hover:bg-gray-700 rounded-xl transition-all border border-gray-700 active:scale-[0.98]"
                >
                  {t("Ακύρωση", "Cancel")}
                </button>
              </div>
            </div>
          </div>
        )}

        {showReportModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-gray-800 rounded-2xl shadow-xl max-w-md w-full p-6 border border-gray-800 animate-in zoom-in-95 duration-200">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-red-50 rounded-full flex items-center justify-center text--400 shrink-0">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">
                    {t("Ιδιωτική Αναφορά Ασφαλείας", "Private Safety Report")}
                  </h3>
                  <p className="text-xs font-semibold text-white tracking-tight capitalize mt-0.5">
                    {t("Απολύτως Εμπιστευτικό", "Strictly Confidential")}
                  </p>
                </div>
              </div>
              <p className="text-xs font-medium leading-relaxed text-white mb-4 bg-gray-900 p-3 rounded-lg border border-gray-800">
                {t(
                  "Αυτή η αναφορά πηγαίνει απευθείας στην ομάδα ελέγχου. ",
                  "This report goes directly to the Nakamas moderation team. It will ",
                )}
                <span className="font-bold text-white">
                  {t("Δεν", "not")}
                </span>
                {t(
                  " θα κοινοποιηθεί στα μέλη. Βοηθήστε μας να διατηρήσουμε την κοινότητα ασφαλή.",
                  " be shared with the group members. Help us keep the community safe.",
                )}
              </p>
              <textarea
                className="w-full border border-gray-700 rounded-xl p-3 text-sm resize-none mb-5 focus:ring-2 focus:ring-[#111827] outline-none shadow-sm font-medium transition-all"
                rows={4}
                placeholder={t(
                  "Παρακαλώ περιγράψτε το πρόβλημα με λεπτομέρεια...",
                  "Please describe the issue in detail...",
                )}
              ></textarea>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowReportModal(false)}
                  className="px-5 py-2.5 text-sm font-bold text-white bg-gray-900 hover:bg-gray-700 rounded-xl transition-colors border border-gray-700"
                >
                  {t("Ακύρωση", "Cancel")}
                </button>
                <button
                  onClick={() => {
                    alert(
                      t(
                        "Η αναφορά σας υποβλήθηκε με ασφάλεια.",
                        "Your report has been submitted securely.",
                      ),
                    );
                    setShowReportModal(false);
                  }}
                  className="px-5 py-2.5 text-sm font-bold text-white bg-gradient-to-br from-red-900 via-rose-900 to-red-800 text-white hover:bg-gray-900 rounded-xl transition-all shadow-sm hover:shadow-md"
                >
                  {t("Υποβολή", "Submit Report")}
                </button>
              </div>
            </div>
          </div>
        )}

        {showStatusModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-gray-800 rounded-2xl shadow-xl max-w-sm w-full p-6 text-center border border-gray-800 animate-in zoom-in-95 duration-200">
              <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4 text--400">
                <Clock className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">
                {t("Κατάσταση Άφιξης", "Share Arrival Status")}
              </h3>
              <p className="text-xs font-medium leading-relaxed text-white mb-6">
                {t(
                  "Ενημερώστε γρήγορα την ομάδα για την κατάστασή σας χωρίς να μοιραστείτε την ακριβή τοποθεσία σας.",
                  "Quickly update the group on your status without sharing your exact location.",
                )}
              </p>
              <div className="flex flex-col gap-2.5">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    const formData = new FormData(e.currentTarget);
                    const eta = formData.get("eta") as string;
                    if (eta) {
                      setMessages((prev) => [
                        ...prev,
                        {
                          id: Date.now().toString(),
                          senderId: "system",
                          senderName: "System",
                          text: `${currentUser.name} ${t("ενημέρωσε την κατάστασή του", "updated their ETA")}: ETA ${eta} ${t("λεπτά", "mins")}`,
                          timestamp: new Date().toISOString(),
                        },
                      ]);
                      setShowStatusModal(false);
                    }
                  }}
                  className="flex gap-2 mb-2"
                >
                  <input
                    name="eta"
                    type="number"
                    placeholder={t("ETA (λεπτά)", "ETA (mins)")}
                    className="flex-1 w-full bg-gray-900 border border-gray-700 text-white text-sm rounded-xl px-4 py-3 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none"
                    min="1"
                  />
                  <button
                    type="submit"
                    className="px-4 py-3 text-sm font-bold text-white bg-cyan-600 hover:bg-cyan-700 rounded-xl shadow-sm transition-all whitespace-nowrap"
                  >
                    {t("Αποστολή", "Send")}
                  </button>
                </form>

                {[
                  {
                    text: t("Είμαι στον δρόμο", "I'm on my way"),
                    color: "bg-gradient-to-br from-red-900 via-rose-900 to-red-800 text-white hover:bg-gray-900",
                  },
                  {
                    text: t("Έφτασα", "I arrived"),
                    color: "bg-emerald-600 text-white hover:bg-emerald-700",
                  },
                  {
                    text: t("Θα αργήσω λίγο", "I'll be late"),
                    color: "bg-amber-500 text-white hover:bg-amber-600",
                  },
                  {
                    text: t(
                      "Είμαι στο σημείο συνάντησης",
                      "I'm at the meeting point",
                    ),
                    color: "bg-cyan-600 text-white hover:bg-cyan-700",
                  },
                ].map((status, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setMessages((prev) => [
                        ...prev,
                        {
                          id: Date.now().toString(),
                          senderId: "system",
                          senderName: "System",
                          text: `${currentUser.name} ${t("ενημέρωσε την κατάστασή του", "updated their status")}: "${status.text}"`,
                          timestamp: new Date().toISOString(),
                        },
                      ]);
                      setShowStatusModal(false);
                    }}
                    className={`w-full px-4 py-3 text-sm font-bold rounded-xl transition-all shadow-sm active:scale-[0.98] ${status.color}`}
                  >
                    {status.text}
                  </button>
                ))}

                <button
                  onClick={() => setShowStatusModal(false)}
                  className="w-full px-4 py-3 mt-2 text-sm font-bold text-white bg-gray-900 hover:bg-gray-700 rounded-xl transition-all border border-gray-700 active:scale-[0.98]"
                >
                  {t("Ακύρωση", "Cancel")}
                </button>
              </div>
            </div>
          </div>
        )}
        {showAddMemberModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-gray-800 rounded-2xl shadow-xl max-w-md w-full max-h-[85vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
              <div className="p-4 sm:p-5 border-b border-gray-800 flex items-center justify-between bg-gray-800 relative z-10">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-emerald-900/30 rounded-full flex items-center justify-center text-cyan-400">
                    <UserPlus className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white">
                      {t("Προσθήκη Μελών", "Add Members")}
                    </h3>
                    <p className="text-[11px] font-medium text-white">
                      {t(
                        "Μπορείτε να προσθέσετε όσα άτομα θέλετε σε αυτή την ομάδα.",
                        "You can add as many people as you wish to this group.",
                      )}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setShowAddMemberModal(false);
                    setMemberAddSearchQuery("");
                  }}
                  className="text-white hover:text-white p-1.5 rounded-full hover:bg-gray-700 transition-colors"
                  title={t("Κλείσιμο", "Close")}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-4 sm:p-5 bg-gray-900/50 border-b border-gray-800">
                <div className="relative">
                  <Search className="h-4 w-4 text-white absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder={t(
                      "Αναζήτηση με όνομα ή email...",
                      "Search by name or email...",
                    )}
                    value={memberAddSearchQuery}
                    onChange={(e) => setMemberAddSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 text-[13px] border border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-600 bg-gray-800 transition-all shadow-sm font-medium"
                  />
                </div>
              </div>

              <div className="flex-1 overflow-y-auto custom-scrollbar p-2">
                {potentialNewMembers.length > 0 ? (
                  potentialNewMembers
                    .filter((m) =>
                      m.name
                        .toLowerCase()
                        .includes(memberAddSearchQuery.toLowerCase()),
                    )
                    .map((member) => (
                      <div
                        key={member.id}
                        className="flex items-center justify-between p-3 hover:bg-gray-900 rounded-xl transition-colors border border-transparent hover:border-gray-800"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden shrink-0 border border-gray-700">
                            {member.photoUrl ? (
                              <img
                                src={member.photoUrl}
                                alt={member.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-cyan-400 font-bold text-xs bg-emerald-900/30">
                                {member.name.substring(0, 2)}
                              </div>
                            )}
                          </div>
                          <div className="flex flex-col">
                            <span className="text-[13px] font-bold text-white">
                              {member.name}
                            </span>
                            <span className="text-[10px] text-white font-medium flex items-center gap-1">
                              {member.city}{" "}
                              {member.badges.includes("Payment verified") && (
                                <ShieldCheck className="w-3 h-3 text-emerald-500" />
                              )}
                            </span>
                          </div>
                        </div>
                        <button
                          onClick={() => {
                            // Mutate the mockGroup's members directly for the demo
                            group.members.push(member.id);
                            // Trigger re-render
                            setRenderTrigger((prev) => prev + 1);
                            // Post a system message in the chat
                            setMessages((prev) => [
                              ...prev,
                              {
                                id: Date.now().toString(),
                                senderId: "system",
                                senderName: "System",
                                text: `${member.name} ${t("προστέθηκε στην ομάδα από τον διοργανωτή.", "was added to the group by the organizer.")}`,
                                timestamp: new Date().toISOString(),
                              },
                            ]);
                          }}
                          className="text-[12px] font-semibold capitalize tracking-tight px-3 py-1.5 rounded-lg border flex items-center gap-1 transition-all bg-cyan-600 text-white border-cyan-600 hover:bg-cyan-700 shadow-sm"
                        >
                          <UserPlus className="w-3 h-3" />{" "}
                          {t("Προσθήκη", "Add")}
                        </button>
                      </div>
                    ))
                ) : (
                  <div className="text-center p-8 text-white flex flex-col items-center">
                    <div className="w-12 h-12 bg-gray-700 rounded-full flex items-center justify-center mb-3 text-white">
                      <Check className="w-6 h-6" />
                    </div>
                    <p className="text-[13px] font-bold text-white">
                      {t(
                        "Όλα τα διαθέσιμα άτομα είναι ήδη στην ομάδα!",
                        "All available people are in this group!",
                      )}
                    </p>
                    <p className="text-[11px] mt-1">
                      {t(
                        "Ελέγξτε ξανά αργότερα ή προσκαλέστε με σύνδεσμο.",
                        "Check back later or invite via link.",
                      )}
                    </p>
                  </div>
                )}
              </div>

              <div className="p-4 sm:p-5 border-t border-gray-800 bg-gray-900 flex items-center justify-between">
                <span className="text-xs font-bold text-white">
                  {t("Τρέχον μέγεθος:", "Current size:")} {group.members.length}
                </span>
                <button
                  onClick={() => {
                    setShowAddMemberModal(false);
                    setMemberAddSearchQuery("");
                  }}
                  className="px-5 py-2.5 text-sm font-bold text-white bg-gray-800 hover:bg-gray-900 rounded-xl transition-all border border-gray-700 shadow-sm active:scale-[0.98]"
                >
                  {t("Τέλος", "Done")}
                </button>
              </div>
            </div>
          </div>
        )}
        {showLiveRadarModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-gray-800 rounded-2xl shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col border border-gray-800 animate-in zoom-in-95 duration-200 overflow-hidden relative">
              <button
                onClick={() => setShowLiveRadarModal(false)}
                className="absolute top-4 right-4 z-[200] bg-gray-800 rounded-full p-2 shadow-sm border border-gray-700 text-white hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
              <LiveEventTracker groupId={group.id} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
