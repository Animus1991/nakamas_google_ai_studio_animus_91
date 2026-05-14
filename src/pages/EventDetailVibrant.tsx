import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import { motion } from 'motion/react';
import { useStore } from '../store';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { Button } from '../components/common/Button';
import { Skeleton, EventDetailSkeleton } from '../components/common/Skeleton';
import { Calendar, MapPin, Users, Ticket, ShieldCheck, Clock, CheckCircle, AlertTriangle, Share, Bookmark, Hash, ExternalLink, Maximize, Minimize, QrCode, X } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { APIProvider, Map, AdvancedMarker, Pin } from '@vis.gl/react-google-maps';
import { ErrorBoundary } from '../components/common/ErrorBoundary';
import { useLanguage } from '../lib/i18n';

function Group({ group, event, navigate }: { group: any; event: any; navigate: any; key?: any }) {
  const { t } = useLanguage();
  const users = useStore((state) => state.users);
  const spotsLeft = group.targetSize - group.members.length;
  const isDiscountEligible = event.groupDiscount && group.targetSize >= event.groupDiscount.minSize;
  const discountUnlockedTemp = event.groupDiscount && group.members.length >= event.groupDiscount.minSize;
  const membersNeededForDiscount = event.groupDiscount ? Math.max(0, event.groupDiscount.minSize - group.members.length) : 0;
  
  const hostId = group.hostId || group.members[0];
  const groupHost = users.find(u => u.id === hostId);
  
  return (
    <div 
      className="group relative rounded-xl border border-gray-200 bg-white p-4 shadow-sm hover:border-cyan-300 hover:shadow-md transition-all cursor-pointer overflow-hidden mt-2" 
      onClick={() => navigate(`/events/${event.id}/join?groupId=${group.id}`)}
    >
      <div className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-cyan-400 to-purple-400 opacity-0 group-hover:opacity-100 transition-opacity"></div>
      
      {(group.discountUnlocked || discountUnlockedTemp) && event.groupDiscount && (
        <div className="absolute -top-1 -right-1 bg-emerald-500 text-white text-[10px] font-bold px-2 py-1 rounded-bl-lg shadow-sm flex items-center gap-1 z-10 w-fit">
           <CheckCircle className="h-3 w-3" /> {event.groupDiscount.percentage}% {t('ΕΚΠΤΩΣΗ ΕΝΕΡΓΟΠΟΙΗΘΗΚΕ', 'OFF ACTIVATED')}
        </div>
      )}
      
      <div className="flex justify-between items-start mb-3 mt-1">
        <div>
          <div className="flex items-center gap-1.5 text-xs font-bold text-black tracking-wide mb-1">
            <Users className="h-3.5 w-3.5" />
            {t('Ομαδα', 'Group')} {group.id.replace('g', '#')}
          </div>
          <h4 className="text-[13px] font-bold text-black mb-0.5 line-clamp-1">{event.title}</h4>
          <span className="text-[9px] tracking-widest font-bold text-cyan-600 bg-cyan-50 px-2 py-0.5 rounded-full mb-2 inline-block shadow-sm">
            {event.category}
          </span>
          <div className="flex items-baseline gap-1 mt-1">
             <span className="text-lg font-bold text-black">{group.members.length}</span>
             <span className="text-xs font-medium text-black">/ {group.targetSize} {t('μέλη', 'members')}</span>
          </div>
        </div>
        
        <div className="flex flex-col items-end gap-2">
          <Badge variant={spotsLeft <= 2 ? 'warning' : 'outline'} className={spotsLeft <= 2 ? "font-bold animate-pulse shadow-sm" : ""}>
            {spotsLeft === 1 ? t('1 Θέση!', '1 Spot!') : spotsLeft + t(' Θέσεις', ' Spots')}
          </Badge>
          
          {groupHost && (
            <div className="flex flex-col items-end mr-1 mt-1" title={t(`Οργανώθηκε από $${groupHost.name} ($${groupHost.trustTier})`, `Organized by $${groupHost.name} ($${groupHost.trustTier})`)}>
              <div className="relative">
                <div className="h-8 w-8 rounded-full bg-gray-200 overflow-hidden shrink-0 border border-gray-200">
                   {groupHost.photoUrl ? (
                     <img referrerPolicy="no-referrer" src={groupHost.photoUrl} alt={groupHost.name} className="h-full w-full object-cover" />
                   ) : (
                     <div className="h-full w-full flex items-center justify-center bg-cyan-100 text-cyan-700 font-bold text-xs">
                        {groupHost.name.charAt(0)}
                     </div>
                   )}
                </div>
                {groupHost.trustTier === '3_high_trust' ? (
                   <div className="absolute -bottom-1 -right-1 bg-emerald-100 rounded-full p-0.5 border border-white">
                      <ShieldCheck className="w-3 h-3 text-emerald-600" />
                   </div>
                ) : groupHost.trustTier === '2_confirmed' ? (
                   <div className="absolute -bottom-1 -right-1 bg-blue-100 rounded-full p-0.5 border border-white">
                      <CheckCircle className="w-3 h-3 text-blue-600" />
                   </div>
                ) : null}
              </div>
              <span className="text-[9px] font-bold text-black mt-1">{t('Οικοδεσποτης', 'Host')}</span>
            </div>
          )}
        </div>
      </div>
      
      {isDiscountEligible && !discountUnlockedTemp && (
        <div className="bg-amber-50/80 border border-amber-200/50 p-2.5 rounded-lg mb-4">
          <div className="flex justify-between items-center mb-1.5">
            <p className="text-[10px] text-amber-800 font-bold tracking-wide">
              {t('Πρόοδος Έκπτωσης', 'Discount Progress')}
            </p>
            <span className="text-[10px] font-bold text-amber-700 bg-amber-100 px-1.5 py-0.5 rounded">-{event.groupDiscount.percentage}%</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-2 flex-1 bg-amber-200/50 rounded-full overflow-hidden">
               <div className="h-full bg-amber-500 rounded-full" style={{ width: `${(group.members.length / event.groupDiscount.minSize) * 100}%` }}></div>
            </div>
            <span className="text-[10px] font-bold text-amber-700">{membersNeededForDiscount} {t('ακόμα', 'more')}</span>
          </div>
        </div>
      )}
      
      {!isDiscountEligible && (
         <div className="flex items-center gap-1.5 text-xs text-black mb-4 bg-gray-50 p-2 rounded-md border border-gray-100">
           <ShieldCheck className="h-4 w-4 text-black" />
           <span className="font-medium">{t('Μικρή & ιδιωτική ομάδα', 'Small & private group')}</span>
         </div>
      )}

      <Button 
        variant="primary" 
        size="sm" 
        className="w-full bg-cyan-50 text-cyan-700 border border-cyan-100 hover:bg-cyan-600 hover:text-white transition-colors group-hover:bg-cyan-600 group-hover:text-white font-semibold shadow-sm"
        onClick={(e) => { e.stopPropagation(); navigate(`/events/${event.id}/join`); }}
      >
        {t('Προβολή & Συμμετοχή στην Ομάδα', 'View & Join Group')}
      </Button>
    </div>
  );
}

export default function EventDetailVibrant() {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [isLoading, setIsLoading] = useState(true);
  const [isCopied, setIsCopied] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [showQRCode, setShowQRCode] = useState(false);
  const [groupSizeFilter, setGroupSizeFilter] = useState<'All' | '3' | '4' | '5' | '6+'>('All');
  const [discountFilter, setDiscountFilter] = useState(false);
  const [isMapFullscreen, setIsMapFullscreen] = useState(false);
  
  const events = useStore((state) => state.events);
  const groups = useStore((state) => state.groups);
  const users = useStore((state) => state.users);
  const currentUser = useStore((state) => state.currentUser);
  
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, [eventId]);

  const event = events.find(e => e.id === eventId);
  
  let eventGroups = groups
    .filter(g => g.eventId === eventId)
    .sort((a, b) => {
      if (event?.isPaid && event?.groupDiscount) {
         if (a.discountUnlocked && !b.discountUnlocked) return -1;
         if (!a.discountUnlocked && b.discountUnlocked) return 1;
      }
      const aSpotsLeft = a.targetSize - a.members.length;
      const bSpotsLeft = b.targetSize - b.members.length;
      return aSpotsLeft - bSpotsLeft;
    });

  const totalMembers = eventGroups.reduce((acc, g) => acc + g.members.length, 0);
  const spotsLeftEvent = (event?.maxParticipants || 100) - totalMembers;

  if (discountFilter) {
    eventGroups = eventGroups.filter(g => g.discountUnlocked);
  }
  if (groupSizeFilter !== 'All') {
    if (groupSizeFilter === '6+') {
      eventGroups = eventGroups.filter(g => g.targetSize >= 6);
    } else {
      eventGroups = eventGroups.filter(g => g.targetSize === parseInt(groupSizeFilter));
    }
  }

  const organizer = event ? users.find(u => u.id === event.organizerId) : null;

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleAddToCalendar = () => {
    if (!event) return;
    
    let startDate = '';
    let endDate = '';
    
    try {
      const d = new Date(`${event.date}T${event.time}`);
      
      // Format as local time (no 'Z' suffix) so the ICS DTSTART is a floating
      // time — calendar apps will interpret it in the user's local timezone,
      // avoiding the UTC-conversion offset bug for Greek users (UTC+2/+3).
      const pad = (n: number) => n.toString().padStart(2, '0');
      const toLocalICS = (dt: Date) =>
        `${dt.getFullYear()}${pad(dt.getMonth() + 1)}${pad(dt.getDate())}T${pad(dt.getHours())}${pad(dt.getMinutes())}00`;

      startDate = toLocalICS(d);

      let addMinutes = 60; // Default 1 hr
      if (event.duration) {
        let parsedMins = 0;
        const hMatch = event.duration.match(/(\d+)h/);
        const mMatch = event.duration.match(/(\d+)m/);
        if (hMatch) parsedMins += parseInt(hMatch[1]) * 60;
        if (mMatch) parsedMins += parseInt(mMatch[1]);
        if (parsedMins > 0) addMinutes = parsedMins;
      }
      
      const endD = new Date(d.getTime() + addMinutes * 60000);
      endDate = toLocalICS(endD);
    } catch(e) {
       console.error("Invalid date", e);
       return;
    }

    const title = event.title || 'Parea Event';
    const description = event.description || '';
    const location = event.locationArea || '';

    const icsContent = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//Parea App//EN",
      "BEGIN:VEVENT",
      `DTSTART:${startDate}`,
      `DTEND:${endDate}`,
      `SUMMARY:${title}`,
      `DESCRIPTION:${description}`,
      `LOCATION:${location}`,
      "END:VEVENT",
      "END:VCALENDAR"
    ].join('\n');

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => URL.revokeObjectURL(url), 100);
  };

  const handleSave = () => {
    setIsSaved(!isSaved);
  };

  // Safely get API key
  const apiKey = (import.meta as any).env?.VITE_GOOGLE_MAPS_API_KEY || '';
  
  if (isLoading) {
    return <EventDetailSkeleton />;
  }

  if (!event) return <div className="p-8 text-center text-black font-medium">{t('Η εκδήλωση δεν βρέθηκε', 'Event not found')}</div>;

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="mx-auto max-w-full space-y-8 pb-24 md:pb-8"
    >
      {/* Header */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <button 
            onClick={() => navigate(-1)}
            className="text-[10px] font-bold tracking-wide text-black hover:text-[#111827]"
          >
            &larr; {t('Επιστροφή στην Ανακάλυψη', 'Back to Discover')}
          </button>
          
          <div className="flex gap-2 flex-wrap justify-end">
            <button 
              onClick={handleSave}
              className={`flex items-center gap-2 text-[10px] font-bold  tracking-wider transition-colors px-3 py-1 rounded-full ${isSaved ? 'text-cyan-800 bg-cyan-100' : 'text-black hover:text-cyan-600 bg-gray-50 hover:bg-gray-100'}`}
            >
              <Bookmark className={`h-3.5 w-3.5 ${isSaved ? 'fill-current' : ''}`} />
              {isSaved ? t("Αποθηκεύτηκε", "Saved") : t("Αποθήκευση Εκδήλωσης", "Save Event")}
            </button>
            <button 
              onClick={() => setShowQRCode(true)}
              className="flex items-center gap-2 text-[10px] font-bold tracking-wide text-cyan-600 hover:text-cyan-800 transition-colors bg-cyan-50 px-3 py-1.5 rounded-full"
            >
              <QrCode className="h-3.5 w-3.5" />
              {t('Κωδικός QR', 'QR Code')}
            </button>
            <button 
              onClick={handleShare}
              className="flex items-center gap-2 text-[10px] font-bold  tracking-wider text-cyan-600 hover:text-cyan-800 transition-colors bg-cyan-50 px-3 py-1.5 rounded-full"
            >
              <Share className="h-3.5 w-3.5" />
              {isCopied ? t("Αντιγράφηκε!", "Link Copied!") : t("Κοινοποίηση", "Share Event")}
            </button>
            <button 
              onClick={handleAddToCalendar}
              className="flex items-center gap-2 text-[10px] font-bold  tracking-wider text-black hover:text-cyan-600 transition-colors bg-gray-50 hover:bg-gray-100 px-3 py-1.5 rounded-full"
            >
              <Calendar className="h-3.5 w-3.5" />
              {t('Προσθήκη στο Ημερολόγιο', 'Add to Calendar')}
            </button>
          </div>
        </div>
        
        <div className="relative w-full h-48 md:h-64 lg:h-80 rounded-2xl overflow-hidden shadow-sm">
          <motion.img 
            layoutId={`event-image-${event.id}`}
            referrerPolicy="no-referrer"
            src={event.imageUrl || 'https://picsum.photos/seed/eventdefault/800/600'} 
            alt={event.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        </div>
        
        <div className="flex flex-wrap gap-2 mt-4">
          <Badge variant="neutral">{event.category}</Badge>
          {event.isPaid ? (
            <Badge variant="outline" icon={<Ticket className="h-3 w-3" />}>€{event.price}</Badge>
          ) : (
            <Badge variant="outline">{t('Δωρεάν', 'Free')}</Badge>
          )}
          {event.groupDiscount && (
             <Badge variant="success" icon={<CheckCircle className="h-3 w-3" />}>
               -{event.groupDiscount.percentage}% {t('έκπτωση για', 'off for')} {event.groupDiscount.minSize}+ {t('άτομα', 'people')}
             </Badge>
          )}
          {event.minTrustTierAccess === '3_high_trust' && (
            <Badge variant="outline" className="text-cyan-700 font-bold bg-cyan-50 border-cyan-100" icon={<ShieldCheck className="h-3 w-3" />}>{t('Πρόσβαση με Επαλήθευση', 'Verified Access')}</Badge>
          )}
          
          {/* Match Score Badge based on User Interests */}
          {event.tags && event.tags.length > 0 && (
            <Badge variant="outline" className="bg-orange-50 border-orange-200 text-orange-700 font-bold" icon={<span className="text-[10px]">🔥</span>}>
              {Math.min(98, Math.max(15, Math.round((currentUser.interests.filter(i => (event.tags ?? []).includes(i)).length / (event.tags ?? [1]).length) * 100) + 40))}% {t('Ταίριασμα', 'Match')}
            </Badge>
          )}
        </div>
        <h1 className="text-xl md:text-2xl font-extrabold text-[#111827] leading-tight mb-2 md:mb-0">{event.title}</h1>
      </div>

      <div className="grid grid-cols-1 gap-6 md:gap-8 md:grid-cols-5 lg:grid-cols-3">
        {/* Left Column: Details */}
        <div className="space-y-6 md:space-y-8 md:col-span-3 lg:col-span-2">
          <section className="space-y-4 text-[13px] text-[#111827] leading-relaxed bg-white rounded-xl border border-gray-200 p-5 md:p-6 shadow-sm">
             <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 text-black font-bold tracking-wide text-[10px]">
                    <Calendar className="h-3.5 w-3.5" /> {t('Ημερομηνία', 'Date')}
                  </div>
                  <p className="font-medium text-[13px]">{format(parseISO(event.date), 'EEEE, MMMM d, yyyy')}</p>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 text-black font-bold tracking-wide text-[10px]">
                    <Clock className="h-3.5 w-3.5" /> {t('Ώρα', 'Time')}
                  </div>
                  <p className="font-medium text-[13px]">{event.time} ({event.duration})</p>
                  <p className="text-[11px] text-black mt-0.5 font-medium">{event.timeZone || t('Τοπική Ώρα', 'Local Time')}</p>
                </div>
                <div className="space-y-3 col-span-2 sm:col-span-1">
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5 text-black font-bold tracking-wide text-[10px]">
                      <MapPin className="h-3.5 w-3.5" /> {t('Τοποθεσία', 'Location')}
                    </div>
                    <p className="font-medium text-[13px]">{event.locationArea}</p>
                    <p className="text-[11px] text-black mt-0.5">{t('Το ακριβές σημείο συνάντησης εμφανίζεται μετά την επιβεβαίωση.', 'Exact meeting point revealed upon confirmation.')}</p>
                  </div>
                </div>
                 <div className="space-y-1 col-span-2 sm:col-span-1">
                  <div className="flex items-center gap-1.5 text-black font-bold tracking-wide text-[10px]">
                    <ShieldCheck className="h-3.5 w-3.5" /> {t('Κανόνες Συμμετοχής', 'Participation Rules')}
                  </div>
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-[13px] capitalize">{event.minTrustTierAccess === '3_high_trust' ? t('απαιτείται επαληθευμένος λογαριασμός', 'verified account required') : event.minTrustTierAccess.split('_')[1].replace('high', 'verified') + ' account required'}</p>
                    <Link to="/trust" className="text-[11px] text-cyan-600 font-bold underline">{t('Γιατί;', 'Why?')}</Link>
                  </div>
                </div>
             </div>

             <div className={`${isMapFullscreen ? 'fixed !inset-0 !z-[9999] bg-black !m-0 rounded-none !h-[100dvh]' : 'mt-6 w-full h-64 sm:h-80 rounded-lg'} bg-gray-100 overflow-hidden relative border border-gray-200 transition-all duration-300`}>
                  <button 
                    onClick={() => setIsMapFullscreen(!isMapFullscreen)}
                    className="absolute top-4 right-4 z-10 p-2 bg-white/90 backdrop-blur rounded-lg shadow-md text-black hover:text-cyan-600 transition-colors"
                  >
                    {isMapFullscreen ? <Minimize className="h-5 w-5" /> : <Maximize className="h-5 w-5" />}
                  </button>
                  {apiKey ? (
                    <ErrorBoundary fallback={
                      <div className="w-full h-full flex items-center justify-center bg-[#e5e3df] p-4 text-center">
                        <div className="bg-white p-3 rounded-lg shadow-sm border border-red-100">
                          <AlertTriangle className="w-6 h-6 text-red-500 mx-auto mb-2" />
                          <p className="text-[10px] text-black">{t('Ο χάρτης δεν είναι διαθέσιμος. Παρακαλώ ελέγξτε το API key.', 'Map unavailable. Please check API key.')}</p>
                        </div>
                      </div>
                    }>
                      <APIProvider apiKey={apiKey} version="weekly">
                        <Map
                          defaultCenter={{ lat: event.lat || 37.9838, lng: event.lng || 23.7275 }}
                          defaultZoom={15}
                          mapId="DEMO_MAP_ID"
                          internalUsageAttributionIds={['gmp_mcp_codeassist_v1_aistudio']}
                          style={{ width: '100%', height: '100%' }}
                          disableDefaultUI={true}
                        >
                          <AdvancedMarker position={{ lat: event.lat || 37.9838, lng: event.lng || 23.7275 }} zIndex={100}>
                            <Pin background="#4f46e5" borderColor="#312e81" glyphColor="#fff" />
                          </AdvancedMarker>
                        </Map>
                      </APIProvider>
                    </ErrorBoundary>
                  ) : (
                    <div className="w-full h-full bg-[#e5e3df] relative flex items-center justify-center overflow-hidden">
                       <div className="absolute inset-0 opacity-20" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M10 10h80v80h-80z' stroke='%23000' stroke-width='1' fill='none'/%3E%3C/svg%3E")`, backgroundSize: '100px 100px' }} />
                       <div className="w-24 h-24 sm:w-32 sm:h-32 bg-cyan-600/10 rounded-full flex items-center justify-center animate-pulse relative z-10 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                         <div className="w-4 h-4 bg-cyan-600 rounded-full border-2 border-white shadow-md"></div>
                       </div>
                       <div className="absolute bottom-2 right-2 bg-white/90 backdrop-blur text-black text-[10px] px-2 py-1 rounded shadow-sm">{t('Ενεργή Προεπισκόπηση Χάρτη', 'Map Preview Active')}</div>
                    </div>
                  )}
             </div>
             
             <div className="pt-5 border-t border-gray-200 mt-5">
               <h3 className="text-[11px] font-bold text-[#111827] mb-2 tracking-wide">{t('Πληροφορίες για την εμπειρία', 'About the experience')}</h3>
               <p className="text-[13px] text-black leading-relaxed font-medium">{event.description}</p>
               
               {event.externalLink && (
                 <div className="mt-4 pt-1">
                   <a href={event.externalLink} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-4 py-2 border border-gray-200 text-black bg-white hover:bg-gray-50 hover:text-cyan-600 hover:border-cyan-200 transition-colors shadow-sm text-xs font-bold tracking-wide rounded-lg w-full sm:w-auto justify-center">
                     <ExternalLink className="w-3.5 h-3.5" />
                     {t('Επίσημη Σελίδα Εκδήλωσης', 'Official Event Page')}
                   </a>
                 </div>
               )}

               {event.tags && event.tags.length > 0 && (
                 <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-gray-100">
                   {event.tags.map((tag: string) => (
                     <Badge key={tag} variant="neutral" className="bg-gray-100 text-black hover:bg-gray-200 shadow-none border border-gray-200/60 px-3 py-1 text-xs cursor-pointer transition-colors" onClick={() => navigate(`/?search=${tag}`)}>
                       <Hash className="h-3.5 w-3.5 mr-0.5 text-black" />
                       {tag}
                     </Badge>
                   ))}
                 </div>
               )}
             </div>
             
             {organizer && (
               <div className="pt-5 border-t border-gray-200 mt-5">
                 <div className="flex items-center justify-between mb-4">
                    <h3 className="text-[11px] font-bold text-[#111827] tracking-wide mt-1">{t('Διοργανωτής Εκδήλωσης', 'Event Organizer')}</h3>
                 </div>
                 <div className="flex items-center justify-between p-4 rounded-xl border border-gray-200 bg-white shadow-sm hover:border-cyan-200 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-full overflow-hidden bg-cyan-50 border-2 border-white ring-2 ring-cyan-50 shrink-0">
                        {organizer.photoUrl ? (
                          <img referrerPolicy="no-referrer" src={organizer.photoUrl} alt={organizer.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-cyan-500 font-bold text-lg">{organizer.name.substring(0, 2).toUpperCase()}</div>
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <Link to={`/profile`} className="text-base font-bold text-[#111827] hover:text-cyan-600 transition-colors">
                            {organizer.name}
                          </Link>
                          {organizer.trustTier && (
                             <Badge variant="outline" className={`text-[9px] py-0 px-1.5 shadow-none ${organizer.trustTier === '3_high_trust' ? 'bg-blue-50 text-blue-700 border-blue-200' : 'bg-gray-50 text-black border-gray-200'}`}>
                               {organizer.trustTier === '3_high_trust' ? t('ΥΨΗΛΗ ΕΜΠΙΣΤΟΣΥΝΗ', 'HIGH TRUST') : organizer.trustTier.replace(/_/g, ' ').toUpperCase()}
                             </Badge>
                          )}
                          <Badge variant="outline" className="text-[9px] py-0 px-1.5 bg-green-50 text-green-700 border-green-200 shadow-none">
                            {organizer.reliabilityScore}% {t('ΑΞΙΟΠΙΣΤΙΑ', 'RELIABILITY')}
                          </Badge>
                        </div>
                        <p className="text-xs text-black mt-0.5 font-medium">{organizer.bio || t('Επαληθευμένος Διοργανωτής • 12 εκδηλώσεις', 'Verified Organizer • 12 events hosted')}</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" className="hidden sm:flex" onClick={() => navigate('/profile')}>
                       {t('Προβολή Προφίλ', 'View Profile')}
                    </Button>
                 </div>
               </div>
             )}
             
             {/* High Trust / Outdoor Template Mock */}
             {(event.category === 'Hiking' || event.category === 'Nearby escapes') && (
               <div className="pt-5 border-t border-gray-200 animate-in fade-in slide-in-from-bottom-2 mt-5">
                 <h3 className="text-[11px] font-bold text-[#111827] mb-3 tracking-wide">{t('Λεπτομέρειες Περιπέτειας', 'Adventure Details')}</h3>
                 <div className="grid grid-cols-2 gap-4">
                   <div className="bg-emerald-50/50 border border-emerald-100 p-4 rounded-xl">
                     <div className="text-[10px] font-bold text-emerald-700 mb-1 tracking-wider">{t('Δυσκολία', 'Difficulty')}</div>
                     <div className="text-sm font-bold text-black">{event.category === 'Hiking' ? t('Μέτρια / Έδαφος', 'Moderate / Terrain') : t('Εύκολο / Αναψυχή', 'Easy / Leisure')}</div>
                   </div>
                   <div className="bg-amber-50/50 border border-amber-100 p-4 rounded-xl">
                     <div className="text-[10px] font-bold text-amber-700 mb-1 tracking-wider">{t('Εξοπλισμός / Σημειώσεις', 'Equipment / Notes')}</div>
                     <div className="text-sm font-bold text-black">{event.category === 'Hiking' ? t('Απαιτούνται μποτάκια πεζοπορίας. Φέρτε νερό.', 'Hiking boots required. Bring water.') : t('Διανυκτέρευση. Μοιρασμένα έξοδα.', 'Overnight stay. Shared expenses.')}</div>
                   </div>
                 </div>
               </div>
             )}
          </section>

          {/* Contextual Context Note */}
          <section className="rounded-xl border border-gray-100 bg-gray-50/50 p-5 text-sm">
            <h3 className="text-[11px] font-bold text-[#111827] mb-3 tracking-wide">{t('Γιατί αυτή η ομάδα είναι αξιόπιστη', 'Why this group is reliable')}</h3>
            <ul className="space-y-2.5 text-black">
              <li className="flex items-start gap-2 text-xs">
                <Users className="w-4 h-4 text-black shrink-0 mt-0.5" />
                <span><strong className="text-black">{t('Περιορισμός μικρής ομάδας.', 'Small group constraint.')}</strong> {t('Περιορίζεται σε ', 'Kept to ')}{event.maxParticipants || '3-6'}{t(' άτομα για καλύτερο συντονισμό και άνεση.', ' people for better coordination and comfort.')}</span>
              </li>
              <li className="flex items-start gap-2 text-xs">
                <ShieldCheck className="w-4 h-4 text-black shrink-0 mt-0.5" />
                <span><strong className="text-black">{t('Επιβεβαιωμένη συμμετοχή.', 'Confirmed participation.')}</strong> {t('Οι χρήστες πρέπει να δεσμευτούν για να συμμετάσχουν. Οι μη-εμφανίσεις παρακολουθούνται.', 'Users must commit to join. No-shows are tracked internally.')}</span>
              </li>
              <li className="flex items-start gap-2 text-xs">
                <MapPin className="w-4 h-4 text-black shrink-0 mt-0.5" />
                <span><strong className="text-black">{t('Δημόσιο σημείο συνάντησης.', 'Public meeting point.')}</strong> {t('Η ακριβής τοποθεσία συνάντησης αποκαλύπτεται μόνο αφού επιβεβαιωθεί η ομάδα.', 'Exact meeting location is revealed only after the group is confirmed.')}</span>
              </li>
              <li className="flex items-start gap-2 text-xs">
                <CheckCircle className="w-4 h-4 text-black shrink-0 mt-0.5" />
                <span><strong className="text-black">{t('Ιδιωτικές αναφορές.', 'Private reports.')}</strong> {t('Οποιαδήποτε ανάρμοστη συμπεριφορά μπορεί να αναφερθεί ιδιωτικά και επηρεάζει τις βαθμολογίες αξιοπιστίας.', 'Any inappropriate behavior can be reported privately and affects reliability scores.')}</span>
              </li>
            </ul>
          </section>
        </div>

        {/* Right Column: Groups & Actions */}
        <div className="space-y-6 md:col-span-2 lg:col-span-1">
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm sticky top-24">
            <h3 className="text-[11px] font-bold text-black tracking-wide mb-4">{t('Αυτόματη προτεινόμενη Μικρών Ομάδων', 'Auto-Suggest Small Groups')}</h3>
            <div className="mb-4 bg-cyan-50 border border-cyan-100 rounded-lg p-3 flex flex-col xl:flex-row xl:justify-between items-start xl:items-center gap-2 text-sm font-bold text-cyan-900">
              <span className="flex items-center gap-1.5"><Ticket className="h-4 w-4" /> {t('Συνολική Χωρητικότητα Εκδήλωσης', 'Overall Event Capacity')}</span>
              <span className="text-cyan-600 xl:text-cyan-900 bg-white xl:bg-transparent px-2 py-0.5 xl:p-0 rounded-full text-xs xl:text-sm border border-cyan-100 xl:border-transparent">{Math.max(0, spotsLeftEvent)} {t('θέσεις έμειναν', 'spots left')}</span>
            </div>
            
            <div className="flex flex-col gap-3 mb-6">
              <Button className="w-full bg-cyan-600 text-white hover:bg-cyan-700 shadow-md flex items-center justify-center gap-2" size="lg" onClick={() => navigate(`/events/${eventId}/join`)}>
                <Users className="w-5 h-5" />
                {t('Δημιουργία Νέας Ομάδας', 'Create New Group')}
              </Button>
            </div>
            
            {(eventGroups.length > 0 || groupSizeFilter !== 'All' || discountFilter) && (
              <div className="mb-4 space-y-2">
                <div className="flex gap-2">
                  <span className="text-[10px] font-bold text-black mt-1.5">{t('Φίλτρο:', 'Filter by:')}</span>
                  <div className="flex flex-wrap gap-2 flex-1">
                    <select 
                      value={groupSizeFilter} 
                      onChange={(e) => setGroupSizeFilter(e.target.value as any)}
                      className="text-xs bg-gray-50 border border-gray-200 rounded p-1 font-medium focus:outline-none focus:ring-1 focus:ring-cyan-500"
                    >
                      <option value="All">{t('Όλα τα Μεγέθη', 'Any Size')}</option>
                      <option value="3">{t('3 Μέλη', '3 Members')}</option>
                      <option value="4">{t('4 Μέλη', '4 Members')}</option>
                      <option value="5">{t('5 Μέλη', '5 Members')}</option>
                      <option value="6+">{t('6+ Μέλη', '6+ Members')}</option>
                    </select>
                    {event.isPaid && event.groupDiscount && (
                      <button 
                        onClick={() => setDiscountFilter(!discountFilter)}
                        className={`text-xs px-2 py-1 rounded border font-medium transition-colors ${discountFilter ? 'bg-emerald-100 border-emerald-300 text-emerald-800' : 'bg-gray-50 border-gray-200 text-black hover:bg-gray-100'}`}
                      >
                        {t('Μόνο με Έκπτωση', 'Discount Only')}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}
            
            <p className="text-xs text-black font-medium mb-4 leading-relaxed">
              {t('Συνιστούμε ανεπιφύλακτα να δημιουργήσετε ή να συμμετάσχετε σε ομάδες 3-5 ατόμων.', 'We highly recommend joining or creating groups of 3-5 users to reduce awkwardness and ensure the event happens safely.')}
            </p>
            
            {eventGroups.length === 0 ? (
              <div className="text-xs text-black mb-6 bg-gray-50 p-4 rounded-xl text-center border border-dashed border-gray-200 font-medium">
                {t('Δεν έχουν δημιουργηθεί ομάδες ακόμα. Γίνετε ο πρώτος που θα ξεκινήσει μία!', 'No groups forming yet. Be the first to start one!')}
              </div>
            ) : (
              <div className="space-y-4 mb-6">
                {eventGroups.map(group => (
                  <Group key={group.id} group={group} event={event} navigate={navigate} />
                ))}
              </div>
            )}
            
            <div className="space-y-4 pt-5 border-t border-gray-200">
              <div className="grid grid-cols-1 gap-3">
                <Button variant="outline" className="w-full border-gray-200 text-black hover:bg-gray-50" size="lg" onClick={() => alert(t("Προστέθηκε στη λίστα αναμονής. Θα ειδοποιηθείτε αν ανοίξει θέση.", "Added to waitlist. We will notify you if a spot in a group opens up."))}>
                  {t('Λίστα Αναμονής', 'Join Waitlist')}
                </Button>
              </div>
              <div className="text-[10px] text-black font-medium bg-gray-50 rounded text-center p-3 leading-relaxed tracking-wide">
                {t('Δημιουργήστε νέα ομάδα 3-5 ατόμων. ', 'Create a new 3-5 person group. ')}
                {event.isPaid ? (
                  <span className="block mt-1 font-bold text-black">{t('Η πληρωμή προεγκρίνεται. Χρεώνεται μόνο κατά την επιβεβαίωση.', 'Payment pre-authorized via official partner APIs. Discharges automatically on Group confirmation.')}</span>
                ) : (
                  <span className="block mt-1 font-bold">{t('Δωρεάν δημιουργία.', 'Free to start.')}</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Mobile Sticky CTA */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] md:hidden z-50 flex gap-3">
        <Button variant="outline" className="flex-1 border-gray-200 text-black" onClick={() => navigate(`/events/${eventId}/join`)}>
          {t('Λίστα Αναμονής', 'Waitlist')}
        </Button>
        <Button className="flex-[2] bg-cyan-600 text-white hover:bg-cyan-700 shadow-sm" onClick={() => navigate(`/events/${eventId}/join`)}>
          {t('Νέα Ομάδα', 'Create Group')}
        </Button>
      </div>

      {/* QR Code Modal */}
      {showQRCode && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm px-4" onClick={() => setShowQRCode(false)}>
          <div className="bg-white rounded-2xl p-6 md:p-8 max-w-sm w-full text-center relative shadow-2xl" onClick={e => e.stopPropagation()}>
            <button 
              onClick={() => setShowQRCode(false)}
              className="absolute top-4 right-4 p-2 text-black hover:text-black bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
            <h3 className="text-xl font-bold text-black mb-2">{t('Κοινοποίηση', 'Share Event')}</h3>
            <p className="text-sm text-black mb-6">{t('Σαρώστε αυτό το QR για να δείτε την εκδήλωση', 'Scan this QR code to view the event')}</p>
            <div className="bg-white p-4 rounded-xl shadow-inner border border-gray-100 inline-block">
              <QRCodeSVG 
                value={window.location.href} 
                size={200}
                bgColor={"#ffffff"}
                fgColor={"#111827"}
                level={"H"}
                includeMargin={false}
              />
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
}
