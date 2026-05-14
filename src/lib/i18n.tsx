import React, { createContext, useContext, useState, ReactNode } from 'react';

type Language = 'el' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (greekText: string, englishText?: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const translations: Record<string, Record<Language, string>> = {
  // Navigation / AppShell
  'nav.discover': { el: 'Ανακάλυψη', en: 'Discover' },
  'nav.plans': { el: 'Σχέδια', en: 'Plans' },
  'nav.organize': { el: 'Διοργάνωση', en: 'Organize' },
  'nav.trust': { el: 'Εμπιστοσύνη', en: 'Trust' },
  'nav.profile': { el: 'Προφίλ', en: 'Profile' },
  'nav.my_nakamas': { el: 'Οι Nakamas μου', en: 'My Nakamas' },
  'nav.messages': { el: 'Μηνύματα', en: 'Messages' },
  'nav.wallet': { el: 'Πορτοφόλι & Πληρωμές', en: 'Wallet & Payments' },
  'nav.settings': { el: 'Ρυθμίσεις & Απόρρητο', en: 'Settings & Privacy' },
  'nav.help': { el: 'Κέντρο Βοήθειας', en: 'Help Center' },

  // Home Page Hero
  'home.hero.badge': { el: 'Νέος Τρόπος Εξόδου', en: 'New Way to Go Out' },
  'home.hero.title1': { el: 'Βρείτε παρέα για τις', en: 'Find company for the' },
  'home.hero.title2': { el: 'εμπειρίες', en: 'experiences' },
  'home.hero.title3': { el: 'που ήδη θέλετε να ζήσετε.', en: 'you already want to live.' },
  'home.hero.subtitle': { el: 'Προσχωρήστε σε μικρές ομάδες για εκδηλώσεις, δραστηριότητες και κοντινές αποδράσεις — βασισμένες σε κοινά ενδιαφέροντα και διαθεσιμότητα.', en: 'Join small groups for events, activities and nearby getaways — based on shared interests and availability.' },
  'home.hero.stat1': { el: 'Μικρές ομάδες', en: 'Small groups' },
  'home.hero.stat2': { el: 'Επαληθευμένη συμμετοχή', en: 'Verified attendance' },
  'home.hero.stat3': { el: 'Δημόσια σημεία', en: 'Public spots' },
  'home.hero.search_placeholder': { el: 'Αναζήτηση εμπειριών...', en: 'Search experiences...' },
  'home.hero.how_groups': { el: 'Πώς λειτουργούν οι ομάδες', en: 'How groups work' },
  'home.pending_feedback.title': { el: 'Εκκρεμής Αξιολόγηση', en: 'Pending Feedback' },
  'home.pending_feedback.body': { el: 'Αξιολογήστε τα 3 μέλη από το "Comedy Night" για να ξεκλειδώσετε την επόμενη κράτησή σας.', en: 'Please rate the 3 members from "Comedy Night" to unlock your next booking.' },
  'home.pending_feedback.cta': { el: 'Αξιολόγηση', en: 'Review Event' },

  // How it works
  'home.how.step1.title': { el: 'Διαλέξτε μια εμπειρία', en: 'Pick an experience' },
  'home.how.step1.body': { el: 'Επιλέξτε μια εκδήλωση, πεζοπορία ή δραστηριότητα που θέλετε να παρακολουθήσετε.', en: 'Choose an event, hike, or activity you want to attend.' },
  'home.how.step2.title': { el: 'Εντάξτε μια μικρή ομάδα', en: 'Join a small group' },
  'home.how.step2.body': { el: 'Συνδεθείτε με 3-6 άτομα που μοιράζονται την ίδια πρόθεση και πρόγραμμα.', en: 'Connect with 3-6 others who share the same intent and schedule.' },
  'home.how.step3.title': { el: 'Επιβεβαιώστε & συναντηθείτε', en: 'Confirm & meet' },
  'home.how.step3.body': { el: 'Ξεκλειδώστε το group chat, ορίστε σημείο συνάντησης και απολαύστε την εμπειρία.', en: 'Unlock the group chat, set a meeting point, and enjoy the experience.' },

  // Filters / categories
  'home.explore_categories': { el: 'Εξερεύνηση Κατηγοριών', en: 'Explore Categories' },
  'home.filter.all_types': { el: 'Όλοι οι Τύποι', en: 'All Types' },
  'home.filter.free': { el: 'Δωρεάν', en: 'Free' },
  'home.filter.paid': { el: 'Επί Πληρωμή', en: 'Paid' },
  'home.filter.group_discount': { el: 'Ομαδική Έκπτωση', en: 'Group Discount' },
  'home.filter.any_date': { el: 'Οποιαδήποτε Ημ/νία', en: 'Any Date' },
  'home.filter.today': { el: 'Σήμερα', en: 'Today' },
  'home.filter.this_week': { el: 'Αυτή την Εβδομάδα', en: 'This Week' },
  'home.filter.this_month': { el: 'Αυτόν τον Μήνα', en: 'This Month' },
  'home.filter.all_comfort': { el: 'Όλα τα Επίπεδα', en: 'All Comfort Levels' },
  'home.filter.public': { el: 'Δημόσιοι Χώροι', en: 'Public Spaces' },
  'home.filter.organized': { el: 'Οργανωμένοι Hosts', en: 'Organized Hosts' },
  'home.filter.verified': { el: 'Επαληθευμένες Ομάδες', en: 'Verified Groups' },
  'home.filter.any_distance': { el: 'Οποιαδήποτε Απόσταση', en: 'Any Distance' },
  'home.filter.5km': { el: 'Εντός 5χλμ', en: 'Within 5km' },
  'home.filter.10km': { el: 'Εντός 10χλμ', en: 'Within 10km' },
  'home.filter.25km': { el: 'Εντός 25χλμ', en: 'Within 25km' },

  // Feed
  'home.feed.for_you': { el: 'Για Σένα', en: 'For You' },
  'home.feed.discover': { el: 'Ανακάλυψε', en: 'Discover' },
  'home.feed.no_events': { el: 'Δεν βρέθηκαν εκδηλώσεις για τα κριτήριά σας.', en: 'No events found matching your criteria.' },
  'home.feed.load_more': { el: 'Φόρτωση Περισσότερων', en: 'Load More' },
  'home.feed.sort.relevance': { el: 'Συνάφεια', en: 'Relevance' },
  'home.feed.sort.distance': { el: 'Απόσταση', en: 'Distance' },
  'home.feed.sort.group_progress': { el: 'Πρόοδος Ομάδας', en: 'Group Progress' },

  // EventCard
  'event_card.organizer': { el: 'ΔΙΟΡΓΑΝΩΤΗΣ', en: 'ORGANIZER' },
  'event_card.free': { el: 'ΔΩΡΕΑΝ', en: 'FREE' },
  'event_card.forming': { el: 'Σε Σχηματισμό', en: 'Forming' },
  'event_card.join': { el: 'Συμμετοχή', en: 'Join' },
  'event_card.copied': { el: 'Ο σύνδεσμος αντιγράφηκε!', en: 'Link copied to clipboard!' },

  // General
  'general.language_toggle': { el: 'EN', en: 'EL' },
  'general.soon': { el: 'Σύντομα', en: 'Soon' },
};

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('el');

  const t = (greekText: string, englishText?: string): string => {
    const entry = translations[greekText];
    if (entry) {
      return entry[language];
    }
    if (language === 'en' && englishText) {
      return englishText;
    }
    return greekText;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
