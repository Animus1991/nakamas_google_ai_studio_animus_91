import React, { useState } from 'react';
import { Flag, AlertTriangle, ShieldCheck, CheckCircle2, ChevronRight, X, Upload, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from "../lib/i18n";

export default function ReportIssueVibrant() {
    const { t } = useLanguage();
  const [step, setStep] = useState(1);
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep(2);
  };

  return (
    <div className="max-w-full mx-auto space-y-6 animate-in slide-in-from-bottom-4 duration-500 fade-in pb-20 md:pb-0">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-[20.104264919475px] md:text-[26.7902365993px] font-bold text-[#111827]">{t(`Αναφορά Προβλήματος`, `Report an Issue`)}</h1>
          <p className="text-black font-medium text-[13.551608211075px] md:text-[16.25212883329px] mt-1">{t(`Βοηθήστε μας να κρατήσουμε την κοινότητα ασφαλή`, `Help us keep the community safe`)}</p>
        </div>
        <button onClick={() => navigate(-1)} className="text-black hover:text-[#111827] transition-colors rounded-full p-2 bg-white border border-gray-200 shadow-sm">
          <X className="w-5 h-5" />
        </button>
      </div>

      {step === 1 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-4 md:p-6 bg-red-50 border-b border-red-100 flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center shrink-0">
              <AlertTriangle className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <h3 className="font-bold text-[#111827] text-[16.75971px]">{t(`Αναφορά Ζητήματος Ασφαλείας`, `Report a Safety Concern`)}</h3>
              <p className="text-[14.535px] text-red-800 mt-1 leading-relaxed">{t(`Η αναφορά σας θα εξεταστεί από την ομάδα μας εντός 24 ωρών.`, `Your report will be reviewed by our team within 24 hours.`)}</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-4 md:p-6 space-y-5">
            <div>
              <label className="block text-[10.90125px] font-bold text-[#111827] tracking-wider mb-2">{t(`Κατηγορία`, `Category`)}</label>
              <select className="w-full h-11 px-3 rounded-lg border border-gray-200 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-cyan-600 focus:border-transparent text-[16.2px] font-medium" required>
                <option value="">{t(`Επιλέξτε κατηγορία...`, `Select a category...`)}</option>
                <option value="user_behavior">{t(`Ανάρμοστη συμπεριφορά`, `Inappropriate behavior`)}</option>
                <option value="event_safety">{t(`Ασφάλεια εκδήλωσης`, `Event safety`)}</option>
                <option value="fake_profile">{t(`Ψεύτικο προφίλ`, `Fake profile`)}</option>
                <option value="no_show">{t(`No-show`, `No-show`)}</option>
                <option value="other">{t(`Άλλο`, `Other`)}</option>
              </select>
            </div>

            {/* Severity Level */}
            <div>
              <label className="block text-[10.90125px] font-bold text-[#111827] tracking-wider mb-2">{t(`Σοβαρότητα`, `Severity`)}</label>
              <div className="grid grid-cols-3 gap-2">
                <button type="button" className="p-2.5 rounded-lg border border-amber-200 bg-amber-50 text-center hover:ring-2 hover:ring-amber-300 transition-all">
                  <span className="text-[12.1125px] font-bold text-amber-800 block">{t(`Χαμηλή`, `Low`)}</span>
                  <span className="text-[10px] text-amber-600">{t(`Ενόχληση`, `Annoyance`)}</span>
                </button>
                <button type="button" className="p-2.5 rounded-lg border border-orange-200 bg-orange-50 text-center hover:ring-2 hover:ring-orange-300 transition-all">
                  <span className="text-[12.1125px] font-bold text-orange-800 block">{t(`Μέτρια`, `Medium`)}</span>
                  <span className="text-[10px] text-orange-600">{t(`Ανησυχία`, `Concern`)}</span>
                </button>
                <button type="button" className="p-2.5 rounded-lg border border-red-200 bg-red-50 text-center hover:ring-2 hover:ring-red-300 transition-all">
                  <span className="text-[12.1125px] font-bold text-red-800 block">{t(`Υψηλή`, `High`)}</span>
                  <span className="text-[10px] text-red-600">{t(`Κίνδυνος`, `Danger`)}</span>
                </button>
              </div>
            </div>

            <div>
              <label className="block text-[10.90125px] font-bold text-[#111827] tracking-wider mb-2">{t(`Περιγραφή`, `Description`)}</label>
              <textarea 
                className="w-full px-3 py-2.5 rounded-lg border border-gray-200 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-cyan-600 focus:border-transparent text-[16.2px] font-medium resize-none" 
                rows={5} 
                placeholder={t(`Περιγράψτε τι συνέβη...`, `Describe what happened...`)}
                required
              ></textarea>
            </div>

            {/* Evidence Upload */}
            <div>
              <label className="block text-[12.15px] font-bold text-[#111827] tracking-wider mb-2">{t(`Αποδεικτικά (προαιρετικά)`, `Evidence (optional)`)}</label>
              <div className="border-2 border-dashed border-gray-200 rounded-xl p-4 text-center hover:border-cyan-300 hover:bg-cyan-50/30 transition-colors cursor-pointer">
                <Upload className="w-5 h-5 text-black mx-auto mb-1" />
                <p className="text-[12.5px] text-black font-medium">{t(`Ανεβάστε screenshots ή φωτογραφίες`, `Upload screenshots or photos`)}</p>
                <p className="text-[10px] text-black mt-0.5">PNG, JPG {t(`έως`, `up to`)} 5MB</p>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-cyan-600 shrink-0 mt-0.5" />
              <p className="text-[13.5px] text-black font-medium leading-relaxed"><span className="font-bold text-[#111827]">{t(`Απόρρητο:`, `Privacy:`)}</span> {t(`Η αναφορά σας είναι εμπιστευτική.`, `Your report is confidential.`)}</p>
            </div>

            {/* Expected response time */}
            <div className="flex items-center gap-2 justify-center text-[12.5px] text-black font-medium">
              <Clock className="w-3.5 h-3.5" />
              <span>{t(`Αναμενόμενος χρόνος απόκρισης: <24 ώρες`, `Expected response time: <24 hours`)}</span>
            </div>

            <button type="submit" className="w-full bg-gradient-to-br from-violet-600 via-fuchsia-600 to-orange-500 text-white py-2.5 rounded-full text-[12.15px] font-bold shadow-sm hover:bg-black transition-colors  tracking-wider">{t(`Υποβολή Αναφοράς`, `Submit Report`)}</button>
          </form>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
          <div className="w-16 h-[58px] rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-8 h-8 text-emerald-600" />
          </div>
          <h2 className="text-[25px] font-bold text-[#111827] mb-2">{t(`Η αναφορά υποβλήθηκε`, `Report Submitted`)}</h2>
          <p className="text-[18px] text-black max-w-md mx-auto mb-6">{t(`Ευχαριστούμε. Θα εξετάσουμε την αναφορά σας και θα σας ενημερώσουμε.`, `Thank you. We'll review your report and get back to you.`)}</p>
          <button 
            onClick={() => navigate('/')}
            className="bg-gray-100 text-[#111827] px-5 py-2.5 rounded-full text-[13.5px] font-bold hover:bg-gray-200 transition-colors tracking-wider"
          >{t(`Επιστροφή`, `Go Back`)}</button>
        </div>
      )}
    </div>
  );
}
