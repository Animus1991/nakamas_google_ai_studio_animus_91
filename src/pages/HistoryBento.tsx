import React from 'react';
import { History as HistoryIcon, MapPin, Calendar, Clock, Star, MessageSquare, ThumbsUp, CheckCircle2 } from 'lucide-react';
import { mockEvents } from '../data/mockEvents';
import { format, parseISO } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from "../lib/i18n";
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';

export default function HistoryBento() {
    const { t } = useLanguage();
    
  const pastEvents = mockEvents.slice(0, 3);
  const navigate = useNavigate();
  const feedbackStatus: Record<string, { given: boolean; rating?: number }> = {
    'e1': { given: true, rating: 5 },
    'e2': { given: true, rating: 4 },
    'e3': { given: false },
  };

  return (
    <div className="max-w-full mx-auto space-y-6 animate-in slide-in-from-bottom-4 duration-500 fade-in pb-20 md:pb-0">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-[20.104264919475px] md:text-[26.7902365993px] font-bold text-[#111827]">{t(`Ιστορικό`, `History`)}</h1>
          <p className="text-black font-medium text-[13.551608211075px] md:text-[14.626916949961px] mt-1">{t(`Εκδηλώσεις που έχετε παρακολουθήσει`, `Events you've attended`)}</p>
        </div>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-3 gap-3">
        <Card className="p-3 text-center">
          <p className="text-[23px] font-black text-[#111827]">3</p>
          <p className="text-[11.2px] text-black font-medium tracking-wide">{t(`Εκδηλώσεις`, `Events`)}</p>
        </Card>
        <Card className="p-3 text-center">
          <p className="text-[23px] font-black text-[#111827]">4.5</p>
          <p className="text-[11.2px] text-black font-medium tracking-wide">{t(`Μ.Ο. Βαθμολογία`, `Avg Rating`)}</p>
        </Card>
        <Card className="p-3 text-center">
          <p className="text-[23px] font-black text-[#111827]">14</p>
          <p className="text-[11.2px] text-black font-medium tracking-wide">{t(`Άτομα`, `People Met`)}</p>
        </Card>
      </div>

      <div className="space-y-3">
        {pastEvents.map((event) => (
          <Card key={event.id} className="p-4 hover:border-cyan-200 transition-colors cursor-pointer" onClick={() => navigate(`/history/feedback/${event.id}`)}>
            <div className="flex gap-4">
              <img src={event.imageUrl} alt={event.title} className="w-16 h-16 rounded-xl object-cover shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <Badge variant="neutral" className="text-[12.1125px]">{event.category}</Badge>
                  <Badge variant="success" className="text-[12.1125px]">{t(`Ολοκληρώθηκε`, `Completed`)}</Badge>
                </div>
                <h3 className="font-bold text-[16.75971px] text-[#111827] truncate">{event.title}</h3>
                <div className="flex flex-wrap items-center gap-3 mt-1.5 text-[12.1125px] text-black font-medium">
                  <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{format(parseISO(event.date), 'dd MMM yyyy')}</span>
                  <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{event.locationArea}</span>
                  {feedbackStatus[event.id]?.given && feedbackStatus[event.id]?.rating && (
                    <span className="flex items-center gap-0.5">
                      {Array.from({ length: feedbackStatus[event.id]!.rating! }).map((_, s) => <Star key={s} className="w-2.5 h-2.5 text-amber-500 fill-amber-500" />)}
                    </span>
                  )}
                </div>
              </div>
              <div className="self-center shrink-0">
                {feedbackStatus[event.id]?.given ? (
                  <span className="flex items-center gap-1 text-[11.2px] font-bold text-green-600 bg-green-50 px-2 py-1 rounded-full">
                    <CheckCircle2 className="w-3 h-3" />{t(`Αξιολογήθηκε`, `Reviewed`)}
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-[11.2px] font-bold text-amber-600 bg-amber-50 px-2 py-1 rounded-full">
                    <Star className="w-3 h-3" />{t(`Εκκρεμεί`, `Pending`)}
                  </span>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
