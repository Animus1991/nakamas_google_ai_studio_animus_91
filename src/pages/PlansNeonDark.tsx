import { useState } from 'react';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { Button } from '../components/common/Button';
import { MessageCircle, MapPin, Search, Calendar, Star, Clock, AlertTriangle, ShieldCheck, CheckCircle, XCircle, Users } from 'lucide-react';
import { mockEvents } from '../data/mockEvents';
import { useNavigate } from 'react-router-dom';
import { format, parseISO, differenceInDays, differenceInHours } from 'date-fns';
import { useLanguage } from "../lib/i18n";

export default function PlansNeonDark() {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<'upcoming' | 'pending' | 'past'>('upcoming');
  const navigate = useNavigate();
  
  // Mocks based on events
  const upcomingEvents = mockEvents.filter(e => e.id === 'e4' || e.id === 'e1');
  const pendingEvents = mockEvents.filter(e => e.id === 'e5');
  const pastEvents = mockEvents.filter(e => e.id === 'e2' || e.id === 'e3');

  return (
    <div className="mx-auto max-w-full space-y-6 md:space-y-8 pb-20 md:pb-0">
      <div>
        <h1 className="text-[21.2211685261125px] md:text-[25.450724769334997px] font-bold text-white">{t(`Τα Σχέδιά μου`, `My Plans`)}</h1>
        <p className="mt-1 text-[12.87402780052125px] text-white font-medium">{t(`Διαχείριση επερχόμενων, εκκρεμών και παρελθόντων εκδηλώσεων.`, `Manage your upcoming experiences, pending groups, and past events.`)}</p>
      </div>

      {/* Action required prompt */}
      <Card className="rounded-xl p-4 border border-amber-200 bg-amber-50 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <h3 className="font-bold text-white text-[15.921724499999998px] mb-1">{t(`Επαληθεύστε την ταυτότητά σας`, `Verify your identity`)}</h3>
            <p className="text-[13.80825px] text-amber-800 font-medium">{t(`Πρέπει να ολοκληρώσετε την επαλήθευση για να συμμετάσχετε στο "Arachova Retreat".`, `You need to complete ID verification to join the "Arachova Retreat" you expressed interest in.`)}</p>
          </div>
        </div>
        <button onClick={() => navigate('/trust')} className="bg-amber-600 text-white px-4 py-2 rounded-full text-[13.533465824999999px] font-bold shadow-sm hover:bg-amber-700 transition-colors whitespace-nowrap shrink-0 snap-center">
          {t(`Επαλήθευση`, `Verify Now`)}
        </button>
      </Card>

      <div className="flex gap-4 border-b border-gray-700 overflow-x-auto noscrollbar">
        <button 
          onClick={() => setActiveTab('upcoming')}
          className={`pb-3 text-[11.506875px] font-bold tracking-wide transition-colors whitespace-nowrap ${
            activeTab === 'upcoming' 
              ? 'border-b-2 border-cyan-600 text-cyan-400' 
              : 'text-white hover:text-white'
          }`}
        >
          {t(`Επερχόμενα`, `Upcoming Confirmed`)}
        </button>
        <button 
          onClick={() => setActiveTab('pending')}
          className={`pb-3 text-[11.506875px] font-bold tracking-wide transition-colors whitespace-nowrap ${
            activeTab === 'pending' 
              ? 'border-b-2 border-cyan-600 text-cyan-400' 
              : 'text-white hover:text-white'
          }`}
        >
          {t(`Εκκρεμή`, `Pending & Waitlists`)}
        </button>
        <button 
          onClick={() => setActiveTab('past')}
          className={`pb-3 text-[11.506875px] font-bold tracking-wide transition-colors whitespace-nowrap ${
            activeTab === 'past' 
              ? 'border-b-2 border-cyan-600 text-cyan-400' 
              : 'text-white hover:text-white'
          }`}
        >
          {t(`Ιστορικό`, `Past & Feedback`)}
        </button>
      </div>

      {activeTab === 'upcoming' && (
      <div className="space-y-4">
        {upcomingEvents.map(event => (
          <Card key={event.id} className="rounded-xl p-4 sm:p-5 border border-emerald-800 flex flex-col sm:flex-row gap-4">
            <div className="w-full sm:w-32 h-32 sm:h-auto shrink-0 bg-gray-700 rounded-lg overflow-hidden relative">
              <img referrerPolicy="no-referrer" src={event.imageUrl} alt={event.title} className="w-full h-full object-cover" />
              <div className="absolute top-2 left-2 bg-cyan-600 text-white px-2 py-0.5 rounded text-[10.6875px] font-bold tracking-wide">
                {t(`Επιβεβαιωμένο`, `Confirmed`)}
              </div>
            </div>
            
            <div className="flex-1 flex flex-col">
              <div className="flex justify-between items-start gap-2 mb-2">
                <h3 className="font-bold text-[19px] text-white">{event.title}</h3>
                <div className="text-right shrink-0">
                  <div className="text-[17.099999999999998px] font-bold text-white">{format(parseISO(event.date), 'MMM d')}</div>
                  <div className="text-[14.107499999999998px] font-medium text-white">{event.time}</div>
                  {(() => {
                    const days = differenceInDays(parseISO(event.date), new Date());
                    const hours = differenceInHours(parseISO(event.date), new Date());
                    if (days <= 0 && hours > 0) return <span className="text-[10.639999999999999px] font-bold text--400 bg-orange-50 px-1.5 py-0.5 rounded mt-0.5 inline-block">{t(`σε`, `in`)} {hours}h</span>;
                    if (days > 0 && days <= 7) return <span className="text-[10.639999999999999px] font-bold text-cyan-400 bg-emerald-900/30 px-1.5 py-0.5 rounded mt-0.5 inline-block">{t(`σε`, `in`)} {days} {t(`μέρες`, `days`)}</span>;
                    return null;
                  })()}
                </div>
              </div>
              
              <div className="flex flex-wrap gap-x-4 gap-y-2 mb-4">
                <div className="flex items-center text-[12.825px] text-white font-medium">
                  <MapPin className="w-3.5 h-3.5 mr-1" /> {t(`Σημείο συνάντησης ενεργό`, `Meeting point active`)}
                </div>
                <div className="flex items-center text-[12.825px] text-white font-medium">
                  <Clock className="w-3.5 h-3.5 mr-1" /> {event.duration}
                </div>
              </div>

              {/* Group members preview */}
              <div className="flex items-center gap-2 mb-3">
                <div className="flex -space-x-2">
                  {['https://i.pravatar.cc/24?u=p1', 'https://i.pravatar.cc/24?u=p2', 'https://i.pravatar.cc/24?u=p3'].map((url, i) => (
                    <img key={i} src={url} alt="" className="w-6 h-6 rounded-full border-2 border-white object-cover" />
                  ))}
                </div>
                <span className="text-[10.6875px] font-medium text-white flex items-center gap-0.5">
                  <Users className="w-3 h-3" /> 4/5 {t(`μέλη`, `members`)}
                </span>
              </div>

              <div className="mt-auto pt-4 border-t border-gray-800 flex gap-2">
                <button onClick={() => navigate(`/chat/${event.id}`)} className="flex-1 bg-emerald-900/30 hover:bg-emerald-900/50 text-cyan-400 py-2 rounded-lg text-[12.825px] font-bold transition-colors flex items-center justify-center gap-1.5">
                  <MessageCircle className="h-4 w-4" /> {t(`Ομαδική Συνομιλία`, `Group Chat`)}
                </button>
                <button onClick={() => navigate(`/events/${event.id}`)} className="bg-gray-800 border border-gray-700 hover:bg-gray-900 text-white px-4 py-2 rounded-lg text-[12.825px] font-bold transition-colors">
                  {t(`Λεπτομέρειες`, `Details`)}
                </button>
                <button className="bg-gray-800 border border-red-200 hover:bg-red-50 text-red-500 px-3 py-2 rounded-lg text-[12.825px] font-bold transition-colors flex items-center gap-1">
                  <XCircle className="h-3.5 w-3.5" /> {t(`Αποχώρηση`, `Leave`)}
                </button>
              </div>
            </div>
          </Card>
        ))}
        
        {upcomingEvents.length === 0 && (
          <div className="text-center py-12 bg-gray-900 rounded-xl border border-dashed border-gray-700">
            <p className="text-white font-medium text-[17.099999999999998px] mb-4">{t(`Δεν υπάρχουν επερχόμενα σχέδια.`, `No upcoming confirmed plans.`)}</p>
            <button className="bg-gradient-to-br from-red-900 via-rose-900 to-red-800 text-white px-5 py-2 rounded-full text-[13.5375px] font-bold" onClick={() => navigate('/')}>{t(`Εξερεύνηση`, `Explore Experiences`)}</button>
          </div>
        )}
      </div>
      )}

      {activeTab === 'pending' && (
      <div className="space-y-4">
        {pendingEvents.map(event => (
          <Card key={event.id} className="rounded-xl p-4 sm:p-5 border border-gray-700 flex flex-col sm:flex-row gap-4 opacity-75 hover:opacity-100 transition-opacity">
            <div className="w-full sm:w-32 h-32 sm:h-auto shrink-0 bg-gray-700 rounded-lg overflow-hidden relative grayscale">
              <img referrerPolicy="no-referrer" src={event.imageUrl} alt={event.title} className="w-full h-full object-cover" />
              <div className="absolute top-2 left-2 bg-gray-800 text-white px-2 py-0.5 rounded text-[10.6875px] font-bold tracking-wide">
                {t(`Εκκρεμής Ομάδα`, `Pending Group`)}
              </div>
            </div>
            
            <div className="flex-1 flex flex-col">
              <div className="flex justify-between items-start gap-2 mb-2">
                <h3 className="font-bold text-[19px] text-white opacity-80">{event.title}</h3>
                <div className="text-right shrink-0">
                  <div className="text-[17.099999999999998px] font-bold text-white">{format(parseISO(event.date), 'MMM d')}</div>
                </div>
              </div>
              
              <p className="text-[12.825px] text-white font-medium mb-4">
                {t(`Εκδηλώσατε ενδιαφέρον. Αναμονή για 2 ακόμα άτομα για να επιβεβαιωθεί η ομάδα.`, `You expressed interest. Waiting for 2 more people to confirm the group and unlock the meeting point.`)}
              </p>

              <div className="mt-auto pt-4 border-t border-gray-800 flex gap-2">
                <button onClick={() => navigate(`/events/${event.id}`)} className="bg-gray-800 border border-gray-700 hover:bg-gray-900 text-white px-4 py-2 rounded-lg text-[12.825px] font-bold transition-colors">
                  {t(`Κατάσταση`, `View Status`)}
                </button>
              </div>
            </div>
          </Card>
        ))}
      </div>
      )}

      {activeTab === 'past' && (
      <div className="space-y-4">
        {pastEvents.map((event, index) => (
          <Card key={event.id} className="rounded-xl p-4 sm:p-5 border border-gray-700 flex flex-col sm:flex-row gap-4">
            <div className="flex-1 flex flex-col">
              <div className="flex items-center gap-2 mb-1.5 text-[12.825px] font-bold text-white">
                <Calendar className="w-3.5 h-3.5" />
                {format(parseISO(event.date), 'MMMM d, yyyy')}
              </div>
              <h3 className="font-bold text-[19px] text-white mb-3">{event.title}</h3>
              
              {index === 0 ? (
                <div className="bg-emerald-900/30 border border-emerald-800 p-3 rounded-lg flex items-center justify-between mt-auto">
                  <div className="text-[12.825px] font-bold text-cyan-400">{t(`Απαιτείται αξιολόγηση`, `Feedback required`)}</div>
                  <button onClick={() => navigate(`/history/feedback/${event.id}`)} className="text-[10.6875px] font-bold bg-cyan-600 text-white px-3 py-1.5 rounded hover:bg-cyan-700 tracking-wide">
                    {t(`Αξιολόγηση`, `Rate Experience`)}
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2 mt-auto text-[12.825px] font-bold text--400">
                  <CheckCircle className="w-4 h-4" /> {t(`Αξιολόγηση υποβλήθηκε`, `Feedback submitted`)}
                </div>
              )}
            </div>
          </Card>
        ))}
      </div>
      )}
    </div>
  );
}

