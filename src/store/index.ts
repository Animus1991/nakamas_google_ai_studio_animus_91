import { create } from "zustand";
import { Event } from "../types";
import { mockEvents } from "../data/mockEvents";
import { mockGroups } from "../data/mockGroups";
import { mockUsers, currentUser } from "../data/mockUsers";
import { mockNotifications } from "../data/mockNotifications";
import { fetchTicketmasterEvents, isTicketmasterConfigured } from "../services/eventApi";

interface AppState {
  theme: string;
  setTheme: (theme: string) => void;
  events: Event[];
  groups: typeof mockGroups;
  users: typeof mockUsers;
  currentUser: typeof currentUser | null;
  isAuthenticated: boolean;
  notifications: typeof mockNotifications;
  eventsLoading: boolean;
  eventsSource: 'mock' | 'api' | 'mixed';

  // Actions
  login: (userId: string) => void;
  logout: () => void;
  joinGroup: (groupId: string) => void;
  leaveGroup: (groupId: string) => void;
  createGroup: (eventId: string, targetSize: number) => void;
  createEvent: (event: any) => void;
  addNotification: (notification: any) => void;
  markNotificationRead: (id: string) => void;
  updateUser: (userId: string, data: Partial<typeof currentUser>) => void;
  toggleLiveTracking: (groupId: string, enabled: boolean) => void;
  updateMemberLocation: (
    groupId: string,
    userId: string,
    location: { lat: number; lng: number; sos?: boolean },
  ) => void;
  triggerSos: (groupId: string, userId: string, active: boolean) => void;
  savedEvents: string[];
  toggleSavedEvent: (eventId: string) => void;
  fetchExternalEvents: () => Promise<void>;
}

export const useStore = create<AppState>((set, get) => ({
  theme: "classic",
  setTheme: (theme) => set({ theme }),
  events: mockEvents,
  eventsLoading: false,
  eventsSource: 'mock',
  groups: mockGroups,
  users: mockUsers,
  currentUser: currentUser,
  isAuthenticated: true,
  notifications: mockNotifications,
  savedEvents: [],

  login: (userId) =>
    set((state) => {
      const user = state.users.find((u) => u.id === userId);
      if (!user) return state;
      return { currentUser: user, isAuthenticated: true };
    }),

  logout: () => set({ currentUser: null, isAuthenticated: false }),

  joinGroup: (groupId) =>
    set((state) => {
      if (!state.currentUser) return state;
      return {
        groups: state.groups.map((g) =>
          g.id === groupId && !g.members.includes(state.currentUser.id)
            ? { ...g, members: [...g.members, state.currentUser.id] }
            : g,
        ),
      };
    }),

  leaveGroup: (groupId) =>
    set((state) => {
      if (!state.currentUser) return state;
      return {
        groups: state.groups.map((g) =>
          g.id === groupId
            ? {
                ...g,
                members: g.members.filter(
                  (mId) => state.currentUser && mId !== state.currentUser.id,
                ),
              }
            : g,
        ),
      };
    }),

  createGroup: (eventId, targetSize) =>
    set((state) => {
      if (!state.currentUser) return state;
      const newGroup = {
        id: `g${Date.now()}`,
        eventId,
        hostId: state.currentUser.id,
        targetSize,
        status: "pending" as const,
        members: [state.currentUser.id],
        pendingMembers: [],
        discountUnlocked: false,
        chatId: `chat_${Date.now()}`,
      };
      return {
        groups: [...state.groups, newGroup],
      };
    }),

  createEvent: (event) =>
    set((state) => {
      if (!state.currentUser) return state;
      const newEvent = { ...event, id: `e${Date.now()}` };
      const newGroup = {
        id: `g${Date.now()}`,
        eventId: newEvent.id,
        hostId: state.currentUser.id,
        targetSize: event.maxAttendees || 5,
        status: "pending" as const,
        members: [state.currentUser.id],
        pendingMembers: [],
        discountUnlocked: false,
        chatId: `chat_${Date.now()}`,
      };
      return {
        events: [...state.events, newEvent],
        groups: [...state.groups, newGroup],
      };
    }),

  addNotification: (notification) =>
    set((state) => ({
      notifications: [
        { ...notification, id: Date.now().toString(), read: false },
        ...state.notifications,
      ],
    })),

  markNotificationRead: (id) =>
    set((state) => ({
      notifications: state.notifications.map((n) =>
        n.id === id ? { ...n, read: true } : n,
      ),
    })),

  updateUser: (userId, data) =>
    set((state) => {
      const isCurrentUser = state.currentUser?.id === userId;
      return {
        users: state.users.map((u) =>
          u.id === userId ? { ...u, ...data } : u,
        ),
        currentUser:
          isCurrentUser && state.currentUser
            ? { ...state.currentUser, ...data }
            : state.currentUser,
      };
    }),

  toggleLiveTracking: (groupId, enabled) =>
    set((state) => ({
      groups: state.groups.map((g) =>
        g.id === groupId ? { ...g, isLiveTrackingActive: enabled } : g,
      ),
    })),

  updateMemberLocation: (groupId, userId, location) =>
    set((state) => ({
      groups: state.groups.map((g) => {
        if (g.id !== groupId) return g;
        const membersLocations = { ...g.membersLocations };
        membersLocations[userId] = { ...location, timestamp: Date.now() };
        return { ...g, membersLocations };
      }),
    })),

  triggerSos: (groupId, userId, active) =>
    set((state) => ({
      groups: state.groups.map((g) => {
        if (g.id !== groupId) return g;
        const membersLocations = { ...g.membersLocations };
        if (membersLocations[userId]) {
          membersLocations[userId] = {
            ...membersLocations[userId],
            sos: active,
            timestamp: Date.now(),
          };
        }
        return { ...g, membersLocations };
      }),
    })),

  toggleSavedEvent: (eventId) =>
    set((state) => {
      const isSaved = state.savedEvents.includes(eventId);
      return {
        savedEvents: isSaved
          ? state.savedEvents.filter((id) => id !== eventId)
          : [...state.savedEvents, eventId],
      };
    }),

  fetchExternalEvents: async () => {
    if (!isTicketmasterConfigured()) return;
    set({ eventsLoading: true });
    try {
      const tmEvents = await fetchTicketmasterEvents();
      if (tmEvents.length > 0) {
        const existing = get().events;
        const existingIds = new Set(existing.map((e) => e.id));
        const newEvents = tmEvents.filter((e) => !existingIds.has(e.id));
        set({
          events: [...existing, ...newEvents],
          eventsSource: 'mixed',
          eventsLoading: false,
        });
      } else {
        set({ eventsLoading: false });
      }
    } catch {
      set({ eventsLoading: false });
    }
  },
}));
