import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { useAuth } from "../../hooks/useAuth";
import { getProfile, updateProfile, changePassword } from "../../services/user.api";
import { profileUpdateSchema, changePasswordSchema } from "../../schemas/profile.schema";
import Skeleton from "../../components/ui/Skeleton";
import GoogleButton from "../../components/auth/GoogleButton";
import {
  FiUser,
  FiMail,
  FiShield,
  FiLock,
  FiEdit3,
  FiCheckCircle,
  FiSave,
  FiKey,
  FiLayers,
  FiAward,
  FiTrendingUp,
  FiEye,
  FiEyeOff,
  FiCopy,
  FiCheck,
} from "react-icons/fi";

const AVATAR_STYLES = [
  {
    id: "bottts",
    name: "Cyber Bot",
    role: "AI Engineer",
    getUrl: (seed) =>
      `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(seed || "Nexus")}&backgroundColor=ff6662,fe9a00&backgroundType=gradientLinear`,
  },
  {
    id: "adventurer",
    name: "Neon Hero",
    role: "Full Stack",
    getUrl: (seed) =>
      `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(seed || "Aiden")}&backgroundColor=818cf8,c084fc&backgroundType=gradientLinear`,
  },
  {
    id: "avataaars",
    name: "Tech Lead",
    role: "Staff Architect",
    getUrl: (seed) =>
      `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(seed || "Julian")}&backgroundColor=34d399,059669&backgroundType=gradientLinear`,
  },
  {
    id: "pixel-art",
    name: "Pixel Pro",
    role: "Game & Systems",
    getUrl: (seed) =>
      `https://api.dicebear.com/7.x/pixel-art/svg?seed=${encodeURIComponent(seed || "Shadow")}&backgroundColor=fbbf24,f59e0b&backgroundType=gradientLinear`,
  },
  {
    id: "lorelei",
    name: "Anime Sage",
    role: "Frontend Specialist",
    getUrl: (seed) =>
      `https://api.dicebear.com/7.x/lorelei/svg?seed=${encodeURIComponent(seed || "Kira")}&backgroundColor=ec4899,8b5cf6&backgroundType=gradientLinear`,
  },
  {
    id: "personas",
    name: "Cosmic Dev",
    role: "Cloud Engineer",
    getUrl: (seed) =>
      `https://api.dicebear.com/7.x/personas/svg?seed=${encodeURIComponent(seed || "Cosmic")}&backgroundColor=6366f1,3b82f6&backgroundType=gradientLinear`,
  },
  {
    id: "big-smile",
    name: "Vibrant Smile",
    role: "Product & UI/UX",
    getUrl: (seed) =>
      `https://api.dicebear.com/7.x/big-smile/svg?seed=${encodeURIComponent(seed || "Oliver")}&backgroundColor=f43f5e,fb7185&backgroundType=gradientLinear`,
  },
  {
    id: "notionists",
    name: "Minimalist",
    role: "Data & ML",
    getUrl: (seed) =>
      `https://api.dicebear.com/7.x/notionists/svg?seed=${encodeURIComponent(seed || "Creative")}&backgroundColor=14b8a6,06b6d4&backgroundType=gradientLinear`,
  },
];

const getDiceBearAvatar = (seed) =>
  `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(seed || "SkillBridge")}&backgroundColor=ff6662,fe9a00&backgroundType=gradientLinear`;

const Profile = () => {
  const { user, setUser, handleLinkGoogle, googleLoading } = useAuth();

  const [activeTab, setActiveTab] = useState("profile");
  const [statsLoading, setStatsLoading] = useState(true);
  const [stats, setStats] = useState({ totalReports: 0, averageScore: 0, topScore: 0 });

  // Form states — initialized from AuthContext user
  const [username, setUsername] = useState(user?.username || "");
  const [avatar, setAvatar] = useState(user?.avatar || "");
  const [copiedEmail, setCopiedEmail] = useState(false);

  // Sync with AuthContext user when updated
  useEffect(() => {
    if (user) {
      setUsername((prev) => prev || user.username);
      setAvatar((prev) => prev || user.avatar || "");
    }
  }, [user]);

  // Password form states
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Password visibility toggles
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Saving state indicators
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);

  // Fetch only stats in background — user data is already in AuthContext
  useEffect(() => {
    const fetchStats = async () => {
      setStatsLoading(true);
      try {
        const response = await getProfile();
        const data = response?.data || response;
        if (data?.stats) {
          setStats(data.stats);
        }
        if (data?.user) {
          setUsername(data.user.username);
          setAvatar(data.user.avatar || "");
        }
      } catch (err) {
        console.error("Failed fetching profile stats:", err);
      } finally {
        setStatsLoading(false);
      }
    };
    fetchStats();
  }, []);

  // Real-time Zod validation for Profile Update
  const profileValidation = profileUpdateSchema.safeParse({
    username,
    email: user?.email || "user@example.com",
    avatar,
  });
  const profileErrors = {};
  if (!profileValidation.success && profileValidation.error) {
    const issues = profileValidation.error.issues || profileValidation.error.errors || [];
    issues.forEach((err) => {
      const field = err.path[0];
      if (field && !profileErrors[field]) profileErrors[field] = err.message;
    });
  }

  // Real-time Zod validation for Password Change
  const passwordValidation = changePasswordSchema.safeParse({
    currentPassword,
    newPassword,
    confirmPassword,
  });
  const passwordErrors = {};
  if (!passwordValidation.success && passwordValidation.error) {
    const issues = passwordValidation.error.issues || passwordValidation.error.errors || [];
    issues.forEach((err) => {
      const field = err.path[0];
      if (field && !passwordErrors[field]) passwordErrors[field] = err.message;
    });
  }

  // Reactive state checks
  const hasProfileChanged =
    username.trim() !== (user?.username || "") ||
    (avatar || "") !== (user?.avatar || "");

  const canSaveProfile = hasProfileChanged && profileValidation.success && !savingProfile;
  const canSavePassword = passwordValidation.success && !savingPassword;

  const handleCopyEmail = () => {
    if (!user?.email) return;
    navigator.clipboard.writeText(user.email);
    setCopiedEmail(true);
    toast.success("Email copied to clipboard!");
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    if (!canSaveProfile) return;
    setSavingProfile(true);

    try {
      const response = await updateProfile({
        username: username.trim() !== user?.username ? username.trim() : undefined,
        avatar: avatar ? avatar.trim() : null,
      });

      const updatedUser = response?.data?.user || response?.user;
      if (updatedUser) {
        setUser(updatedUser);
        toast.success("Profile updated successfully!");
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to update profile.");
    } finally {
      setSavingProfile(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (!canSavePassword) return;

    setSavingPassword(true);
    try {
      await changePassword({ currentPassword, newPassword });
      toast.success("Password changed successfully!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to change password.");
    } finally {
      setSavingPassword(false);
    }
  };

  const handleGoogleLinkSuccess = async (tokenResponse) => {
    try {
      const response = await handleLinkGoogle({ accessToken: tokenResponse.access_token });
      const updatedUser = response?.data?.user || response?.user;
      if (updatedUser) {
        setUser(updatedUser);
      }
      toast.success("Google account linked successfully!");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to link Google account.");
    }
  };

  const handleGoogleLinkError = (err) => {
    if (err?.cancelled) return;
    toast.error("Google linking failed. Please try again.");
  };

  const isGoogleLinked = user?.providers?.some((p) => (typeof p === "string" ? p === "google" : p.providerName === "google"));
  const displayAvatar = avatar || getDiceBearAvatar(user?.username);

  const TABS = [
    { id: "profile", label: "Profile Details", icon: FiUser },
    { id: "security", label: "Security & Password", icon: FiKey },
    { id: "accounts", label: "Connected Accounts", icon: FiShield },
  ];

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 py-10 page-enter">
      {/* ── Top Header Banner ── */}
      <div className="relative studio-card p-4 sm:p-6 md:p-8 overflow-hidden mb-8 shadow-sm">
        <div
          className="absolute -top-24 -right-24 w-80 h-80 rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(229,77,72,0.08) 0%, transparent 70%)" }}
        />

        <div className="flex flex-col md:flex-row items-center gap-6 relative z-10">
          {/* Avatar with live preview */}
          <div className="relative group">
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden border-2 border-accent/40 bg-white shadow-sm relative shrink-0 transition-all duration-300 group-hover:scale-105">
              <img
                src={displayAvatar}
                alt={user?.username}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = getDiceBearAvatar(user?.username);
                }}
              />
            </div>
            <button
              onClick={() => setActiveTab("profile")}
              className="absolute -bottom-2 -right-2 p-2 rounded-xl bg-accent text-white shadow-sm hover:scale-110 active:scale-95 transition-transform cursor-pointer"
              title="Change Avatar"
              aria-label="Change Avatar"
            >
              <FiEdit3 className="w-4 h-4" />
            </button>
          </div>

          {/* User Details */}
          <div className="flex-1 text-center md:text-left min-w-0">
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2.5 mb-2">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-primary tracking-tight truncate">
                {user?.username}
              </h1>
              {isGoogleLinked && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <FiCheckCircle className="w-3.5 h-3.5" /> Google Connected
                </span>
              )}
            </div>
            <div className="flex items-center justify-center md:justify-start gap-2 text-secondary text-sm">
              <FiMail className="w-4 h-4 text-accent/80 shrink-0" />
              <span className="truncate">{user?.email}</span>
            </div>
            <p className="type-micro text-secondary/60 mt-1.5 font-mono">
              Member since {new Date(user?.createdAt || Date.now()).toLocaleDateString("en-US", { month: "short", year: "numeric" })}
            </p>
          </div>
        </div>
      </div>

      {/* ── Candidate Performance Stats Grid ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">
        <div className="studio-card p-5 border-l-[3px] border-l-accent flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-accent/15 border border-accent/20 flex items-center justify-center text-accent shrink-0">
            <FiLayers className="w-6 h-6" />
          </div>
          <div>
            <span className="type-micro text-secondary block font-mono">TOTAL AUDITED</span>
            {statsLoading ? (
              <div className="mt-1"><Skeleton width="65px" height="1.5rem" /></div>
            ) : (
              <span className="text-2xl font-extrabold text-primary font-mono">{stats.totalReports} <span className="text-xs font-normal text-secondary font-sans">roles</span></span>
            )}
          </div>
        </div>

        <div className="studio-card p-5 border-l-[3px] border-l-amber flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber/15 border border-amber/20 flex items-center justify-center text-amber shrink-0">
            <FiTrendingUp className="w-6 h-6" />
          </div>
          <div>
            <span className="type-micro text-secondary block font-mono">AVG COMPATIBILITY</span>
            {statsLoading ? (
              <div className="mt-1"><Skeleton width="55px" height="1.5rem" /></div>
            ) : (
              <span className="text-2xl font-extrabold text-amber font-mono">{stats.averageScore}%</span>
            )}
          </div>
        </div>

        <div className="studio-card p-5 border-l-[3px] border-l-emerald-600 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700 shrink-0">
            <FiAward className="w-6 h-6" />
          </div>
          <div>
            <span className="type-micro text-secondary block font-mono">HIGHEST MATCH</span>
            {statsLoading ? (
              <div className="mt-1"><Skeleton width="55px" height="1.5rem" /></div>
            ) : (
              <span className="text-2xl font-extrabold text-emerald-700 font-mono">{stats.topScore}%</span>
            )}
          </div>
        </div>
      </div>

      {/* ── Tabbed Workspace ── */}
      <div className="studio-card p-4 sm:p-6 md:p-8">
        {/* Modern Segmented Capsule Tab Navigation */}
        <div className="flex bg-slate-100 p-1.5 rounded-2xl border border-border mb-8 gap-2 overflow-x-auto no-scrollbar">
          {TABS.map((tab) => {
            const IconComp = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold min-h-[42px] transition-all duration-200 cursor-pointer whitespace-nowrap ${
                  isActive
                    ? "bg-accent text-white shadow-xs scale-[1.02]"
                    : "text-secondary hover:text-primary hover:bg-white"
                }`}
              >
                <IconComp className="w-4 h-4 shrink-0" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* ── Tab 1: Edit Profile ── */}
        {activeTab === "profile" && (
          <form onSubmit={handleUpdateProfile} className="space-y-7 max-w-2xl animate-fade-in">
            {/* Username Input */}
            <div>
              <label className="block text-xs font-bold text-secondary uppercase tracking-wider mb-2">
                Username <span className="text-secondary/50 font-normal">(Letters, numbers, underscores)</span>
              </label>
              <div className="relative">
                <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className={`w-full pl-11 pr-4 py-3 bg-white border rounded-xl text-sm text-primary focus:outline-none transition-all ${
                    profileErrors.username
                      ? "border-red-500/60 bg-red-50/40 focus:border-red-500 focus:shadow-[0_0_0_3px_rgba(239,68,68,0.12)]"
                      : "border-border hover:border-slate-300 focus:border-accent focus:shadow-[0_0_0_3px_rgba(229,77,72,0.12)]"
                  }`}
                  placeholder="e.g. alex_dev"
                  required
                />
              </div>
              {profileErrors.username && (
                <p className="text-red-600 text-xs mt-1.5 flex items-center gap-1 font-mono">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-600 shrink-0" />
                  {profileErrors.username}
                </p>
              )}
            </div>

            {/* Email Address (Read-only + Copy Button) */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-xs font-bold text-secondary uppercase tracking-wider">
                  Email Address <span className="text-secondary/50 font-normal">(Permanent Identity)</span>
                </label>
                <span className="type-micro text-accent font-mono font-semibold">Verified Account</span>
              </div>
              <div className="relative">
                <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="email"
                  value={user?.email || ""}
                  readOnly
                  disabled
                  className="w-full pl-11 pr-28 py-3 bg-slate-100 border border-border rounded-xl text-sm text-secondary cursor-not-allowed select-all"
                />
                <button
                  type="button"
                  onClick={handleCopyEmail}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 px-3 py-1.5 rounded-lg bg-white border border-border hover:border-slate-300 text-xs font-bold text-primary flex items-center gap-1.5 transition-all cursor-pointer hover:scale-105 active:scale-95 shadow-xs min-h-[32px]"
                  title="Copy Email Address"
                  aria-label="Copy Email Address"
                >
                  {copiedEmail ? (
                    <>
                      <FiCheck className="w-3.5 h-3.5 text-emerald-700" />
                      <span className="text-emerald-700">Copied</span>
                    </>
                  ) : (
                    <>
                      <FiCopy className="w-3.5 h-3.5 text-accent" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>
              <p className="text-[11px] text-muted mt-1.5">
                Email address is locked to your account security credentials and cannot be modified.
              </p>
            </div>

            {/* Avatar Style Picker (8 Curated Styles) */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="block text-xs font-bold text-secondary uppercase tracking-wider">
                  Choose Avatar Style
                </label>
                <span className="type-micro text-muted font-mono">8 Preset Styles</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
                {AVATAR_STYLES.map((style) => {
                  const styleUrl = style.getUrl(username || user?.username);
                  const isSelected = avatar === styleUrl || (!avatar && style.id === "bottts");

                  return (
                    <button
                      key={style.id}
                      type="button"
                      onClick={() => setAvatar(styleUrl)}
                      className={`relative p-3 rounded-2xl border transition-all duration-200 flex flex-col items-center gap-2.5 text-center cursor-pointer group ${
                        isSelected
                          ? "bg-accent/10 border-accent shadow-xs scale-[1.03]"
                          : "bg-white border-border hover:border-slate-300 hover:bg-slate-50"
                      }`}
                    >
                      <div className="w-14 h-14 rounded-2xl overflow-hidden bg-slate-100 border border-border p-1 flex items-center justify-center shrink-0 shadow-xs">
                        <img src={styleUrl} alt={style.name} className="w-full h-full object-contain" />
                      </div>
                      <div className="min-w-0">
                        <span className={`text-xs font-bold block truncate ${isSelected ? "text-accent" : "text-secondary group-hover:text-primary"}`}>
                          {style.name}
                        </span>
                        <span className="text-[10px] text-muted block truncate font-mono mt-0.5">
                          {style.role}
                        </span>
                      </div>
                      {isSelected && (
                        <div className="absolute top-2 right-2 w-4 h-4 rounded-full bg-accent flex items-center justify-center text-white text-[10px] shadow-xs font-black">
                          ✓
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Save Changes Button */}
            <div className="pt-6 mt-6 border-t border-border">
              <button
                type="submit"
                disabled={!canSaveProfile}
                className={`studio-btn-primary min-h-[44px] px-6 py-3 rounded-xl text-sm font-bold flex items-center gap-2.5 text-white shadow-sm transition-all duration-200 ${
                  !canSaveProfile ? "opacity-45 cursor-not-allowed pointer-events-none" : "hover:scale-[1.02] active:scale-[0.98]"
                }`}
              >
                {savingProfile ? (
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <FiSave className="w-4 h-4" />
                )}
                {savingProfile ? "Saving Profile..." : "Save Profile Changes"}
              </button>

              {!hasProfileChanged && (
                <p className="text-xs text-muted mt-3 font-sans">
                  Change your username or select an avatar to enable saving.
                </p>
              )}
            </div>
          </form>
        )}

        {/* ── Tab 2: Security & Password ── */}
        {activeTab === "security" && (
          <div className="space-y-6 max-w-xl animate-fade-in">
            {user?.hasPassword ? (
              <form onSubmit={handleChangePassword} className="space-y-5">
                <div>
                  <h3 className="text-base font-bold text-primary flex items-center gap-2 mb-1">
                    <FiKey className="text-accent" /> Change Password
                  </h3>
                  <p className="text-xs text-secondary leading-relaxed mb-4">
                    Update your account password. Ensure it has at least 6 characters.
                  </p>
                </div>

                {/* Current Password */}
                <div>
                  <label className="block text-xs font-bold text-secondary uppercase tracking-wider mb-2">
                    Current Password
                  </label>
                  <div className="relative">
                    <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type={showCurrentPassword ? "text" : "password"}
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-11 pr-12 py-3 bg-white border border-border rounded-xl text-sm text-primary focus:outline-none focus:border-accent focus:shadow-[0_0_0_3px_rgba(229,77,72,0.12)] transition-all"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrentPassword((v) => !v)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 flex items-center justify-center text-slate-400 hover:text-primary transition-colors focus:outline-none cursor-pointer rounded-lg hover:bg-slate-100"
                      aria-label={showCurrentPassword ? "Hide current password" : "Show current password"}
                    >
                      {showCurrentPassword ? <FiEyeOff className="w-4 h-4" /> : <FiEye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* New Password */}
                <div>
                  <label className="block text-xs font-bold text-secondary uppercase tracking-wider mb-2">
                    New Password <span className="text-secondary/50 font-normal">(Min 6 characters)</span>
                  </label>
                  <div className="relative">
                    <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type={showNewPassword ? "text" : "password"}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="••••••••"
                      className={`w-full pl-11 pr-12 py-3 bg-white border rounded-xl text-sm text-primary focus:outline-none transition-all ${
                        passwordErrors.newPassword
                          ? "border-red-500/60 bg-red-50/40 focus:border-red-500 focus:shadow-[0_0_0_3px_rgba(239,68,68,0.12)]"
                          : "border-border hover:border-slate-300 focus:border-accent focus:shadow-[0_0_0_3px_rgba(229,77,72,0.12)]"
                      }`}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword((v) => !v)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 flex items-center justify-center text-slate-400 hover:text-primary transition-colors focus:outline-none cursor-pointer rounded-lg hover:bg-slate-100"
                      aria-label={showNewPassword ? "Hide new password" : "Show new password"}
                    >
                      {showNewPassword ? <FiEyeOff className="w-4 h-4" /> : <FiEye className="w-4 h-4" />}
                    </button>
                  </div>
                  {passwordErrors.newPassword && (
                    <p className="text-red-600 text-xs mt-1.5 flex items-center gap-1 font-mono">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-600 shrink-0" />
                      {passwordErrors.newPassword}
                    </p>
                  )}
                </div>

                {/* Confirm New Password */}
                <div>
                  <label className="block text-xs font-bold text-secondary uppercase tracking-wider mb-2">
                    Confirm New Password
                  </label>
                  <div className="relative">
                    <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      className={`w-full pl-11 pr-12 py-3 bg-white border rounded-xl text-sm text-primary focus:outline-none transition-all ${
                        passwordErrors.confirmPassword
                          ? "border-red-500/60 bg-red-50/40 focus:border-red-500 focus:shadow-[0_0_0_3px_rgba(239,68,68,0.12)]"
                          : "border-border hover:border-slate-300 focus:border-accent focus:shadow-[0_0_0_3px_rgba(229,77,72,0.12)]"
                      }`}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword((v) => !v)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 flex items-center justify-center text-slate-400 hover:text-primary transition-colors focus:outline-none cursor-pointer rounded-lg hover:bg-slate-100"
                      aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
                    >
                      {showConfirmPassword ? <FiEyeOff className="w-4 h-4" /> : <FiEye className="w-4 h-4" />}
                    </button>
                  </div>
                  {passwordErrors.confirmPassword && (
                    <p className="text-red-600 text-xs mt-1.5 flex items-center gap-1 font-mono">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-600 shrink-0" />
                      {passwordErrors.confirmPassword}
                    </p>
                  )}
                </div>

                {/* Update Password Button */}
                <div className="pt-6 mt-6 border-t border-border">
                  <button
                    type="submit"
                    disabled={!canSavePassword}
                    className={`studio-btn-primary min-h-[44px] px-6 py-3 rounded-xl text-sm font-bold flex items-center gap-2.5 text-white shadow-sm transition-all duration-200 ${
                      !canSavePassword ? "opacity-45 cursor-not-allowed pointer-events-none" : "hover:scale-[1.02] active:scale-[0.98]"
                    }`}
                  >
                    {savingPassword ? (
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <FiLock className="w-4 h-4" />
                    )}
                    {savingPassword ? "Updating Password..." : "Update Password"}
                  </button>
                </div>
              </form>
            ) : (
              <div className="p-6 rounded-2xl studio-well border border-border">
                <h3 className="text-base font-bold text-primary mb-2 flex items-center gap-2">
                  <FiShield className="text-emerald-700" /> Google Single Sign-On Account
                </h3>
                <p className="text-xs text-secondary leading-relaxed mb-4">
                  Password management is disabled because your account was created with Google OAuth. Your account security is directly handled by Google.
                </p>
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold">
                  <FiCheckCircle className="w-4 h-4" /> Google SSO Verified
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── Tab 3: Connected Accounts (Split Tab) ── */}
        {activeTab === "accounts" && (
          <div className="space-y-6 max-w-xl animate-fade-in">
            <div className="p-6 rounded-2xl studio-well border border-border">
              <h3 className="text-base font-bold text-primary mb-2 flex items-center gap-2">
                <FiShield className="text-accent" /> External SSO Providers
              </h3>
              <p className="text-xs text-secondary mb-5 leading-relaxed">
                Connect external accounts for instant one-click sign-in to SkillBridge AI.
              </p>

              {isGoogleLinked ? (
                <div className="flex items-center justify-between p-4 rounded-xl bg-emerald-50 border border-emerald-200 shadow-xs">
                  <div className="flex items-center gap-3.5">
                    <svg className="w-6 h-6 shrink-0" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                    </svg>
                    <div>
                      <span className="text-sm font-bold text-primary block">Google Account</span>
                      <span className="text-xs text-emerald-700 font-semibold">Connected & Active</span>
                    </div>
                  </div>
                  <FiCheckCircle className="text-emerald-700 w-5 h-5 shrink-0" />
                </div>
              ) : (
                <div className="space-y-4">
                  <p className="text-xs text-amber-900 bg-amber-50 p-3.5 rounded-xl border border-amber-200 leading-relaxed">
                    Google account is not linked. Link your Google account to sign in with one click using your verified email.
                  </p>
                  <GoogleButton
                    text="link_with"
                    onSuccess={handleGoogleLinkSuccess}
                    onError={handleGoogleLinkError}
                    isLoading={googleLoading}
                  />
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;