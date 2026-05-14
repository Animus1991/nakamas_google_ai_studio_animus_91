import React, { useState } from 'react';
import { Users, Search, MessageCircle, MoreVertical, Coffee, MapPin, Calendar, UserPlus, Filter } from 'lucide-react';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { useStore } from '../store';
import { useLanguage } from '../lib/i18n';

export default function MyConnectionsVibrant() {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<'all' | 'requests'>('all');
  const users = useStore((state) => state.users);
  const currentUser = useStore((state) => state.currentUser);
  
  // Calculate mutual connections
  const calculateMutualConnections = (userConnections: string[] = []) => {
    const myConnections = currentUser.connections || [];
    // The mutual count is the intersection of myConnections and their connections
    const mutuals = myConnections.filter(id => userConnections.includes(id) && id !== currentUser.id);
    return mutuals.length;
  };

  // Map to format
  const connections = users.filter(u => u.id !== currentUser.id).map(u => ({
    id: u.id,
    name: u.name,
    role: u.isOrganizer ? t('Διοργανωτής', 'Organizer') : (u.reliabilityScore > 80 ? t('Εξερευνητής', 'Explorer') : t('Αρχάριος', 'Newbie')),
    mutual: calculateMutualConnections(u.connections),
    location: u.city || 'Downtown',
    image: u.photoUrl || `https://i.pravatar.cc/150?u=${u.id}`
  }));

  return (
    <div className="max-w-full mx-auto space-y-6 animate-in slide-in-from-bottom-4 duration-500 fade-in pb-20 md:pb-0">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-[#111827]">{t('Οι Συνδέσεις μου', 'My Nakamas')}</h1>
          <p className="text-black font-medium text-xs md:text-sm mt-1">{t('Άτομα με τα οποία συνδεθήκατε μέσα από εκδηλώσεις.', 'People you\'ve connected with through events.')}</p>
        </div>
      </div>

      <div className="flex gap-4 border-b border-gray-200">
        <button 
          className={`pb-3 text-sm font-bold border-b-2 transition-colors ${activeTab === 'all' ? 'border-cyan-600 text-cyan-600' : 'border-transparent text-black hover:text-black'}`}
          onClick={() => setActiveTab('all')}
        >
          {t('Συνδέσεις', 'Connections')} ({connections.length})
        </button>
        <button 
          className={`pb-3 text-sm font-bold border-b-2 transition-colors flex items-center gap-2 ${activeTab === 'requests' ? 'border-cyan-600 text-cyan-600' : 'border-transparent text-black hover:text-black'}`}
          onClick={() => setActiveTab('requests')}
        >
          {t('Αιτήματα', 'Requests')}
          <span className="bg-rose-500 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center">2</span>
        </button>
      </div>

      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-black" />
          <input 
            type="text" 
            placeholder={t('Αναζήτηση συνδέσεων...', 'Search connections...')} 
            className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
          />
        </div>
        <Button variant="outline" className="shrink-0 flex items-center gap-2">
           <Filter className="w-4 h-4" /> {t('Φίλτρα', 'Filter')}
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
        {connections.map((conn) => (
          <Card key={conn.id} className="p-4 flex items-center justify-between hover:border-cyan-200 transition-colors cursor-pointer group">
            <div className="flex items-center gap-3">
              <img referrerPolicy="no-referrer" src={conn.image} alt={conn.name} className="w-12 h-12 rounded-full object-cover bg-gray-100" />
              <div>
                <h3 className="font-bold text-[#111827] text-sm group-hover:text-cyan-600 transition-colors">{conn.name}</h3>
                <p className="text-xs text-black flex items-center gap-1 mt-0.5">
                  <MapPin className="w-3 h-3" /> {conn.location}
                </p>
                <div className="flex items-center gap-2 mt-1.5">
                  <Badge variant="neutral" className="text-[9px] px-1.5 py-0">{conn.role}</Badge>
                  <span className="text-[10px] text-black font-medium">{conn.mutual} {t('Κοινοί', 'mutuals')}</span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <button className="p-2 text-cyan-600 hover:bg-cyan-50 rounded-full transition-colors" title={t('Μήνυμα', 'Message')}>
                <MessageCircle className="w-5 h-5" />
              </button>
              <button className="p-2 text-black hover:bg-gray-100 rounded-full transition-colors">
                <MoreVertical className="w-5 h-5" />
              </button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
