import { Bell, Calendar, MessageCircle, AlertTriangle, Users, CheckCircle2, ArrowRight } from 'lucide-react';
import { useLanguage } from "../lib/i18n";
import { useNavigate } from 'react-router-dom';

export default function NotificationsBento() {
    const { t } = useLanguage();
    const navigate = useNavigate();
    
  const notifications = [
    {
      id: 'n1',
      type: 'match',
      message: t("Νέο Ταίριασμα! Τοποθετηθήκατε σε ομάδα υψηλής εμπιστοσύνης για το 'Σαββατοκύριακο στην Αράχωβα'.", "New Match! You've been placed in a high-trust group for 'Weekend in Arachova'."),
      time: t(`Πριν 10 λεπτά`, `10 minutes ago`),
      read: false,
      icon: Users,
      color: 'bg-emerald-100 text-emerald-600'
    },
    {
      id: 'n2',
      type: 'message',
      message: t("Ο διοργανωτής Alex έστειλε ένα μήνυμα: 'Γεια σε όλους! Δείτε το νέο σημείο συνάντησης για την αυριανή πεζοπορία.'", "Organizer Alex sent a message: 'Hey everyone! Check the new meeting point for tomorrow's hike.'"),
      time: t(`Πριν 1 ώρα`, `1 hour ago`),
      read: false,
      icon: MessageCircle,
      color: 'bg-cyan-100 text-cyan-600'
    },
    {
      id: 'n3',
      type: 'reminder',
      message: t("Υπενθύμιση: Το 'Stand-up Comedy' ξεκινά σε 24 ώρες. Μην ξεχάσετε τα εισιτήριά σας!", "Reminder: 'Stand-up Comedy' starts in 24 hours. Don't forget your tickets!"),
      time: t(`Πριν 3 ώρες`, `3 hours ago`),
      read: true,
      icon: Calendar,
      color: 'bg-gray-100 text-black'
    },
    {
      id: 'n4',
      type: 'system',
      message: t(`Η βαθμολογία αξιοπιστίας σας αυξήθηκε στο 95%. Ευχαριστούμε που είστε ένα εξαιρετικό μέλος της κοινότητας!`, `Your reliability score increased to 95%. Thank you for being a great community member!`),
      time: t(`Πριν 2 μέρες`, `2 days ago`),
      read: true,
      icon: CheckCircle2,
      color: 'bg-gray-100 text-black'
    },
    {
      id: 'n5',
      type: 'achievement',
      message: t(`Κερδίσατε το badge "Κοινωνική Πεταλούδα"! Γίνατε μέλος σε 5 διαφορετικές ομάδες.`, `You earned the "Social Butterfly" badge! Joined 5 different groups.`),
      time: t(`Πριν 3 μέρες`, `3 days ago`),
      read: true,
      icon: CheckCircle2,
      color: 'bg-purple-100 text-purple-600'
    }
  ];

  const todayNotifs = notifications.filter(n => !n.read);
  const earlierNotifs = notifications.filter(n => n.read);

  return (
    <div className="mx-auto max-w-full space-y-6 pb-20 md:pb-0">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-[22.33807213275px] md:text-[26.7902365993px] font-bold text-[#111827]">{t(`Ειδοποιήσεις`, `Notifications`)}</h1>
          <p className="text-black font-medium text-[13.551608211075px] md:text-[16.25212883329px] mt-1">{t(`Μείνετε ενημερωμένοι`, `Stay up to date`)}</p>
        </div>
        <button className="text-[14.2457535px] font-bold text-cyan-600 hover:text-cyan-700">
          {t(`Σήμανση όλων ως αναγνωσμένα`, `Mark all as read`)}
        </button>
      </div>

      {/* Today */}
      {todayNotifs.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-[12.1125px] font-bold text-black tracking-wide">{t(`Σήμερα`, `Today`)}</h3>
          {todayNotifs.map((notif) => {
            const Icon = notif.icon;
            return (
              <div key={notif.id} className="flex gap-4 p-4 rounded-xl border border-cyan-100 bg-cyan-50/30">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${notif.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[13.5px] leading-relaxed text-[#111827] font-medium">{notif.message}</p>
                  <span className="text-[11.25px] font-bold text-black tracking-wide mt-1 block">{notif.time}</span>
                  {notif.type === 'match' && (
                    <button onClick={() => navigate('/plans')} className="mt-2 text-[11.2px] font-bold text-cyan-700 bg-cyan-100 px-2.5 py-1 rounded-full hover:bg-cyan-200 transition-colors inline-flex items-center gap-1">
                      {t(`Δείτε ομάδα`, `View group`)} <ArrowRight className="w-2.5 h-2.5" />
                    </button>
                  )}
                  {notif.type === 'message' && (
                    <button onClick={() => navigate('/chats')} className="mt-2 text-[11.2px] font-bold text-cyan-700 bg-cyan-100 px-2.5 py-1 rounded-full hover:bg-cyan-200 transition-colors inline-flex items-center gap-1">
                      {t(`Απάντηση`, `Reply`)} <ArrowRight className="w-2.5 h-2.5" />
                    </button>
                  )}
                </div>
                <span className="w-2.5 h-2.5 bg-cyan-500 rounded-full shrink-0 mt-2"></span>
              </div>
            );
          })}
        </div>
      )}

      {/* Earlier */}
      {earlierNotifs.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-[11.2px] font-bold text-black tracking-wide">{t(`Προηγούμενες`, `Earlier`)}</h3>
          {earlierNotifs.map((notif) => {
            const Icon = notif.icon;
            return (
              <div key={notif.id} className="flex gap-4 p-4 rounded-xl border border-gray-100 bg-white">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${notif.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[13.5px] leading-relaxed text-black">{notif.message}</p>
                  <span className="text-[11.25px] font-bold text-black tracking-wide mt-1 block">{notif.time}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
