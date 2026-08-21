import React, { useState, useEffect } from "react";
import { useAuth } from "../../hooks/useAuth";
import { getProfile, updateProfile, changePassword } from "../../services/user.api";
import { profileUpdateSchema, changePasswordSchema } from "../../schemas/profile.schema";
import LoadingScreen from "../../components/layout/LoadingScreen";
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
} from "react-icons/fi";

const getDiceBearAvatar = (seed) =>
  `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(seed || "SkillBridge")}`;

const Profile = () => {
  const { user, setUser, handleLinkGoogle, googleLoading } = useAuth();

  const [activeTab, setActiveTab] = useState("profile");
  const [statsLoading, setStatsLoading] = useState(true);
  const [stats, setStats] = useState({ totalReports: 0, averageScore: 0, topScore: 0 });

  // Form states — initialized from AuthContext user (instant render)
  const [username, setUsername] = useState(user?.username || "");
  const [email, setEmail] = useState(user?.email || "");
  const [avatar, setAvatar] = useState(user?.avatar || "");

  // Sync with AuthContext user if it updates
  useEffect(() => {
    if (user) {
      setUsername((prev) => prev || user.username);
      setEmail((prev) => prev || user.email);
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

  // Feedback messages
  const [profileMessage, setProfileMessage] = useState(null);
  const [profileError, setProfileError] = useState(null);
  const [passwordMessage, setPasswordMessage] = useState(null);
  const [passwordError, setPasswordError] = useState(null);

  // Separate saving states — prevent cross-form disabled states
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);

  // Fetch only stats in background — user data is already in AuthContext
  useEffect(() => {
    const fetchStats = async () => {
      setStatsLoading(true);
      try {
        const data = await getProfile();
        if (data?.stats) {
          setStats(data.stats);
        }
        // Sync form fields with freshest user data from server response
        if (data?.user) {
          setUsername(data.user.username);
          setEmail(data.user.email);
          setAvatar(data.user.avatar || "");
        }
      } catch (err) {
        console.error("Failed fetching profile data:", err);
      } finally {
        setStatsLoading(false);
      }
    };
    fetchStats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Auto-clear feedback messages after 5 seconds
  useEffect(() => {
    if (!profileMessage && !profileError) return;
    const timer = setTimeout(() => {
      setProfileMessage(null);
      setProfileError(null);
    }, 5000);
    return () => clearTimeout(timer);
  }, [profileMessage, profileError]);

  useEffect(() => {
    if (!passwordMessage && !passwordError) return;
    const timer = setTimeout(() => {
      setPasswordMessage(null);
      setPasswordError(null);
    }, 5000);
    return () => clearTimeout(timer);
  }, [passwordMessage, passwordError]);

  // Real-time Zod validation for Profile Update
  const profileValidation = profileUpdateSchema.safeParse({ username, email, avatar });
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
    email.trim().toLowerCase() !== (user?.email || "").toLowerCase() ||
    (avatar || "") !== (user?.avatar || "");

  const canSaveProfile = hasProfileChanged && profileValidation.success && !savingProfile;
  const canSavePassword = passwordValidation.success && !savingPassword;

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setProfileMessage(null);
    setProfileError(null);

    if (!canSaveProfile) return;
    setSavingProfile(true);

    try {
      const response = await updateProfile({
        username: username.trim() !== user?.username ? username.trim() : undefined,
        email: email.trim().toLowerCase() !== user?.email ? email.trim().toLowerCase() : undefined,
        avatar: avatar ? avatar.trim() : null,
      });

      if (response?.user) {
        setUser(response.user);
        setProfileMessage("Profile updated successfully!");
      }
    } catch (err) {
      setProfileError(err?.response?.data?.message || "Failed to update profile.");
    } finally {
      setSavingProfile(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPasswordMessage(null);
    setPasswordError(null);

    if (!canSavePassword) return;

    setSavingPassword(true);
    try {
      await changePassword({ currentPassword, newPassword });
      setPasswordMessage("Password changed successfully!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      setPasswordError(err?.response?.data?.message || "Failed to change password.");
    } finally {
      setSavingPassword(false);
    }
  };

  const handleGoogleLinkSuccess = async (tokenResponse) => {
    setProfileMessage(null);
    setProfileError(null);
    try {
      await handleLinkGoogle({ accessToken: tokenResponse.access_token });
      setProfileMessage("Google account linked successfully!");
    } catch (err) {
      setProfileError(err?.response?.data?.message || "Failed to link Google account.");
    }
  };

  const handleGoogleLinkError = (err) => {
    if (err?.cancelled) return;
    setProfileError("Google linking failed. Please try again.");
  };

  const isGoogleLinked = user?.providers?.includes("google");
  const displayAvatar = avatar || getDiceBearAvatar(user?.username);

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 py-10 animate-fade-in">
      {/* ── Top Header Banner ── */}
      <div className="relative rounded-3xl p-6 sm:p-8 bg-surface/30 border border-border/80 overflow-hidden mb-8 shadow-xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-accent/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="flex flex-col md:flex-row items-center gap-6 relative z-10">
          {/* Avatar with onError fallback */}
          <div className="relative group">
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden border-2 border-accent/40 bg-surface shadow-lg relative shrink-0">
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
              className="absolute -bottom-2 -right-2 p-2 rounded-xl bg-accent text-primary shadow-lg hover:scale-110 transition-transform cursor-pointer"
              title="Change Avatar"
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
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  <FiCheckCircle className="w-3.5 h-3.5" /> Google Connected
                </span>
              )}
            </div>
            <p className="text-secondary text-sm flex items-center justify-center md:justify-start gap-2">
              <FiMail className="w-4 h-4 text-accent/80" />
              <span>{user?.email}</span>
            </p>
            <p className="text-xs text-secondary/60 mt-1 font-mono">
              Member since {new Date(user?.createdAt || Date.now()).toLocaleDateString("en-US", { month: "short", year: "numeric" })}
            </p>
          </div>
        </div>
      </div>

      {/* ── Candidate Performance Stats Grid ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">
        <div className="rounded-2xl p-5 bg-surface/30 border border-border/60 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-accent/15 border border-accent/20 flex items-center justify-center text-accent shrink-0">
            <FiLayers className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-secondary uppercase tracking-widest block">Total Audited</span>
            {statsLoading ? (
              <div className="mt-1"><Skeleton width="65px" height="1.5rem" /></div>
            ) : (
              <span className="text-2xl font-extrabold text-primary">{stats.totalReports} roles</span>
            )}
          </div>
        </div>

        <div className="rounded-2xl p-5 bg-surface/30 border border-border/60 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-500/15 border border-amber-500/20 flex items-center justify-center text-amber-400 shrink-0">
            <FiTrendingUp className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-secondary uppercase tracking-widest block">Avg Compatibility</span>
            {statsLoading ? (
              <div className="mt-1"><Skeleton width="55px" height="1.5rem" /></div>
            ) : (
              <span className="text-2xl font-extrabold text-amber-400">{stats.averageScore}%</span>
            )}
          </div>
        </div>

        <div className="rounded-2xl p-5 bg-surface/30 border border-border/60 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/15 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
            <FiAward className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-secondary uppercase tracking-widest block">Highest Match</span>
            {statsLoading ? (
              <div className="mt-1"><Skeleton width="55px" height="1.5rem" /></div>
            ) : (
              <span className="text-2xl font-extrabold text-emerald-400">{stats.topScore}%</span>
            )}
          </div>
        </div>
      </div>

      {/* ── Tabbed Workspace ── */}
      <div className="bg-surface/20 border border-border/80 rounded-3xl p-6 sm:p-8">
        {/* Navigation Tabs */}
        <div className="flex border-b border-border/60 mb-8 gap-6 overflow-x-auto no-scrollbar">
          {[
            { id: "profile", label: "Edit Profile", icon: FiUser },
            { id: "security", label: "Security & Accounts", icon: FiShield },
          ].map((tab) => {
            const IconComp = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 pb-4 text-sm font-bold border-b-2 transition-all duration-200 cursor-pointer whitespace-nowrap ${
                  isActive
                    ? "border-accent text-accent"
                    : "border-transparent text-secondary hover:text-primary"
                }`}
              >
                <IconComp className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* ── Tab 1: Edit Profile ── */}
        {activeTab === "profile" && (
          <form onSubmit={handleUpdateProfile} className="space-y-6 max-w-xl animate-fade-in">
            {profileMessage && (
              <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm flex items-center gap-2">
                <FiCheckCircle className="w-5 h-5 shrink-0" />
                <span>{profileMessage}</span>
              </div>
            )}
            {profileError && (
              <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                {profileError}
              </div>
            )}

            {/* Username Input */}
            <div>
              <label className="block text-xs font-bold text-secondary uppercase tracking-wider mb-2">
                Username <span className="text-secondary/50 font-normal">(No spaces allowed)</span>
              </label>
              <div className="relative">
                <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary/50" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className={`w-full pl-11 pr-4 py-3 bg-surface/50 border rounded-xl text-sm text-primary focus:outline-none transition-all ${
                    profileErrors.username ? "border-red-500/50 focus:border-red-500" : "border-white/[0.08] focus:border-accent/60"
                  }`}
                  placeholder="e.g. alex_dev"
                  required
                />
              </div>
              {profileErrors.username && (
                <p className="text-red-400 text-xs mt-1.5 flex items-center gap-1">
                  <span className="w-1 h-1 rounded-full bg-red-400 shrink-0" />
                  {profileErrors.username}
                </p>
              )}
            </div>

            {/* Email Address Input */}
            <div>
              <label className="block text-xs font-bold text-secondary uppercase tracking-wider mb-2">Email Address</label>
              <div className="relative">
                <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary/50" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className={`w-full pl-11 pr-4 py-3 bg-surface/50 border rounded-xl text-sm text-primary focus:outline-none transition-all ${
                    profileErrors.email ? "border-red-500/50 focus:border-red-500" : "border-white/[0.08] focus:border-accent/60"
                  }`}
                  required
                />
              </div>
              {profileErrors.email && (
                <p className="text-red-400 text-xs mt-1.5 flex items-center gap-1">
                  <span className="w-1 h-1 rounded-full bg-red-400 shrink-0" />
                  {profileErrors.email}
                </p>
              )}
            </div>

            {/* Avatar Input */}
            <div>
              <label className="block text-xs font-bold text-secondary uppercase tracking-wider mb-2">Avatar URL (Optional)</label>
              <input
                type="text"
                placeholder="https://..."
                value={avatar}
                onChange={(e) => setAvatar(e.target.value)}
                className="w-full px-4 py-3 bg-surface/50 border border-white/[0.08] rounded-xl text-sm text-primary focus:outline-none focus:border-accent/60 mb-3"
              />
              <div className="flex items-center gap-2">
                <span className="text-xs text-secondary/70">Or generate DiceBear avatar:</span>
                <button
                  type="button"
                  onClick={() => setAvatar(getDiceBearAvatar(username || user?.username))}
                  className="px-3 py-1 text-xs font-bold rounded-lg bg-surface border border-border text-accent hover:bg-surface/80 cursor-pointer transition-colors"
                >
                  Generate DiceBear Avatar
                </button>
              </div>
            </div>

            {/* Save Changes Button */}
            <button
              type="submit"
              disabled={!canSaveProfile}
              className={`px-6 py-3 rounded-xl font-bold text-primary transition-all flex items-center gap-2 shadow-md ${
                canSaveProfile
                  ? "bg-accent hover:opacity-90 cursor-pointer shadow-accent/20"
                  : "bg-surface/50 text-secondary/40 border border-white/[0.05] cursor-not-allowed opacity-60"
              }`}
            >
              {savingProfile ? (
                <span className="w-4 h-4 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
              ) : (
                <FiSave className="w-4 h-4" />
              )}
              {savingProfile ? "Saving Changes..." : "Save Changes"}
            </button>

            {!hasProfileChanged && (
              <p className="text-xs text-secondary/50 italic">
                Change your username, email, or avatar to enable saving.
              </p>
            )}
          </form>
        )}

        {/* ── Tab 2: Security & Provider Linking ── */}
        {activeTab === "security" && (
          <div className="space-y-8 max-w-xl animate-fade-in">
            {/* Connected Providers Box */}
            <div className="p-6 rounded-2xl bg-surface/30 border border-border/60">
              <h3 className="text-base font-bold text-primary mb-2 flex items-center gap-2">
                <FiShield className="text-accent" /> Connected Accounts
              </h3>
              <p className="text-xs text-secondary mb-4 leading-relaxed">
                Manage external OAuth single sign-on connections for your SkillBridge AI account.
              </p>

              {/* Profile-level messages */}
              {profileMessage && (
                <div className="mb-4 p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs flex items-center gap-2">
                  <FiCheckCircle className="w-4 h-4 shrink-0" />
                  {profileMessage}
                </div>
              )}
              {profileError && (
                <div className="mb-4 p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs">
                  {profileError}
                </div>
              )}

              {isGoogleLinked ? (
                <div className="flex items-center justify-between p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                  <div className="flex items-center gap-3">
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                    </svg>
                    <span className="text-sm font-semibold text-emerald-300">Google Account Linked</span>
                  </div>
                  <FiCheckCircle className="text-emerald-400 w-5 h-5" />
                </div>
              ) : (
                <div className="space-y-3">
                  <p className="text-xs text-amber-300 bg-amber-500/10 p-3 rounded-xl border border-amber-500/20">
                    Google account is not linked. Click below to link your Google account.
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

            {/* Change Password Form (Credential Users) */}
            {user?.hasPassword ? (
              <form onSubmit={handleChangePassword} className="space-y-5 p-6 rounded-2xl bg-surface/30 border border-border/60">
                <h3 className="text-base font-bold text-primary flex items-center gap-2">
                  <FiKey className="text-accent" /> Change Password
                </h3>

                {passwordMessage && (
                  <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs">
                    {passwordMessage}
                  </div>
                )}
                {passwordError && (
                  <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs">
                    {passwordError}
                  </div>
                )}

                {/* Current Password */}
                <div>
                  <label className="block text-xs font-bold text-secondary uppercase tracking-wider mb-2">Current Password</label>
                  <div className="relative">
                    <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary/50" />
                    <input
                      type={showCurrentPassword ? "text" : "password"}
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-11 pr-12 py-2.5 bg-surface/50 border border-white/[0.08] rounded-xl text-sm text-primary focus:outline-none focus:border-accent/60"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrentPassword((v) => !v)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-secondary/50 hover:text-primary transition-colors focus:outline-none cursor-pointer"
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
                    <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary/50" />
                    <input
                      type={showNewPassword ? "text" : "password"}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="••••••••"
                      className={`w-full pl-11 pr-12 py-2.5 bg-surface/50 border rounded-xl text-sm text-primary focus:outline-none transition-all ${
                        passwordErrors.newPassword ? "border-red-500/50 focus:border-red-500" : "border-white/[0.08] focus:border-accent/60"
                      }`}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword((v) => !v)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-secondary/50 hover:text-primary transition-colors focus:outline-none cursor-pointer"
                    >
                      {showNewPassword ? <FiEyeOff className="w-4 h-4" /> : <FiEye className="w-4 h-4" />}
                    </button>
                  </div>
                  {passwordErrors.newPassword && (
                    <p className="text-red-400 text-xs mt-1.5 flex items-center gap-1">
                      <span className="w-1 h-1 rounded-full bg-red-400 shrink-0" />
                      {passwordErrors.newPassword}
                    </p>
                  )}
                </div>

                {/* Confirm New Password */}
                <div>
                  <label className="block text-xs font-bold text-secondary uppercase tracking-wider mb-2">Confirm New Password</label>
                  <div className="relative">
                    <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary/50" />
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      className={`w-full pl-11 pr-12 py-2.5 bg-surface/50 border rounded-xl text-sm text-primary focus:outline-none transition-all ${
                        passwordErrors.confirmPassword ? "border-red-500/50 focus:border-red-500" : "border-white/[0.08] focus:border-accent/60"
                      }`}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword((v) => !v)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-secondary/50 hover:text-primary transition-colors focus:outline-none cursor-pointer"
                    >
                      {showConfirmPassword ? <FiEyeOff className="w-4 h-4" /> : <FiEye className="w-4 h-4" />}
                    </button>
                  </div>
                  {passwordErrors.confirmPassword && (
                    <p className="text-red-400 text-xs mt-1.5 flex items-center gap-1">
                      <span className="w-1 h-1 rounded-full bg-red-400 shrink-0" />
                      {passwordErrors.confirmPassword}
                    </p>
                  )}
                </div>

                {/* Update Password Button */}
                <button
                  type="submit"
                  disabled={!canSavePassword}
                  className={`px-5 py-2.5 rounded-xl font-bold text-primary transition-all flex items-center gap-2 text-sm ${
                    canSavePassword
                      ? "bg-accent hover:opacity-90 cursor-pointer shadow-accent/20"
                      : "bg-surface/50 text-secondary/40 border border-white/[0.05] cursor-not-allowed opacity-60"
                  }`}
                >
                  {savingPassword ? (
                    <span className="w-4 h-4 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
                  ) : (
                    <FiLock className="w-4 h-4" />
                  )}
                  {savingPassword ? "Updating Password..." : "Update Password"}
                </button>
              </form>
            ) : (
              <div className="p-5 rounded-2xl bg-surface/20 border border-border/50 text-xs text-secondary">
                Password management is disabled because your account was created with Google Sign-In.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
