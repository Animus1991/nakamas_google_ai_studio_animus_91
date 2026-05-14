import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { AlertCircle, UserMinus, ShieldAlert, Flag, Search, CheckCircle, TrendingUp, Clock, Users, Calendar } from 'lucide-react';
import { Button } from '../components/common/Button';
import { useLanguage } from "../lib/i18n";

export default function AdminDashboardVibrant() {
    const { t } = useLanguage();
  return (
    <div className="mx-auto max-w-full space-y-8 pb-12">
      <div>
        <h1 className="text-[26.7902365993px] font-bold text-red-700">{t(`Πίνακας Διαχείρισης`, `Admin Dashboard`)}</h1>
        <p className="mt-1 text-[13.551608211075px] text-black font-medium">{t(`Εποπτεία πλατφόρμας & μετριασμός`, `Platform oversight & moderation`)}</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Card className="p-4 border-t-4 border-t-blue-500">
          <h3 className="text-[12.1125px] font-bold text-black tracking-wider">{t(`Ενεργοί`, `Active`)}</h3>
          <p className="text-[25px] font-black text-[#111827] mt-1">127</p>
          <p className="text-[11.2px] text-green-500 font-bold flex items-center gap-0.5"><TrendingUp className="w-2.5 h-2.5" />+8%</p>
        </Card>
        <Card className="p-4 border-t-4 border-t-cyan-500">
          <h3 className="text-[12.1125px] font-bold text-black tracking-wider">{t(`Αναφορές`, `Reports`)}</h3>
          <p className="text-[25px] font-black text-[#111827] mt-1">4</p>
          <p className="text-[11.2px] text-amber-500 font-bold">{t(`εκκρεμείς`, `pending`)}</p>
        </Card>
        <Card className="p-4 border-t-4 border-t-red-500">
          <h3 className="text-[12.1125px] font-bold text-black tracking-wider">{t(`Αποκλεισμένοι`, `Banned`)}</h3>
          <p className="text-[25px] font-black text-[#111827] mt-1">1</p>
          <p className="text-[11.2px] text-black font-medium">{t(`συνολικά`, `total`)}</p>
        </Card>
        <Card className="p-4 border-t-4 border-t-emerald-500">
          <h3 className="text-[12.1125px] font-bold text-black tracking-wider">{t(`Εκδηλώσεις`, `Events`)}</h3>
          <p className="text-[25px] font-black text-[#111827] mt-1">48</p>
          <p className="text-[11.2px] text-black font-medium">{t(`αυτή τη βδομάδα`, `this week`)}</p>
        </Card>
      </div>

      {/* Platform Health */}
      <Card className="p-4">
        <h3 className="text-[12.1125px] font-bold text-[#111827] tracking-widest mb-3">{t(`Υγεία Πλατφόρμας`, `Platform Health`)}</h3>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-[11.2px] text-black font-medium">{t(`Μ.Ο. Αξιοπιστία`, `Avg Reliability`)}</span>
              <span className="text-[12.5px] font-bold text-emerald-600">87%</span>
            </div>
            <div className="w-full bg-gray-100 h-1.5 rounded-full"><div className="bg-emerald-500 h-full rounded-full" style={{ width: '87%' }} /></div>
          </div>
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-[11.2px] text-black font-medium">No-show rate</span>
              <span className="text-[12.5px] font-bold text-amber-600">4.2%</span>
            </div>
            <div className="w-full bg-gray-100 h-1.5 rounded-full"><div className="bg-amber-400 h-full rounded-full" style={{ width: '4.2%' }} /></div>
          </div>
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-[11.2px] text-black font-medium">{t(`Επαληθευμένοι`, `Verified`)}</span>
              <span className="text-[12.5px] font-bold text-cyan-600">72%</span>
            </div>
            <div className="w-full bg-gray-100 h-1.5 rounded-full"><div className="bg-cyan-500 h-full rounded-full" style={{ width: '72%' }} /></div>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mt-10">
        
        <div className="md:col-span-7 space-y-6">
          <h2 className="text-[16.75971px] font-bold text-[#111827] tracking-wide">{t(`Πρόσφατες Αναφορές`, `Recent Reports`)}</h2>
          <div className="space-y-4">
            <Card className="p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                 <div className="mt-1"><AlertCircle className="h-4 w-4 text-yellow-500" /></div>
                 <div>
                   <p className="font-bold text-[#111827] text-[16.75971px]">{t(`Ακατάλληλη συμπεριφορά σε εκδήλωση`, `Inappropriate behavior at event`)}</p>
                   <p className="text-[14.535px] text-black mt-0.5 leading-relaxed">{t(`Αναφέρθηκε από 2 συμμετέχοντες`, `Reported by 2 participants`)}</p>
                 </div>
              </div>
              <div className="flex gap-2">
                <button className="text-[18px]  tracking-wider bg-gray-100 hover:bg-gray-200 text-black px-3 py-1.5 rounded font-bold transition-colors shadow-sm border border-gray-200">{t(`Εξέταση`, `Review`)}</button>
                <button className="text-[18px]  tracking-wider bg-red-50 hover:bg-red-100 text-red-700 px-3 py-1.5 rounded font-bold transition-colors border border-red-200">{t(`Αποκλεισμός`, `Ban`)}</button>
              </div>
            </Card>

            <Card className="p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border border-red-200 bg-red-50/30">
              <div className="flex items-start gap-3">
                 <div className="mt-1"><ShieldAlert className="h-4 w-4 text-red-500" /></div>
                 <div>
                   <p className="font-bold text-[#111827] text-[18px]">{t(`Ύποπτος λογαριασμός — πολλαπλές no-shows`, `Suspicious account — multiple no-shows`)}</p>
                   <p className="text-[15px] text-black mt-0.5 leading-relaxed">{t(`3 no-shows τον τελευταίο μήνα`, `3 no-shows in the last month`)}</p>
                 </div>
              </div>
              <div className="flex gap-2 shrink-0">
                <button className="text-[18px]  tracking-wider bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded font-bold shadow-sm transition-colors">{t(`Αναστολή`, `Suspend`)}</button>
              </div>
            </Card>
          </div>
        </div>

        <div className="md:col-span-5 relative">
          <div className="sticky top-24">
            <h2 className="text-[18px] font-bold text-[#111827] tracking-wide mb-6 flex items-center gap-2">
              <Flag className="h-4 w-4 text-black" />{t(`Γρήγορη Ενέργεια`, `Quick Action`)}</h2>
            <Card className="p-5 bg-gray-50 border-gray-200">
              <p className="text-[18px] text-black font-bold tracking-wide mb-4">{t(`Αναζήτηση Χρήστη`, `Search User`)}</p>
              
              <div className="space-y-4">
                <div>
                  <label className="text-[15px] font-bold text-[#111827] mb-1.5 block">{t(`Email ή ID`, `Email or ID`)}</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-black" />
                    <input type="text" placeholder={t(`Αναζήτηση...`, `Search...`)} className="w-full pl-9 pr-3 py-2 text-[18px] border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-600 focus:outline-none" />
                  </div>
                </div>

                <div>
                  <label className="text-[15px] font-bold text-[#111827] mb-1.5 block">{t(`Ενέργεια`, `Action`)}</label>
                  <select className="w-full px-3 py-2 text-[18px] border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-600 focus:outline-none bg-white">
                    <option>{t(`Προειδοποίηση`, `Warning`)}</option>
                    <option>{t(`Αναστολή 7 ημέρες`, `Suspend 7 days`)}</option>
                    <option>{t(`Μόνιμος αποκλεισμός`, `Permanent ban`)}</option>
                    <option>{t(`Επαναφορά αξιοπιστίας`, `Reset reliability`)}</option>
                  </select>
                </div>
                
                <div>
                  <label className="text-[15px] font-bold text-[#111827] mb-1.5 block">{t(`Σημείωση`, `Note`)}</label>
                  <textarea rows={3} placeholder={t(`Αιτιολογία...`, `Reason...`)} className="w-full px-3 py-2 text-[18px] border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-600 focus:outline-none resize-none"></textarea>
                </div>
                
                <Button className="w-full bg-gradient-to-br from-violet-600 via-fuchsia-600 to-orange-500 text-white">{t(`Εφαρμογή`, `Apply`)}</Button>
              </div>
            </Card>
          </div>
        </div>

      </div>
    </div>
  );
}
