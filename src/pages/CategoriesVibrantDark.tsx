import React, { useState, useEffect } from 'react';
import { Search, Grid, TrendingUp, Star, Map, Music, Camera, Coffee, Ticket, Gamepad2, Bookmark, ArrowRight, Calendar, Compass, Mountain, Zap, HeartHandshake, BookOpen, Languages, MapPin, Bus, Leaf, Trophy, Palette, Monitor, Users, Lock, Car, TreePine, Plane, BrainCircuit } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useStore } from '../store';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { EventCard } from '../components/events/EventCard';
import { Skeleton, EventCardSkeleton } from '../components/common/Skeleton';
import { format, parseISO, isToday, isThisWeek, isThisMonth } from 'date-fns';

import { useLanguage } from '../lib/i18n';

export default function CategoriesVibrantDark() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const events = useStore((state) => state.events);

  const ALL_CATEGORIES = [
    { id: '1', name: t('Θεατρο', 'Theatre'), icon: Ticket, count: 12, color: 'text--400', bg: 'bg-rose-50', border: 'border-rose-100' },
    { id: '2', name: t('Συναυλιες', 'Concerts'), icon: Music, count: 8, color: 'text--400', bg: 'bg-purple-50', border: 'border-purple-100' },
    { id: '3', name: t('Σινεμα', 'Cinema'), icon: Camera, count: 15, color: 'text-cyan-400', bg: 'bg-emerald-900/30', border: 'border-emerald-800' },
    { id: '4', name: t('Stand-up', 'Stand-up'), icon: Zap, count: 4, color: 'text--400', bg: 'bg-yellow-50', border: 'border-yellow-100' },
    { id: '5', name: t('Μουσεια', 'Museums'), icon: Compass, count: 9, color: 'text--400', bg: 'bg-blue-50', border: 'border-blue-100' },
    { id: '6', name: t('Εκθεσεις', 'Exhibitions'), icon: Palette, count: 11, color: 'text-fuchsia-600', bg: 'bg-fuchsia-50', border: 'border-fuchsia-100' },
    { id: '7', name: t('Φεστιβαλ', 'Festivals'), icon: Star, count: 2, color: 'text--400', bg: 'bg-pink-50', border: 'border-pink-100' },
    { id: '8', name: t('Επιτραπεζια', 'Board games'), icon: Gamepad2, count: 18, color: 'text--400', bg: 'bg-orange-50', border: 'border-orange-100' },
    { id: '9', name: t('Λεσχες βιβλιου', 'Book clubs'), icon: BookOpen, count: 6, color: 'text--400', bg: 'bg-emerald-50', border: 'border-emerald-100' },
    { id: '10', name: t('Ανταλλαγη γλωσσων', 'Language exchange'), icon: Languages, count: 14, color: 'text-cyan-400', bg: 'bg-emerald-900/30', border: 'border-emerald-800' },
    { id: '11', name: t('Φιλοσοφια/Επιστημη', 'Philosophy/Science'), icon: BrainCircuit, count: 5, color: 'text-white', bg: 'bg-slate-50', border: 'border-slate-100' },
    { id: '12', name: t('Περιπατοι στην πολη', 'City walks'), icon: MapPin, count: 20, color: 'text--400', bg: 'bg-teal-50', border: 'border-teal-100' },
    { id: '13', name: t('Πεζοπορια', 'Hiking'), icon: Mountain || Map, count: 32, color: 'text--400', bg: 'bg-green-50', border: 'border-green-100' },
    { id: '14', name: t('Κοντινες αποδρασεις', 'Nearby escapes'), icon: Car, count: 7, color: 'text-sky-600', bg: 'bg-sky-50', border: 'border-sky-100' },
    { id: '15', name: t('Μονοημερες εκδρομες', 'Short day trips'), icon: Bus, count: 10, color: 'text-lime-600', bg: 'bg-lime-50', border: 'border-lime-100' },
    { id: '16', name: t('Περιπατοι στη φυση', 'Nature walks'), icon: TreePine || Leaf, count: 25, color: 'text--400', bg: 'bg-emerald-50', border: 'border-emerald-200' },
    { id: '17', name: t('Ελαφρια αθληματα', 'Light sports'), icon: Trophy, count: 19, color: 'text--400', bg: 'bg-red-50', border: 'border-red-100' },
    { id: '18', name: t('Εργαστηρια', 'Workshops'), icon: Coffee, count: 16, color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-100' },
    { id: '19', name: t('Online εκδηλωσεις', 'Online events'), icon: Monitor, count: 42, color: 'text-white', bg: 'bg-gray-900', border: 'border-gray-700' },
    { id: '20', name: t('Κοινοτικες εκδηλωσεις', 'Community events'), icon: HeartHandshake, count: 28, color: 'text-rose-500', bg: 'bg-rose-50', border: 'border-rose-100' },
    { id: '21', name: t('Ιδιωτικες εκδηλωσεις', 'Private events'), icon: Lock, count: 8, color: 'text-cyan-400', bg: 'bg-emerald-900/30', border: 'border-cyan-200' }
  ];

  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [priceFilter, setPriceFilter] = useState<'All' | 'Free' | 'Paid' | 'Group Discount'>('All');
  const [dateFilter, setDateFilter] = useState<'Any' | 'Today' | 'This Week' | 'This Month'>('Any');
  const [sortBy, setSortBy] = useState<'Relevance' | 'Distance' | 'Group Progress'>('Relevance');
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 600);
    return () => clearTimeout(timer);
  }, [activeCategory, priceFilter, dateFilter, sortBy, searchQuery]);

  // Recalculate dynamic counts for categories
  const categoryCounts = events.reduce((acc, event) => {
    const cat = event.category || '';
    acc[cat] = (acc[cat] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const visibleCategories = ALL_CATEGORIES.map(cat => ({
    ...cat,
    count: categoryCounts[cat.name] || 0 // Use actual count
  })).filter(cat => 
    cat.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredEvents = [...events].filter(e => {
    // Basic category check
    if (activeCategory && e.category !== activeCategory && !activeCategory.includes(e.category)) return false;
    if (priceFilter === 'Free' && e.isPaid) return false;
    if (priceFilter === 'Paid' && !e.isPaid) return false;
    if (priceFilter === 'Group Discount' && !e.groupDiscount) return false;
    
    if (dateFilter !== 'Any') {
      const eDate = parseISO(e.date);
      if (dateFilter === 'Today' && !isToday(eDate)) return false;
      if (dateFilter === 'This Week' && !isThisWeek(eDate)) return false;
      if (dateFilter === 'This Month' && !isThisMonth(eDate)) return false;
    }
    return true;
  }).sort((a, b) => {
    if (sortBy === 'Group Progress') {
      const progA = (a.currentParticipants || 0) / (a.maxParticipants || 1);
      const progB = (b.currentParticipants || 0) / (b.maxParticipants || 1);
      return progB - progA;
    }
    if (sortBy === 'Distance') {
      // Dummy logic for distance - assuming mock proximity
      return (a.lat ? 1 : 0) - (b.lat ? 1 : 0);
    }
    return 0; // Default Relevance
  });

  return (
    <div className="max-w-full mx-auto space-y-6 animate-in slide-in-from-bottom-4 duration-500 fade-in pb-20 md:pb-0">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-extrabold tracking-tight text-white">{t('Κατηγορίες', 'Categories')}</h1>
          <p className="text-white font-medium text-[13px] mt-1.5">{t('Εξερευνήστε όλο το φάσμα των εμπειριών μας.', 'Explore our full range of curated experiences.')}</p>
        </div>
      </div>

      <div className="relative mb-6 max-w-md">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-white" />
        <input 
          type="text" 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={t('Αναζήτηση κατηγοριών...', 'Search categories...')} 
          className="w-full h-11 pl-10 pr-4 rounded-full border border-gray-700 bg-gray-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-cyan-600 focus:border-transparent text-sm font-medium transition-shadow hover:shadow-md"
        />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 gap-3">
        {visibleCategories.map(cat => (
          <div 
            key={cat.id} 
            className={`bg-gray-800 rounded-xl p-3 border shadow-sm hover:shadow-md transition-all cursor-pointer group flex flex-col items-center text-center ${activeCategory === cat.name ? 'border-cyan-600 ring-1 ring-cyan-600' : 'border-gray-800 hover:border-gray-700'}`}
            onClick={() => setActiveCategory(activeCategory === cat.name ? null : cat.name)}
          >
            <div className={`w-10 h-10 rounded-full ${cat.bg} ${cat.border} border flex items-center justify-center mb-2 group-hover:scale-110 transition-transform duration-300`}>
              <cat.icon className={`w-5 h-5 ${cat.color}`} />
            </div>
            <h3 className="font-bold text-white text-xs group-hover:text-cyan-400 transition-colors line-clamp-1 w-full">{cat.name}</h3>
            <p className="text-[10px] font-semibold text-white mt-1 capitalize tracking-wide">{cat.count} {t('Εκδηλώσεις', 'Events')}</p>
          </div>
        ))}
      </div>
      
      {visibleCategories.length === 0 && (
         <div className="text-center py-12 bg-gray-900 rounded-2xl border border-dashed border-gray-700">
           <p className="text-white font-medium text-sm">{t('Δεν βρέθηκαν κατηγορίες.', 'No categories found matching ')} "{searchQuery}".</p>
         </div>
      )}

      <div className="mt-8 border-t border-gray-700 pt-8" id="events-list">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <h2 className="text-sm font-bold text-white capitalize tracking-tight shrink-0">
            {activeCategory ? `${activeCategory} ${t('Εκδηλώσεις', 'Events')}` : t('Όλες οι Εκδηλώσεις', 'All Events')}
          </h2>
          <div className="flex gap-2 overflow-x-auto pb-2 noscrollbar items-center w-full md:w-auto">
            {/* Sort Dropdown */}
            <select 
              className="text-xs border border-gray-700 rounded-lg shadow-sm focus:border-cyan-500 focus:ring-cyan-500 bg-gray-800 hover:bg-gray-900 py-1.5 px-3 font-medium outline-none cursor-pointer h-8 shrink-0 appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2212%22%20height%3D%2212%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%23ffffff%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E')] bg-no-repeat bg-[position:right_0.5rem_center] pr-7"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
            >
              <option value="Relevance">{t('Συνάφεια', 'Relevance')}</option>
              <option value="Distance">{t('Απόσταση', 'Distance')}</option>
              <option value="Group Progress">{t('Πρόοδος Ομάδας', 'Group Progress')}</option>
            </select>

            <div className="w-px h-6 bg-gray-200 shrink-0 mx-1"></div>

            {/* Price Pills */}
            <div className="flex gap-1 shrink-0 bg-gray-700/80 p-0.5 rounded-lg border border-gray-700/50">
              {['All', 'Free', 'Paid', 'Group Discount'].map((price) => (
                <button
                  key={price}
                  onClick={() => setPriceFilter(price as any)}
                  className={`text-[10px] sm:text-xs font-semibold px-2.5 sm:px-3 py-1.5 rounded-md transition-all whitespace-nowrap ${priceFilter === price ? 'bg-gray-800 text-cyan-400 shadow-sm border border-gray-700/50 ring-1 ring-black/5' : 'text-white hover:text-white hover:bg-gray-200/50'}`}
                >
                  {price === 'All' ? t('Όλες', 'All') : price === 'Free' ? t('Δωρεάν', 'Free') : price === 'Paid' ? t('Επί πληρωμή', 'Paid') : t('Ομαδική Έκπτωση', 'Group Discount')}
                </button>
              ))}
            </div>

            <div className="w-px h-6 bg-gray-200 shrink-0 mx-1"></div>

            {/* Date Pills */}
            <div className="flex gap-1 shrink-0 bg-gray-700/80 p-0.5 rounded-lg border border-gray-700/50">
              {['Any', 'Today', 'This Week', 'This Month'].map((date) => (
                <button
                  key={date}
                  onClick={() => setDateFilter(date as any)}
                  className={`text-[10px] sm:text-xs font-semibold px-2.5 sm:px-3 py-1.5 rounded-md transition-all whitespace-nowrap ${dateFilter === date ? 'bg-gray-800 text-cyan-400 shadow-sm border border-gray-700/50 ring-1 ring-black/5' : 'text-white hover:text-white hover:bg-gray-200/50'}`}
                >
                  {date === 'Any' ? t('Οποιαδήποτε', 'Any Date') : date === 'Today' ? t('Σήμερα', 'Today') : date === 'This Week' ? t('Αυτή την εβδ.', 'This Week') : t('Αυτόν τον μήνα', 'This Month')}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {isLoading ? (
            Array.from({ length: 6 }).map((_, i) => (
              <EventCardSkeleton key={`skeleton-${i}`} />
            ))
          ) : filteredEvents.length === 0 ? (
            <div className="col-span-1 sm:col-span-2 lg:col-span-3 text-center py-12 bg-gray-900 rounded-2xl border border-dashed border-gray-700">
              <p className="text-white font-medium text-sm">{t('Δεν βρέθηκαν εκδηλώσεις για τα κριτήριά σας.', 'No events found matching your criteria.')}</p>
            </div>
          ) : (
            filteredEvents.map(event => (
              <EventCard key={event.id} event={event} />
            ))
          )}
        </div>
      </div>

      <div className="mt-8 bg-emerald-900/30 rounded-2xl p-6 border border-emerald-800 flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-bold text-white">{t('Δεν βρίσκετε αυτό που ψάχνετε;', 'Can\'t find what you\'re looking for?')}</h3>
          <p className="text-xs text-white mt-1">{t('Δημιουργήστε τη δική σας εκδήλωση και συγκεντρώστε άτομα με παρόμοια ενδιαφέροντα.', 'Create your own event and gather people with similar interests.')}</p>
        </div>
        <button onClick={() => navigate('/create-event')} className="bg-cyan-600 text-white px-5 py-2 rounded-full text-xs font-bold shadow-sm hover:bg-cyan-700 transition-colors whitespace-nowrap shrink-0">
          {t('Δημιουργία Εκδήλωσης', 'Create Event')}
        </button>
      </div>
    </div>
  );
}
