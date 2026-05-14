import React from 'react';
import { Bookmark, MapPin, Calendar, Users, ArrowRight } from 'lucide-react';
import { useStore } from '../store';
import { Link } from 'react-router-dom';
import { format, parseISO } from 'date-fns';
import { Badge } from '../components/common/Badge';
import { useLanguage } from '../lib/i18n';

export default function SavedEventsNeonDark() {
  const { t } = useLanguage();
  const events = useStore((state) => state.events);
  // Using some mock data for demonstration
  const savedEvents = events.length >= 3 ? [events[0], events[2]] : events;

  return (
    <div className="max-w-full mx-auto space-y-6 animate-in slide-in-from-bottom-4 duration-500 fade-in pb-20 md:pb-0">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-white">{t('Αποθηκευμένα', 'Saved Events')}</h1>
          <p className="text-white font-medium text-xs md:text-sm mt-1">{t('Εμπειρίες που έχετε προσθέσει στους σελιδοδείκτες σας.', 'Experiences you\'ve bookmarked for later.')}</p>
        </div>
      </div>

      {savedEvents.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {savedEvents.map(event => (
            <Link key={event.id} to={`/events/${event.id}`} className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden shadow-sm hover:shadow-md transition-all group flex flex-col">
              <div className="h-32 bg-gray-200 relative overflow-hidden shrink-0">
                <img referrerPolicy="no-referrer" src={event.imageUrl} alt={event.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <button className="absolute top-3 right-3 w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center text-white shadow-sm z-10">
                  <Bookmark className="w-4 h-4 fill-current text-cyan-400" />
                </button>
              </div>
              <div className="p-4 flex flex-col flex-1">
                <div className="mb-2">
                  <Badge variant={event.safetyLevel === 'high_trust' ? 'warning' : 'outline'}>
                    {event.safetyLevel === 'high_trust' ? t('Υψηλή Εμπιστοσύνη', 'High Trust Req.') : event.safetyLevel === 'medium' ? t('Μεσαία Εμπιστοσύνη', 'Medium Trust') : t('Χαμηλό Ρίσκο • Δημόσια', 'Low Risk • Public')}
                  </Badge>
                </div>
                <h3 className="font-bold text-sm text-white group-hover:text-cyan-400 transition-colors line-clamp-2 mb-2">{event.title}</h3>
                
                <div className="mt-auto space-y-1.5">
                  <div className="flex items-center text-xs text-white font-medium">
                    <Calendar className="w-3.5 h-3.5 mr-1.5 shrink-0" />
                    <span className="truncate">{format(parseISO(event.date), 'MMM d, yyyy')} • {event.time}</span>
                  </div>
                  <div className="flex items-center text-xs text-white font-medium">
                    <MapPin className="w-3.5 h-3.5 mr-1.5 shrink-0" />
                    <span className="truncate">{event.locationArea}</span>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-gray-800 flex items-center gap-1.5 text-[10px] font-bold text-cyan-400 tracking-wider">
                  {t('Προβολή Λεπτομερειών', 'View Details')} <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-gray-900 rounded-2xl border border-dashed border-gray-700">
          <Bookmark className="mx-auto h-10 w-10 text-white mb-3" />
          <h3 className="text-base font-bold text-white">{t('Δεν υπάρχουν αποθηκευμένες εκδηλώσεις', 'No saved events yet')}</h3>
          <p className="text-sm text-white mt-1 max-w-sm mx-auto">{t('Όταν δείτε μια εκδήλωση που σας αρέσει, προσθέστε τη στους σελιδοδείκτες σας.', 'When you see an event you like, bookmark it to find it easily later.')}</p>
          <Link to="/" className="inline-flex items-center justify-center px-4 py-2 mt-4 bg-cyan-600 text-white text-xs font-bold rounded-full shadow-sm hover:bg-cyan-700 transition-colors">
            {t('Ανακαλύψτε Εκδηλώσεις', 'Discover Events')}
          </Link>
        </div>
      )}
    </div>
  );
}
