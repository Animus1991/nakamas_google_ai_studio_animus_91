import { useNavigate } from 'react-router-dom';
import { Card } from '../components/common/Card';
import { Users } from 'lucide-react';
import { useLanguage } from '../lib/i18n';
import { useStore } from '../store';
import { Button } from '../components/common/Button';

export default function LoginVibrant() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const users = useStore(state => state.users);
  const login = useStore(state => state.login);

  const handleLogin = (userId: string) => {
    login(userId);
    navigate('/');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 bg-[#FDFCFB]">
      <Card className="w-full max-w-md p-8 space-y-6 animate-in fade-in slide-in-from-bottom-4 shadow-xl border-gray-100">
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center text-4xl font-black tracking-tight text-[#111827] mb-4 font-['Outfit']">
             NAKAMAS
          </div>
          <h1 className="text-2xl font-bold text-[#111827]">{t('Καλώς ήρθατε', 'Welcome back')}</h1>
          <p className="text-xs text-black font-medium">{t('Συνδεθείτε για να ανακαλύψετε αξιόπιστες ομάδες και εμπειρίες.', 'Log in to discover trusted groups and experiences.')}</p>
        </div>

        <div className="space-y-4 pt-4">
          <div className="text-center text-xs font-bold text-black tracking-wide mb-4">
            {t('Επιλέξτε Λογαριασμό (Demo)', 'Select Account (Demo)')}
          </div>
          <div className="grid grid-cols-1 gap-3">
            {users.slice(0, 3).map(user => (
              <button 
                key={user.id}
                onClick={() => handleLogin(user.id)}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl border border-gray-200 bg-white hover:bg-cyan-50 hover:border-cyan-200 transition-colors shadow-sm text-left group"
              >
                <div className="h-10 w-10 rounded-full overflow-hidden bg-cyan-100 flex-shrink-0">
                  {user.photoUrl ? (
                    <img referrerPolicy="no-referrer" src={user.photoUrl} alt={user.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-cyan-700 font-bold">{user.name.substring(0, 2)}</div>
                  )}
                </div>
                <div>
                  <div className="text-sm font-bold text-black group-hover:text-cyan-700">{user.name}</div>
                  <div className="text-[10px] text-black">{user.isOrganizer ? t('Διοργανωτής', 'Organizer') : t('Χρήστης', 'User')} • {user.city}</div>
                </div>
              </button>
            ))}
          </div>
          
          <div className="relative py-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center">
              <span className="bg-white px-2 text-[10px] text-black tracking-wide">{t('Ή συνεχίστε με', 'Or continue with')}</span>
            </div>
          </div>

          <button 
            onClick={() => handleLogin(users[0].id)}
            className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-full border border-gray-200 bg-white text-sm font-bold text-black hover:bg-gray-50 transition-colors shadow-sm"
          >
            <img referrerPolicy="no-referrer" src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-5 h-5" />
            {t('Συνέχεια με Google', 'Continue with Google')}
          </button>
        </div>

        <div className="text-center mt-6">
          <p className="text-[10px] text-black font-medium leading-relaxed">
            {t('Συνεχίζοντας, συμφωνείτε με τους Όρους Χρήσης και την Πολιτική Απορρήτου του Nakamas.', 'By continuing, you agree to Nakamas\'s Terms of Service and Privacy Policy.')}<br/>
            {t('Ίσως απαιτείται επαλήθευση για ορισμένες εκδηλώσεις υψηλής εμπιστοσύνης.', 'Verification may be required for certain high-trust events.')}
          </p>
        </div>
      </Card>
    </div>
  );
}
