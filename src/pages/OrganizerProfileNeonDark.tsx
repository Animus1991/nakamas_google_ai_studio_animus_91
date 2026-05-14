import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useStore } from '../store';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { Calendar, MapPin, ShieldCheck, Mail, Globe, X } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { useLanguage } from '../lib/i18n';

export default function OrganizerProfileNeonDark() {
  const { id } = useParams();
  const { t } = useLanguage();
  const [showContactModal, setShowContactModal] = useState(false);
  const events = useStore((state) => state.events);
  const users = useStore((state) => state.users);
  const organizer = users.find(u => u.id === id);
  const hostedEvents = events.filter(e => e.organizerId === id);

  if (!organizer) return <div className="p-8 text-center text-white font-medium">{t('Ο διοργανωτής δεν βρέθηκε', 'Organizer not found')}</div>;

  const isVerifiedOrganizer = organizer.idVerified && organizer.reliabilityScore >= 80;

  return (
    <div className="mx-auto max-w-full space-y-8 relative">
      {/* Profile Header */}
      <div className="bg-gray-800 rounded-xl border border-gray-700 p-8 shadow-sm text-center sm:text-left sm:flex sm:items-start gap-8">
        <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-700 mx-auto sm:mx-0 shrink-0 border-4 border-white shadow-md">
          {organizer.photoUrl ? (
            <img referrerPolicy="no-referrer" src={organizer.photoUrl} alt={organizer.name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-white text-3xl font-bold">
              {organizer.name.substring(0, 2).toUpperCase()}
            </div>
          )}
        </div>
        
        <div className="mt-6 sm:mt-0 flex-1 space-y-4">
          <div>
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-2">
              {isVerifiedOrganizer && (
                <Badge variant="outline" icon={<ShieldCheck className="h-3 w-3 text-cyan-400" />}>
                  {t('Επαληθευμένος Διοργανωτής', 'Verified Organizer')}
                </Badge>
              )}
              <Badge variant="neutral">{t('Επίπεδο Εμπιστοσύνης', 'Trust Tier')} {organizer.trustTier.split('_')[0]}</Badge>
            </div>
            <h1 className="text-3xl font-bold text-white">{organizer.name}</h1>
            <p className="text-sm text-white font-medium mt-1"><MapPin className="h-3.5 w-3.5 inline mr-1" /> {organizer.city}</p>
          </div>
          
          <p className="text-sm text-white leading-relaxed max-w-2xl">
            {organizer.bio || t('Άυτος ο διοργανωτής δεν έχει προσθέσει βιογραφικό ακόμα. Είναι ένας επαληθευμένος συνεργάτης του Nakamas που διαχειρίζεται εξαιρετικές εκδηλώσεις.', 'This organizer has not provided a biography yet. They are a verified partner of Nakamas managing high-quality group events.')}
          </p>

          {/* Average Rating Section */}
          <div className="flex items-center gap-4 bg-gray-900 p-3 rounded-lg border border-gray-800 w-fit">
             <div className="flex items-center gap-1 text-yellow-500">
               {[1, 2, 3, 4, 5].map(star => (
                 <svg key={star} className={`w-4 h-4 ${star <= 4 ? 'fill-current' : 'text-white'}`} viewBox="0 0 24 24">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                 </svg>
               ))}
             </div>
             <div className="text-xs font-bold text-white">
               4.2 / 5.0 
               <span className="text-white font-medium ml-1">({t('120+ Κριτικές Εκδηλώσεων', '120+ Event Reviews')})</span>
             </div>
          </div>
          
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 pt-2">
            <button 
              onClick={() => setShowContactModal(true)}
              className="text-[10px] font-bold tracking-wide text-white hover:text-cyan-400 transition-colors flex items-center gap-1"
            >
              <Mail className="h-4 w-4" /> {t('Επικοινωνία', 'Contact Organizer')}
            </button>
            <a 
              href="#" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-[10px] font-bold tracking-wide text-white hover:text-cyan-400 transition-colors flex items-center gap-1"
            >
              <Globe className="h-4 w-4" /> {t('Ιστότοπος', 'Website')}
            </a>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-lg font-bold text-white">{t('Επερχόμενες Εκδηλώσεις από', 'Upcoming Events by')} {organizer.name}</h2>
        {hostedEvents.length === 0 ? (
          <div className="text-center py-12 bg-gray-900 rounded-xl border border-dashed border-gray-700">
            <p className="text-white font-medium text-sm">{t('Δεν έχουν προγραμματιστεί επερχόμενες εκδηλώσεις.', 'No upcoming events currently scheduled.')}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {hostedEvents.map(event => (
              <Link key={event.id} to={`/events/${event.id}`}>
                <Card className="flex items-start gap-4 p-4 hover:border-cyan-300 transition-colors cursor-pointer group">
                  <div className="w-20 h-20 bg-gray-700 rounded-lg overflow-hidden shrink-0">
                    <div className="w-full h-full bg-emerald-900/30 flex flex-col items-center justify-center text-cyan-400">
                      <span className="text-[10px] font-bold tracking-wide">{format(parseISO(event.date), 'MMM')}</span>
                      <span className="text-xl font-bold leading-none">{format(parseISO(event.date), 'd')}</span>
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-white group-hover:text-cyan-400 transition-colors line-clamp-1">{event.title}</h3>
                    <p className="text-xs text-white mt-1">{event.time} • {event.locationArea}</p>
                    <div className="mt-2 flex gap-2">
                      <Badge variant="neutral">{event.category}</Badge>
                      {event.isPaid ? <Badge variant="outline">€{event.price}</Badge> : <Badge variant="outline">{t('Δωρεάν', 'Free')}</Badge>}
                    </div>
                  </div>
                  <div className="hidden sm:flex items-center text-[10px] font-bold tracking-wide text-cyan-400 self-center">
                    {t('Προβολή', 'View')} &rarr;
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>

      {showContactModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-gray-800 rounded-xl shadow-xl max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-white">{t('Επικοινωνία με', 'Contact')} {organizer.name}</h3>
              <button onClick={() => setShowContactModal(false)} className="text-white hover:text-white transition-colors">
                <X className="h-5 w-5" />
              </button>
            </div>
            <p className="text-sm text-white mb-4">
              {t('Στείλτε ένα ασφαλές μήνυμα σε αυτόν τον διοργανωτή για τις εκδηλώσεις του, τα εισιτήρια ή γενικές ερωτήσεις.', 'Send a secure message to this organizer about their events, tickting issues, or general inquiries.')}
            </p>
            <textarea 
              className="w-full border border-gray-300 rounded-lg p-3 text-sm resize-none mb-4 focus:ring-2 focus:ring-cyan-600 outline-none"
              rows={4}
              placeholder={t('Το μήνυμά σας...', 'Your message...')}
            ></textarea>
            <div className="flex justify-end gap-3">
              <button 
                onClick={() => setShowContactModal(false)}
                className="px-4 py-2 text-sm font-bold text-white hover:bg-gray-700 rounded-lg transition-colors"
              >
                {t('Ακύρωση', 'Cancel')}
              </button>
              <button 
                onClick={() => {
                  alert(t('Το μήνυμά σας έχει σταλεί απευθείας στον διοργανωτή.', 'Your message has been sent directly to the organizer.'));
                  setShowContactModal(false);
                }}
                className="px-4 py-2 text-sm font-bold text-white bg-cyan-600 hover:bg-cyan-700 rounded-lg transition-colors"
              >
                {t('Αποστολή Μηνύματος', 'Send Message')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
