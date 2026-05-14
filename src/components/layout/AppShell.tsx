import React, { ReactNode, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  Compass, CalendarCheck, ShieldCheck, Menu, Bell,
  Grid, TrendingUp, Bookmark, History, Flag,
  Users, Settings, HelpCircle, Plus, User, X, MapPin, Calendar, PlusSquare, CreditCard, BadgeCheck, Terminal, Search, Globe, MessageSquare
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { Palette } from 'lucide-react';
import { useStore } from '../../store';

function useUnreadCount() {
  const notifications = useStore(state => state.notifications);
  return notifications.filter(n => !n.read).length;
}
import { useLanguage } from '../../lib/i18n';

// ─────────────────────────────────────────────
// NakamasLogo — SVG ψάθινο καπέλο με αχυρωτό στέλεχος
// ─────────────────────────────────────────────
function NakamasLogo({ className, compact = false }: { className?: string; compact?: boolean }) {
  return (
    <div className={cn("flex items-baseline font-bold tracking-tight text-[#18D8DB] font-['Poppins']", className)}>
      <div className="relative inline-block">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 120 90"
          className="absolute -top-[0.65em] -left-[0.55em] w-[1.8em] h-[1.8em] origin-center -rotate-[8deg] z-10 pointer-events-none drop-shadow-sm"
        >
          {/* Chin strap back */}
          <path d="M 35 60 C 20 65, 15 75, 25 80" fill="none" stroke="#3F2A1B" strokeWidth="2" strokeLinecap="round" />
          {/* Brim */}
          <ellipse cx="60" cy="62" rx="55" ry="14" fill="#E4BD70" stroke="#3F2A1B" strokeWidth="3" />
          {/* Brim texture */}
          <path d="M 15 62 Q 60 76 105 62 M 25 67 Q 60 80 95 67" fill="none" stroke="#C49B50" strokeWidth="1.5" />
          {/* Dome */}
          <path d="M 32 60 C 32 20, 42 16, 60 16 C 78 16, 88 20, 88 60 Z" fill="#E4BD70" stroke="#3F2A1B" strokeWidth="3" strokeLinejoin="round" />
          {/* Dome texture lines */}
          <path d="M 45 25 L 45 48 M 60 20 L 60 52 M 75 25 L 75 48" fill="none" stroke="#C49B50" strokeWidth="2" strokeLinecap="round" />
          <path d="M 38 32 C 50 35, 70 35, 82 32 M 36 42 Q 60 48 84 42" fill="none" stroke="#C49B50" strokeWidth="1.5" strokeLinecap="round" />
          {/* Red Band */}
          <path d="M 31.5 54 C 50 63, 70 63, 88.5 54 L 88.5 60 C 70 70, 50 70, 31.5 60 Z" fill="#D84539" stroke="#3F2A1B" strokeWidth="3" strokeLinejoin="round" />
          {/* Chin strap front */}
          <path d="M 32 62 C 25 58, 20 62, 22 66" fill="none" stroke="#3F2A1B" strokeWidth="2" strokeLinecap="round" />
          <path d="M 22 66 Q 16 75 20 85" fill="none" stroke="#3F2A1B" strokeWidth="2.5" strokeLinecap="round" />
          {/* Wheat Straw */}
          <g transform="translate(62, 79) rotate(-12)">
            <path d="M 0 0 Q 34 12 68 -2" fill="none" stroke="#E4BD70" strokeWidth="1.5" strokeLinecap="round" />
            <path d="M 46 4.8 Q 57 2 66 -1.2" fill="none" stroke="#FDE68A" strokeWidth="2.5" strokeLinecap="round" />
            <path d="M 48 4.3 L 56 -1.5 M 52 3.3 L 60 -2.5 M 56 2.3 L 64 -3.5 M 60 1.3 L 68 -4.5 M 64 0.3 L 72 -5.5" fill="none" stroke="#E4BD70" strokeWidth="1" strokeLinecap="round" />
            <path d="M 48 4.3 L 56 10 M 52 3.3 L 60 9 M 56 2.3 L 64 8 M 60 1.3 L 68 7 M 64 0.3 L 72 6" fill="none" stroke="#E4BD70" strokeWidth="1" strokeLinecap="round" />
          </g>
        </svg>
        <span className="relative z-0 leading-none">N</span>
      </div>
      <span className={cn("leading-none", compact && "hidden lg:inline")}>akamas</span>
    </div>
  );
}

// ─────────────────────────────────────────────
// NavItem
// ─────────────────────────────────────────────
interface NavItemProps {
  to: string;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  disabled?: boolean;
  compact?: boolean;
}

function NavItem({ to, icon: Icon, label, disabled = false, compact = false }: NavItemProps) {
  const { t } = useLanguage();
  const theme = useStore((state) => state.theme);
  const containerClass = compact
    ? 'justify-center px-0 py-3 lg:justify-start lg:px-3 lg:py-2'
    : 'justify-start px-3 py-2';
  const iconClass = compact
    ? 'h-[22px] w-[22px] lg:h-4 lg:w-4 shrink-0'
    : 'h-4 w-4 shrink-0';
  const textClass = compact ? 'hidden lg:block' : 'block';

  if (disabled) {
    return (
      <div
        className={cn('flex items-center gap-3 text-sm font-medium text-gray-900 rounded-lg cursor-not-allowed', containerClass)}
        title={label}
      >
        <Icon className={iconClass} />
        <span className={textClass}>{label}</span>
      <span className={cn('text-[9px] tracking-wide font-bold bg-gray-100 px-1.5 py-0.5 rounded text-gray-900', textClass)}>{t('Σύντομα', 'Soon')}</span>
      </div>
    );
  }

  return (
    <NavLink
      to={to}
      title={label}
      className={({ isActive }) =>
        cn(
          'flex items-center gap-3 rounded-xl lg:rounded-lg text-sm font-medium transition-colors group',
          containerClass,
          isActive ? (theme === "bento-dark" ? "bg-gray-800 text-emerald-400 font-bold" : "bg-cyan-50 text-[#0E8B8D] font-bold") : (theme === "bento-dark" ? "text-gray-200 hover:bg-gray-700 hover:text-white" : "text-gray-900 hover:bg-gray-100 hover:text-[#111827]")
        )
      }
    >
      <Icon className={iconClass} />
      <span className={textClass}>{label}</span>
    </NavLink>
  );
}

// ─────────────────────────────────────────────
// NavSection
// ─────────────────────────────────────────────
interface NavSectionProps {
  title: string;
  children: ReactNode;
  compact?: boolean;
}

function NavSection({ title, children, compact = false }: NavSectionProps) {
  return (
    <div className="mb-2 lg:mb-6">
      {compact && <div className="block lg:hidden h-px bg-gray-200 my-4 mx-4" />}
      <h3
        className={cn(
          'px-3 text-[13.35px] font-bold tracking-wide text-[#6B7280] mb-2',
          compact ? 'hidden lg:block' : 'block'
        )}
      >
        {title}
      </h3>
      <div className="space-y-1.5 lg:space-y-0.5">{children}</div>
    </div>
  );
}

// ─────────────────────────────────────────────
// NavLinks
// ─────────────────────────────────────────────
function NavLinks({ compact = false }: { compact?: boolean }) {
  const { t } = useLanguage();
  return (
    <>
      <NavSection title={t('Εξερεύνηση & Ανακάλυψη', 'Explore & Discover')} compact={compact}>
        <NavItem to="/" icon={Compass} label={t('Ανακάλυψη Εκδηλώσεων', 'Discover Events')} compact={compact} />
        <NavItem to="/categories" icon={Grid} label={t('Κατηγορίες', 'Categories')} compact={compact} />
        <NavItem to="/nearby" icon={MapPin} label={t('Τοπικές Ομάδες', 'Local Groups')} compact={compact} />
      </NavSection>

      <NavSection title={t('Η Εμπειρία μου', 'My Experience')} compact={compact}>
        <NavItem to="/agenda" icon={Calendar} label={t('Το Ημερολόγιό μου', 'My Calendar')} compact={compact} />
        <NavItem to="/plans" icon={CalendarCheck} label={t('Τα Σχέδιά μου', 'My Plans')} compact={compact} />
        <NavItem to="/saved" icon={Bookmark} label={t('Αποθηκευμένες', 'Saved')} compact={compact} />
        <NavItem to="/history" icon={History} label={t('Ιστορικό', 'History')} compact={compact} />
      </NavSection>

      <NavSection title={t('Κοινότητα', 'Community')} compact={compact}>
        <NavItem to="/connections" icon={Users} label={t('Οι Nakamas μου', 'My Nakamas')} compact={compact} />
        <NavItem to="/chats" icon={MessageSquare} label={t('Ομαδικές Συνομιλίες', 'Group Chats')} compact={compact} />
      </NavSection>

      <NavSection title={t('Διοργάνωση', 'Host')} compact={compact}>
        <NavItem to="/manage" icon={TrendingUp} label={t('Πίνακας Διοργανωτή', 'Organizer Dashboard')} compact={compact} />
        <NavItem to="/create" icon={PlusSquare} label={t('Δημιουργία Εκδήλωσης', 'Create Event')} compact={compact} />
        <NavItem to="/wallet" icon={CreditCard} label={t('Πορτοφόλι & Κέρδη', 'Wallet & Earnings')} compact={compact} />
      </NavSection>

      <NavSection title={t('Εμπιστοσύνη & Ασφάλεια', 'Trust & Safety')} compact={compact}>
        <NavItem to="/verification" icon={BadgeCheck} label={t('Επαλήθευση Ταυτότητας', 'Identity Verification')} compact={compact} />
        <NavItem to="/trust" icon={ShieldCheck} label={t('Κέντρο Εμπιστοσύνης', 'Trust Center')} compact={compact} />
        <NavItem to="/report" icon={Flag} label={t('Αναφορά Προβλήματος', 'Report Issue')} compact={compact} />
      </NavSection>

      <NavSection title={t('Λογαριασμός & Ρυθμίσεις', 'Account & Settings')} compact={compact}>
        <NavItem to="/profile" icon={User} label={t('Το Προφίλ μου', 'My Profile')} compact={compact} />
        <NavItem to="/notifications" icon={Bell} label={t('Ειδοποιήσεις', 'Notifications')} compact={compact} />
        <NavItem to="/settings" icon={Settings} label={t('Ρυθμίσεις & Απόρρητο', 'Settings & Privacy')} compact={compact} />
        <NavItem to="/help" icon={HelpCircle} label={t('Κέντρο Βοήθειας', 'Help Center')} compact={compact} />
        <NavItem to="/admin" icon={Terminal} label={t('Διαχείριση & Έλεγχος', 'Admin & Moderation')} compact={compact} />
      </NavSection>
    </>
  );
}

// ─────────────────────────────────────────────
// SideNav
// ─────────────────────────────────────────────
export function SideNav() {
  return (
    <aside className="bg-white border-r border-[#E5E7EB] h-full flex-col shrink-0 hidden md:flex w-[88px] lg:w-64 transition-all duration-300 z-30">
      <div className="h-16 flex items-center justify-center lg:justify-start lg:px-6 border-b border-[#E5E7EB] shrink-0">
        <NakamasLogo className="text-[22px] lg:text-[26px]" />
      </div>
      <div className="flex-1 overflow-y-auto py-4 lg:py-6 px-2 lg:px-3">
        <NavLinks compact />
      </div>
    </aside>
  );
}

// ─────────────────────────────────────────────
// TopNav
// ─────────────────────────────────────────────
export function TopNav({ onMenuClick }: { onMenuClick?: () => void }) {
  const navigate = useNavigate();
  const { language, setLanguage, t } = useLanguage();
  const currentUser = useStore((state) => state.currentUser);
  const isAuthenticated = useStore((state) => state.isAuthenticated);
  const theme = useStore((state) => state.theme);
  const setTheme = useStore((state) => state.setTheme);
  const cycleTheme = () => { const themes = ['classic', 'vibrant', 'bento', 'neon', 'vibrant-dark', 'bento-dark', 'neon-dark']; const next = themes[(themes.indexOf(theme) + 1) % themes.length]; setTheme(next); };
  const unreadNotificationCount = useUnreadCount();
  const [searchValue, setSearchValue] = useState('');

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && searchValue.trim()) {
      navigate(`/?search=${encodeURIComponent(searchValue.trim())}`);
    }
  };

  return (
    <nav className={cn("flex items-center justify-between px-4 lg:px-6 py-3 border-b h-16 shrink-0", theme === "bento-dark" ? "bg-gray-900 border-gray-800" : "bg-white border-[#E5E7EB]")}>
      <div className="flex items-center space-x-8">
        <div className="md:hidden">
          <NakamasLogo className="text-[22px]" />
        </div>
        <div className="hidden md:block">
          <span className="text-[14.58px] font-bold text-gray-900 tracking-wide">{t('Πίνακας Ελέγχου', 'Dashboard')}</span>
        </div>
      </div>
      <div className="flex items-center space-x-3">
        <div className="relative hidden lg:block">
          <input
            type="text"
            value={searchValue}
            onChange={e => setSearchValue(e.target.value)}
            onKeyDown={handleSearchKeyDown}
            placeholder={t('Αναζήτηση εκδηλώσεων...', 'Search events...')}
            className={cn("w-64 py-1.5 pl-8 pr-3 text-[14.42px] border-transparent rounded-md focus:ring-1 focus:ring-cyan-500 outline-none", theme === "bento-dark" ? "bg-gray-800 text-white focus:bg-gray-700" : "bg-gray-100 focus:bg-white text-gray-900")}
          />
          <Search className="absolute w-4 h-4 text-gray-900 left-2.5 top-2" />
        </div>

        {/* Theme Toggle */}
        <button onClick={cycleTheme} className={cn("flex items-center gap-1 text-[11.33px] font-bold transition-colors px-2.5 py-1.5 rounded-lg", theme === "bento-dark" ? "bg-gray-800 text-gray-200 hover:text-emerald-400 hover:bg-gray-700" : "bg-gray-100 text-gray-900 hover:text-[#0E8B8D] hover:bg-cyan-50")} title="Toggle Theme">
          <Palette className="w-4 h-4" />
          <span className="hidden sm:inline capitalize">{theme}</span>
        </button>

        {/* Language Toggle */}
        <button
          onClick={() => setLanguage(language === 'el' ? 'en' : 'el')}
          className={cn("flex items-center gap-1 text-[11.33px] font-bold transition-colors px-2.5 py-1.5 rounded-lg", theme === "bento-dark" ? "bg-gray-800 text-gray-200 hover:text-emerald-400 hover:bg-gray-700" : "bg-gray-100 text-gray-900 hover:text-[#0E8B8D] hover:bg-cyan-50")}
          title={language === 'el' ? 'Switch to English' : 'Αλλαγή σε Ελληνικά'}
        >
          <Globe className="w-3.5 h-3.5" />
          {language === 'el' ? 'EN' : 'EL'}
        </button>

        <NavLink to="/notifications" className="relative text-gray-900 hover:text-[#0E8B8D] transition-colors">
          <Bell className="h-[18px] w-[18px]" />
          {unreadNotificationCount > 0 && (
            <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-[#18D8DB] text-[9.27px] text-white font-bold border border-white">
              {unreadNotificationCount}
            </span>
          )}
        </NavLink>

        <div className="flex items-center space-x-2">
          {currentUser ? (
            <NavLink to="/profile" className="flex items-center space-x-2 relative group">
              <div className="hidden sm:flex flex-col items-end">
                <span className="text-[10.3px] font-bold text-[#0E8B8D] tracking-wide">{t('Αξιόπιστο Μέλος', 'Trusted Member')}</span>
                <span className="text-[11.33px] font-bold text-[#111827]">{currentUser.name}</span>
              </div>
              <div className="w-[28px] h-[28px] rounded-full bg-cyan-100 border border-cyan-200 flex items-center justify-center text-[#0E8B8D] font-bold text-[10px] overflow-hidden">
                {currentUser.photoUrl ? (
                  <img src={currentUser.photoUrl} alt={currentUser.name} className="w-full h-full object-cover" />
                ) : (
                  currentUser.name.substring(0, 2)
                )}
              </div>
            </NavLink>
          ) : (
            <button
              onClick={() => navigate('/login')}
              className="text-xs font-bold text-white bg-cyan-600 hover:bg-cyan-700 px-3 py-1.5 rounded-full transition-colors"
            >
              {t('Σύνδεση', 'Login')}
            </button>
          )}
        </div>

        <button onClick={onMenuClick} className="text-gray-900 hover:text-[111827] md:hidden">
          <Menu className="h-[22px] w-[22px]" />
        </button>
      </div>
    </nav>
  );
}

// ─────────────────────────────────────────────
// BottomNav
// ─────────────────────────────────────────────
export function BottomNav() { const theme = useStore(s=>s.theme);
  const { t } = useLanguage();
  return (
    <div className={cn("md:hidden fixed bottom-0 left-0 w-full backdrop-blur-md border-t px-2 pb-4 pt-3 flex items-center justify-around shadow-[0_-4px_20px_rgba(0,0,0,0.05)] z-50", theme === "bento-dark" ? "bg-gray-900/95 border-gray-800" : "bg-white/95 border-gray-200")}>
      <NavLink
        to="/"
        className={({ isActive }) =>
          cn("flex flex-col items-center justify-center gap-1 transition-colors min-w-[60px]", isActive ? (theme === "bento-dark" ? "text-emerald-400" : "text-[#0E8B8D]") : (theme === "bento-dark" ? "text-gray-200 hover:text-emerald-400" : "text-gray-900 hover:text-[#0E8B8D]"))
        }
      >
        <Compass className="h-[18px] w-[18px]" strokeWidth={2.2} />
        <span className="text-[8px] font-medium leading-none">{t('Ανακάλυψη', 'Discover')}</span>
      </NavLink>
      <NavLink
        to="/plans"
        className={({ isActive }) =>
          cn("flex flex-col items-center justify-center gap-1 transition-colors min-w-[60px]", isActive ? (theme === "bento-dark" ? "text-emerald-400" : "text-[#0E8B8D]") : (theme === "bento-dark" ? "text-gray-200 hover:text-emerald-400" : "text-gray-900 hover:text-[#0E8B8D]"))
        }
      >
        <CalendarCheck className="h-[18px] w-[18px]" strokeWidth={2.2} />
        <span className="text-[8px] font-medium leading-none">{t('Σχέδια', 'Plans')}</span>
      </NavLink>
      <div className="flex flex-col items-center justify-center -mt-6">
        <NavLink
          to="/create"
          className="bg-[#111827] text-white w-10 h-10 rounded-full flex items-center justify-center shadow-lg hover:bg-black transition-colors border-[3px] border-white"
        >
          <Plus className="h-[20px] w-[20px]" strokeWidth={2.5} />
        </NavLink>
        <span className="text-[8px] font-medium mt-1 text-gray-900">{t('Δημιουργία', 'Create')}</span>
      </div>
      <NavLink
        to="/trust"
        className={({ isActive }) =>
          cn("flex flex-col items-center justify-center gap-1 transition-colors min-w-[60px]", isActive ? (theme === "bento-dark" ? "text-emerald-400" : "text-[#0E8B8D]") : (theme === "bento-dark" ? "text-gray-200 hover:text-emerald-400" : "text-gray-900 hover:text-[#0E8B8D]"))
        }
      >
        <ShieldCheck className="h-[18px] w-[18px]" strokeWidth={2.2} />
        <span className="text-[8px] font-medium leading-none">{t('Εμπιστοσύνη', 'Trust')}</span>
      </NavLink>
      <NavLink
        to="/profile"
        className={({ isActive }) =>
          cn("flex flex-col items-center justify-center gap-1 transition-colors min-w-[60px]", isActive ? (theme === "bento-dark" ? "text-emerald-400" : "text-[#0E8B8D]") : (theme === "bento-dark" ? "text-gray-200 hover:text-emerald-400" : "text-gray-900 hover:text-[#0E8B8D]"))
        }
      >
        <User className="h-[18px] w-[18px]" strokeWidth={2.2} />
        <span className="text-[8px] font-medium leading-none">{t('Προφίλ', 'Profile')}</span>
      </NavLink>
    </div>
  );
}

// ─────────────────────────────────────────────
// AppShell
// ─────────────────────────────────────────────
export function AppShell({ children }: { children: ReactNode }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { t } = useLanguage();
  const theme = useStore((state) => state.theme);

  return (
    <div className={cn("flex h-screen w-full font-sans antialiased overflow-hidden", theme === 'bento-dark' ? 'bg-black text-white' : 'bg-[#F3F4F6] text-[#111827]')}>
      <SideNav />
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div className="fixed inset-0 bg-black/50" onClick={() => setIsMobileMenuOpen(false)} />
          <div className={cn("relative w-64 max-w-sm h-full shadow-xl flex flex-col z-50", theme === "bento-dark" ? "bg-gray-900 border-r border-gray-800" : "bg-white")}>
            <div className="h-14 flex items-center justify-between px-6 border-b border-[#E5E7EB] shrink-0">
              <NakamasLogo className="text-[22px]" />
              <button onClick={() => setIsMobileMenuOpen(false)} className="text-gray-900 hover:text-[111827]">
                <X className="h-6 w-6" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto py-6 px-3" onClick={() => setIsMobileMenuOpen(false)}>
              <NavLinks />
            </div>
          </div>
        </div>
      )}
      <div className="flex flex-col flex-1 h-screen overflow-hidden">
        <TopNav onMenuClick={() => setIsMobileMenuOpen(true)} />
        <main className="flex-1 overflow-y-auto relative flex flex-col">
          <div className="mx-auto w-full max-w-full p-4 lg:px-8 lg:py-6 flex-1 pb-24 md:pb-6">
            {children}
          </div>
        </main>
        <footer className="hidden md:flex h-8 px-6 bg-[#111827] text-[10px] text-gray-900 items-center justify-between shrink-0">
          <div className="flex space-x-4">
            <span>Nakamas v1.0.5-beta</span>
            <span className="flex items-center">
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2" />
              {t('Σύστημα Λειτουργικό', 'System Operational')}
            </span>
          </div>
          <div className="hidden sm:flex space-x-4">
            <a href="#" className="hover:text-white transition-colors">{t('Πολιτική Απορρήτου', 'Privacy Policy')}</a>
            <a href="#" className="hover:text-white transition-colors">{t('Αναφορά Προβλημάτων', 'Report Issues')}</a>
            <a href="#" className="hover:text-white transition-colors">{t('Πώς λειτουργεί η αξιοπιστία', 'How trust works')}</a>
          </div>
        </footer>
        <BottomNav />
      </div>
    </div>
  );
}
