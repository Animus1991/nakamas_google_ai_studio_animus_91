import React, { useState } from 'react';
import { Settings, Bell, Lock, Eye, Globe, Shield, CreditCard, LogOut, Trash2, Smartphone, Mail, MessageSquare, CheckCircle2, Download, Monitor, Laptop, Info } from 'lucide-react';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { useLanguage } from "../lib/i18n";

export default function SettingsAndPrivacyBento() {
    const { t } = useLanguage();
    
  const [show2FASetup, setShow2FASetup] = useState(false);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  
  const [showNotifications, setShowNotifications] = useState(false);
  const [notificationPrefs, setNotificationPrefs] = useState({
    pushMessages: true,
    pushReminders: true,
    pushGroupUpdates: true,
    pushNewEvents: true,
    emailMarketing: false,
    emailUpdates: true
  });

  const [categoryPrefs, setCategoryPrefs] = useState({
    liveMusic: true,
    theater: true,
    hiking: true,
    cinema: false,
    boardGames: true,
    wellness: false,
    festivals: true,
    workshops: false
  });

  const handleTogglePref = (key: keyof typeof notificationPrefs) => {
    setNotificationPrefs(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const sections = [
    {
      title: t(`Ρυθμίσεις Λογαριασμού`, `Account Settings`),
      items: [
        { icon: Globe, label: t(`Γλώσσα & Περιοχή`, `Language & Region`), value: t(`Ελληνικά (GR)`, `Greek (GR)`) },
        { icon: CreditCard, label: t(`Μέθοδοι Πληρωμής`, `Payment Methods`), value: t(`1 αποθηκευμένη κάρτα`, `1 saved card`) },
      ]
    },
    {
      title: t(`Απόρρητο & Ορατότητα`, `Privacy & Visibility`),
      items: [
        { icon: Eye, label: t(`Ορατότητα Προφίλ`, `Profile Visibility`), value: t(`Δημόσιο`, `Public`) },
        { icon: Shield, label: t(`Μπλοκαρισμένοι Χρήστες`, `Blocked Users`), value: t(`Κανένας`, `None`) },
        { icon: Lock, label: t(`Έλεγχος Ταυτότητας 2 Παραγόντων`, `Two-Factor Authentication`), value: twoFactorEnabled ? t(`Ενεργό`, `Active`) : t(`Ανενεργό`, `Inactive`), onClick: () => setShow2FASetup(!show2FASetup) },
      ]
    },
    {
      title: t(`Ειδοποιήσεις`, `Notifications`),
      items: [
        { icon: Bell, label: t(`Προτιμήσεις Ειδοποιήσεων`, `Notification Preferences`), value: t(`Προσαρμοσμένες`, `Custom`), onClick: () => setShowNotifications(!showNotifications) },
      ]
    }
  ];

  return (
    <div className="max-w-full mx-auto space-y-6 animate-in slide-in-from-bottom-4 duration-500 fade-in pb-20 md:pb-0">
      <div className="mb-2">
        <h1 className="text-[20.104264919475px] md:text-[26.7902365993px] font-bold text-[#111827]">{t(`Ρυθμίσεις & Απόρρητο`, `Settings & Privacy`)}</h1>
        <p className="text-black font-medium text-[13.55510121105px] md:text-[14.626916949961px] mt-1">{t(`Διαχειριστείτε τον λογαριασμό σας`, `Manage your account`)}</p>
      </div>

      {sections.map((section, idx) => (
        <div key={idx}>
          <h2 className="text-[12.1125px] font-bold tracking-wider text-black mb-3">{section.title}</h2>
          <Card className="divide-y divide-gray-100">
            {section.items.map((item, i) => {
              const Icon = item.icon;
              return (
                <div key={i} onClick={item.onClick} className={`flex items-center justify-between p-4 ${item.onClick ? 'cursor-pointer hover:bg-gray-50' : ''} transition-colors`}>
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4 text-black" />
                    <span className="text-[14.535px] font-medium text-[#111827]">{item.label}</span>
                  </div>
                  <span className="text-[13.5px] text-black font-medium">{item.value}</span>
                </div>
              );
            })}
          </Card>
        </div>
      ))}

      {show2FASetup && (
        <Card className="p-5 border-cyan-200 bg-cyan-50/30">
          <h3 className="font-bold text-[16.2px] text-[#111827] mb-2">{t(`Ρύθμιση 2FA`, `Setup 2FA`)}</h3>
          <p className="text-[13.5px] text-black mb-4">{t(`Προσθέστε ένα επιπλέον επίπεδο ασφάλειας στον λογαριασμό σας`, `Add an extra layer of security to your account`)}</p>
          <Button size="sm" onClick={() => { setTwoFactorEnabled(true); setShow2FASetup(false); }}>
            {t(`Ενεργοποίηση`, `Enable`)}
          </Button>
        </Card>
      )}

      {showNotifications && (
        <div className="space-y-4">
          <Card className="p-5">
            <h3 className="font-bold text-[16.2px] text-[#111827] mb-4">{t(`Γενικές Ειδοποιήσεις`, `General Notifications`)}</h3>
            <div className="space-y-3">
              {[
                { key: 'pushMessages', label: t(`Μηνύματα ομάδας`, `Group messages`) },
                { key: 'pushReminders', label: t(`Υπενθυμίσεις εκδηλώσεων`, `Event reminders`) },
                { key: 'pushGroupUpdates', label: t(`Ενημερώσεις σχηματισμού ομάδας`, `Group formation updates`) },
                { key: 'pushNewEvents', label: t(`Νέες εκδηλώσεις κοντά μου`, `New events nearby`) },
                { key: 'emailMarketing', label: t(`Email προωθητικά`, `Promotional emails`) },
                { key: 'emailUpdates', label: t(`Email ενημερώσεις`, `Email updates`) },
              ].map(({ key, label }) => (
                <label key={key} className="flex items-center justify-between">
                  <span className="text-[13.5px] text-black font-medium">{label}</span>
                  <div className={`relative w-9 h-5 rounded-full transition-colors cursor-pointer ${notificationPrefs[key as keyof typeof notificationPrefs] ? 'bg-cyan-600' : 'bg-gray-300'}`} onClick={() => handleTogglePref(key as keyof typeof notificationPrefs)}>
                    <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${notificationPrefs[key as keyof typeof notificationPrefs] ? 'translate-x-4' : 'translate-x-0.5'}`} />
                  </div>
                </label>
              ))}
            </div>
          </Card>

          <Card className="p-5">
            <h3 className="font-bold text-[16.2px] text-[#111827] mb-1">{t(`Κατηγορίες Ενδιαφέροντος`, `Category Subscriptions`)}</h3>
            <p className="text-[12.5px] text-black font-medium mb-4">{t(`Ειδοποίηση μόνο για εκδηλώσεις στις κατηγορίες που σας ενδιαφέρουν`, `Get notified only for events in categories you care about`)}</p>
            <div className="grid grid-cols-2 gap-2">
              {[
                { key: 'liveMusic', label: t(`Μουσική`, `Live Music`) },
                { key: 'theater', label: t(`Θέατρο`, `Theater`) },
                { key: 'hiking', label: t(`Πεζοπορία`, `Hiking`) },
                { key: 'cinema', label: t(`Σινεμά`, `Cinema`) },
                { key: 'boardGames', label: t(`Επιτραπέζια`, `Board Games`) },
                { key: 'wellness', label: t(`Ευεξία`, `Wellness`) },
                { key: 'festivals', label: t(`Φεστιβάλ`, `Festivals`) },
                { key: 'workshops', label: t(`Εργαστήρια`, `Workshops`) },
              ].map(({ key, label }) => (
                <button
                  key={key}
                  onClick={() => setCategoryPrefs(prev => ({ ...prev, [key]: !prev[key as keyof typeof categoryPrefs] }))}
                  className={`px-3 py-1.5 rounded-full text-[12.5px] font-bold border transition-colors ${
                    categoryPrefs[key as keyof typeof categoryPrefs]
                      ? 'bg-cyan-50 border-cyan-300 text-cyan-700'
                      : 'bg-white border-gray-200 text-black'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </Card>
        </div>
      )}

      {/* Active Sessions */}
      <div>
        <h2 className="text-[13.5px] font-bold tracking-wider text-black mb-3">{t(`Ενεργές Συνεδρίες`, `Active Sessions`)}</h2>
        <Card className="divide-y divide-gray-100">
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center gap-3">
              <Smartphone className="w-4 h-4 text-cyan-600" />
              <div>
                <span className="text-[16.2px] font-medium text-[#111827]">iPhone 15 Pro</span>
                <p className="text-[12.5px] text-black font-medium">Athens, GR • {t(`Τώρα`, `Now`)}</p>
              </div>
            </div>
            <span className="text-[11.2px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">{t(`Τρέχουσα`, `Current`)}</span>
          </div>
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center gap-3">
              <Laptop className="w-4 h-4 text-black" />
              <div>
                <span className="text-[16.2px] font-medium text-[#111827]">Chrome • Windows</span>
                <p className="text-[12.5px] text-black font-medium">Athens, GR • 2h {t(`πριν`, `ago`)}</p>
              </div>
            </div>
            <button className="text-[11.2px] font-bold text-red-500 hover:text-red-700">{t(`Αποσύνδεση`, `Log out`)}</button>
          </div>
        </Card>
      </div>

      {/* Data Export */}
      <div>
        <h2 className="text-[13.5px] font-bold tracking-wider text-black mb-3">{t(`Δεδομένα`, `Data`)}</h2>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Download className="w-4 h-4 text-black" />
              <div>
                <span className="text-[16.2px] font-medium text-[#111827]">{t(`Εξαγωγή δεδομένων`, `Export your data`)}</span>
                <p className="text-[12.5px] text-black font-medium">{t(`Κατεβάστε αντίγραφο των δεδομένων σας`, `Download a copy of your data`)}</p>
              </div>
            </div>
            <Button variant="outline" size="sm" className="text-[12.5px]">{t(`Λήψη`, `Download`)}</Button>
          </div>
        </Card>
      </div>

      <div className="pt-4 space-y-3">
        <Button variant="outline" className="w-full text-red-600 border-red-200 hover:bg-red-50">
          <LogOut className="w-4 h-4 mr-2" /> {t(`Αποσύνδεση`, `Log out`)}
        </Button>
        <button className="w-full text-[13.5px] text-red-400 font-medium hover:text-red-600 transition-colors py-2">
          {t(`Διαγραφή λογαριασμού`, `Delete account`)}
        </button>
      </div>

      {/* App Version */}
      <div className="text-center pt-2 pb-4">
        <div className="flex items-center justify-center gap-1 text-[12.5px] text-black font-medium">
          <Info className="w-3 h-3" />
          <span>Parea v1.2.0 • Build 2024.10</span>
        </div>
      </div>
    </div>
  );
}
