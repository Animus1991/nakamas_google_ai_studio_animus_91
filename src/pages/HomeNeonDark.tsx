import { useState, useMemo, useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useStore } from "../store";
import { motion } from "motion/react";
import { EventCard } from "../components/events/EventCard";
import { EventCardSkeleton } from "../components/common/Skeleton";
import {
  Search,
  ShieldCheck,
  Map as MapIcon,
  Grid,
  CheckCircle2,
  Users,
  ArrowDownUp,
  ChevronDown,
} from "lucide-react";
import { parseISO, isToday, isThisWeek, isThisMonth } from "date-fns";
import { useLanguage } from "../lib/i18n";

export default function HomeNeonDark() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const initialSearch = searchParams.get("search") || "";

  // feedType declared first — used in the useEffect below
  const [feedType, setFeedType] = useState<"For You" | "Discover">("For You");
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [activeCategory, setActiveCategory] = useState("All");
  const [showSearchSuggestions, setShowSearchSuggestions] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  const events = useStore((state) => state.events);
  const fetchExternalEvents = useStore((state) => state.fetchExternalEvents);

  useEffect(() => {
    fetchExternalEvents();
  }, [fetchExternalEvents]);

  const searchSuggestions = [
    t("Πεζοπορία", "Hiking"),
    t("Επιτραπέζια", "Board Games"),
    t("Μουσικά Φεστιβάλ", "Music Festivals"),
    t("Δικτύωση", "Networking"),
    t("Συναυλίες", "Concerts"),
    t("Σινεμά", "Cinema"),
  ];

  // Sync to 'Discover' feed when the page is loaded with a search query
  useEffect(() => {
    if (initialSearch && searchQuery === initialSearch) {
      setFeedType("Discover");
    }
  }, [initialSearch, searchQuery]);

  // Close suggestions on outside click
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
    if (val) {
      setSearchParams({ search: val });
    } else {
      setSearchParams({});
    }
  };

  const [priceFilter, setPriceFilter] = useState<
    "All" | "Free" | "Paid" | "Group Discount"
  >("All");
  const [dateFilter, setDateFilter] = useState<
    "Any" | "Today" | "This Week" | "This Month"
  >("Any");
  const [safetyFilter, setSafetyFilter] = useState<
    "All" | "low" | "medium" | "high_trust"
  >("All");
  const [radiusFilter, setRadiusFilter] = useState<
    "Any" | "5km" | "10km" | "25km"
  >("Any");
  const [tagFilter, setTagFilter] = useState<string>("All");
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
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const categories = [
    "All",
    "Live Music",
    "Electronic Music",
    "Theater & Dance",
    "Cinema",
    "Stand-up",
    "Food & Drink",
    "Museums",
    "Exhibitions",
    "Workshops",
    "Sports",
    "Social",
    "Networking",
    "Wellness",
    "Board games",
    "Book club",
    "Language exchange",
    "Hiking",
    "Nearby escapes",
    "Walking tours",
    "Community events",
  ];

  const categoryTranslations: Record<string, string> = {
    All: t("Όλα", "All"),
    "Live Music": t("Ζωντανή Μουσική", "Live Music"),
    "Electronic Music": t("Ηλεκτρονική Μουσική", "Electronic Music"),
    "Theater & Dance": t("Θέατρο & Χορός", "Theater & Dance"),
    Cinema: t("Σινεμά", "Cinema"),
    "Stand-up": "Stand-up",
    "Food & Drink": t("Φαγητό & Ποτό", "Food & Drink"),
    Museums: t("Μουσεία", "Museums"),
    Exhibitions: t("Εκθέσεις", "Exhibitions"),
    Workshops: t("Εργαστήρια", "Workshops"),
    Sports: t("Αθλητισμός", "Sports"),
    Social: t("Κοινωνικά", "Social"),
    Networking: t("Δικτύωση", "Networking"),
    Wellness: t("Ευεξία", "Wellness"),
    "Board games": t("Επιτραπέζια", "Board Games"),
    "Book club": t("Λέσχη Ανάγνωσης", "Book Club"),
    "Language exchange": t("Ανταλλαγή Γλωσσών", "Language Exchange"),
    Hiking: t("Πεζοπορία", "Hiking"),
    "Nearby escapes": t("Κοντινές Αποδράσεις", "Nearby Getaways"),
    "Walking tours": t("Ξεναγήσεις", "Walking Tours"),
    "Community events": t("Κοινότητα", "Community"),
  };

  const popularTags = [
    "All",
    "music",
    "culture",
    "food",
    "outdoor",
    "social",
    "nightlife",
    "sports",
    "workshop",
    "free",
  ];
  const tagTranslations: Record<string, string> = {
    All: t("Όλες οι Ετικέτες", "All Tags"),
    music: t("Μουσική", "Music"),
    culture: t("Πολιτισμός", "Culture"),
    food: t("Φαγητό", "Food"),
    outdoor: t("Υπαίθρια", "Outdoor"),
    social: t("Κοινωνικά", "Social"),
    nightlife: t("Νυχτερινή Ζωή", "Nightlife"),
    sports: t("Αθλητισμός", "Sports"),
    workshop: t("Εργαστήριο", "Workshop"),
    free: t("Δωρεάν", "Free"),
  };

  const mockDistances: Record<string, number> = {
    e1: 1.2, e2: 18.0, e3: 2.8, e4: 3.6, e5: 150.0, e6: 0.5,
    e7: 2.1, e8: 4.5, e9: 1.8, e10: 25.0, e11: 1.5, e12: 5.2,
    e13: 1.0, e14: 0.8, e15: 3.2, e16: 2.5, e17: 3.8, e18: 1.3,
    e19: 12.0, e20: 6.0, e21: 2.0, e22: 0.9, e23: 2.4, e24: 2.6,
    e25: 18.0, e26: 3.5, e27: 2.2, e28: 8.5,
  };

  const currentUser = useStore((state) => state.currentUser);

  // Memoized filtering
  const filteredEvents = useMemo(() => {
    return events.filter((e) => {
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        const inTitle = e.title.toLowerCase().includes(q);
        const inDesc = e.description?.toLowerCase().includes(q) ?? false;
        const inTags = (e.tags ?? []).some((tag) =>
          tag.toLowerCase().includes(q),
        );
        if (!inTitle && !inDesc && !inTags) return false;
      }

      if (feedType === "For You") {
        const matchScore = currentUser
          ? (e.tags ?? []).filter((t) => (currentUser.interests || []).includes(t)).length
          : 0;
        if (matchScore === 0 && !e.isTrending && e.id.startsWith('tm_')) return false;
      }
      if (activeCategory !== "All" && e.category !== activeCategory)
        return false;
      if (tagFilter !== "All" && !(e.tags ?? []).includes(tagFilter))
        return false;
      if (priceFilter === "Free" && e.isPaid) return false;
      if (priceFilter === "Paid" && !e.isPaid) return false;
      if (priceFilter === "Group Discount" && !e.groupDiscount) return false;
      if (safetyFilter !== "All" && e.safetyLevel !== safetyFilter)
        return false;

      if (dateFilter !== "Any") {
        const eDate = parseISO(e.date);
        if (dateFilter === "Today" && !isToday(eDate)) return false;
        if (dateFilter === "This Week" && !isThisWeek(eDate)) return false;
        if (dateFilter === "This Month" && !isThisMonth(eDate)) return false;
      }

      if (radiusFilter !== "Any") {
        const distance = mockDistances[e.id] ?? 5;
        if (radiusFilter === "5km" && distance > 5) return false;
        if (radiusFilter === "10km" && distance > 10) return false;
        if (radiusFilter === "25km" && distance > 25) return false;
      }

      return true;
    });
  }, [
    events,
    searchQuery,
    feedType,
    activeCategory,
    tagFilter,
    priceFilter,
    safetyFilter,
    currentUser,
    dateFilter,
    radiusFilter,
  ]);

  // URL-based sorting (Relevance / Distance / Group Progress)
  const sortParam = searchParams.get("sort") || "Relevance";
  const sortedEvents = useMemo(() => {
    return [...filteredEvents].sort((a, b) => {
      if (sortParam === "Distance") {
        return (mockDistances[a.id] ?? 5) - (mockDistances[b.id] ?? 5);
      } else if (sortParam === "Group Progress") {
        const spacesA = (a.maxParticipants || 40) - 12;
        const spacesB = (b.maxParticipants || 40) - 12;
        return spacesA - spacesB;
      }

      // Default: Relevance (Match Score)
      const getMatchScore = (ev: (typeof events)[0]) => {
        if (!currentUser) return 0;
        const matchCount = (ev.tags ?? []).filter((t) =>
          (currentUser.interests || []).includes(t),
        ).length;
        return Math.min(
          99,
          45 + matchCount * 15 + (ev.category === "All" ? 0 : 10),
        );
      };

      if (sortParam === "Relevance" && currentUser) {
        return (
          getMatchScore(b) - getMatchScore(a) ||
          new Date(a.date).getTime() - new Date(b.date).getTime()
        );
      }

      // Chronological fallback
      return new Date(a.date).getTime() - new Date(b.date).getTime();
    });
  }, [filteredEvents, sortParam, currentUser]);

  const visibleEvents = sortedEvents.slice(0, visibleEventsCount);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (
          entries[0].isIntersecting &&
          !isLoading &&
          visibleEventsCount < sortedEvents.length
        ) {
          setVisibleEventsCount((c) => Math.min(c + 6, sortedEvents.length));
        }
      },
      { threshold: 0.1 },
    );

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current);
    }

    return () => observer.disconnect();
  }, [isLoading, visibleEventsCount, sortedEvents.length]);

  return (
    <div className="space-y-6 md:space-y-8 pb-10 md:pb-0">
      {/* Hero */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-gradient-to-br from-red-950 via-rose-950 to-red-900 text-white p-6 md:p-10 rounded-[24px] shadow-sm relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-8"
      >
        <div className="relative z-10 flex-1">
          <div className="text-red-300 text-[14.21px] font-bold tracking-wide mb-4">
            {t("home.hero.badge", "Νεος τροπος εξοδου")}
          </div>
          <h1 className="text-[17.33px] md:text-[22.77px] font-bold tracking-tight mb-4 leading-[1.1] max-w-2xl">
            {t("home.hero.title1", "Βρείτε παρέα για τις")}{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-red-400">
              {t("home.hero.title2", "εμπειρίες")}
            </span>{" "}
            {t("home.hero.title3", "που ήδη θέλετε να ζήσετε.")}
          </h1>
          <p className="text-white font-medium text-[14.42px] md:text-[16.48px] leading-relaxed max-w-xl mb-6">
            {t(
              "home.hero.subtitle",
              "Προσχωρήστε σε μικρές ομάδες για εκδηλώσεις, δραστηριότητες και κοντινές αποδράσεις — βασισμένες σε κοινά ενδιαφέροντα και διαθεσιμότητα.",
            )}
          </p>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-3 text-[11.33px] font-bold tracking-wide text-white mb-6">
            <span className="flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-red-300" />{" "}
              {t("home.hero.stat1", "Μικρες ομαδες")}
            </span>
            <span className="opacity-20">•</span>
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-red-300" />{" "}
              {t("home.hero.stat2", "Επαληθευμενη συμμετοχη")}
            </span>
            <span className="opacity-20">•</span>
            <span className="flex items-center gap-1.5">
              <MapIcon className="w-3.5 h-3.5 text-red-300" />{" "}
              {t("home.hero.stat3", "Δημοσια σημεια")}
            </span>
            <span className="opacity-20">•</span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-red-300" />{" "}
              {t("Ιδιωτικες αναφορες", "Private reports")}
            </span>
          </div>

          <div className="flex gap-3 mb-6">
            <button
              onClick={() => navigate("/nearby")}
              className="flex items-center gap-2 px-5 py-2.5 bg-[#18D8DB]/10 text-red-300 border border-[#18D8DB]/20 hover:bg-[#18D8DB]/20 rounded-xl font-bold text-[13.58px] transition-colors"
              title={t("Εμφάνιση στον Χάρτη", "View on Map")}
            >
              <MapIcon className="w-4 h-4" />
              {t("Αναζήτηση στον Χάρτη", "Search on Map")}
            </button>
          </div>

          {/* Search with suggestions */}
          <div className="flex gap-3 items-center">
            <div ref={searchRef} className="relative flex-1 max-w-md">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-white/80 z-10" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                onFocus={() => setShowSearchSuggestions(true)}
                placeholder={t(
                  "home.hero.search_placeholder",
                  "Αναζήτηση εμπειριών...",
                )}
                className="w-full h-11 pl-10 pr-4 rounded-full border-none bg-gray-800/10 text-white placeholder-white/80 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#18D8DB]/60 text-sm font-medium backdrop-blur-sm"
              />
              {showSearchSuggestions && !searchQuery && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-gray-800 rounded-xl shadow-xl border border-gray-800 z-50 overflow-hidden">
                  <div className="px-3 pt-2 pb-1">
                    <span className="text-[10px] font-bold text-white tracking-widest">
                      {t("Δημοφιλείς Αναζητήσεις", "Popular Searches")}
                    </span>
                  </div>
                  {searchSuggestions.map((s) => (
                    <button
                      key={s}
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => {
                        handleSearchChange(s);
                        setShowSearchSuggestions(false);
                      }}
                      className="w-full text-left px-4 py-2.5 text-sm text-white hover:bg-emerald-900/30 hover:text-emerald-400 transition-colors font-medium flex items-center gap-2"
                    >
                      <Search className="w-3.5 h-3.5 text-white" />
                      {s}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <button
              onClick={() => navigate("/trust")}
              className="hidden sm:flex items-center justify-center bg-gray-800/10 hover:bg-gray-800/20 backdrop-blur-sm text-white px-5 h-11 rounded-full text-xs font-bold transition-colors whitespace-nowrap"
            >
              {t("home.hero.how_groups", "Πώς λειτουργούν οι ομάδες")}
            </button>
          </div>
        </div>
        {/* Decorative */}
        <div className="absolute right-0 top-0 w-[500px] h-[500px] bg-gradient-to-br from-cyan-500/20 to-purple-500/20 rounded-full blur-3xl -translate-y-1/4 translate-x-1/4 pointer-events-none" />
      </motion.div>

      {/* Pending Feedback Alert */}
      <section className="bg-emerald-900/30 border border-emerald-800 rounded-xl p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex gap-3 items-center">
          <div className="bg-gray-800 p-2 text-amber-500 rounded-full shadow-sm shrink-0">
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-[14.63px] font-bold text-white">
              {t("home.pending_feedback.title", "Εκκρεμής Αξιολόγηση")}
            </h3>
            <p className="text-[11.33px] text-white font-medium mt-0.5 leading-relaxed">
              {t(
                "home.pending_feedback.body",
                'Αξιολογήστε τα 3 μέλη από το "Comedy Night" για να ξεκλειδώσετε την επόμενη κράτησή σας.',
              )}
            </p>
          </div>
        </div>
        <button
          onClick={() => navigate("/plans")}
          className="text-[12.38px] tracking-wider font-bold bg-gradient-to-br from-red-900 via-rose-900 to-red-800 text-white px-4 py-2 rounded-full whitespace-nowrap hover:bg-black w-full sm:w-auto shadow-sm transition-colors"
        >
          {t("home.pending_feedback.cta", "Αξιολόγηση")}
        </button>
      </section>

      {/* How it works */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {[
          {
            step: "1",
            title: t("home.how.step1.title", "Διαλέξτε μια εμπειρία"),
            body: t(
              "home.how.step1.body",
              "Επιλέξτε μια εκδήλωση, πεζοπορία ή δραστηριότητα που θέλετε να παρακολουθήσετε.",
            ),
          },
          {
            step: "2",
            title: t("home.how.step2.title", "Εντάξτε μια μικρή ομάδα"),
            body: t(
              "home.how.step2.body",
              "Συνδεθείτε με 3-6 άτομα που μοιράζονται την ίδια πρόθεση και πρόγραμμα.",
            ),
          },
          {
            step: "3",
            title: t("home.how.step3.title", "Επιβεβαιώστε & συναντηθείτε"),
            body: t(
              "home.how.step3.body",
              "Ξεκλειδώστε το group chat, ορίστε σημείο συνάντησης και απολαύστε την εμπειρία.",
            ),
          },
        ].map(({ step, title, body }) => (
          <div
            key={step}
            className="bg-gray-800 p-4 rounded-xl border border-gray-800 shadow-sm flex flex-col items-center text-center"
          >
            <div className="w-8 h-8 bg-emerald-900/30 text-emerald-400 rounded-full flex items-center justify-center font-bold text-xs mb-2.5">
              {step}
            </div>
            <h3 className="font-bold text-white text-[14.63px] mb-1">
              {title}
            </h3>
            <p className="text-[12.38px] leading-relaxed text-white font-medium">
              {body}
            </p>
          </div>
        ))}
      </section>

      {/* Categories & Filters */}
      <section className="space-y-4">
        <div>
          <h2 className="text-[11.6px] font-bold text-white tracking-wide mb-3">
            {t("home.explore_categories", "Εξερευνηση κατηγοριων")}
          </h2>
          <div ref={categoryScrollRef} className="flex flex-nowrap gap-2 overflow-x-auto pb-1 noscrollbar">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`whitespace-nowrap px-3.5 py-1 rounded-full text-[12.75px] font-bold shadow-sm transition-colors tracking-wide ${
                  activeCategory === cat
                    ? "bg-gradient-to-br from-red-900 via-rose-900 to-red-800 text-white"
                    : "bg-gray-800 border border-gray-700 text-white hover:text-white hover:bg-gray-900"
                }`}
              >
                {categoryTranslations[cat] ?? cat}
              </button>
            ))}
          </div>
        </div>

        {/* Tag filter */}
        <div className="flex gap-2 overflow-x-auto pb-1 noscrollbar">
          {popularTags.map((tag) => (
            <button
              key={tag}
              onClick={() => setTagFilter(tag)}
              className={`whitespace-nowrap px-3 py-1 rounded-full text-[11.82px] font-bold transition-colors border ${
                tagFilter === tag
                  ? "bg-[#18D8DB]/20 border-[#18D8DB] text-emerald-400"
                  : "bg-gray-800 border-gray-700 text-white hover:border-gray-300 hover:text-white"
              }`}
            >
              {tagTranslations[tag] ?? tag}
            </button>
          ))}
        </div>

        {/* Secondary filters */}
        <div className="flex gap-2 overflow-x-auto pb-1 noscrollbar items-center flex-wrap">
          <select
            className="text-[12.73px] border border-gray-700 rounded-full shadow-sm bg-gray-800 hover:bg-gray-900 py-1.5 px-3 font-medium outline-none cursor-pointer"
            value={priceFilter}
            onChange={(e) =>
              setPriceFilter(e.target.value as typeof priceFilter)
            }
          >
            <option value="All">
              {t("home.filter.all_types", "Όλοι οι Τύποι")}
            </option>
            <option value="Free">{t("home.filter.free", "Δωρεάν")}</option>
            <option value="Paid">{t("home.filter.paid", "Επί Πληρωμή")}</option>
            <option value="Group Discount">
              {t("home.filter.group_discount", "Ομαδική Έκπτωση")}
            </option>
          </select>

          <select
            className="text-[12.73px] border border-gray-700 rounded-full shadow-sm bg-gray-800 hover:bg-gray-900 py-1.5 px-3 font-medium outline-none cursor-pointer"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value as typeof dateFilter)}
          >
            <option value="Any">
              {t("home.filter.any_date", "Οποιαδήποτε Ημ/νία")}
            </option>
            <option value="Today">{t("home.filter.today", "Σήμερα")}</option>
            <option value="This Week">
              {t("home.filter.this_week", "Αυτή την Εβδομάδα")}
            </option>
            <option value="This Month">
              {t("home.filter.this_month", "Αυτόν τον Μήνα")}
            </option>
          </select>

          <select
            className="text-[12.73px] border border-gray-700 rounded-full shadow-sm bg-gray-800 hover:bg-gray-900 py-1.5 px-3 font-medium outline-none cursor-pointer"
            value={safetyFilter}
            onChange={(e) =>
              setSafetyFilter(e.target.value as typeof safetyFilter)
            }
          >
            <option value="All">
              {t("home.filter.all_comfort", "Όλα τα Επίπεδα")}
            </option>
            <option value="low">
              {t("home.filter.public", "Δημόσιοι Χώροι")}
            </option>
            <option value="medium">
              {t("home.filter.organized", "Οργανωμένοι Hosts")}
            </option>
            <option value="high_trust">
              {t("home.filter.verified", "Επαληθευμένες Ομάδες")}
            </option>
          </select>

          <select
            className="text-[12.73px] border border-gray-700 rounded-full shadow-sm bg-gray-800 hover:bg-gray-900 py-1.5 px-3 font-medium outline-none cursor-pointer"
            value={radiusFilter}
            onChange={(e) =>
              setRadiusFilter(e.target.value as typeof radiusFilter)
            }
          >
            <option value="Any">
              {t("home.filter.any_distance", "Οποιαδήποτε Απόσταση")}
            </option>
            <option value="5km">{t("home.filter.5km", "Εντός 5χλμ")}</option>
            <option value="10km">{t("home.filter.10km", "Εντός 10χλμ")}</option>
            <option value="25km">{t("home.filter.25km", "Εντός 25χλμ")}</option>
          </select>

          {/* Sort */}
          <div className="relative ml-auto">
            <select
              className="text-[12.73px] border border-gray-700 rounded-full shadow-sm bg-gray-800 hover:bg-gray-900 py-1.5 pl-7 pr-3 font-medium outline-none cursor-pointer appearance-none"
              value={sortParam}
              onChange={(e) => {
                const p = new URLSearchParams(searchParams);
                p.set("sort", e.target.value);
                setSearchParams(p);
              }}
            >
              <option value="Relevance">
                {t("home.feed.sort.relevance", "Συνάφεια")}
              </option>
              <option value="Distance">
                {t("home.feed.sort.distance", "Απόσταση")}
              </option>
              <option value="Group Progress">
                {t("home.feed.sort.group_progress", "Πρόοδος Ομάδας")}
              </option>
            </select>
            <ArrowDownUp className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-white pointer-events-none" />
          </div>
        </div>
      </section>

      {/* Events Grid */}
      <section>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-4">
          <div className="flex bg-gray-700 p-1 rounded-lg w-fit">
            <button
              onClick={() => setFeedType("For You")}
              className={`px-4 py-1.5 rounded-md text-[12.73px] font-bold transition-colors ${feedType === "For You" ? "bg-gray-800 shadow-sm text-white" : "text-white hover:text-white"}`}
            >
              {t("home.feed.for_you", "Για Σένα")}
            </button>
            <button
              onClick={() => setFeedType("Discover")}
              className={`px-4 py-1.5 rounded-md text-[12.73px] font-bold transition-colors ${feedType === "Discover" ? "bg-gray-800 shadow-sm text-white" : "text-white hover:text-white"}`}
            >
              {t("home.feed.discover", "Ανακάλυψε")}
            </button>
          </div>

          <div className="flex bg-gray-700 p-0.5 rounded-lg w-fit">
            <button className="p-1.5 rounded-md transition-colors bg-gray-800 shadow-sm text-white">
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => navigate("/nearby")}
              className="p-1.5 rounded-md transition-colors text-white hover:text-white"
              title={t("Άνοιγμα Χάρτη", "Open Map")}
            >
              <MapIcon className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {isLoading ? (
            Array.from({ length: 6 }).map((_, i) => (
              <EventCardSkeleton key={`skeleton-${i}`} />
            ))
          ) : sortedEvents.length === 0 ? (
            <div className="col-span-1 sm:col-span-2 lg:col-span-3 text-center py-12 bg-gray-900 rounded-2xl border border-dashed border-gray-700">
              <p className="text-white font-medium text-sm">
                {t(
                  "home.feed.no_events",
                  "Δεν βρέθηκαν εκδηλώσεις για τα κριτήριά σας.",
                )}
              </p>
            </div>
          ) : (
            visibleEvents.map((event, index) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <EventCard event={event} />
              </motion.div>
            ))
          )}
        </div>

        {/* Load More Trigger */}
        {!isLoading && visibleEventsCount < sortedEvents.length && (
          <div ref={loadMoreRef} className="flex justify-center mt-6 py-4">
            <div className="w-6 h-6 border-2 border-[#18D8DB] border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
      </section>
    </div>
  );
}
