export type TrustTier = '1_explorer' | '2_confirmed' | '3_high_trust';
export type SafetyLevel = 'low' | 'medium' | 'high_trust';

export interface User {
  id: string;
  name: string; // usually first name or alias
  ageRange: string;
  gender?: string;
  city: string;
  interests: string[];
  trustTier: TrustTier;
  reliabilityScore: number; // hidden internally, determines badge
  badges: string[];
  photoUrl?: string; // photo optional
  bio?: string;
  emailVerified: boolean;
  phoneVerified: boolean;
  paymentVerified: boolean;
  idVerified: boolean;
  isOrganizer: boolean;
  connections?: string[];
}

export interface Notification {
  id: string;
  message: string;
  time: string;
  read: boolean;
  type: 'reminder' | 'message' | 'system';
}

export interface Event {
  id: string;
  title: string;
  category: string;
  tags?: string[];
  description: string;
  date: string;
  time: string;
  timeZone?: string;
  duration: string;
  locationArea: string; // General area, e.g., "Gazi, Athens"
  exactLocation?: string; // Revealed only to confirmed participants
  isPaid: boolean;
  price: number;
  lat?: number;
  lng?: number;
  groupDiscount?: { minSize: number, percentage: number };
  organizerId: string;
  safetyLevel: SafetyLevel;
  minTrustTierAccess: TrustTier;
  maxParticipants: number;
  currentParticipants?: number;
  isTrending?: boolean;
  imageUrl?: string;
  externalLink?: string;
}

export interface MemberLocation {
  lat: number;
  lng: number;
  timestamp: number;
  sos?: boolean;
}

export interface Group {
  id: string;
  eventId: string;
  hostId?: string; // optional, can be system-created
  members: string[]; // User IDs
  pendingMembers: string[]; // User IDs that applied/paid and wait for completion
  targetSize: number; // e.g. 4
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  discountUnlocked: boolean;
  meetingPoint?: string; // Revealed upon confirmation
  isLiveTrackingActive?: boolean;
  membersLocations?: Record<string, MemberLocation>;
}

export interface Ticket {
  id: string;
  eventId: string;
  userId: string;
  status: 'active' | 'cancelled' | 'used' | 'refunded';
  pricePaid: number;
}
