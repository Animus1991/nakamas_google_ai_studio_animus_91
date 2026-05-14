import React, { useState, useEffect, useRef } from "react";
import { Card } from "../components/common/Card";
import { Badge } from "../components/common/Badge";
import { Button } from "../components/common/Button";
import { Skeleton, ProfileSkeleton } from "../components/common/Skeleton";
import { useStore } from "../store";
import {
  CheckCircle2,
  History,
  Camera,
  Edit2,
  X,
  Plus,
  Shield,
  ShieldCheck,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../lib/i18n";

export default function ProfileNeonDark() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const currentUser = useStore((state) => state.currentUser);
  const updateUser = useStore((state) => state.updateUser);
  const logout = useStore((state) => state.logout);
  const [isLoading, setIsLoading] = useState(true);
  const [photoUrl, setPhotoUrl] = useState(currentUser.photoUrl);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [bio, setBio] = useState(
    currentUser.bio ||
      "Passionate about finding cool local events and meeting new people.",
  );
  const [isEditingBio, setIsEditingBio] = useState(false);
  const [tempBio, setTempBio] = useState(bio);

  const [isEditingName, setIsEditingName] = useState(false);
  const [tempName, setTempName] = useState(currentUser.name);

  const [interests, setInterests] = useState(currentUser.interests || []);
  const [isAddingInterest, setIsAddingInterest] = useState(false);
  const [newInterest, setNewInterest] = useState("");

  const [availabilities, setAvailabilities] = useState<string[]>([
    "Weekends",
    "Weekday Evenings",
  ]);

  const [settings, setSettings] = useState({
    revealPhoto: true,
    allowMutualPing: true,
    allowOrganizerMsg: false,
    profileVisibility: 'public' as 'public' | 'verified' | 'private',
    messagePermission: 'anyone' as 'anyone' | 'verified' | 'friends',
    shareLocation: false,
  });

  useEffect(() => {
    if (!currentUser) {
      navigate("/login");
      return;
    }
    const timer = setTimeout(() => setIsLoading(false), 600);
    return () => clearTimeout(timer);
  }, [currentUser, navigate]);

  if (!currentUser) return null;

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const newUrl = URL.createObjectURL(e.target.files[0]);
      setPhotoUrl(newUrl);
      updateUser(currentUser.id, { photoUrl: newUrl });
    }
  };

  if (isLoading) {
    return (
      <div className="mx-auto max-w-full px-4 py-8">
        <ProfileSkeleton />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl space-y-8 pb-12">
      <div>
        <h1 className="text-xl md:text-2xl font-extrabold tracking-tight text-white">
          {t("Προφίλ", "Profile")}
        </h1>
        <p className="mt-1 text-xs text-white font-medium leading-relaxed">
          {t(
            "Διαχειριστείτε τις ρυθμίσεις εμπιστοσύνης, τις επαληθεύσεις και το ιστορικό σας.",
            "Manage your trust settings, verifications, and history.",
          )}
        </p>
      </div>

      <Card className="p-6">
        <div className="flex flex-col sm:flex-row items-start gap-4">
          <div className="relative group">
            <div className="h-20 w-20 sm:h-16 sm:w-16 rounded-full bg-emerald-900/50 flex items-center justify-center shrink-0 border border-cyan-200 overflow-hidden">
              {photoUrl ? (
                <img
                  referrerPolicy="no-referrer"
                  src={photoUrl}
                  alt={currentUser.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-cyan-400 font-bold text-xl">
                  {currentUser.name.substring(0, 2)}
                </span>
              )}
            </div>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-full"
              title={t("Ανέβασμα φωτογραφίας προφίλ", "Upload profile picture")}
            >
              <Camera className="h-5 w-5 text-white" />
            </button>
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept="image/*"
              onChange={handlePhotoUpload}
            />
          </div>
          <div className="flex-1 space-y-1">
            <div className="mt-1 flex items-center justify-between">
              {isEditingName ? (
                <div className="flex w-full items-center gap-2">
                  <input
                    autoFocus
                    value={tempName}
                    onChange={(e) => setTempName(e.target.value)}
                    className="flex-1 text-lg font-bold text-white bg-gray-900 border border-gray-700 rounded-md px-2 py-1 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none"
                  />
                  <Button
                    size="sm"
                    onClick={() => {
                      if (tempName.trim()) {
                        updateUser(currentUser.id, { name: tempName });
                        setIsEditingName(false);
                      }
                    }}
                  >
                    {t("Αποθήκευση", "Save")}
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => {
                      setTempName(currentUser.name);
                      setIsEditingName(false);
                    }}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ) : (
                <div className="group relative flex w-full items-center justify-between">
                  <h2 className="text-lg font-bold text-white pr-8">
                    {currentUser.name}
                  </h2>
                  <button
                    onClick={() => setIsEditingName(true)}
                    className="p-1 text-white hover:text-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity rounded-md hover:bg-gray-700"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
            <div className="flex flex-wrap gap-2 text-xs text-white font-medium">
              <span>{currentUser.ageRange}</span>
              <span>•</span>
              <span>{currentUser.city}</span>
            </div>

            <div className="mt-3">
              {isEditingBio ? (
                <div className="space-y-2">
                  <textarea
                    value={tempBio}
                    onChange={(e) => setTempBio(e.target.value)}
                    className="w-full text-sm text-white bg-gray-900 border border-gray-700 rounded-md p-2 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none resize-none"
                    rows={3}
                  />
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={() => {
                        setBio(tempBio);
                        setIsEditingBio(false);
                        updateUser(currentUser.id, { bio: tempBio });
                      }}
                    >
                      {t("Αποθήκευση", "Save")}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setTempBio(bio);
                        setIsEditingBio(false);
                      }}
                    >
                      {t("Ακύρωση", "Cancel")}
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="group relative">
                  <p className="text-sm text-white font-medium pr-8">
                    {bio}
                  </p>
                  <button
                    onClick={() => setIsEditingBio(true)}
                    className="absolute top-0 right-0 p-1 text-white hover:text-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity rounded-md hover:bg-gray-700"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              <Badge
                variant="outline"
                className={`text-xs py-1 px-2.5 shadow-sm ${currentUser.reliabilityScore >= 80 ? "text--400 bg-green-50 border-green-200" : currentUser.reliabilityScore >= 50 ? "text--400 bg-blue-50 border-blue-200" : "text-amber-700 bg-amber-50 border-amber-200"}`}
              >
                <ShieldCheck className="h-4 w-4 mr-1.5 inline" />
                {currentUser.reliabilityScore}%{" "}
                {t("Αξιοπιστία", "Reliability Score")}
              </Badge>
              <Badge
                variant="outline"
                className={`text-xs py-1 px-2.5 shadow-sm ${currentUser.trustTier === "3_high_trust" ? "text-cyan-400 bg-emerald-900/30 border-cyan-200" : "text-white bg-gray-900 border-gray-700"}`}
              >
                {currentUser.trustTier === "3_high_trust"
                  ? t("Υψηλό Επίπεδο Εμπιστοσύνης", "High Trust Tier")
                  : currentUser.trustTier.replace(/_/g, " ").toUpperCase() +
                    " " +
                    t("Επίπεδο", "Tier")}
              </Badge>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <Button variant="outline" size="sm">
              {t("Επεξεργασία", "Edit")}
            </Button>
            {currentUser.isOrganizer ? (
              <Button
                size="sm"
                onClick={() => navigate(`/organizer/${currentUser.id}`)}
              >
                {t("Το Προφίλ Διοργανωτή μου", "My Organizer Profile")}
              </Button>
            ) : (
              <Button
                size="sm"
                variant="ghost"
                onClick={() =>
                  alert(
                    t(
                      "Ανακατεύθυνση στην εγγραφή διοργανωτή...",
                      "Redirecting to Organizer Registration...",
                    ),
                  )
                }
              >
                {t("Γίνε Διοργανωτής", "Become an Organizer")}
              </Button>
            )}
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-gray-800">
          <h3 className="text-xs font-bold text-white capitalize tracking-wide mb-3">
            {t(
              "Επίπεδα Ταυτότητας & Δικαιώματα",
              "Identity Tiers & Permissions",
            )}
          </h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="h-6 w-6 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
                <CheckCircle2 className="h-4 w-4 text--400" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-bold text-white">
                  {t("Επίπεδο 1: Εξερευνητής", "Tier 1: Explorer")}
                </p>
                <p className="text-[10px] text-white capitalize font-medium tracking-wide">
                  {t(
                    "Email/Τηλέφωνο επαληθευμένο. Συμμετοχή σε Δημόσιες Εκδηλώσεις.",
                    "Email/Phone verified. Can view and join Public Free Events.",
                  )}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="h-6 w-6 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
                <CheckCircle2 className="h-4 w-4 text--400" />
              </div>
              <div className="flex-1 border border-emerald-200 bg-emerald-50/50 p-2 rounded">
                <p className="text-sm font-bold text--400">
                  {t("Επίπεδο 2: Επιβεβαιωμένος", "Tier 2: Confirmed")}
                </p>
                <p className="text-[10px] text--400/80 capitalize font-bold tracking-wide">
                  {t(
                    "Προσθήκη Μεθόδου Πληρωμής. Συμμετοχή σε Πληρωμένες/Μικρές Ομάδες.",
                    "Payment Method added or first Ticket Purchased. Can join Paid/Small Group Events.",
                  )}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="h-6 w-6 rounded-full bg-gray-700 border border-gray-700 flex items-center justify-center shrink-0">
                <Shield className="h-4 w-4 text-white" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-bold text-white">
                  {t("Επίπεδο 3: Υψηλή Εμπιστοσύνη", "Tier 3: High Trust")}
                </p>
                <p className="text-[10px] text-white capitalize font-medium tracking-wide">
                  {t(
                    "Ταυτότητα/Selfie επαληθευμένα + Υψηλή Αξιοπιστία. Πρόσβαση σε Ιδιωτικές/Εκδρομές.",
                    "Identity/Selfie verified + Positive Reliability Score. Access to Private/Home events and Hiking/Trips.",
                  )}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-800">
          <h3 className="text-xs font-bold text-white capitalize tracking-wide mb-3">
            {t("Προτιμήσεις Ομάδας", "Group Preferences")}
          </h3>
          <div className="space-y-4">
            <label className="flex items-start gap-3 p-3 border border-cyan-200 bg-emerald-900/30/30 rounded-xl cursor-pointer">
              <input
                type="radio"
                name="groupsize"
                defaultChecked
                className="mt-0.5 h-4 w-4 text-cyan-400 rounded-full border-cyan-300"
              />
              <div>
                <span className="text-sm font-bold text-cyan-400 block">
                  {t(
                    "Προεπιλογή: Ομάδες (3-5 άτομα)",
                    "Default: Groups (3-5 people)",
                  )}
                </span>
                <span className="text-xs text-cyan-400/80 font-medium leading-relaxed block mt-1">
                  {t(
                    "Συνιστάται. Το Nakamas λειτουργεί καλύτερα σε μικρές ομάδες για ασφάλεια.",
                    "Recommended. Nakamas works best in small groups to remove awkwardness and increase safety.",
                  )}
                </span>
              </div>
            </label>
            <label className="flex items-start gap-3 p-3 border border-gray-700 rounded-xl cursor-pointer opacity-75">
              <input
                type="radio"
                name="groupsize"
                disabled
                className="mt-0.5 h-4 w-4 text-white rounded-full border-gray-300"
              />
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-white block">
                    {t("1-προς-1 Εμπειρίες", "1-on-1 Experiences")}
                  </span>
                  <Badge variant="neutral">
                    {t("Επίπεδο 3", "Tier 3 Req")}
                  </Badge>
                </div>
                <span className="text-xs text-white font-medium leading-relaxed block mt-1">
                  {t(
                    "Απαιτεί Υψηλό Επίπεδο Εμπιστοσύνης.",
                    "Requires High Trust Tier to unlock.",
                  )}
                </span>
              </div>
            </label>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-800">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-bold text-white capitalize tracking-wide">
              {t("Ιστορικό & Αξιολογήσεις", "History & Reviews")}
            </h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/plans")}
              className="text-cyan-400 font-bold hover:bg-emerald-900/30"
            >
              {t("Προβολή Όλων", "View All")}
            </Button>
          </div>
          <div className="rounded-xl border border-gray-700 bg-gray-900 p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-900/50 text-cyan-400 rounded">
                <History className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-bold text-white">
                  {t(
                    "Παρελθούσες Εκδηλώσεις & Ιδιωτική Αξιολόγηση",
                    "Past Events & Private Feedback",
                  )}
                </p>
                <p className="text-xs text-white font-medium">
                  {t(
                    "Αξιολογήστε τις εμπειρίες σας ιδιωτικά",
                    "Review your experiences privately",
                  )}
                </p>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate("/plans")}
            >
              {t("Αξιολόγηση", "Review")}
            </Button>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-800">
          <h3 className="text-xs font-bold text-white capitalize tracking-wide mb-3">
            {t("Ενδιαφέροντα", "Interests")}
          </h3>
          <div className="flex flex-wrap gap-2 items-center">
            {interests.map((i) => (
              <Badge
                key={i}
                variant="neutral"
                className="pr-1.5 select-none bg-gray-900 border-gray-700 text-white"
              >
                {i}
                <button
                  onClick={() => {
                    const updated = interests.filter((int) => int !== i);
                    setInterests(updated);
                    updateUser(currentUser.id, { interests: updated });
                  }}
                  className="ml-1.5 p-0.5 rounded-full hover:bg-gray-200 text-white hover:text-white transition-colors"
                >
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            ))}

            {isAddingInterest ? (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (
                    newInterest.trim() &&
                    !interests.includes(newInterest.trim())
                  ) {
                    const updated = [...interests, newInterest.trim()];
                    setInterests(updated);
                    updateUser(currentUser.id, { interests: updated });
                    setNewInterest("");
                    setIsAddingInterest(false);
                  }
                }}
                className="flex items-center gap-2"
              >
                <input
                  type="text"
                  value={newInterest}
                  onChange={(e) => setNewInterest(e.target.value)}
                  placeholder={t("Νέο ενδιαφέρον...", "New interest...")}
                  className="text-xs border border-gray-700 rounded px-2 py-1 w-28 focus:outline-none focus:border-cyan-500"
                  autoFocus
                  onBlur={() => {
                    if (!newInterest.trim()) setIsAddingInterest(false);
                  }}
                />
                <Button
                  type="submit"
                  size="sm"
                  variant="ghost"
                  className="h-6 px-2 text-cyan-400 font-bold capitalize text-[11px]"
                >
                  {t("Προσθήκη", "Add")}
                </Button>
              </form>
            ) : (
              <Button
                variant="ghost"
                size="sm"
                className="bg-gray-900 border border-gray-700 h-6 px-2 text-xs font-medium text-white hover:bg-gray-700 flex items-center gap-1"
                onClick={() => setIsAddingInterest(true)}
              >
                <Plus className="w-3 h-3" /> {t("Προσθήκη", "Add Interest")}
              </Button>
            )}
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-800">
          <h3 className="text-xs font-bold text-white capitalize tracking-wide mb-3">
            {t("Προτιμήσεις Διαθεσιμότητας", "Availability Preferences")}
          </h3>
          <div className="flex flex-wrap gap-2">
            <Badge variant="neutral">{t("Σαββατοκύριακα", "Weekends")}</Badge>
            <Badge variant="neutral">
              {t("Βράδια Καθημερινών", "Weekday Evenings")}
            </Badge>
            <Button
              variant="ghost"
              size="sm"
              className="bg-gray-900 border border-gray-700"
            >
              + {t("Επεξεργασία", "Edit")}
            </Button>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-800">
          <h3 className="text-xs font-bold text-white capitalize tracking-wide mb-3">
            {t("Ορατότητα, Συνδέσεις & Απόρρητο", "Visibility, Connections & Privacy")}
          </h3>
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 p-3 bg-gray-800 border border-gray-800 rounded-xl shadow-sm">
              <div>
                <p className="text-sm font-bold text-white">{t("Ορατότητα Προφίλ", "Profile Visibility")}</p>
                <p className="text-xs text-white mt-0.5">{t("Επιλέξτε ποιοι μπορούν να δουν το πλήρες προφίλ σας.", "Choose who can see your full profile.")}</p>
              </div>
              <select 
                value={settings.profileVisibility}
                onChange={e => setSettings({...settings, profileVisibility: e.target.value as any})}
                className="text-xs border-gray-700 rounded-lg shadow-sm focus:border-cyan-500 focus:ring-cyan-500 py-1.5 px-2 bg-gray-900 outline-none"
              >
                <option value="public">{t("Όλοι", "Everyone")}</option>
                <option value="verified">{t("Μόνο επαληθευμένοι χρήστες", "Verified Users Only")}</option>
                <option value="private">{t("Ιδιωτικό", "Private")}</option>
              </select>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 p-3 bg-gray-800 border border-gray-800 rounded-xl shadow-sm">
              <div>
                <p className="text-sm font-bold text-white">{t("Ποιοι μπορούν να μου στείλουν μήνυμα", "Who can message me")}</p>
                <p className="text-xs text-white mt-0.5">{t("Διαχειριστείτε ποιοι μπορούν να ξεκινήσουν συνομιλία μαζί σας.", "Manage who can initiate a chat with you.")}</p>
              </div>
              <select 
                value={settings.messagePermission}
                onChange={e => setSettings({...settings, messagePermission: e.target.value as any})}
                className="text-xs border-gray-700 rounded-lg shadow-sm focus:border-cyan-500 focus:ring-cyan-500 py-1.5 px-2 bg-gray-900 outline-none"
              >
                <option value="anyone">{t("Όλοι", "Everyone")}</option>
                <option value="verified">{t("Μόνο επαληθευμένοι χρήστες", "Verified Users Only")}</option>
                <option value="friends">{t("Μόνο αμοιβαίες συνδέσεις", "Mutual Connections Only")}</option>
              </select>
            </div>

            <label className="flex items-start gap-3 p-3 bg-gray-800 border border-gray-800 rounded-xl shadow-sm cursor-pointer hover:bg-gray-900 transition-colors">
              <input
                type="checkbox"
                checked={settings.shareLocation}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    shareLocation: e.target.checked,
                  })
                }
                className="mt-0.5 h-4 w-4 text-cyan-400 rounded border-gray-300 focus:ring-cyan-500"
              />
              <div>
                <span className="text-sm font-bold text-white block">
                  {t("Κοινοποίηση Δεδομένων Τοποθεσίας", "Share Location Data")}
                </span>
                <span className="text-xs text-white font-medium leading-relaxed block mt-0.5">
                  {t("Να επιτρέπεται στην εφαρμογή να χρησιμοποιεί την ακριβή τοποθεσία μου για καλύτερες προτάσεις εκδηλώσεων και ζωντανή παρακολούθηση.", "Allow the app to use my precise location for better event recommendations and live tracking.")}
                </span>
              </div>
            </label>

            <label className="flex items-center gap-3 mt-4">
              <input
                type="checkbox"
                checked={settings.revealPhoto}
                onChange={(e) =>
                  setSettings({ ...settings, revealPhoto: e.target.checked })
                }
                className="h-4 w-4 text-cyan-400 rounded border-gray-300 focus:ring-cyan-500"
              />
              <span className="text-sm text-white font-medium">
                {t(
                  "Αποκάλυψη της φωτογραφίας μου στις επιβεβαιωμένες ομάδες 2 ώρες πριν την εκδήλωση",
                  "Reveal my photo to confirmed groups 2 hours before event",
                )}
              </span>
            </label>
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={settings.allowMutualPing}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    allowMutualPing: e.target.checked,
                  })
                }
                className="h-4 w-4 text-cyan-400 rounded border-gray-300 focus:ring-cyan-500"
              />
              <span className="text-sm text-white font-medium">
                {t(
                  "Να επιτρέπονται αμοιβαία αιτήματα επικοινωνίας μετά την εκδήλωση",
                  'Allow mutual "Keep in touch" requests post-event',
                )}
              </span>
            </label>
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={settings.allowOrganizerMsg}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    allowOrganizerMsg: e.target.checked,
                  })
                }
                className="h-4 w-4 text-cyan-400 rounded border-gray-300 focus:ring-cyan-500"
              />
              <span className="text-sm text-white font-medium">
                {t(
                  "Να επιτρέπεται στους διοργανωτές να μου στέλνουν μηνύματα μετά την εκδήλωση",
                  "Allow organizers to message me after event",
                )}
              </span>
            </label>
          </div>
        </div>
      </Card>

      <div className="flex justify-center">
        <Button
          onClick={() => {
            logout();
            navigate("/login");
          }}
          variant="ghost"
          className="text-white hover:text--400 font-bold capitalize tracking-wide text-[11px]"
        >
          {t("Αποσύνδεση", "Sign Out")}
        </Button>
      </div>
    </div>
  );
}
