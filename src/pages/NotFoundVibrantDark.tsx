import { useNavigate } from 'react-router-dom';
import { Compass, Home, Calendar, Search, Users } from 'lucide-react';
import { Button } from '../components/common/Button';
import { useLanguage } from '../lib/i18n';

export default function NotFoundVibrantDark() {
  const { t } = useLanguage();
  const navigate = useNavigate();

  const suggestions = [
    { icon: Home, label: t(`Αρχική`, `Home`), path: '/' },
    { icon: Calendar, label: t(`Τα Πλάνα μου`, `My Plans`), path: '/plans' },
    { icon: Search, label: t(`Κατηγορίες`, `Categories`), path: '/categories' },
    { icon: Users, label: t(`Συνδέσεις`, `Connections`), path: '/connections' },
  ];

  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center animate-in fade-in duration-500">
      <div className="w-20 h-20 rounded-full bg-gray-700 flex items-center justify-center mb-6 relative">
        <span className="absolute inset-0 rounded-full bg-gray-200 animate-ping opacity-20"></span>
        <Compass className="w-10 h-10 text-white animate-spin" style={{ animationDuration: '8s' }} />
      </div>
      <h1 className="text-[25px] font-bold text-white mb-2">
        {t(`Η σελίδα δεν βρέθηκε`, `Page Not Found`)}
      </h1>
      <p className="text-[18px] text-white font-medium mb-6 max-w-xs">
        {t(`Η σελίδα που αναζητάτε δεν υπάρχει ή έχει μετακινηθεί.`, `The page you're looking for doesn't exist or has been moved.`)}
      </p>

      <div className="grid grid-cols-2 gap-2 mb-6 w-full max-w-xs">
        {suggestions.map(s => {
          const Icon = s.icon;
          return (
            <button key={s.path} onClick={() => navigate(s.path)} className="flex items-center gap-2 p-3 rounded-xl border border-gray-700 bg-gray-800 hover:border-cyan-300 hover:bg-emerald-900/30 transition-all text-left">
              <Icon className="w-4 h-4 text-cyan-400" />
              <span className="text-[13.8px] font-bold text-white">{s.label}</span>
            </button>
          );
        })}
      </div>

      <Button onClick={() => navigate('/')}>
        {t(`Επιστροφή στην αρχική`, `Back to Home`)}
      </Button>
    </div>
  );
}
