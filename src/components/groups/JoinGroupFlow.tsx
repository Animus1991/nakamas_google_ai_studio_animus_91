import { useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useStore } from '../../store';
import { Button } from '../common/Button';
import { Ticket, Users, CheckCircle, Split, ShieldCheck, Tag } from 'lucide-react';

export default function JoinGroupFlow() {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const preSelectedGroupId = searchParams.get('groupId');
  
  const events = useStore((state) => state.events);
  const groups = useStore((state) => state.groups);
  const joinGroup = useStore((state) => state.joinGroup);
  const createGroup = useStore((state) => state.createGroup);
  const event = events.find(e => e.id === eventId);
  const [step, setStep] = useState(1);
  const [groupType, setGroupType] = useState<'existing' | 'new'>(preSelectedGroupId ? 'existing' : 'new');
  const [newGroupSize, setNewGroupSize] = useState(4);
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(preSelectedGroupId);

  if (!event) return null;

  const handleConfirm = () => {
    if (groupType === 'existing') {
      if (selectedGroupId) {
        joinGroup(selectedGroupId);
      } else {
        // Fallback: join first available group if none selected
        const firstAvail = groups.find(g => g.eventId === eventId && g.members.length < g.targetSize);
        if (firstAvail) joinGroup(firstAvail.id);
      }
    } else {
      createGroup(event.id, newGroupSize);
    }
    setStep(3);
  };

  return (
    <div className="mx-auto max-w-lg rounded-xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8 mt-8">
      {step === 1 && (
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-bold text-[#111827]">Join or Create a Group</h2>
            <p className="mt-1 text-sm text-gray-900 font-medium">{event.title}</p>
            <p className="text-xs text-gray-900 font-medium mt-0.5">Time Zone: {event.timeZone || 'Local Time'}</p>
          </div>
          
          <p className="text-xs text-gray-900 font-medium mt-2 p-3 bg-cyan-50 border border-cyan-100 rounded text-cyan-900 leading-relaxed">
            Nakamas highly recommends groups of 3-5 people. Groups are less awkward, safer{event.isPaid && event.groupDiscount ? `, and groups of ${event.groupDiscount.minSize} or more receive an automatic ${event.groupDiscount.percentage}% discount on paid tickets once confirmed!` : '!'}
          </p>

          <div className="grid grid-cols-2 gap-3 mt-4">
            <button 
              onClick={() => setGroupType('existing')}
              className={`p-4 rounded-xl border text-left transition-all ${groupType === 'existing' ? 'border-cyan-600 bg-cyan-50 shadow-sm ring-1 ring-cyan-600' : 'border-gray-200 hover:border-gray-300'}`}
            >
              <Users className={`h-5 w-5 mb-2 ${groupType === 'existing' ? 'text-cyan-600' : 'text-gray-900'}`} />
              <p className="font-bold text-sm text-[#111827]">Join Existing</p>
              <p className="text-sm text-gray-900 font-medium mt-1">Jump into a small group that's already gathering.</p>
            </button>
            <button 
              onClick={() => setGroupType('new')}
              className={`p-4 rounded-xl border text-left transition-all ${groupType === 'new' ? 'border-cyan-600 bg-cyan-50 shadow-sm ring-1 ring-cyan-600' : 'border-gray-200 hover:border-gray-300'}`}
            >
              <Split className={`h-5 w-5 mb-2 ${groupType === 'new' ? 'text-cyan-600' : 'text-gray-900'}`} />
              <p className="font-bold text-sm text-[#111827]">Start New Group</p>
              <p className="text-sm text-gray-900 font-medium mt-1">Gather a fresh group of users to attend.</p>
            </button>
          </div>
          
          {groupType === 'new' && (
            <div className="pt-4 space-y-3">
               <label className="text-xs font-bold text-[#111827] tracking-wide">Target Group Size</label>
               <div className="flex gap-2">
                 {[3,4,5,6].map(size => (
                   <button 
                     key={size}
                     onClick={() => setNewGroupSize(size)}
                     className={`flex-1 py-2 text-xs font-bold rounded border ${newGroupSize === size ? 'bg-cyan-600 text-white border-cyan-600 shadow-sm' : 'bg-white text-gray-900 border-gray-200 hover:bg-gray-50'}`}
                   >
                     {size} People
                     {event.isPaid && event.groupDiscount && size >= event.groupDiscount.minSize && <Tag className="h-3 w-3 inline ml-1" />}
                   </button>
                 ))}
               </div>
               
               <div className="mt-4 flex items-center justify-center p-3 bg-cyan-50 border border-cyan-100 rounded-xl shadow-inner">
                 <div className="text-center">
                   <p className="text-[10px] font-bold text-cyan-400 tracking-wide mb-0.5">Selected Target Size</p>
                   <div className="flex items-center justify-center gap-1.5 text-cyan-900 font-bold text-lg">
                     <Users className="w-4 h-4 text-cyan-600" />
                     {newGroupSize} <span className="text-xs font-medium text-cyan-700">Members</span>
                   </div>
                 </div>
               </div>
               {event.isPaid && event.groupDiscount && newGroupSize >= event.groupDiscount.minSize && (
                 <div className="mt-4 bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex items-start gap-3 shadow-sm transform transition-all duration-300 scale-100">
                   <div className="p-2.5 bg-emerald-100 rounded-full text-emerald-600 shrink-0">
                     <Tag className="h-5 w-5" />
                   </div>
                   <div>
                     <h4 className="text-sm font-bold text-emerald-800 tracking-wide leading-tight">Discount Unlocked!</h4>
                     <p className="text-xs text-emerald-700 font-medium mt-1">
                       Awesome! By starting a group of {newGroupSize}, everyone (including you) gets <span className="font-bold text-emerald-800 bg-emerald-100 px-1 py-0.5 rounded">{event.groupDiscount.percentage}% OFF</span> the ticket price.
                     </p>
                   </div>
                 </div>
               )}
            </div>
          )}

          <Button className="w-full mt-6" size="lg" onClick={() => setStep(2)}>
            Continue
          </Button>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-bold text-[#111827]">
               {event.isPaid ? 'Secure Your Spot via Partner' : 'Commitment Confirmation'}
            </h2>
            <p className="mt-1 text-xs text-gray-900 font-medium bg-gray-50 p-2 rounded inline-block mt-2">
               {groupType === 'new' ? `Starting new group of ${newGroupSize}` : 'Joining existing group'}
            </p>
          </div>

          {event.isPaid ? (
            <div className="space-y-4 rounded-xl border border-gray-200 p-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-900">Base Ticket Price</span>
                <span className="font-bold">€{event.price.toFixed(2)}</span>
              </div>
              
              {event.groupDiscount && newGroupSize >= event.groupDiscount.minSize && (
                <div className="flex justify-between text-sm text-emerald-600 font-medium">
                  <span className="flex items-center gap-1.5"><Tag className="h-4 w-4" /> Group Booking Discount ({event.groupDiscount.percentage}%)</span>
                  <span>-€{(event.price * (event.groupDiscount.percentage / 100)).toFixed(2)}</span>
                </div>
              )}
              
              <div className="flex justify-between text-sm">
                <span className="text-gray-900">Nakamas Coordination Fee</span>
                <span className="font-bold">€1.50</span>
              </div>
              <div className="border-t border-gray-200 pt-3 flex justify-between font-bold text-lg text-cyan-600">
                <span>Total Charge</span>
                <span>€{((event.groupDiscount && newGroupSize >= event.groupDiscount.minSize ? event.price * (1 - event.groupDiscount.percentage / 100) : event.price) + 1.5).toFixed(2)}</span>
              </div>
              <div className="bg-yellow-50 text-yellow-800 text-sm p-3 rounded font-bold tracking-wide flex items-start gap-2 mt-4 leading-relaxed">
                <ShieldCheck className="h-4 w-4 shrink-0" />
                No Web Scraping! Payment is pre-authorized and processed through official API affiliate integration (e.g. more.com) once the group is confirmed.
              </div>
            </div>
          ) : (
             <div className="space-y-4">
               <div className="text-xs text-gray-900 font-medium bg-cyan-50 border border-cyan-200 p-4 rounded-xl" style={{ backgroundColor: "rgb(254 242 242)", borderColor: "rgb(252 165 165)", color: "rgb(153 27 27)" }}>
                 <strong>Mandatory Commitment:</strong> This is a free event, but your spot is valuable. By confirming below, you make a strict commitment to attend. If you fail to show up without a valid reason, your internal reliability score will severely decrease, which may limit your access to future events and high-trust activities.
               </div>
               <div className="rounded-xl border border-gray-200 p-4">
                 <div className="flex justify-between text-sm font-bold text-cyan-600">
                   <span>Registration Status</span>
                   <span>Pending Confirmation</span>
                 </div>
               </div>
             </div>
          )}

          <Button className="w-full" size="lg" onClick={handleConfirm}>
            {event.isPaid ? 'Pre-Authorize with Partner' : 'I Commit to Attend'}
          </Button>
        </div>
      )}

      {step === 3 && (
        <div className="space-y-6 text-center py-4 animate-in fade-in zoom-in duration-500">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 mb-2">
            <CheckCircle className="h-8 w-8 text-emerald-600" />
          </div>
          <div>
            <h2 className="text-2xl font-extrabold text-[#111827]">You're In!</h2>
            <p className="mt-2 text-sm text-gray-900 font-medium leading-relaxed max-w-[280px] mx-auto">
              Your {event.isPaid && 'payment hold is active and your'} spot is reserved. We'll send you the exact meeting location 24h prior.
            </p>
          </div>

          {/* Psychological Push: Social Proof & Consistency */}
          <div className="mt-8 bg-gradient-to-br from-cyan-50/80 to-white border border-cyan-100/50 rounded-2xl p-6 text-left relative overflow-hidden shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)]">
             <div className="absolute top-0 right-0 p-5">
                <span className="flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
                </span>
             </div>
             
             <div className="relative z-10">
                <div className="flex items-center gap-2.5 mb-3">
                  <div className="bg-cyan-100/50 p-1.5 rounded-lg text-cyan-700">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <h3 className="text-sm font-bold text-cyan-950">One last, quick thing for your group</h3>
                </div>
                
                <p className="text-[13px] text-gray-900 font-medium mb-5 leading-relaxed pr-4">
                  Your new group is excited to meet you! Customarily, to keep our community safe and ensure everyone feels perfectly comfortable collaborating, <strong className="text-cyan-900 font-bold">over 85% of members</strong> claim their Verified Badge before their first event.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-3">
                   <Button className="w-full sm:w-auto bg-cyan-600 hover:bg-cyan-700 text-white font-bold rounded-xl text-[13px] py-2 px-5 shadow-lg shadow-cyan-200 transition-all" onClick={() => navigate('/verification')}>
                     Secure my Verified Badge (~60s)
                   </Button>
                </div>
             </div>
          </div>

          <div className="pt-4 space-y-3">
             <Button variant="ghost" className="w-full text-gray-900 font-bold hover:bg-gray-50 text-sm h-11" onClick={() => navigate('/plans')}>
               Skip for now, go to My Plans
             </Button>
          </div>
        </div>
      )}
    </div>
  );
}
