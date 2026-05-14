import React, { useState } from 'react';
import { Card } from '../components/common/Card';
import { Trophy, Star, Flame, Users, Calendar, Shield, Target, Zap, Award, TrendingUp, Share2, Sparkles } from 'lucide-react';
import { useLanguage } from "../lib/i18n";

interface Achievement {
  id: string;
  icon: React.ElementType;
  title: string;
  description: string;
  progress: number;
  maxProgress: number;
  unlocked: boolean;
  xp: number;
  color: string;
}

export default function AchievementsBentoDark() {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<'badges' | 'streaks' | 'leaderboard'>('badges');

  const achievements: Achievement[] = [
    { id: 'a1', icon: Calendar, title: t(`Πρώτη Εμπειρία`, `First Experience`), description: t(`Συμμετείχατε στην πρώτη σας εκδήλωση`, `Attended your first event`), progress: 1, maxProgress: 1, unlocked: true, xp: 50, color: 'text-emerald-400 bg-emerald-900/50' },
    { id: 'a2', icon: Users, title: t(`Κοινωνική Πεταλούδα`, `Social Butterfly`), description: t(`Γίνετε μέλος σε 5 διαφορετικές ομάδες`, `Join 5 different groups`), progress: 5, maxProgress: 5, unlocked: true, xp: 100, color: 'text--400 bg-purple-100' },
    { id: 'a3', icon: Star, title: t(`Αστέρι Αξιοπιστίας`, `Reliability Star`), description: t(`Διατηρήστε 95%+ αξιοπιστία`, `Maintain 95%+ reliability score`), progress: 98, maxProgress: 95, unlocked: true, xp: 200, color: 'text-amber-600 bg-amber-100' },
    { id: 'a4', icon: Flame, title: t(`Εβδομαδιαίο Σερί`, `Weekly Streak`), description: t(`Συμμετοχή σε εκδηλώσεις 4 εβδομάδες σερί`, `Attend events for 4 weeks in a row`), progress: 3, maxProgress: 4, unlocked: false, xp: 150, color: 'text--400 bg-orange-100' },
    { id: 'a5', icon: Shield, title: t(`Αξιόπιστο Μέλος`, `Trusted Member`), description: t(`Επαληθεύστε ταυτότητα + τηλέφωνο + email`, `Verify ID + phone + email`), progress: 2, maxProgress: 3, unlocked: false, xp: 75, color: 'text--400 bg-green-100' },
    { id: 'a6', icon: Target, title: t(`Εξερευνητής`, `Explorer`), description: t(`Δοκιμάστε 4 διαφορετικές κατηγορίες`, `Try 4 different event categories`), progress: 3, maxProgress: 4, unlocked: false, xp: 120, color: 'text--400 bg-indigo-100' },
    { id: 'a7', icon: Trophy, title: t(`Πρωτοπόρος`, `Trailblazer`), description: t(`Δημιουργήστε μια ομάδα που γέμισε`, `Create a group that filled up`), progress: 1, maxProgress: 1, unlocked: true, xp: 100, color: 'text--400 bg-rose-100' },
    { id: 'a8', icon: Zap, title: t(`Αστραπή`, `Lightning`), description: t(`Εγγραφή σε εκδήλωση μέσα σε 1 λεπτό`, `Join an event within 1 minute of posting`), progress: 0, maxProgress: 1, unlocked: false, xp: 80, color: 'text--400 bg-yellow-100' },
  ];

  const totalXP = achievements.filter(a => a.unlocked).reduce((sum, a) => sum + a.xp, 0);
  const level = Math.floor(totalXP / 200) + 1;
  const levelProgress = (totalXP % 200) / 200 * 100;

  const streakDays = [true, true, true, false, false, false, false];

  const leaderboard = [
    { rank: 1, name: 'Elena M.', xp: 1250, avatar: 'https://i.pravatar.cc/32?u=lb1' },
    { rank: 2, name: 'Dimitris K.', xp: 980, avatar: 'https://i.pravatar.cc/32?u=lb2' },
    { rank: 3, name: 'Sofia A.', xp: 870, avatar: 'https://i.pravatar.cc/32?u=lb3' },
    { rank: 4, name: t(`Εσείς`, `You`), xp: totalXP, avatar: 'https://i.pravatar.cc/32?u=me' },
    { rank: 5, name: 'Kostas R.', xp: 420, avatar: 'https://i.pravatar.cc/32?u=lb5' },
  ];

  return (
    <div className="mx-auto max-w-full space-y-6 animate-in slide-in-from-bottom-4 duration-500 fade-in pb-20 md:pb-0">
      <div>
        <h1 className="text-[20.104264919475px] md:text-[26.7902365993px] font-bold text-white">{t(`Επιτεύγματα`, `Achievements`)}</h1>
        <p className="text-white font-medium text-[13.551608211075px] md:text-[16.25212883329px] mt-1">{t(`Κερδίστε badges και XP μέσα από συμμετοχές`, `Earn badges and XP through participation`)}</p>
      </div>

      {/* Level progress */}
      <Card className="p-5">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500 to-purple-500 flex items-center justify-center text-white font-black text-[18px]">
              {level}
            </div>
            <div>
              <p className="text-[18px] font-bold text-white">{t(`Επίπεδο`, `Level`)} {level}</p>
              <p className="text-[12.1125px] text-white font-medium">{totalXP} XP {t(`συνολικά`, `total`)}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-[12.1125px] font-bold text-white tracking-wide">{t(`Επόμενο επίπεδο`, `Next level`)}</p>
            <p className="text-[14.535px] font-bold text-white">{200 - (totalXP % 200)} XP</p>
          </div>
        </div>
        <div className="w-full bg-gray-800 border border-gray-700 h-2 rounded-full overflow-hidden">
          <div className="bg-gradient-to-r from-cyan-500 to-purple-500 h-full rounded-full transition-all" style={{ width: `${levelProgress}%` }} />
        </div>
      </Card>

      {/* Daily Challenge */}
      <Card className="p-4 bg-gradient-to-r from-purple-50 to-cyan-50 border border-purple-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-gray-800 border-gray-700 text-white shadow-sm flex items-center justify-center">
              <Sparkles className="w-4 h-4 text--400" />
            </div>
            <div>
              <p className="text-[13.8px] font-bold text-white">{t(`Ημερήσια Πρόκληση`, `Daily Challenge`)}</p>
              <p className="text-[11.2px] text-white font-medium">{t(`Στείλε μήνυμα σε μια ομάδα σήμερα`, `Send a message in a group today`)}</p>
            </div>
          </div>
          <div className="text-right">
            <span className="text-[12.5px] font-black text--400">+30 XP</span>
            <div className="w-16 bg-gray-200 h-1 rounded-full mt-1 overflow-hidden">
              <div className="w-0 bg-purple-500 h-full rounded-full" />
            </div>
          </div>
        </div>
      </Card>

      {/* Tabs */}
      <div className="flex gap-4 border-b border-gray-700">
        {[
          { key: 'badges' as const, label: t(`Badges`, `Badges`) },
          { key: 'streaks' as const, label: t(`Σερί`, `Streaks`) },
          { key: 'leaderboard' as const, label: t(`Κατάταξη`, `Leaderboard`) },
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`pb-3 text-[13.5px] font-bold tracking-wide transition-colors whitespace-nowrap ${
              activeTab === tab.key ? 'border-b-2 border-cyan-600 text-emerald-400' : 'text-white hover:text-white'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'badges' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {achievements.map(a => {
            const Icon = a.icon;
            const pct = Math.min(100, (a.progress / a.maxProgress) * 100);
            return (
              <Card key={a.id} className={`p-4 transition-all ${a.unlocked ? 'border-gray-700' : 'opacity-60'}`}>
                <div className="flex items-start gap-3">
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${a.color}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="text-[13.5px] font-bold text-white truncate">{a.title}</h4>
                      {a.unlocked && <Award className="w-3 h-3 text-amber-500 shrink-0" />}
                    </div>
                    <p className="text-[12.5px] text-white font-medium mt-0.5 line-clamp-1">{a.description}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <div className="flex-1 bg-gray-800 border border-gray-700 h-1.5 rounded-full overflow-hidden">
                        <div className={`h-full rounded-full transition-all ${a.unlocked ? 'bg-cyan-500' : 'bg-gray-300'}`} style={{ width: `${pct}%` }} />
                      </div>
                      <span className="text-[11.2px] font-bold text-white">{a.progress}/{a.maxProgress}</span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1 shrink-0">
                    <span className="text-[11.2px] font-bold text-emerald-400 bg-emerald-900/30 px-1.5 py-0.5 rounded">+{a.xp}XP</span>
                    {a.unlocked && (
                      <button className="text-[10px] font-bold text-white hover:text-emerald-400 flex items-center gap-0.5 transition-colors">
                        <Share2 className="w-2.5 h-2.5" />{t(`Κοινοπ.`, `Share`)}
                      </button>
                    )}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {activeTab === 'streaks' && (
        <div className="space-y-4">
          <Card className="p-5">
            <div className="flex items-center gap-3 mb-4">
              <Flame className="w-5 h-5 text-orange-500" />
              <div>
                <p className="text-[18px] font-bold text-white">3 {t(`ημέρες σερί`, `day streak`)}</p>
                <p className="text-[12.5px] text-white font-medium">{t(`Συνεχίστε να συμμετέχετε!`, `Keep participating!`)}</p>
              </div>
            </div>
            <div className="flex gap-2 justify-between">
              {[t(`Δε`, `Mo`), t(`Τρ`, `Tu`), t(`Τε`, `We`), t(`Πε`, `Th`), t(`Πα`, `Fr`), t(`Σα`, `Sa`), t(`Κυ`, `Su`)].map((day, i) => (
                <div key={i} className="flex flex-col items-center gap-1">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[12.5px] font-bold ${
                    streakDays[i] ? 'bg-orange-100 text--400 border-2 border-orange-300' : 'bg-gray-800 border border-gray-700 text-white'
                  }`}>
                    {streakDays[i] ? <Flame className="w-3.5 h-3.5" /> : ''}
                  </div>
                  <span className="text-[11.2px] font-medium text-white">{day}</span>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-5">
            <h3 className="text-[13.5px] font-bold text-white mb-3">{t(`Στατιστικά Σερί`, `Streak Stats`)}</h3>
            <div className="grid grid-cols-3 gap-3">
              <div className="text-center">
                <p className="text-[23px] font-black text-white">3</p>
                <p className="text-[11.2px] text-white font-medium">{t(`Τρέχον`, `Current`)}</p>
              </div>
              <div className="text-center">
                <p className="text-[23px] font-black text-white">7</p>
                <p className="text-[11.2px] text-white font-medium">{t(`Μέγιστο`, `Longest`)}</p>
              </div>
              <div className="text-center">
                <p className="text-[23px] font-black text-white">12</p>
                <p className="text-[11.2px] text-white font-medium">{t(`Εκδηλώσεις`, `Events`)}</p>
              </div>
            </div>
          </Card>
        </div>
      )}

      {activeTab === 'leaderboard' && (
        <Card className="p-0 overflow-hidden">
          {leaderboard.map((entry, i) => (
            <div key={entry.rank} className={`flex items-center gap-3 px-4 py-3 border-b border-gray-50 last:border-0 ${entry.rank === 4 ? 'bg-emerald-900/30/50' : ''}`}>
              <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[12.5px] font-black ${
                entry.rank === 1 ? 'bg-amber-100 text-amber-700' :
                entry.rank === 2 ? 'bg-gray-200 text-white' :
                entry.rank === 3 ? 'bg-orange-100 text--400' : 'bg-gray-800 border border-gray-700 text-white'
              }`}>
                {entry.rank}
              </span>
              <img src={entry.avatar} alt="" className="w-7 h-7 rounded-full border border-gray-700" />
              <span className={`flex-1 text-[13.5px] font-medium ${entry.rank === 4 ? 'font-bold text-emerald-400' : 'text-white'}`}>{entry.name}</span>
              <span className="text-[12.5px] font-bold text-white">{entry.xp} XP</span>
              {entry.rank <= 3 && <Trophy className={`w-3.5 h-3.5 ${entry.rank === 1 ? 'text-amber-500' : entry.rank === 2 ? 'text-white' : 'text-orange-400'}`} />}
            </div>
          ))}
        </Card>
      )}
    </div>
  );
}
