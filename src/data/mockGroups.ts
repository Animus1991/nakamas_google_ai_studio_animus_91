import { Group } from '../types';

export const mockGroups: Group[] = [
  {
    id: 'g1',
    eventId: 'e1',
    members: ['u2'],
    pendingMembers: ['u3'],
    targetSize: 4,
    status: 'pending',
    discountUnlocked: false,
  },
  {
    id: 'g2',
    eventId: 'e4',
    hostId: 'u1',
    members: ['u2', 'u1', 'u3'],
    pendingMembers: [],
    targetSize: 6,
    status: 'confirmed',
    discountUnlocked: false,
    meetingPoint: 'Kafe Play, Exarchia square' // Visible because u1 is in it
  }
];
