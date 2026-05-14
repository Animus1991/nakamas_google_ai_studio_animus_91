import React, { useState } from 'react';
import { Search, Book, MessageCircle, FileText, ChevronRight, ChevronDown, Zap, Shield, CreditCard, Users } from 'lucide-react';
import { Card } from '../components/common/Card';
import { useLanguage } from "../lib/i18n";

export default function HelpCenterVibrantDark() {
    const { t } = useLanguage();
    
  const [search, setSearch] = useState('');
  const [expandedFAQ, setExpandedFAQ] = useState<number | null>(null);

  const articles = [
    { id: 1, title: t(`Πώς να αναφέρετε μια μη εμφάνιση (no-show)`, `How to report a no-show`), category: t(`Εμπιστοσύνη & Ασφάλεια`, `Trust & Safety`) },
    { id: 2, title: t(`Επιστροφή χρημάτων για ακυρωμένη εκδήλωση`, `Refund for canceled event`), category: t(`Πληρωμές`, `Payments`) },
    { id: 3, title: t(`Συμβουλές για τη διοργάνωση της πρώτης σας συνάντησης`, `Tips for hosting your first meetup`), category: t(`Διοργανωτές`, `Organizers`) },
    { id: 4, title: t(`Αλλαγή προτιμήσεων ειδοποιήσεων`, `Change notification preferences`), category: t(`Λογαριασμός`, `Account`) },
  ];

  const faqs = [
    { id: 1, q: t(`Πώς λειτουργούν οι ομάδες;`, `How do groups work?`), a: t(`Οι ομάδες σχηματίζονται αυτόματα όταν αρκετά άτομα εκδηλώσουν ενδιαφέρον για μια εκδήλωση. Μόλις γεμίσει η ομάδα, αποκαλύπτεται το σημείο συνάντησης.`, `Groups form automatically when enough people express interest in an event. Once the group fills up, the meeting point is revealed.`) },
    { id: 2, q: t(`Τι συμβαίνει αν κάποιος δεν εμφανιστεί;`, `What happens if someone doesn't show up?`), a: t(`Η αξιοπιστία του μέλους μειώνεται και μπορεί να λάβει προσωρινό αποκλεισμό από νέες εκδηλώσεις. Μπορείτε να αναφέρετε no-shows μέσω της σελίδας αξιολόγησης.`, `The member's reliability score decreases and they may receive a temporary ban from new events. You can report no-shows through the feedback page.`) },
    { id: 3, q: t(`Πώς μπορώ να αυξήσω το Trust Score μου;`, `How can I increase my Trust Score?`), a: t(`Επαληθεύστε email, τηλέφωνο και ταυτότητα. Παρακολουθήστε εκδηλώσεις τακτικά, αξιολογήστε άλλα μέλη, και διατηρήστε υψηλή αξιοπιστία.`, `Verify your email, phone and ID. Attend events regularly, rate other members, and maintain high reliability.`) },
    { id: 4, q: t(`Μπορώ να ακυρώσω μια συμμετοχή;`, `Can I cancel a participation?`), a: t(`Ναι, μπορείτε να αποχωρήσετε από μια ομάδα μέχρι 24 ώρες πριν. Αργότερη ακύρωση επηρεάζει το score σας.`, `Yes, you can leave a group up to 24 hours before. Later cancellation affects your score.`) },
  ];

  const popularTopics = [
    { label: t(`Ασφάλεια`, `Safety`), icon: Shield, color: 'text--400 bg-red-50' },
    { label: t(`Πληρωμές`, `Payments`), icon: CreditCard, color: 'text--400 bg-emerald-50' },
    { label: t(`Ομάδες`, `Groups`), icon: Users, color: 'text--400 bg-blue-50' },
    { label: t(`Γρήγορη Βοήθεια`, `Quick Help`), icon: Zap, color: 'text-amber-600 bg-amber-50' },
  ];

  const filtered = articles.filter(a => a.title.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="max-w-full mx-auto space-y-6 animate-in slide-in-from-bottom-4 duration-500 fade-in pb-20 md:pb-0">
      <div className="bg-cyan-600 text-white rounded-2xl p-8 text-center shadow-md relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 rounded-full bg-gray-800 opacity-10"></div>
        <div className="absolute bottom-0 left-0 -ml-8 -mb-8 w-24 h-24 rounded-full bg-gray-800 opacity-10"></div>
        
        <h1 className="text-[20.104264919475px] md:text-[26.7902365993px] font-black mb-2 relative z-10">{t(`Κέντρο Βοήθειας`, `Help Center`)}</h1>
        <p className="text-cyan-100 text-[16.2px] font-medium mb-6 relative z-10">{t(`Πώς μπορούμε να σας βοηθήσουμε;`, `How can we help you?`)}</p>
        <div className="relative max-w-md mx-auto z-10">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder={t(`Αναζήτηση άρθρων...`, `Search articles...`)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl text-[16.2px] font-medium text-white focus:outline-none focus:ring-2 focus:ring-white"
          />
        </div>
      </div>

      {/* Popular Topics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {popularTopics.map(topic => {
          const Icon = topic.icon;
          return (
            <button key={topic.label} className={`flex items-center gap-2 p-3 rounded-xl border border-gray-800 bg-gray-800 hover:shadow-sm transition-all`}>
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${topic.color}`}>
                <Icon className="w-4 h-4" />
              </div>
              <span className="text-[13.8px] font-bold text-white">{topic.label}</span>
            </button>
          );
        })}
      </div>

      {/* FAQ Accordion */}
      <div>
        <h2 className="text-[12.1125px] font-bold text-white tracking-wide mb-3">{t(`Συχνές Ερωτήσεις`, `Frequently Asked Questions`)}</h2>
        <div className="space-y-2">
          {faqs.map(faq => (
            <Card key={faq.id} className="overflow-hidden">
              <button
                onClick={() => setExpandedFAQ(expandedFAQ === faq.id ? null : faq.id)}
                className="w-full p-4 flex items-center justify-between text-left"
              >
                <span className="font-bold text-[15.083739px] text-white pr-4">{faq.q}</span>
                <ChevronDown className={`w-4 h-4 text-white shrink-0 transition-transform ${expandedFAQ === faq.id ? 'rotate-180' : ''}`} />
              </button>
              {expandedFAQ === faq.id && (
                <div className="px-4 pb-4 -mt-1">
                  <p className="text-[13.5px] text-white font-medium leading-relaxed">{faq.a}</p>
                </div>
              )}
            </Card>
          ))}
        </div>
      </div>

      {/* Articles */}
      <div>
        <h2 className="text-[13.5px] font-bold text-white tracking-wide mb-3">{t(`Άρθρα Βοήθειας`, `Help Articles`)}</h2>
        <div className="space-y-3">
          {filtered.map(article => (
            <Card key={article.id} className="p-4 flex items-center justify-between hover:border-cyan-200 cursor-pointer transition-colors">
              <div>
                <span className="text-[12.5px] font-bold text-cyan-400 tracking-wide">{article.category}</span>
                <h3 className="font-bold text-[16.2px] text-white mt-0.5">{article.title}</h3>
              </div>
              <ChevronRight className="w-4 h-4 text-white shrink-0" />
            </Card>
          ))}
        </div>
      </div>

      {/* Contact & Live Status */}
      <Card className="p-6 text-center">
        <MessageCircle className="w-8 h-8 text-cyan-400 mx-auto mb-3" />
        <h3 className="font-bold text-white mb-1">{t(`Χρειάζεστε περαιτέρω βοήθεια;`, `Need more help?`)}</h3>
        <p className="text-[13.5px] text-white mb-2">{t(`Επικοινωνήστε μαζί μας`, `Contact our support team`)}</p>
        <div className="flex items-center justify-center gap-1.5 mb-4">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
          </span>
          <span className="text-[12.5px] font-bold text--400">{t(`Online τώρα`, `Online now`)} • ~2min {t(`απόκριση`, `response`)}</span>
        </div>
        <button className="px-4 py-2 bg-cyan-600 text-white text-[13.5px] font-bold rounded-lg hover:bg-cyan-700 transition-colors">
          {t(`Αποστολή μηνύματος`, `Send message`)}
        </button>
      </Card>
    </div>
  );
}
