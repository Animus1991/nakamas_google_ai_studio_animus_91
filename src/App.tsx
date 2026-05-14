// Entry point for our pages
import { useEffect } from "react";
import { Routes, Route, useLocation, useNavigate } from "react-router-dom";
import { AnimatePresence } from "motion/react";
import { AppShell } from "./components/layout/AppShell";
import { useStore } from "./store";
import Home from "./pages/Home";
import NotFound from "./pages/not-found";
import EventDetail from "./pages/EventDetail";
import Plans from "./pages/Plans";
import TrustCenter from "./pages/TrustCenter";
import Profile from "./pages/Profile";
import SettingsPage from "./pages/AdminDashboard"; // using as Settings mock
import OrganizerDashboard from "./pages/OrganizerDashboard";
import JoinGroupFlow from "./components/groups/JoinGroupFlow";
import GroupChat from "./pages/GroupChat";
import OrganizerProfile from "./pages/OrganizerProfile";
import Notifications from "./pages/Notifications";
import Categories from "./pages/Categories";
import NearbyGroups from "./pages/NearbyGroups";
import History from "./pages/History";
import SavedEvents from "./pages/SavedEvents";
import ReportIssue from "./pages/ReportIssue";
import PostEventFeedback from "./pages/PostEventFeedback";
import Login from "./pages/Login";
import MyCalendar from "./pages/MyCalendar";
import MyConnections from "./pages/MyConnections";
import Inbox from "./pages/Inbox";
import CreateEventFlow from "./pages/CreateEventFlow";
import Wallet from "./pages/Wallet";
import VerificationCenter from "./pages/VerificationCenter";
import SettingsAndPrivacy from "./pages/SettingsAndPrivacy";
import HelpCenter from "./pages/HelpCenter";
import Achievements from "./pages/Achievements";

export default function App() {
  const location = useLocation();
  const navigate = useNavigate();
  const currentUser = useStore((state) => state.currentUser);

  useEffect(() => {
    if (!currentUser && location.pathname !== "/login") {
      navigate("/login");
    }
  }, [currentUser, location.pathname, navigate]);

  if (!currentUser && location.pathname !== "/login") {
    return null; // wait for redirect
  }

  if (location.pathname === "/login") {
    return (
      <AnimatePresence mode="popLayout">
        <Routes location={location} key={location.pathname}>
          <Route path="/login" element={<Login />} />
        </Routes>
      </AnimatePresence>
    );
  }

  return (
    <AppShell>
      <AnimatePresence mode="popLayout">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Home />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/nearby" element={<NearbyGroups />} />

          <Route path="/events/:eventId" element={<EventDetail />} />
          <Route path="/events/:eventId/join" element={<JoinGroupFlow />} />

          <Route path="/agenda" element={<MyCalendar />} />
          <Route path="/plans" element={<Plans />} />
          <Route path="/history" element={<History />} />
          <Route
            path="/history/feedback/:eventId"
            element={<PostEventFeedback />}
          />
          <Route path="/saved" element={<SavedEvents />} />

          <Route path="/connections" element={<MyConnections />} />
          <Route path="/chats" element={<Inbox />} />
          <Route path="/chat/:groupId" element={<GroupChat />} />

          <Route path="/manage" element={<OrganizerDashboard />} />
          <Route path="/create" element={<CreateEventFlow />} />
          <Route path="/wallet" element={<Wallet />} />

          <Route path="/verification" element={<VerificationCenter />} />
          <Route path="/trust" element={<TrustCenter />} />
          <Route path="/report" element={<ReportIssue />} />

          <Route path="/profile" element={<Profile />} />
          <Route path="/organizer/:id" element={<OrganizerProfile />} />

          <Route path="/notifications" element={<Notifications />} />
          <Route path="/settings" element={<SettingsAndPrivacy />} />
          <Route path="/help" element={<HelpCenter />} />

          <Route path="/admin" element={<SettingsPage />} />
          <Route path="/achievements" element={<Achievements />} />

          {/* 404 catch-all */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AnimatePresence>
    </AppShell>
  );
}
