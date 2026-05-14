const fs = require('fs');

const fileContent = `import { useState, useMemo, useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useStore } from "../store";
import { motion, AnimatePresence } from "motion/react";
import { EventCard } from "../components/events/EventCard";
import { EventCardSkeleton } from "../components/common/Skeleton";
import {
  Search, ShieldCheck, Map as MapIcon, CheckCircle2,
  Users, Grid, ArrowDownUp, Plus, Rocket
} from "lucide-react";
import { parseISO, isToday, isThisWeek, isThisMonth, format } from "date-fns";
import { useLanguage } from "../lib/i18n";

export default function Home() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const initialSearch = searchParams.get("search") || "";

  const [feedType, setFeedType] = useState<"For You" | "Discover">("For You");
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [activeCategory, setActiveCategory] = useState("All");
  const [showSearchSuggestions, setShowSearchSuggestions] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  const events = useStore((state) => state.events);

  const searchSuggestions = [
    t("Πεζοπορία", "Hiking"),
    t("Επιτραπέζια", "Board Games"),
    t("Μουσικά Φεστιβάλ", "Music Festivals"),
    t("Δικτύωση", "Networking")
  ];

  useEffect(() => {
    if (initialSearch && searchQuery === initialSearch) setFeedType("Discover");
  }, [initialSearch, searchQuery]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowSearchSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleSearchChange = (val: string) => {
    setSearchQuery(val);
    if (val) setSearchParams({ search: val });
    else setSearchParams({});
  };

  const [tagFilter, setTagFilter] = useState("All");
  const [isLoading, setIsLoading] = useState(true);
  const [visibleEventsCount, setVisibleEventsCount] = useState(6);
  const categoryScrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = categoryScrollRef.current;
    if (!el) return;
    const handleWheel = (e: WheelEvent) => {
      if (el.scrollWidth > el.clientWidth) {
        e.preventDefault();
        el.scrollLeft += e.deltaY;
      }
    };
    el.addEventListener('wheel', handleWheel, { passive: false });
    return () => el.removeEventListener('wheel', handleWheel);
  }, []);

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 600);
    return () => clearTimeout(timer);
  }, []);

  const popularTags = ["All", "outdoors", "social", "music", "culture", "gaming"];
  const tagTranslations: Record<string, string> = {
    All: t("Ετικέτα: Όλες", "Tag: All"), outdoors: t("Φύση & Ενεργά", "Outdoors"), social: t("Κοινωνικά", "Social"),
    music: t("Μουσικά", "Music"), culture: t("Πολιτισμός", "Culture"), gaming: t("Games", "Games")
  };

  const categories = ["All", "Theatre", "Concerts", "Cinema", "Museums", "Board games", "Hiking", "Workshops"];
  const categoryTranslations: Record<string, string> = {
    All: t("Όλα", "All"), Theatre: t("Θέατρο", "Theatre"), Concerts: t("Συναυλίες", "Concerts"),
    Cinema: t("Σινεμά", "Cinema"), Museums: t("Μουσεία", "Museums"), "Board games": t("Επιτραπέζια", "Board Games"),
    Hiking: t("Πεζοπορία", "Hiking"), Workshops: t("Εργαστήρια", "Workshops")
  };
  
  const mockDistances: Record<string, number> = { e1: 1.2, e2: 18.0, e3: 2.8, e4: 3.6, e5: 150.0, e6: 0.5 };

  const filteredEvents = useMemo(() => {
    return events.filter((e) => {
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        const inTitle = e.title.toLowerCase().includes(q);
        const inTags = (e.tags ?? []).some((tag) => tag.toLowerCase().includes(q));
        if (!inTitle && !inTags) return false;
      }
      if (feedType === "For You" && !["e4", "e1", "e2", "e5"].includes(e.id)) return false;
      if (activeCategory !== "All" && e.category !== activeCategory) return false;
      if (tagFilter !== "All" && !(e.tags ?? []).includes(tagFilter)) return false;
      return true;
    });
  }, [events, searchQuery, feedType, activeCategory, tagFilter]);

  const currentUser = useStore((state) => state.currentUser);
  const sortParam = searchParams.get("sort") || "Relevance";
  const sortedEvents = useMemo(() => {
    return [...filteredEvents].sort((a, b) => {
      if (sortParam === "Distance") return (mockDistances[a.id] ?? 5) - (mockDistances[b.id] ?? 5);
      return new Date(a.date).getTime() - new Date(b.date).getTime();
    });
  }, [filteredEvents, sortParam]);

  const visibleEvents = sortedEvents.slice(0, visibleEventsCount);

  return (
    <div className="pb-10 md:pb-0">
      {/* Bento Grid Container */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-5 auto-rows-[minmax(0,auto)]">
        
        {/* Bento Box 1: Hero (Dark Theme) */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
          className="md:col-span-8 bg-[#111827] rounded-[32px] p-8 md:p-10 text-white relative overflow-hidden flex flex-col justify-between shadow-xl"
        >
          <div className="relative z-10 w-full h-full flex flex-col justify-between">
            <div className="inline-block w-fit px-3 py-1 bg-[#FF6B6B]/20 text-[#FF6B6B] rounded-full text-xs font-bold tracking-wide mb-6">
              {t("Νέος τρόπος εξόδου", "New way out")}
            </div>
            <div>
              <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-4 leading-[1.1] font-['Outfit']">
                {t("Βρείτε παρέα για τις συνήθειες", "Find parea for the gatherings")}<br/>
                <span className="text-[#18D8DB]">
                  {t("που σας ταιριάζουν.", "that suit you.")}
                </span>
              </h1>
              <p className="text-gray-400 font-medium text-sm md:text-base max-w-lg mb-8 leading-relaxed">
                {t("Ανακαλύψτε άτομα με τα ίδια ενδιαφέροντα και οργανώστε δραστηριότητες χωρίς κόπο. Απλά επιλέξτε και πηγαίνετε.", "Discover like-minded people and organize activities effortlessly. Just pick and go.")}
              </p>
            </div>
            
            <div ref={searchRef} className="relative max-w-md w-full">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                onFocus={() => setShowSearchSuggestions(true)}
                placeholder={t("Αναζήτηση...", "Search...")}
                className="w-full h-14 pl-12 pr-4 rounded-2xl border-none bg-white/10 text-white placeholder-gray-400 shadow-inner focus:outline-none focus:ring-2 focus:ring-[#FF6B6B] focus:bg-white/15 text-base font-medium backdrop-blur-md transition-all"
              />
            </div>
          </div>
          <div className="absolute -bottom-20 -right-20 w-96 h-96 bg-gradient-to-br from-[#18D8DB]/30 to-[#FF6B6B]/30 blur-3xl rounded-full" />
        </motion.div>

        {/* Bento Box 2: Upcoming Timeline (Light Theme, Tall) */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.1 }}
          className="md:col-span-4 md:row-span-2 bg-white rounded-[32px] p-8 border border-gray-100 shadow-sm flex flex-col relative overflow-hidden"
        >
          <div className="flex items-center justify-between mb-8 relative z-10">
            <h2 className="text-xl font-black font-['Outfit'] tracking-tight">{t("Επερχόμενα", "Upcoming")}</h2>
            <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 cursor-pointer hover:bg-gray-100 transition-colors">
              <Plus className="w-4 h-4" />
            </div>
          </div>
          
          <div className="flex-1 flex flex-col gap-6 relative z-10">
            {events.slice(0, 3).map((ev, i) => {
              const colorDot = [ "bg-[#FF6B6B]", "bg-[#F59E0B]", "bg-[#18D8DB]" ][i % 3];
              return (
                <div key={ev.id} className="relative pl-6">
                  <div className={"absolute left-0 top-1.5 w-2 h-2 rounded-full " + colorDot} />
                  {i < 2 && <div className="absolute left-[3px] top-4 w-[2px] h-[calc(100%+8px)] bg-gray-100 rounded-full" />}
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{isToday(new Date(ev.date)) ? t("Σε λίγες ώρες", "In a few hours") : format(new Date(ev.date), "EEEE")}</span>
                  <h3 className="font-bold text-[#111827] mt-0.5 max-w-[90%] truncate">{ev.title}</h3>
                  <p className="text-xs text-gray-500 font-medium mt-1 truncate max-w-[90%]">{t((ev.location as any)?.name || "Online", (ev.location as any)?.name || "Online")}</p>
                </div>
              );
            })}
          </div>

          <div className="mt-8 pt-4 border-t border-gray-100 flex items-center gap-3 relative z-10">
            <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center shrink-0">
              <Rocket className="w-5 h-5 text-gray-400" />
            </div>
            <div className="truncate">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest truncate">GITHUB REPOSITORY</p>
              <p className="text-xs font-bold text-[#111827] truncate">Animus1991/parea_app</p>
            </div>
          </div>
        </motion.div>

        {/* Bento Box 3: Create Gathering (Dark / Vibrant Palette) */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}
          className="md:col-span-4 bg-[#1F2937] rounded-[32px] p-8 text-white relative shadow-lg flex flex-col justify-center min-h-[220px]"
        >
          <h2 className="text-2xl font-black font-['Outfit'] tracking-tight mb-3 leading-tight text-white">
            {t("Δημιουργήστε τη δική σας συγκέντρωση.", "Create your own Gathering today.")}
          </h2>
          <p className="text-gray-400 text-sm font-medium mb-6">
            {t("Οργανώστε μια εκδήλωση από το μηδέν.", "Organize an event from scratch.")}
          </p>
          <button onClick={() => navigate("/create")} className="w-fit bg-[#FF6B6B] hover:bg-[#E05252] text-white px-6 py-3 rounded-xl font-bold transition-all shadow-[0_4px_14px_rgba(255,107,107,0.39)]">
            {t("Ξεκινήστε", "Start a Parea")}
          </button>
        </motion.div>

        {/* Bento Box 4: Active Circles (Vibrant Palette) */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }}
          className="md:col-span-4 bg-white border border-gray-100 rounded-[32px] p-6 lg:p-8 flex flex-col shadow-sm min-h-[220px]"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-black font-['Outfit'] tracking-tight">{t("Ενεργοί Κύκλοι", "Active Circles")}</h2>
            <span className="text-[#FF6B6B] text-xs font-bold cursor-pointer hover:underline">{t("Προβολή Όλων", "View All")}</span>
          </div>
          <div className="grid grid-cols-2 gap-4 flex-1">
            <div className="bg-[#FEFCE8] border border-yellow-100/50 rounded-2xl p-4 flex flex-col justify-between">
              <div>
                <div className="w-8 h-8 rounded-full bg-yellow-100 flex items-center justify-center text-yellow-600 text-sm mb-3">☕</div>
                <div className="text-[10px] font-bold text-yellow-600 tracking-wider mb-1">SUNDAY</div>
                <h3 className="font-bold text-[#111827] text-sm leading-snug mb-1">Morning Walk</h3>
              </div>
            </div>
            <div className="bg-[#ECFEFF] border border-cyan-100/50 rounded-2xl p-4 flex flex-col justify-between">
               <div>
                <div className="w-8 h-8 rounded-full bg-cyan-100 flex items-center justify-center text-cyan-600 text-sm mb-3">🎮</div>
                <div className="text-[10px] font-bold text-cyan-600 tracking-wider mb-1">VIBE ONLY</div>
                <h3 className="font-bold text-[#111827] text-sm leading-snug mb-1">Gaming Night</h3>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Categories / Tags Filter row */}
        <div className="md:col-span-12 flex flex-col gap-3 py-2 mt-4">
          <div className="flex gap-2 overflow-x-auto pb-2 noscrollbar">
            {categories.map((cat, i) => (
              <button
                key={cat} onClick={() => setActiveCategory(cat)}
                className={\`whitespace-nowrap px-6 py-3 rounded-full text-sm font-bold shadow-sm transition-all focus:outline-none \${
                  activeCategory === cat 
                    ? "bg-[#111827] text-white" 
                    : "bg-white border border-gray-100 text-gray-600 hover:border-gray-200"
                }\`}
              >
                {categoryTranslations[cat] ?? cat}
              </button>
            ))}
          </div>
          
          <div className="flex gap-2 overflow-x-auto pb-2 noscrollbar items-center flex-wrap">
            <select
              className="text-[12.36px] border border-gray-200 rounded-full shadow-sm bg-white hover:bg-gray-50 py-2 px-4 font-medium outline-none cursor-pointer"
              onChange={(e) => setTagFilter(e.target.value)}
              value={tagFilter}
            >
              {popularTags.map(tag => (
                <option key={tag} value={tag}>{tagTranslations[tag] ?? tag}</option>
              ))}
            </select>

            <select
              className="text-[12.36px] border border-gray-200 rounded-full shadow-sm bg-white hover:bg-gray-50 py-2 px-4 font-medium outline-none cursor-pointer"
              value={sortParam}
              onChange={(e) => {
                const p = new URLSearchParams(searchParams);
                p.set("sort", e.target.value);
                setSearchParams(p);
              }}
            >
              <option value="Relevance">{t("Συνάφεια", "Relevance")}</option>
              <option value="Distance">{t("Απόσταση", "Distance")}</option>
            </select>
          </div>
        </div>

        {/* Bento Box 5: Feed Area (Main Grids) */}
        <div className="md:col-span-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {isLoading ? (
            Array.from({ length: 3 }).map((_, i) => <EventCardSkeleton key={\`skeleton-\${i}\`} />)
          ) : (
            visibleEvents.map((event, index) => (
              <motion.div key={event.id} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: index * 0.05 }} className="h-full">
                <EventCard event={event} />
              </motion.div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
`;

fs.writeFileSync('src/pages/Home.tsx', fileContent);
