import React from 'react';
import { CreditCard, Euro, ArrowUpRight, ArrowDownRight, Clock, Building2, CheckCircle2 } from 'lucide-react';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { useLanguage } from '../lib/i18n';

export default function WalletVibrant() {
  const { t } = useLanguage();
  const transactions = [
    { id: '1', type: 'Payout', amount: 120.00, status: t('Ολοκληρώθηκε', 'Completed'), date: 'Oct 12, 2024', desc: t('Μεταφορά στην τράπεζα με κατάληξη 4092', 'Transfer to Bank ending in 4092') },
    { id: '2', type: 'Earnings', amount: 45.00, status: t('Διαθέσιμο', 'Available'), date: 'Oct 10, 2024', desc: t('Πωλήσεις: Yoga στο Πάρκο', 'Ticket sales: Yoga in the Park') },
    { id: '3', type: 'Earnings', amount: 25.00, status: t('Σε Επεξεργασία', 'Processing'), date: 'Oct 14, 2024', desc: t('Πωλήσεις: Comedy Night', 'Ticket sales: Comedy Night') },
  ];

  return (
    <div className="max-w-full mx-auto space-y-6 animate-in slide-in-from-bottom-4 duration-500 fade-in pb-20 md:pb-0">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-[#111827]">{t('Πορτοφόλι & Έσοδα', 'Wallet & Earnings')}</h1>
          <p className="text-black font-medium text-xs md:text-sm mt-1">{t('Διαχειριστείτε τα έσοδα και τις πληρωμές σας.', 'Manage your event revenue and payouts.')}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-6 bg-cyan-600 text-white border-0 shadow-md">
          <div className="flex items-center gap-2 text-cyan-100 mb-2">
            <Euro className="w-4 h-4" />
            <h3 className="text-xs font-bold tracking-wide">{t('Διαθέσιμο Υπόλοιπο', 'Available Balance')}</h3>
          </div>
          <p className="text-4xl font-black mb-4">€345.50</p>
          <Button className="w-full bg-white text-cyan-900 hover:bg-gray-100 border-0">
            {t('Ανάληψη χρημάτων', 'Withdraw Funds')}
          </Button>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-2 text-black mb-2">
            <Clock className="w-4 h-4" />
            <h3 className="text-xs font-bold tracking-wide">{t('Εκκρεμεί εξόφληση', 'Pending Clearing')}</h3>
          </div>
          <p className="text-3xl font-bold text-black mb-2">€85.00</p>
          <p className="text-[10px] text-black font-medium leading-tight">
            {t('Έσοδα από πρόσφατες εκδηλώσεις. Εξοφλούνται 3-5 ημέρες μετά την ολοκλήρωση.', 'Revenue from recently completed events. Clears 3-5 days after event completion.')}
          </p>
        </Card>

        <Card className="p-6 border border-gray-200 bg-gray-50 flex flex-col justify-center">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-white shadow-sm border border-gray-200 rounded-full flex items-center justify-center text-black">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-[#111827]">{t('Τραπεζικός λογαριασμός', 'Bank Account')}</h3>
              <p className="text-xs text-black font-medium">Chase ****4092</p>
            </div>
          </div>
          <Button variant="outline" size="sm" className="w-full text-xs">{t('Διαχείριση μεθόδων πληρωμής', 'Manage Payout Methods')}</Button>
        </Card>
      </div>

      <Card className="mt-8">
        <div className="p-4 md:p-6 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-lg font-bold text-[#111827]">{t('Πρόσφατες Συναλλαγές', 'Recent Transactions')}</h2>
          <select className="text-xs border border-gray-200 rounded-lg px-2 py-1 outline-none">
            <option>{t('Όλες', 'All Time')}</option>
            <option>{t('Αυτόν τον Μήνα', 'This Month')}</option>
            <option>{t('Προηγούμενο Μήνα', 'Last Month')}</option>
          </select>
        </div>
        <div className="divide-y divide-gray-100">
          {transactions.map((tx) => (
            <div key={tx.id} className="p-4 md:p-6 flex items-center justify-between hover:bg-gray-50 transition-colors">
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${tx.type === 'Payout' ? 'bg-rose-50 text-rose-600' : 'bg-emerald-50 text-emerald-600'}`}>
                  {tx.type === 'Payout' ? <ArrowUpRight className="w-5 h-5" /> : <ArrowDownRight className="w-5 h-5" />}
                </div>
                <div>
                  <h4 className="font-bold text-[#111827] text-sm">{tx.desc}</h4>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[10px] text-black font-bold tracking-wide">{tx.date}</span>
                    <span className="text-[10px] text-black">•</span>
                    <span className="text-[10px] text-black font-medium flex items-center justify-center gap-1">
                      {tx.status === t('Ολοκληρώθηκε', 'Completed') || tx.status === t('Διαθέσιμο', 'Available')
                        ? <CheckCircle2 className="w-3 h-3 text-emerald-500"/>
                        : <Clock className="w-3 h-3 text-amber-500"/>}
                      {tx.status}
                    </span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p className={`font-bold ${tx.type === 'Payout' ? 'text-[#111827]' : 'text-emerald-600'}`}>
                  {tx.type === 'Payout' ? '-' : '+'}€{tx.amount.toFixed(2)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
