import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/common/Button';
import { Card } from '../components/common/Card';
import { Star, ShieldAlert, CheckCircle2, Sparkles, Trophy } from 'lucide-react';
import { useLanguage } from "../lib/i18n";

export default function PostEventFeedbackVibrantDark() {
    const { t } = useLanguage();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [overallRating, setOverallRating] = useState(0);
  const [vibeRating, setVibeRating] = useState(0);
  const [mood, setMood] = useState('');
  const [comment, setComment] = useState('');

  const moods = [
    { emoji: '🤩', label: t(`Φανταστικά`, `Amazing`) },
    { emoji: '😊', label: t(`Ωραία`, `Good`) },
    { emoji: '😐', label: t(`Μέτρια`, `Okay`) },
    { emoji: '😕', label: t(`Μέτρια`, `Meh`) },
  ];

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-in slide-in-from-bottom-4 duration-500 fade-in pb-20 md:pb-0">
      <div>
        <h1 className="text-[22.33807213275px] md:text-[24.11121293937px] font-bold tracking-tight text-white">{t(`Αξιολόγηση Εκδήλωσης`, `Post-Event Feedback`)}</h1>
        <p className="text-white font-medium text-[13.551608211075px] md:text-[14.626916949961px] mt-1">{t(`Πείτε μας πώς ήταν η εμπειρία σας`, `Tell us about your experience`)}</p>
      </div>

      {/* XP Reward Banner */}
      <div className="flex items-center gap-3 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-xl p-3">
        <Trophy className="w-5 h-5 text-amber-600 shrink-0" />
        <div className="flex-1">
          <p className="text-[13.233495595550108784px] font-bold text-amber-900">{t(`Κερδίστε +25 XP`, `Earn +25 XP`)}</p>
          <p className="text-[11.2px] text-amber-700 font-medium">{t(`Η αξιολόγηση ανεβάζει το level σας και βοηθά την κοινότητα`, `Rating boosts your level and helps the community`)}</p>
        </div>
        <Sparkles className="w-4 h-4 text-amber-400" />
      </div>

      <Card className="p-6">
        {step === 1 && (
          <div className="space-y-8">
            {/* Emoji Mood */}
            <div>
              <h3 className="text-[16.75971px] font-bold text-white tracking-wide mb-3">{t(`Πώς νιώσατε;`, `How did you feel?`)}</h3>
              <div className="flex gap-3 justify-center">
                {moods.map(m => (
                  <button
                    key={m.emoji}
                    onClick={() => setMood(m.emoji)}
                    className={`flex flex-col items-center gap-1 p-3 rounded-xl border transition-all ${mood === m.emoji ? 'border-cyan-500 bg-emerald-900/30 scale-110 shadow-sm' : 'border-gray-700 hover:border-gray-300'}`}
                  >
                    <span className="text-[30px]">{m.emoji}</span>
                    <span className="text-[10.90125px] font-bold text-white">{m.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-[16.75971px] font-bold text-white tracking-wide mb-4">{t(`Γενική Εντύπωση`, `Overall Experience`)}</h3>
              <p className="text-[14.535px] text-white font-medium mb-3">{t(`Πώς θα βαθμολογούσατε την εκδήλωση;`, `How would you rate the event?`)}</p>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button key={star} onClick={() => setOverallRating(star)} className="p-2 hover:bg-gray-900 rounded-full transition-colors">
                    <Star className={`w-8 h-8 transition-colors ${star <= overallRating ? 'text-amber-400 fill-amber-400' : 'text-white hover:text-amber-400'}`} />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-[16.75971px] font-bold text-white tracking-wide mb-4 mt-6">{t(`Ατμόσφαιρα`, `Vibe`)}</h3>
              <p className="text-[14.535px] text-white font-medium mb-3">{t(`Πώς ήταν η ατμόσφαιρα;`, `How was the atmosphere?`)}</p>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button key={`vibe-${star}`} onClick={() => setVibeRating(star)} className="p-2 hover:bg-gray-900 rounded-full transition-colors">
                    <Star className={`w-8 h-8 transition-colors ${star <= vibeRating ? 'text-cyan-400 fill-cyan-400' : 'text-white hover:text-cyan-400'}`} />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-[16.2px] font-bold text-white tracking-wide mb-4">{t(`Παρουσία`, `Attendance`)}</h3>
              <p className="text-[15px] text-white font-medium mb-3">{t(`Ήταν όλοι παρόντες;`, `Was everyone present?`)}</p>
              <div className="space-y-3 mt-4">
                <label className="flex items-center gap-3 p-3 border border-gray-700 rounded-lg cursor-pointer hover:bg-gray-900">
                  <input type="radio" name="attendance" className="h-4 w-4 text-cyan-400 rounded-full border-gray-300" />
                  <span className="text-[16.2px] font-medium text-white">{t(`Ναι, ήρθαν όλοι`, `Yes, everyone showed up`)}</span>
                </label>
                <label className="flex items-center gap-3 p-3 border border-gray-700 rounded-lg cursor-pointer hover:bg-gray-900">
                  <input type="radio" name="attendance" className="h-4 w-4 text-cyan-400 rounded-full border-gray-300" />
                  <span className="text-[16.2px] font-medium text-white">{t(`Όχι, κάποιοι δεν ήρθαν`, `No, some people didn't show up`)}</span>
                </label>
              </div>
            </div>

            <div>
              <h3 className="text-[16.2px] font-bold text-white tracking-wide mb-4">{t(`Αίσθημα Ασφάλειας`, `Safety Comfort`)}</h3>
              <p className="text-[15px] text-white font-medium mb-3">{t(`Νιώσατε ασφαλείς;`, `Did you feel safe?`)}</p>
              <div className="space-y-3 mt-4">
                <label className="flex items-center gap-3 p-3 border border-emerald-200 bg-emerald-50 rounded-lg cursor-pointer">
                  <input type="radio" name="comfort" className="h-4 w-4 text--400 rounded-full border-gray-300" />
                  <span className="text-[16.2px] font-medium text--400">{t(`Ναι, ένιωσα πλήρως ασφαλής`, `Yes, I felt completely safe`)}</span>
                </label>
                <label className="flex items-center gap-3 p-3 border border-amber-200 bg-amber-50 rounded-lg cursor-pointer">
                  <input type="radio" name="comfort" className="h-4 w-4 text-amber-600 rounded-full border-gray-300" />
                  <span className="text-[16.2px] font-medium text-amber-800 flex items-center gap-2">
                    <ShieldAlert className="w-4 h-4" />{t(`Είχα κάποια ανησυχία`, `I had some concerns`)}</span>
                </label>
              </div>
            </div>

            {/* Optional comment */}
            <div>
              <h3 className="text-[16.2px] font-bold text-white tracking-wide mb-3">{t(`Σχόλιο (προαιρετικό)`, `Comment (optional)`)}</h3>
              <textarea
                value={comment}
                onChange={e => setComment(e.target.value)}
                placeholder={t(`Μοιραστείτε περισσότερα για την εμπειρία σας...`, `Share more about your experience...`)}
                className="w-full px-4 py-2.5 border border-gray-700 rounded-xl text-[16.2px] font-medium focus:outline-none focus:ring-2 focus:ring-cyan-500 resize-none"
                rows={3}
              />
              <p className="text-[11.2px] text-white font-medium mt-1">{t(`Αυτό θα είναι ορατό στον διοργανωτή`, `This will be visible to the organizer`)}</p>
            </div>

            <Button className="w-full" size="lg" onClick={() => setStep(2)}>{t(`Υποβολή Αξιολόγησης`, `Submit Feedback`)}</Button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6 text-center py-8">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50">
              <CheckCircle2 className="h-7 w-7 text--400" />
            </div>
            <div>
              <h2 className="text-[25px] font-bold text-white">{t(`Ευχαριστούμε!`, `Thank You!`)}</h2>
              <p className="mt-2 text-[16.2px] text-white font-medium leading-relaxed max-w-sm mx-auto">{t(`Η αξιολόγησή σας βοηθά στη βελτίωση της εμπειρίας για όλους.`, `Your feedback helps improve the experience for everyone.`)}</p>
            </div>
            <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-xl p-4 max-w-xs mx-auto">
              <div className="flex items-center justify-center gap-2">
                <Trophy className="w-5 h-5 text-amber-600" />
                <span className="text-[16.2px] font-bold text-amber-900">+25 XP</span>
              </div>
              <p className="text-[12.5px] text-amber-700 font-medium mt-1">{t(`Προστέθηκε στο προφίλ σας!`, `Added to your profile!`)}</p>
            </div>
            <div className="pt-4">
              <Button onClick={() => navigate('/history')}>{t(`Πίσω στο Ιστορικό`, `Back to History`)}</Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
