import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { Button } from '../components/common/Button';
import { Calendar, Users, MessageSquare, Plus, MoreHorizontal, TrendingUp, Star, DollarSign } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from "../lib/i18n";

export default function OrganizerDashboardVibrantDark() {
    const { t } = useLanguage();
  const navigate = useNavigate();

  return (
    <div className="mx-auto max-w-full space-y-8 pb-12">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-[26.7902365993px] font-bold text-white">{t(`Πίνακας Διοργανωτή`, `Organizer Dashboard`)}</h1>
          <p className="mt-1 text-[13.551608211075px] text-white font-medium">{t(`Διαχείριση εκδηλώσεων & ομάδων`, `Manage events & groups`)}</p>
        </div>
        <Button className="bg-gradient-to-br from-red-900 via-rose-900 to-red-800 text-white flex items-center gap-2 text-[14.2457535px] font-bold px-4 hover:bg-black" onClick={() => navigate('/create')}>
          <Plus className="w-4 h-4" />{t(`Νέα`, `New`)}</Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Card className="p-4 border-t-4 border-t-cyan-500">
          <h3 className="text-[12.1125px] font-bold text-white tracking-wide">{t(`Ενεργές`, `Active`)}</h3>
          <p className="text-[25px] font-black text-white mt-1">3</p>
          <p className="text-[11.2px] text-white font-medium">{t(`εκδηλώσεις`, `events`)}</p>
        </Card>
        <Card className="p-4 border-t-4 border-t-emerald-500">
          <h3 className="text-[12.1125px] font-bold text-white tracking-wide">{t(`Συμμετέχοντες`, `Participants`)}</h3>
          <p className="text-[25px] font-black text-white mt-1">48</p>
          <p className="text-[11.2px] text-green-500 font-bold flex items-center gap-0.5"><TrendingUp className="w-2.5 h-2.5" />+12%</p>
        </Card>
        <Card className="p-4 border-t-4 border-t-amber-500">
          <h3 className="text-[12.1125px] font-bold text-white tracking-wide">{t(`Βαθμολογία`, `Rating`)}</h3>
          <p className="text-[25px] font-black text-white mt-1 flex items-center gap-1">4.8 <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" /></p>
          <p className="text-[11.2px] text-white font-medium">23 {t(`αξιολογήσεις`, `reviews`)}</p>
        </Card>
        <Card className="p-4 border-t-4 border-t-purple-500">
          <h3 className="text-[12.1125px] font-bold text-white tracking-wide">{t(`Έσοδα`, `Revenue`)}</h3>
          <p className="text-[25px] font-black text-white mt-1">€340</p>
          <p className="text-[11.2px] text-white font-medium">{t(`αυτόν τον μήνα`, `this month`)}</p>
        </Card>
      </div>

      {/* Fill rate bar */}
      <Card className="p-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-[12.1125px] font-bold text-white tracking-wide">{t(`Ποσοστό Πληρότητας`, `Fill Rate`)}</h3>
          <span className="text-[12.1125px] font-bold text-cyan-400">72%</span>
        </div>
        <div className="w-full bg-gray-700 h-2 rounded-full overflow-hidden">
          <div className="bg-gradient-to-r from-cyan-500 to-emerald-500 h-full rounded-full" style={{ width: '72%' }} />
        </div>
        <p className="text-[11.2px] text-white font-medium mt-1">{t(`18 από 25 θέσεις καλύφθηκαν συνολικά`, `18 of 25 spots filled overall`)}</p>
      </Card>

      {/* Attendee Satisfaction */}
      <Card className="p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-[12.1125px] font-bold text-white tracking-wide">{t(`Ικανοποίηση Συμμετεχόντων`, `Attendee Satisfaction`)}</h3>
          <span className="text-[11.2px] font-medium text-white">{t(`Τελ. 30 μέρες`, `Last 30 days`)}</span>
        </div>
        <div className="grid grid-cols-3 gap-3">
          <div className="text-center p-2 bg-emerald-50 rounded-lg border border-emerald-100">
            <p className="text-[23px] font-black text--400">92%</p>
            <p className="text-[10px] font-bold text--400">{t(`Θετικές`, `Positive`)}</p>
          </div>
          <div className="text-center p-2 bg-amber-50 rounded-lg border border-amber-100">
            <p className="text-[23px] font-black text-amber-700">6%</p>
            <p className="text-[10px] font-bold text-amber-600">{t(`Ουδέτερες`, `Neutral`)}</p>
          </div>
          <div className="text-center p-2 bg-red-50 rounded-lg border border-red-100">
            <p className="text-[23px] font-black text--400">2%</p>
            <p className="text-[10px] font-bold text--400">{t(`Αρνητικές`, `Negative`)}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 mt-3 text-[11.2px] text-white font-medium">
          <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
          <span>{t(`Κορυφαίο σχόλιο:`, `Top comment:`)} "<em>{t(`Εξαιρετική οργάνωση!`, `Excellent organization!`)}</em>"</span>
        </div>
      </Card>

      {/* Quick Create Templates */}
      <div>
        <h3 className="text-[12.5px] font-bold text-white tracking-wide mb-2">{t(`Γρήγορη Δημιουργία`, `Quick Create`)}</h3>
        <div className="flex gap-2 overflow-x-auto pb-1 noscrollbar">
          {[
            { label: t(`Πεζοπορία`, `Hiking`), emoji: '🥾' },
            { label: t(`Σινεμά`, `Cinema`), emoji: '🎬' },
            { label: 'Stand-up', emoji: '🎤' },
            { label: t(`Επιτραπέζια`, `Board Games`), emoji: '🎲' },
          ].map(tpl => (
            <button key={tpl.label} onClick={() => navigate('/create')} className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-gray-700 bg-gray-800 hover:bg-emerald-900/30 hover:border-cyan-200 transition-colors text-[12.5px] font-bold text-white">
              <span>{tpl.emoji}</span> {tpl.label}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-6">
        <h2 className="text-[18px] font-bold text-white tracking-wide">{t(`Οι Εκδηλώσεις μου`, `My Events`)}</h2>
        
        <Card className="p-0 overflow-hidden border border-gray-700">
          <div className="p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-gray-800 bg-gray-900/50">
            <div className="flex flex-col">
               <div className="flex items-center gap-2 mb-1">
                 <Badge variant="neutral">Stand-up</Badge>
                 <span className="text-[12.5px] text-white font-bold tracking-wide">{t(`Σε 2 μέρες`, `In 2 days`)}</span>
               </div>
               <h3 className="text-[18px] font-bold text-white">{t(`Stand-up Comedy Night`, `Stand-up Comedy Night`)}</h3>
            </div>
            <div className="flex gap-2">
              <span className="text-[15px] font-bold text-white bg-gray-800 px-2 py-1 rounded shadow-sm border border-gray-800">12/20 {t(`θέσεις`, `spots`)}</span>
            </div>
          </div>
          
          <div className="p-4 bg-gray-800 grid grid-cols-1 md:grid-cols-3 gap-4">
             <div className="md:col-span-2 space-y-3">
               <h4 className="text-[15px] font-bold text-white tracking-wide flex items-center gap-2">
                 <Users className="w-4 h-4 text-white" />{t(`Ομάδες`, `Groups`)}</h4>
               
               <div className="flex items-center justify-between p-3 bg-gray-900 rounded border border-gray-800">
                  <div>
                    <p className="text-[15px] font-bold text-white">{t(`Ομάδα #1`, `Group #1`)} — 4/4</p>
                    <p className="text-[12.5px] text-white mt-0.5">{t(`Επιβεβαιωμένη`, `Confirmed`)}</p>
                  </div>
                  <div className="flex gap-2">
                    <button className="p-1.5 bg-gray-800 text-cyan-400 rounded shadow-sm border border-gray-700 hover:bg-emerald-900/30">
                      <MessageSquare className="w-3.5 h-3.5" />
                    </button>
                  </div>
               </div>

               <div className="flex items-center justify-between p-3 bg-gray-900 rounded border border-gray-800">
                  <div>
                    <p className="text-[15px] font-bold text-white">{t(`Ομάδα #2`, `Group #2`)} — 3/4</p>
                    <p className="text-[12.5px] text-white mt-0.5">{t(`Αναμένεται 1 ακόμα`, `Waiting for 1 more`)}</p>
                  </div>
                  <div className="flex gap-2">
                    <button className="p-1.5 bg-gray-800 text-cyan-400 rounded shadow-sm border border-gray-700 hover:bg-emerald-900/30">
                      <MessageSquare className="w-3.5 h-3.5" />
                    </button>
                  </div>
               </div>
             </div>

             <div className="space-y-3">
               <h4 className="text-[15px] font-bold text-white tracking-wide flex items-center gap-2">
                 <Calendar className="w-4 h-4 text-white" />{t(`Ενέργειες`, `Actions`)}</h4>
               <Button variant="outline" className="w-full text-[15px]" size="sm">{t(`Επεξεργασία`, `Edit`)}</Button>
               <Button variant="outline" className="w-full text-[15px]" size="sm">{t(`Αποστολή Ανακοίνωσης`, `Send Announcement`)}</Button>
               <Button variant="outline" className="w-full text-[15px] bg-emerald-50 border-emerald-200 text--400 hover:bg-emerald-100" size="sm">{t(`Δημοσίευση Σημείου Συνάντησης`, `Publish Meeting Point`)}</Button>
               <Button variant="ghost" className="w-full text-[15px] text--400 hover:bg-red-50 hover:text--400" size="sm">{t(`Ακύρωση`, `Cancel Event`)}</Button>
             </div>
          </div>
        </Card>

        <Card className="p-0 overflow-hidden border border-gray-700">
          <div className="p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-gray-800 bg-gray-900/50">
            <div className="flex flex-col">
               <div className="flex items-center gap-2 mb-1">
                 <Badge variant="neutral">Hiking</Badge>
                 <span className="text-[12.5px] text-white font-bold tracking-wide">{t(`Σε 5 μέρες`, `In 5 days`)}</span>
               </div>
               <h3 className="text-[18px] font-bold text-white">{t(`Πεζοπορία στον Υμηττό`, `Hike on Hymettus`)}</h3>
            </div>
            <div className="flex gap-2">
              <span className="text-[15px] font-bold text-white bg-gray-800 px-2 py-1 rounded shadow-sm border border-gray-800">6/8 {t(`θέσεις`, `spots`)}</span>
            </div>
          </div>
          
          <div className="p-4 bg-gray-800 grid grid-cols-1 md:grid-cols-3 gap-4">
             <div className="md:col-span-2 space-y-3">
               <h4 className="text-[15px] font-bold text-white tracking-wide flex items-center gap-2">
                 <Users className="w-4 h-4 text-white" />{t(`Ομάδες`, `Groups`)}</h4>
               
               <div className="flex items-center justify-between p-3 bg-emerald-900/30 rounded border border-emerald-800">
                  <div>
                    <p className="text-[15px] font-bold text-cyan-400">{t(`Ομάδα #1`, `Group #1`)} — 3/4</p>
                    <p className="text-[12.5px] text-cyan-400 mt-0.5">{t(`Νέο μήνυμα`, `New message`)}</p>
                  </div>
                  <div className="flex gap-2">
                    <button className="p-1.5 bg-gray-800 text-cyan-400 rounded shadow-sm border border-cyan-200 hover:bg-emerald-900/50 relative">
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                    </button>
                  </div>
               </div>
             </div>

             <div className="space-y-3">
               <h4 className="text-[15px] font-bold text-white tracking-wide flex items-center gap-2">
                 <MoreHorizontal className="w-4 h-4 text-white" />{t(`Περισσότερα`, `More`)}</h4>
               <Button variant="outline" className="w-full text-[15px]" size="sm">{t(`Επεξεργασία`, `Edit`)}</Button>
               <Button variant="outline" className="w-full text-[15px]" size="sm">{t(`Αρχειοθέτηση`, `Archive`)}</Button>
             </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
