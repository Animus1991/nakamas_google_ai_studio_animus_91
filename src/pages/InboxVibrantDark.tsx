import React, { useState } from 'react';
import { Search, MessageSquare, Flame, CheckCircle2, Ghost, Plus, Pin, Clock, AlertTriangle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from "../lib/i18n";

export default function InboxVibrantDark() {
    const { t } = useLanguage();
    
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState<'active' | 'past'>('active');

  const chats = [
    {
      id: 'g1',
      title: t(`Παράσταση Κωμωδίας`, `Comedy Show`),
      lastMessage: t(`Nikos: Θα συναντηθούμε στην είσοδο;`, `Nikos: Shall we meet at the entrance?`),
      time: '12:30 ΜΜ',
      unread: 3,
      image: 'https://picsum.photos/seed/comedy/500/500',
      participants: 6,
      status: 'active',
      isPinned: true,
      timeRemaining: t(`12 ώρες`, `12 hours`),
      online: 4,
      isTyping: true
    },
    {
      id: 'g2',
      title: t(`Καφετέρια με Επιτραπέζια`, `Board Game Cafe`),
      lastMessage: t(`Εσύ: Θα φέρω το Catan!`, `You: I\'ll bring Catan!`),
      time: t(`Χθες`, `Yesterday`),
      unread: 0,
      image: 'https://picsum.photos/seed/boardgame/500/500',
      participants: 4,
      status: 'active',
      isPinned: false,
      timeRemaining: t(`2 μέρες`, `2 days`),
      online: 2,
      isTyping: false
    },
    {
      id: 'g3',
      title: t(`Πρωινή Πεζοπορία Κυριακής`, `Sunday Morning Hike`),
      lastMessage: t(`Μαρία: Τέλεια διαδρομή παιδιά, ευχαριστώ!`, `Maria: Great trail guys, thanks!`),
      time: '14 Οκτ',
      unread: 0,
      image: 'https://picsum.photos/seed/hike/500/500',
      participants: 8,
      status: 'past',
      isPinned: false,
      online: 0,
      isTyping: false
    }
  ];

  const filteredChats = chats.filter(c => c.status === activeTab && c.title.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="w-full flex flex-col relative pb-20 md:pb-0">
      <div className="shrink-0 mb-6">
        <div className="flex items-end justify-between mb-4">
          <div>
            <h1 className="text-[20.104264919475px] md:text-[24.11121293937px] font-bold text-white tracking-tight">{t(`Μηνύματα`, `Messages`)}</h1>
            <p className="text-white font-medium text-[12.1964473899675px] md:text-[14.626916949961px] mt-1">{t(`Συνομιλίες ομάδων`, `Group conversations`)}</p>
          </div>
        </div>

        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder={t(`Αναζήτηση συνομιλιών...`, `Search conversations...`)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-700 text-[16.2px] font-medium focus:outline-none focus:ring-2 focus:ring-cyan-500"
          />
        </div>

        <div className="flex bg-gray-700 p-1 rounded-lg w-fit">
          <button onClick={() => setActiveTab('active')} className={`px-4 py-1.5 rounded-md text-[13.5px] font-bold transition-colors ${activeTab === 'active' ? 'bg-gray-800 shadow-sm text-white' : 'text-white'}`}>
            {t(`Ενεργές`, `Active`)}
          </button>
          <button onClick={() => setActiveTab('past')} className={`px-4 py-1.5 rounded-md text-[13.5px] font-bold transition-colors ${activeTab === 'past' ? 'bg-gray-800 shadow-sm text-white' : 'text-white'}`}>
            {t(`Παλαιότερες`, `Past`)}
          </button>
        </div>
      </div>

      <div className="space-y-2">
        {filteredChats.length === 0 ? (
          <div className="text-center py-12">
            <MessageSquare className="w-10 h-10 text-white mx-auto mb-3" />
            <p className="text-[18px] text-white font-medium">{t(`Δεν υπάρχουν συνομιλίες`, `No conversations`)}</p>
          </div>
        ) : (
          filteredChats.map(chat => (
            <div
              key={chat.id}
              onClick={() => navigate(`/chat/${chat.id}`)}
              className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-900 cursor-pointer transition-colors border border-transparent hover:border-gray-800"
            >
              <div className="relative shrink-0">
                <img src={chat.image} alt={chat.title} className="w-12 h-12 rounded-full object-cover" />
                {chat.isPinned && <Pin className="absolute -top-1 -right-1 w-3.5 h-3.5 text-cyan-400 fill-cyan-600" />}
                {chat.online > 0 && (
                  <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h3 className={`text-[14.52px] ${chat.unread > 0 ? 'font-bold text-white' : 'font-medium text-white'}`}>{chat.title}</h3>
                  <span className="text-[11.25px] text-white font-medium shrink-0 ml-2">{chat.time}</span>
                </div>
                {chat.isTyping ? (
                  <p className="text-[13.5px] text-cyan-400 font-medium mt-0.5 flex items-center gap-1">
                    <span className="flex gap-0.5">
                      <span className="w-1 h-1 bg-cyan-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <span className="w-1 h-1 bg-cyan-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <span className="w-1 h-1 bg-cyan-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </span>
                    {t(`κάποιος γράφει...`, `someone is typing...`)}
                  </p>
                ) : (
                  <p className="text-[12.42px] text-white truncate mt-0.5">{chat.lastMessage}</p>
                )}
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-[11.25px] text-white font-medium">{chat.participants} {t(`μέλη`, `members`)}</span>
                  {chat.online > 0 && <span className="text-[11.25px] text-green-500 font-bold">{chat.online} online</span>}
                  {chat.timeRemaining && <span className="text-[11.25px] text-cyan-400 font-bold flex items-center gap-0.5"><Clock className="w-3 h-3" />{chat.timeRemaining}</span>}
                </div>
              </div>
              {chat.unread > 0 && (
                <span className="bg-cyan-600 text-white text-[12.5px] font-bold w-5 h-5 flex items-center justify-center rounded-full shrink-0">{chat.unread}</span>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
