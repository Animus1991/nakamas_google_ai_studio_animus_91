import { Calendar, MessageCircle, AlertTriangle } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export interface AppNotification {
  id: string;
  type: string;
  messageEn: string;
  messageGr: string;
  timeEn: string;
  timeGr: string;
  read: boolean;
  icon: LucideIcon;
  color: string;
}

export const mockNotifications: AppNotification[] = [
  {
    id: 'n1',
    type: 'match',
    messageEn: "New Match! You've been placed in a high-trust group for 'Weekend Getaway: Arachova Retreat'.",
    messageGr: "Νέο Ταίριασμα! Τοποθετηθήκατε σε ομάδα υψηλής εμπιστοσύνης για την 'Απόδραση στην Αράχωβα'.",
    timeEn: '10 mins ago',
    timeGr: 'πριν 10 λεπτά',
    read: false,
    icon: AlertTriangle,
    color: 'bg-emerald-100 text-emerald-600'
  },
  {
    id: 'n2',
    type: 'message',
    messageEn: "Organizer Alex sent a message: 'Hey everyone! Please check the updated meeting point for tomorrow's hike.'",
    messageGr: "Ο διοργανωτής Alex έστειλε μήνυμα: 'Γεια σε όλους! Δείτε το νέο σημείο συνάντησης για την αυριανή πεζοπορία.'",
    timeEn: '1 hour ago',
    timeGr: 'πριν 1 ώρα',
    read: false,
    icon: MessageCircle,
    color: 'bg-cyan-100 text-cyan-600'
  },
  {
    id: 'n3',
    type: 'reminder',
    messageEn: "Reminder: 'Laugh out Loud: Stand-up Comedy' starts in 24 hours. Don't forget your tickets!",
    messageGr: "Υπενθύμιση: Το 'Stand-up Comedy' ξεκινά σε 24 ώρες. Μην ξεχάσετε τα εισιτήριά σας!",
    timeEn: '3 hours ago',
    timeGr: 'πριν 3 ώρες',
    read: true,
    icon: Calendar,
    color: 'bg-gray-100 text-gray-600'
  },
  {
    id: 'n4',
    type: 'system',
    messageEn: "Your reliability score increased to 95%. Thanks for being a great community member!",
    messageGr: "Το σκορ αξιοπιστίας σας αυξήθηκε στο 95%. Ευχαριστούμε που είστε εξαιρετικό μέλος της κοινότητας!",
    timeEn: '2 days ago',
    timeGr: 'πριν 2 μέρες',
    read: true,
    icon: AlertTriangle,
    color: 'bg-gray-100 text-gray-600'
  }
];

export const unreadNotificationCount = mockNotifications.filter(n => !n.read).length;
