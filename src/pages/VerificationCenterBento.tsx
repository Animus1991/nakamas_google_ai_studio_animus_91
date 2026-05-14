import React from 'react';
import { ShieldCheck, UserCheck, Smartphone, Mail, FileText, CheckCircle2 } from 'lucide-react';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { useLanguage } from "../lib/i18n";

export default function VerificationCenterBento() {
    const { t } = useLanguage();
  return (
    <div className="max-w-full mx-auto space-y-6 animate-in slide-in-from-bottom-4 duration-500 fade-in pb-20 md:pb-0">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-[20.104264919475px] md:text-[26.7902365993px] font-bold text-[#111827]">{t(`Κέντρο Επαλήθευσης`, `Verification Center`)}</h1>
          <p className="text-black font-medium text-[13.551608211075px] md:text-[14.626916949961px] mt-1">{t(`Επαληθεύστε την ταυτότητά σας για μεγαλύτερη ασφάλεια`, `Verify your identity for greater safety`)}</p>
        </div>
      </div>

      <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex gap-4 mt-6">
        <div className="w-12 h-[42px] bg-emerald-100 rounded-full flex items-center justify-center shrink-0">
           <ShieldCheck className="w-6 h-6 text-emerald-600" />
        </div>
        <div>
          <h2 className="font-bold text-emerald-900 text-[15.083739px]">{t(`Πρόοδος Επαλήθευσης`, `Verification Progress`)}</h2>
          <p className="text-[13.0815px] text-emerald-700 mt-1 mb-3">{t(`2 από 3 βήματα ολοκληρώθηκαν`, `2 of 3 steps completed`)}</p>
          <div className="w-full bg-emerald-200 rounded-full h-2">
            <div className="bg-emerald-600 h-2 rounded-full w-2/3"></div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="p-5">
           <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                 <div className="w-10 h-10 bg-cyan-50 text-cyan-600 rounded-lg flex items-center justify-center">
                    <Mail className="w-5 h-5" />
                 </div>
                 <div>
                    <h3 className="font-bold text-[15.083739px] text-[#111827]">{t(`Email Επαλήθευση`, `Email Verification`)}</h3>
                    <p className="text-[10.90125px] text-black font-bold tracking-wider mt-0.5">{t(`Ολοκληρώθηκε`, `Completed`)}</p>
                 </div>
              </div>
              <CheckCircle2 className="w-5 h-5 text-emerald-500" />
           </div>
        </Card>

        <Card className="p-5">
           <div className="flex items-start justify-between border-b border-gray-100 pb-4 mb-4">
              <div className="flex items-center gap-3">
                 <div className="w-10 h-10 bg-gray-50 text-black border border-gray-200 rounded-lg flex items-center justify-center">
                    <Smartphone className="w-5 h-5" />
                 </div>
                 <div>
                    <h3 className="font-bold text-[15.083739px] text-[#111827]">{t(`Τηλέφωνο`, `Phone Number`)}</h3>
                    <p className="text-[10.90125px] text-black font-bold tracking-wider mt-0.5">{t(`Σε εκκρεμότητα`, `Pending`)}</p>
                 </div>
              </div>
           </div>
           <p className="text-[13.0815px] text-black mb-3">{t(`Θα σας στείλουμε ένα SMS με κωδικό επαλήθευσης.`, `We'll send you an SMS with a verification code.`)}</p>
           <Button variant="outline" size="sm" className="w-full text-[12.82117815px]">{t(`Επαλήθευση Τώρα`, `Verify Now`)}</Button>
        </Card>

        <Card className="p-5 md:col-span-2">
           <div className="flex items-start justify-between border-b border-gray-100 pb-4 mb-4">
              <div className="flex items-center gap-3">
                 <div className="w-10 h-10 bg-gray-50 text-black border border-gray-200 rounded-lg flex items-center justify-center">
                    <FileText className="w-5 h-5" />
                 </div>
                 <div>
                    <h3 className="font-bold text-[15.083739px] text-[#111827]">{t(`Ταυτότητα / Διαβατήριο`, `Government ID`)}</h3>
                    <p className="text-[10.90125px] text-black font-bold tracking-wider mt-0.5">{t(`Προαιρετικό`, `Optional`)}</p>
                 </div>
              </div>
              <span className="bg-gray-100 text-black text-[10.90125px] font-bold px-2 py-0.5 rounded-full tracking-wide">{t(`Προχωρημένο`, `Advanced`)}</span>
           </div>
           <p className="text-[14.908928449356px] text-black mb-4 max-w-xl">{t(`Ανεβάστε φωτογραφία της ταυτότητάς σας για πρόσβαση σε εκδηλώσεις υψηλής ασφάλειας.`, `Upload a photo of your ID to access high-safety events.`)}</p>
           <div className="bg-gray-50 p-4 rounded-lg flex flex-col sm:flex-row items-center justify-between gap-4 border border-dashed border-gray-200">
             <div className="flex gap-3 text-[14.535px] text-black font-medium">
                <span className="flex items-center gap-1"><ShieldCheck className="w-4 h-4"/>{t(`Ασφαλές`, `Secure`)}</span>
                <span className="flex items-center gap-1"><UserCheck className="w-4 h-4"/>{t(`Ιδιωτικό`, `Private`)}</span>
             </div>
             <Button size="sm" className="w-full sm:w-auto shrink-0 shadow-sm">{t(`Μεταφόρτωση`, `Upload`)}</Button>
           </div>
        </Card>
      </div>

      {/* Benefits per tier */}
      <Card className="p-5">
        <h3 className="text-[12.5px] font-bold text-[#111827] tracking-wide mb-4">{t(`Τι ξεκλειδώνετε`, `What you unlock`)}</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="bg-cyan-50 border border-cyan-100 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-2">
              <Mail className="w-4 h-4 text-cyan-600" />
              <span className="text-[13.8px] font-bold text-cyan-900">Email</span>
            </div>
            <ul className="space-y-1 text-[12.5px] text-black font-medium">
              <li>• {t(`Βασική πρόσβαση`, `Basic access`)}</li>
              <li>• {t(`Εγγραφή σε ομάδες`, `Join groups`)}</li>
              <li>• {t(`Ομαδικές συνομιλίες`, `Group chats`)}</li>
            </ul>
            <span className="mt-2 inline-block text-[11.2px] font-bold text-cyan-600 bg-white px-2 py-0.5 rounded-full">~1 {t(`λεπτό`, `min`)}</span>
          </div>
          <div className="bg-purple-50 border border-purple-100 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-2">
              <Smartphone className="w-4 h-4 text-purple-600" />
              <span className="text-[13.8px] font-bold text-purple-900">{t(`Τηλέφωνο`, `Phone`)}</span>
            </div>
            <ul className="space-y-1 text-[12.5px] text-black font-medium">
              <li>• {t(`Δημιουργία εκδηλώσεων`, `Create events`)}</li>
              <li>• {t(`Trust Score +15%`, `Trust Score +15%`)}</li>
              <li>• {t(`Πρόσβαση σε ιδιωτικά events`, `Access private events`)}</li>
            </ul>
            <span className="mt-2 inline-block text-[11.2px] font-bold text-purple-600 bg-white px-2 py-0.5 rounded-full">~2 {t(`λεπτά`, `min`)}</span>
          </div>
          <div className="bg-amber-50 border border-amber-100 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-2">
              <FileText className="w-4 h-4 text-amber-600" />
              <span className="text-[13.8px] font-bold text-amber-900">{t(`Ταυτότητα`, `ID`)}</span>
            </div>
            <ul className="space-y-1 text-[12.5px] text-black font-medium">
              <li>• {t(`Πλήρης πρόσβαση`, `Full access`)}</li>
              <li>• {t(`Trust Score +25%`, `Trust Score +25%`)}</li>
              <li>• {t(`Organizer badge`, `Organizer badge`)}</li>
            </ul>
            <span className="mt-2 inline-block text-[11.2px] font-bold text-amber-600 bg-white px-2 py-0.5 rounded-full">~5 {t(`λεπτά`, `min`)}</span>
          </div>
        </div>
      </Card>

      {/* Trust Score Impact */}
      <Card className="p-4 flex items-center gap-4">
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan-500 to-emerald-500 flex items-center justify-center text-white font-black text-[18px] shrink-0">72%</div>
        <div className="flex-1">
          <p className="text-[13.8px] font-bold text-[#111827]">{t(`Τρέχον Trust Score`, `Current Trust Score`)}</p>
          <p className="text-[11.2px] text-black font-medium mt-0.5">{t(`Ολοκληρώστε την επαλήθευση τηλεφώνου για +15%`, `Complete phone verification for +15%`)}</p>
        </div>
        <div className="text-right">
          <span className="text-[12.5px] font-bold text-emerald-600">→ 87%</span>
          <p className="text-[11.2px] text-black font-medium">{t(`μετά`, `after`)}</p>
        </div>
      </Card>
    </div>
  );
}
