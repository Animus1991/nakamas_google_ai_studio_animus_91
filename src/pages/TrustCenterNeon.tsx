import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { ShieldCheck, Phone, Mail, CreditCard, Award, UserCheck, TrendingUp, Calendar, CheckCircle2 } from 'lucide-react';
import { currentUser } from '../data/mockUsers';
import { useLanguage } from "../lib/i18n";

export default function TrustCenterNeon() {
    const { t } = useLanguage();
  return (
    <div className="mx-auto max-w-full space-y-6 md:space-y-8">
      <div>
        <h1 className="text-[20.104264919475px] md:text-[26.7902365993px] font-bold text-[#111827] tracking-tight">{t(`Κέντρο Εμπιστοσύνης`, `Trust Center`)}</h1>
        <p className="mt-2 text-[16.2px] leading-relaxed text-black max-w-xl">{t(`Η αξιοπιστία σας βασίζεται στις επαληθεύσεις και τις αξιολογήσεις σας.`, `Your trust score is based on your verifications and reviews.`)}</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
         <Card className="p-5 space-y-5">
           <div>
             <h2 className="text-[10.9766035490675px] font-bold text-black tracking-wide mb-3 flex items-center gap-1.5">
               <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />{t(`Κατάσταση Επαλήθευσης`, `Verification Status`)}</h2>
             <p className="text-[16.2px] font-bold text-[#111827]">{currentUser.trustTier}</p>
           </div>
           
           <div className="space-y-3">
             <div className="flex items-center justify-between">
               <div className="flex items-center gap-2 text-[13.5px] text-black font-medium">
                 <Mail className="h-3.5 w-3.5 text-black" /> Email
               </div>
               <Badge variant="success" className="text-[11.2px] px-1.5 py-0.5">{t(`Επαληθευμένο`, `Verified`)}</Badge>
             </div>
             <div className="flex items-center justify-between">
               <div className="flex items-center gap-2 text-[13.5px] text-black font-medium">
                 <Phone className="h-3.5 w-3.5 text-black" />{t(`Τηλέφωνο`, `Phone`)}</div>
               <Badge variant="success" className="text-[11.2px] px-1.5 py-0.5">{t(`Επαληθευμένο`, `Verified`)}</Badge>
             </div>
             <div className="flex items-center justify-between">
               <div className="flex items-center gap-2 text-[13.5px] text-black font-medium">
                 <CreditCard className="h-3.5 w-3.5 text-black" />{t(`Πληρωμή`, `Payment`)}</div>
               <Badge variant="success" className="text-[11.2px] px-1.5 py-0.5">{t(`Επαληθευμένο`, `Verified`)}</Badge>
             </div>
             <div className="flex items-center justify-between">
               <div className="flex items-center gap-2 text-[13.5px] text-black font-medium">
                 <UserCheck className="h-3.5 w-3.5 text-black" />{t(`Ταυτότητα`, `Government ID`)}</div>
               <span className="text-[11.2px] text-cyan-600 font-bold cursor-pointer hover:underline tracking-wide">{t(`Επαλήθευση`, `Verify`)}</span>
             </div>
           </div>
           
           <div className="pt-4 border-t border-gray-100">
             <div className="flex items-center justify-between">
               <div className="flex items-center gap-2 text-[13.8px] font-bold text-[#111827]">
                 <Award className="h-4 w-4 text-amber-500" />{t(`Βαθμός Αξιοπιστίας`, `Reliability Score`)}</div>
               <span className="text-[16.2px] font-bold text-emerald-600">{currentUser.reliabilityScore}%</span>
             </div>
             <p className="text-[13.8px] text-black mt-1.5 font-medium leading-relaxed">{t(`Βασίζεται στις παρουσίες, αξιολογήσεις και συμπεριφορά σας.`, `Based on your attendance, reviews, and behavior.`)}</p>
           </div>
         </Card>

         {/* Radial score + info cards */}
         <div className="space-y-3">
            {/* SVG Radial Score */}
            <Card className="p-5 flex flex-col items-center">
              <svg width="120" height="120" viewBox="0 0 120 120" className="mb-2">
                <circle cx="60" cy="60" r="52" fill="none" stroke="#e5e7eb" strokeWidth="8" />
                <circle cx="60" cy="60" r="52" fill="none" stroke="#10b981" strokeWidth="8" strokeLinecap="round" strokeDasharray={`${(currentUser.reliabilityScore / 100) * 327} 327`} transform="rotate(-90 60 60)" />
                <text x="60" y="56" textAnchor="middle" className="text-[30px] font-black fill-[#111827]" fontSize="28">{currentUser.reliabilityScore}</text>
                <text x="60" y="74" textAnchor="middle" className="fill-gray-400" fontSize="10" fontWeight="600">%</text>
              </svg>
              <p className="text-[12.5px] font-bold text-black tracking-wide">{t(`Βαθμός Αξιοπιστίας`, `Reliability Score`)}</p>
            </Card>

            <Card className="p-4 md:p-5 bg-gray-50 border-none shadow-none">
              <h3 className="text-[12.1964473899675px] font-bold text-[#111827] tracking-wide mb-1.5">{t(`Πώς λειτουργεί`, `How It Works`)}</h3>
              <p className="text-[13.8px] md:text-[13.5px] text-black leading-relaxed">{t(`Κάθε επαλήθευση αυξάνει το επίπεδο εμπιστοσύνης σας, ξεκλειδώνοντας πρόσβαση σε εκδηλώσεις υψηλής ασφάλειας.`, `Each verification raises your trust tier, unlocking access to high-safety events.`)}</p>
            </Card>
            <Card className="p-4 md:p-5 bg-gray-50 border-none shadow-none">
              <h3 className="text-[12.1964473899675px] font-bold text-[#111827] tracking-wide mb-1.5">{t(`Επίπεδα Εμπιστοσύνης`, `Trust Tiers`)}</h3>
              <p className="text-[13.8px] md:text-[13.5px] text-black leading-relaxed">{t(`Newcomer → Verified → Trusted → Super Trusted. Κάθε επίπεδο απαιτεί περισσότερες επαληθεύσεις.`, `Newcomer → Verified → Trusted → Super Trusted. Each tier requires more verifications.`)}</p>
            </Card>
         </div>
      </div>

      {/* Trust History Timeline */}
      <Card className="p-5">
        <h3 className="text-[12.5px] font-bold text-[#111827] tracking-wide mb-4 flex items-center gap-1.5">
          <TrendingUp className="w-3.5 h-3.5 text-cyan-600" />{t(`Ιστορικό Εμπιστοσύνης`, `Trust History`)}
        </h3>
        <div className="space-y-0">
          {[
            { date: t(`9 Μαΐ`, `May 9`), event: t(`Επαλήθευση τηλεφώνου ολοκληρώθηκε`, `Phone verification completed`), positive: true },
            { date: t(`5 Μαΐ`, `May 5`), event: t(`Αξιολογήθηκε 5/5 από ομάδα "Comedy Night"`, `Rated 5/5 by "Comedy Night" group`), positive: true },
            { date: t(`1 Μαΐ`, `May 1`), event: t(`Συμμετοχή σε "Release Athens" επιβεβαιώθηκε`, `Attended "Release Athens" confirmed`), positive: true },
            { date: t(`28 Απρ`, `Apr 28`), event: t(`Email επαλήθευση ολοκληρώθηκε`, `Email verification completed`), positive: true },
            { date: t(`25 Απρ`, `Apr 25`), event: t(`Δημιουργία λογαριασμού — Newcomer`, `Account created — Newcomer`), positive: true },
          ].map((item, i) => (
            <div key={i} className="flex gap-3">
              <div className="flex flex-col items-center">
                <div className={`w-2 h-2 rounded-full mt-1.5 ${item.positive ? 'bg-green-500' : 'bg-red-400'}`} />
                {i < 4 && <div className="w-px flex-1 bg-gray-200" />}
              </div>
              <div className="pb-4">
                <p className="text-[13.8px] font-medium text-[#111827]">{item.event}</p>
                <span className="text-[11.2px] text-black font-medium">{item.date}</span>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
