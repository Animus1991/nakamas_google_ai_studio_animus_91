import React, { useState } from "react";
import {
  Camera,
  MapPin,
  Clock,
  Calendar,
  Users,
  Target,
  Lock,
  Globe,
  CheckCircle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useStore } from "../store";
import { motion, AnimatePresence } from "motion/react";
import { Card } from "../components/common/Card";
import { Button } from "../components/common/Button";
import { useLanguage } from "../lib/i18n";
import { MapPinPicker } from "../components/common/MapPinPicker";

export default function CreateEventFlowNeonDark() {
  const [step, setStep] = useState(1);
  const totalSteps = 4;
  const { t } = useLanguage();
  const navigate = useNavigate();
  const createEvent = useStore((state) => state.createEvent);
  const currentUser = useStore((state) => state.currentUser);

  // Form State
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [location, setLocation] = useState("");
  const [coordinates, setCoordinates] = useState({ lat: 0, lng: 0 });
  const [visibility, setVisibility] = useState<"public" | "private">("public");
  const [maxAttendees, setMaxAttendees] = useState(4);
  const [duration, setDuration] = useState("2h");

  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImagePreview(URL.createObjectURL(e.target.files[0]));
    }
  };

  const handleSubmit = () => {
    const newEvent = {
      title: title || "New Experience",
      category: category || "Social",
      description: description || "A new gathering created from the app.",
      date: date || new Date().toISOString().split("T")[0],
      time: time || "18:00",
      duration: duration || "2h",
      locationArea: location || "Athens",
      exactLocation: location || "Athens (TBD)",
      lat: coordinates.lat || 37.9838,
      lng: coordinates.lng || 23.7275,
      isPaid: false,
      price: 0,
      organizerId: currentUser.id,
      timeZone: "EET (Athens)",
      safetyLevel: "low",
      minTrustTierAccess: visibility === "private" ? "2_confirmed" : "none",
      maxParticipants: maxAttendees,
      tags: ["social"],
      imageUrl: imagePreview || `https://picsum.photos/seed/${Date.now()}/800/600`,
      participantsCount: 1,
    };

    createEvent(newEvent);
    // Redirect to home page
    navigate("/");
  };

  const stepVariants = {
    hidden: { opacity: 0, x: 20 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.3 } },
    exit: { opacity: 0, x: -20, transition: { duration: 0.2 } },
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-full mx-auto pb-24 md:pb-8"
    >
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">
          {t("Δημιουργία Εμπειρίας", "Create Experience")}
        </h1>
        <p className="text-white text-sm mt-1">
          {t(
            "Σχεδιάστε την τέλεια συνάντησή σας.",
            "Design your perfect real-world gathering.",
          )}
        </p>

        <div className="flex items-center gap-2 mt-6">
          {Array.from({ length: totalSteps }).map((_, i) => (
            <motion.div
              key={i}
              className={`h-1.5 flex-1 rounded-full ${i < step ? "bg-cyan-600" : "bg-gray-200"}`}
              initial={false}
              animate={{ backgroundColor: i < step ? "#4f46e5" : "#e5e7eb" }}
            />
          ))}
        </div>
      </div>

      <Card className="p-6 md:p-8 overflow-hidden relative min-h-[400px]">
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              variants={stepVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="space-y-6"
            >
              <h2 className="text-lg font-bold text-white">
                {t("Τα Βασικά", "The Basics")}
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-[13px] font-semibold text-white capitalize tracking-tight mb-2">
                    {t("Εικόνα Εκδήλωσης", "Event Image")}
                  </label>
                  <div 
                    className="w-full h-40 border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center text-white hover:bg-gray-900 hover:border-cyan-400 transition-colors cursor-pointer relative overflow-hidden"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    {imagePreview ? (
                       <img src={imagePreview} className="absolute inset-0 w-full h-full object-cover" alt="Event preview" />
                    ) : (
                       <>
                         <Camera className="w-8 h-8 mb-2 text-white" />
                         <span className="text-sm font-bold text-white block">{t('Ανέβασμα Εικόνας', 'Upload Image')}</span>
                         <span className="text-[11px] text-white mt-1 capitalize tracking-tight">{t('JPG, PNG έως 5MB', 'JPG, PNG up to 5MB')}</span>
                       </>
                    )}
                  </div>
                  <input type="file" ref={fileInputRef} className="hidden" accept="image/jpeg, image/png" onChange={handleImageUpload} />
                  {imagePreview && (
                     <button onClick={() => setImagePreview(null)} className="text-[11px] text-red-500 font-bold capitalize tracking-tight mt-2 hover:underline">
                        {t('Αφαίρεση Εικόνας', 'Remove Image')}
                     </button>
                  )}
                </div>

                <div>
                  <label className="block text-[13px] font-semibold text-white capitalize tracking-tight mb-2">
                    {t("Τίτλος Εκδήλωσης", "Event Title")}
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder={t(
                      "π.χ Κοινωνικός Καφές Κυριακής",
                      "e.g. Sunday Morning Hike & Coffee",
                    )}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-cyan-600 focus:border-transparent outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="block text-[13px] font-semibold text-white capitalize tracking-tight mb-2">
                    {t("Κατηγορία", "Category")}
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-cyan-600 focus:border-transparent outline-none transition-all bg-gray-800"
                  >
                    <option value="">
                      {t("Επιλέξτε κατηγορία...", "Select a category...")}
                    </option>
                    <option value="Hiking & Outdoors">
                      {t("Πεζοπορία & Εξόρμηση", "Hiking & Outdoors")}
                    </option>
                    <option value="Board Games">
                      {t("Επιτραπέζια", "Board Games")}
                    </option>
                    <option value="Stand-up Comedy">
                      {t("Stand-up κωμωδία", "Stand-up Comedy")}
                    </option>
                    <option value="Theatre">{t("Θέατρο", "Theatre")}</option>
                    <option value="Live Music">
                      {t("Ζωντανή Μουσική", "Live Music")}
                    </option>
                    <option value="Social">
                      {t("Κοινωνικό / Social", "Social")}
                    </option>
                  </select>
                </div>

                <div>
                  <label className="block text-[13px] font-semibold text-white capitalize tracking-tight mb-2">
                    {t("Περιγραφή", "Description")}
                  </label>
                  <textarea
                    rows={4}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder={t(
                      "Τι πρόκειται να κάνουμε; Τι πρέπει να περιμένουν οι συμμετέχοντες;",
                      "What are we going to do? What should people expect?",
                    )}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-cyan-600 focus:border-transparent outline-none transition-all resize-none"
                  ></textarea>
                </div>
              </div>

              <Button
                onClick={() => setStep(2)}
                className="w-full"
                disabled={!title || !category}
              >
                {t("Επόμενο: Πότε & Πού", "Next: When & Where")}
              </Button>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              variants={stepVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="space-y-6"
            >
              <h2 className="text-lg font-bold text-white">
                {t("Πότε & Πού", "When & Where")}
              </h2>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[13px] font-semibold text-white capitalize tracking-tight mb-2 flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5" />{" "}
                      {t("Ημερομηνία", "Date")}
                    </label>
                    <input
                      type="date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-cyan-600 focus:border-transparent outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-[13px] font-semibold text-white capitalize tracking-tight mb-2 flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5" /> {t("Ώρα", "Time")}
                    </label>
                    <input
                      type="time"
                      value={time}
                      onChange={(e) => setTime(e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-cyan-600 focus:border-transparent outline-none transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[13px] font-semibold text-white capitalize tracking-tight mb-2 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5" /> {t("Διάρκεια", "Duration")}
                  </label>
                  <select
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-cyan-600 focus:border-transparent outline-none transition-all bg-gray-800"
                  >
                    <option value="1h">1 {t("ώρα", "hour")}</option>
                    <option value="2h">2 {t("ώρες", "hours")}</option>
                    <option value="3h">3 {t("ώρες", "hours")}</option>
                    <option value="4+h">4+ {t("ώρες", "hours")}</option>
                    <option value="custom">{t("Προσαρμοσμένη", "Custom")}</option>
                  </select>
                  {duration === "custom" && (
                     <input 
                       type="text" 
                       placeholder={t("Λεπτομέρειες (π.χ. Όλη μέρα)...", "Details (e.g. All day)...")}
                       className="w-full border border-gray-300 rounded-lg px-4 py-2 mt-2 text-sm focus:ring-2 focus:ring-cyan-600 outline-none"
                       onChange={(e) => setDuration(e.target.value)}
                     />
                  )}
                </div>

                <div>
                  <label className="block text-[13px] font-semibold text-white capitalize tracking-tight mb-2 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5" />{" "}
                    {t("Τοποθεσία", "Location")}
                  </label>
                  <div className="relative mb-2">
                    <input
                      type="text"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder={t(
                        "Αναζήτηση χώρου ή διεύθυνσης...",
                        "Search venue or address...",
                      )}
                      className="w-full border border-gray-300 rounded-lg pl-10 pr-4 py-2 text-sm focus:ring-2 focus:ring-cyan-600 focus:border-transparent outline-none transition-all"
                    />
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white" />
                  </div>
                  <div className="w-full">
                    <p className="text-[10px] text-white mb-2">
                      {t(
                        "Επιλέξτε το ακριβές σημείο στον χάρτη:",
                        "Select exact location on map:",
                      )}
                    </p>
                    <MapPinPicker
                      location={coordinates}
                      onChange={setCoordinates}
                      height="200px"
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => setStep(1)}
                  className="flex-1"
                >
                  {t("Πίσω", "Back")}
                </Button>
                <Button
                  onClick={() => setStep(3)}
                  className="flex-[2]"
                  disabled={!date || !time || !location}
                >
                  {t("Επόμενο: Δυναμική Ομάδας", "Next: Group Dynamics")}
                </Button>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="step3"
              variants={stepVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="space-y-6"
            >
              <h2 className="text-lg font-bold text-white">
                {t("Δυναμική Ομάδας", "Group Dynamics")}
              </h2>

              <div className="space-y-6">
                <div>
                  <label className="block text-[13px] font-semibold text-white capitalize tracking-tight mb-3">
                    {t("Ορατότητα", "Visibility")}
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <div
                      className={`border rounded-xl p-4 cursor-pointer transition-all ${visibility === "public" ? "border-cyan-600 bg-emerald-900/30 shadow-sm" : "border-gray-700 hover:border-cyan-200"}`}
                      onClick={() => setVisibility("public")}
                    >
                      <Globe
                        className={`w-5 h-5 mb-2 ${visibility === "public" ? "text-cyan-400" : "text-white"}`}
                      />
                      <h4 className="text-sm font-bold text-white mb-1">
                        {t("Δημόσια", "Public")}
                      </h4>
                      <p className="text-[10px] text-white">
                        {t(
                          "Όλοι μπορούν να βρουν και να ζητήσουν να συμμετάσχουν.",
                          "Anyone can find and request to join.",
                        )}
                      </p>
                    </div>
                    <div
                      className={`border rounded-xl p-4 cursor-pointer transition-all ${visibility === "private" ? "border-cyan-600 bg-emerald-900/30 shadow-sm" : "border-gray-700 hover:border-cyan-200"}`}
                      onClick={() => setVisibility("private")}
                    >
                      <Lock
                        className={`w-5 h-5 mb-2 ${visibility === "private" ? "text-cyan-400" : "text-white"}`}
                      />
                      <h4 className="text-sm font-bold text-white mb-1">
                        {t("Ιδιωτική", "Private")}
                      </h4>
                      <p className="text-[10px] text-white">
                        {t(
                          "Ορατή μόνο μέσω απευθείας συνδέσμου πρόσκλησης.",
                          "Only visible via direct invite link.",
                        )}
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-[13px] font-semibold text-white capitalize tracking-tight mb-2 flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5" />{" "}
                    {t("Όριο μεγέθους ομάδας", "Group Size limit")}
                  </label>
                  <div className="flex items-center gap-3">
                    <input
                      type="number"
                      min="2"
                      max="50"
                      value={maxAttendees}
                      onChange={(e) => setMaxAttendees(Number(e.target.value))}
                      className="w-20 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-cyan-600 focus:border-transparent outline-none text-center"
                    />
                    <span className="text-sm text-white font-medium">
                      {t("άτομα το μέγιστο", "people maximum")}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => setStep(2)}
                  className="flex-1"
                >
                  {t("Πίσω", "Back")}
                </Button>
                <Button onClick={() => setStep(4)} className="flex-[2]">
                  {t("Επόμενο: Αναθεώρηση", "Next: Review")}
                </Button>
              </div>
            </motion.div>
          )}

          {step === 4 && (
            <motion.div
              key="step4"
              variants={stepVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="space-y-6"
            >
              <div className="text-center">
                <div className="w-12 h-12 bg-emerald-900/50 rounded-full flex items-center justify-center mx-auto mb-3">
                  <CheckCircle className="w-6 h-6 text-cyan-400" />
                </div>
                <h2 className="text-lg font-bold text-white">
                  {t("Έτοιμο για Δημοσίευση!", "Ready to Publish!")}
                </h2>
                <p className="text-sm text-white mt-1">
                  {t(
                    "Αναθεωρήστε τις λεπτομέρειες πριν τη δημοσίευση.",
                    "Review your event details before sharing.",
                  )}
                </p>
              </div>

              <div className="bg-gray-900 rounded-xl p-4 space-y-3 text-sm">
                <div className="flex justify-between pb-3 border-b border-gray-700">
                  <span className="text-white font-medium">
                    {t("Τίτλος", "Title")}
                  </span>
                  <span className="font-bold text-white truncate max-w-[200px] text-right">
                    {title || t("Χωρίς Τίτλο", "Untitled")}
                  </span>
                </div>
                <div className="flex justify-between pb-3 border-b border-gray-700">
                  <span className="text-white font-medium">
                    {t("Ημερομηνία & Ώρα", "Date & Time")}
                  </span>
                  <span className="font-bold text-white">
                    {date} • {time}
                  </span>
                </div>
                <div className="flex justify-between pb-3 border-b border-gray-700">
                  <span className="text-white font-medium">
                    {t("Ορατότητα", "Visibility")}
                  </span>
                  <span className="font-bold text-white capitalize">
                    {visibility === "public"
                      ? t("Δημόσια", "Public")
                      : t("Ιδιωτική", "Private")}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white font-medium">
                    {t("Χωρητικότητα", "Capacity")}
                  </span>
                  <span className="font-bold text-white">
                    {maxAttendees} {t("θέσεις", "spots")}
                  </span>
                </div>
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 flex gap-3 text-sm text-amber-800">
                <Target className="w-5 h-5 shrink-0 mt-0.5" />
                <p className="text-xs">
                  {t(
                    "Μόλις δημοσιευθεί, οι συμμετέχοντες μπορούν να ζητήσουν συμμετοχή. Μπορείτε να εγκρίνετε τα αιτήματα χειροκίνητα ή αυτόματα.",
                    "Once published, attendees can start joining. You can manually approve requests or set it to auto-approve.",
                  )}
                </p>
              </div>

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => setStep(3)}
                  className="flex-1"
                >
                  {t("Πίσω", "Back")}
                </Button>
                <Button
                  onClick={handleSubmit}
                  className="flex-[2] shadow-cyan-200 shadow-lg"
                >
                  {t("Δημοσίευση Εμπειρίας", "Publish Experience")}
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>
    </motion.div>
  );
}
