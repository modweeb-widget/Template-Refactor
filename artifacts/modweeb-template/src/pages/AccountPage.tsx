import { useEffect, useState, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import Logo from "../components/Logo";

interface Session {
  id: number;
  time: string;
  os: string;
  ip: string;
  isCurrent: boolean;
}

function getOS(): string {
  const ua = navigator.userAgent;
  if (ua.includes("Windows")) return "ويندوز";
  if (ua.includes("Mac")) return "ماك";
  if (ua.includes("Linux")) return "لينكس";
  if (ua.includes("Android")) return "أندرويد";
  if (ua.includes("iPhone") || ua.includes("iPad")) return "آيفون/آيباد";
  return "غير معروف";
}

async function getIP(): Promise<string> {
  try {
    const res = await fetch("https://api.ipify.org?format=json");
    const data = await res.json();
    return data.ip;
  } catch {
    return "غير معروف";
  }
}

function getCurrentTime(): string {
  return new Date().toLocaleString("en-US", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

function formatDate(d: string | null): string {
  if (!d || d === "undefined" || d === "null") return "غير محدد";
  try {
    const dt = new Date(d);
    if (isNaN(dt.getTime())) return "غير محدد";
    return dt
      .toLocaleDateString("en-US", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
      .replace(",", "");
  } catch {
    return "غير محدد";
  }
}

function loadSessions(): Session[] {
  try {
    const s = localStorage.getItem("userSessions");
    return s ? JSON.parse(s) : [];
  } catch {
    return [];
  }
}

function saveSessions(sessions: Session[]) {
  localStorage.setItem("userSessions", JSON.stringify(sessions));
}

interface AccountPageProps {
  onLogout?: () => void;
  loginHref?: string;
}

export default function AccountPage({
  onLogout,
  loginHref = "/login.html",
}: AccountPageProps = {}) {
  const { isLoggedIn, user, logout, updateProfile } = useAuth();
  const [sessions, setSessions] = useState<Session[]>([]);
  const [showSettings, setShowSettings] = useState(false);
  const [editName, setEditName] = useState("");
  const [editPicUrl, setEditPicUrl] = useState("");
  const [toast, setToast] = useState("");
  const settingsRef = useRef<HTMLDivElement>(null);

  function showToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(""), 3000);
  }

  useEffect(() => {
    if (!isLoggedIn) return;
    const existing = loadSessions();
    if (!existing.find((s) => s.isCurrent)) {
      const session: Session = {
        id: Date.now(),
        time: getCurrentTime(),
        os: getOS(),
        ip: "جارٍ التحميل...",
        isCurrent: true,
      };
      const updated = [...existing.filter((s) => !s.isCurrent), session];
      saveSessions(updated);
      setSessions(updated);
      getIP().then((ip) => {
        session.ip = ip;
        saveSessions(updated);
        setSessions([...updated]);
      });
    } else {
      setSessions(existing);
    }
  }, [isLoggedIn]);

  useEffect(() => {
    function handleOutside(e: MouseEvent) {
      if (
        settingsRef.current &&
        !settingsRef.current.contains(e.target as Node)
      ) {
        setShowSettings(false);
      }
    }
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, []);

  function removeSession(index: number) {
    const updated = sessions.filter((_, i) => i !== index);
    saveSessions(updated);
    setSessions(updated);
    showToast("تم إزالة الجلسة بنجاح");
  }

  function handleFileUpload(file: File) {
    const reader = new FileReader();
    reader.onload = (e) => {
      setEditPicUrl(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  }

  function handleSaveProfile(e: React.FormEvent) {
    e.preventDefault();
    const updates: { name?: string; picture?: string } = {};
    if (editName.trim()) updates.name = editName.trim();
    if (editPicUrl.trim()) updates.picture = editPicUrl.trim();
    if (Object.keys(updates).length === 0) {
      showToast("لا توجد تغييرات للحفظ");
      return;
    }
    updateProfile(updates);
    setShowSettings(false);
    showToast("تم حفظ التعديلات بنجاح!");
  }

  function handleLogout() {
    logout();
    if (onLogout) onLogout();
  }

  /* ────────── Guest Card ────────── */
  if (!isLoggedIn) {
    return (
      <div className="account-page account-page--guest">
        <div className="account-page__inner">
          <div className="acct-card">
            <div className="acct-card__content">
              <div className="acct-guest">
                <div className="acct-guest__icon">
                  <Logo />
                </div>
                <h2 className="acct-guest__title">لم تقم بتسجيل الدخول بعد</h2>
                <p className="acct-guest__subtitle">
                  سجّل دخولك للوصول إلى حسابك وإدارة إعداداتك
                </p>
                <div className="acct-guest__actions">
                  <a href={loginHref} className="acct-btn acct-btn--black">
                    <svg viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
                      <polyline points="10 17 15 12 10 7" />
                      <line x1="15" y1="12" x2="3" y2="12" />
                    </svg>
                    تسجيل الدخول
                  </a>
                  <a href="/" className="acct-btn acct-btn--outline">
                    <svg viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                      <polyline points="9 22 9 12 15 12 15 22" />
                    </svg>
                    الصفحة الرئيسية
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
        {toast && <div className="page-toast page-toast--active">{toast}</div>}
      </div>
    );
  }

  /* ────────── Logged-in Card ────────── */
  return (
    <div className="account-page">
      <div className="account-page__inner">
        <div className="acct-card">
          <div className="acct-card__content">
            <div className="acct-card__top">
              <div className="acct-card__avatar-wrap">
                {user?.picture ? (
                  <img
                    src={user.picture}
                    alt={user.name}
                    className="acct-card__avatar"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <span className="acct-card__avatar acct-card__avatar--initial">
                    {user?.name?.charAt(0) || "م"}
                  </span>
                )}
              </div>

              <div className="acct-card__info">
                <h2 className="acct-card__name">{user?.name}</h2>
                <p className="acct-card__email">{user?.email}</p>
                <p className="acct-card__join">
                  انضم في: {formatDate(user?.joinDate || null)}
                </p>
              </div>

              <div className="acct-card__actions" ref={settingsRef}>
                <button
                  className="settings-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowSettings((s) => !s);
                    setEditName(user?.name || "");
                    setEditPicUrl("");
                  }}
                  aria-expanded={showSettings}
                  title="الإعدادات"
                >
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M12 15A3 3 0 1 0 12 9 3 3 0 0 0 12 15Z" />
                    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
                  </svg>
                  <span>الإعدادات</span>
                </button>

                {showSettings && (
                  <div className="settings-panel">
                    <form onSubmit={handleSaveProfile}>
                      <label className="settings-panel__label">
                        الاسم:
                        <input
                          type="text"
                          className="settings-panel__input"
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          maxLength={32}
                        />
                      </label>
                      <div className="settings-panel__divider" />
                      <div className="settings-panel__section-title">
                        تغيير الصورة:
                      </div>
                      <label className="settings-panel__label">
                        (إما برفع صورة من جهازك)
                        <input
                          type="file"
                          accept="image/*"
                          className="settings-panel__input"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleFileUpload(file);
                          }}
                          style={{ padding: 0 }}
                        />
                      </label>
                      <div className="settings-panel__divider" />
                      <label className="settings-panel__label">
                        (أو بإضافة رابط مباشر للصورة)
                        <input
                          type="url"
                          className="settings-panel__input"
                          placeholder="https://example.com/avatar.jpg"
                          value={editPicUrl}
                          onChange={(e) => setEditPicUrl(e.target.value)}
                        />
                      </label>
                      <button
                        type="submit"
                        className="acct-btn acct-btn--black acct-btn--full"
                        style={{ marginTop: 14 }}
                      >
                        حفظ التعديلات
                      </button>
                    </form>
                  </div>
                )}
              </div>
            </div>

            <div className="acct-card__divider" />

            <div className="acct-card__sessions">
              <h3 className="acct-card__section-title">الجلسات النشطة</h3>
              <ul className="acct-sessions">
                {sessions.map((session, i) => (
                  <li
                    key={session.id}
                    className={`acct-session${session.isCurrent ? " acct-session--current" : ""}`}
                  >
                    <div className="acct-session__icon">
                      <svg viewBox="0 0 24 24" aria-hidden="true">
                        <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
                        <line x1="8" y1="21" x2="16" y2="21" />
                        <line x1="12" y1="17" x2="12" y2="21" />
                      </svg>
                    </div>
                    <div className="acct-session__info">
                      <div className="acct-session__os">
                        {session.os}
                        {session.isCurrent && (
                          <span className="acct-session__badge">
                            الجلسة الحالية
                          </span>
                        )}
                      </div>
                      <div className="acct-session__meta">
                        IP: {session.ip} · {session.time}
                      </div>
                    </div>
                    {!session.isCurrent && (
                      <button
                        className="acct-session__remove"
                        onClick={() => removeSession(i)}
                        aria-label="إزالة الجلسة"
                        title="إزالة"
                      >
                        <svg viewBox="0 0 24 24" aria-hidden="true">
                          <line x1="18" y1="6" x2="6" y2="18" />
                          <line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                      </button>
                    )}
                  </li>
                ))}
                {sessions.length === 0 && (
                  <li className="acct-session acct-session--empty">
                    لا توجد جلسات مسجّلة.
                  </li>
                )}
              </ul>
            </div>

            <div className="acct-card__divider" />

            <div className="acct-card__footer">
              <button
                className="acct-btn acct-btn--outline"
                onClick={handleLogout}
              >
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                  <polyline points="16 17 21 12 16 7" />
                  <line x1="21" y1="12" x2="9" y2="12" />
                </svg>
                تسجيل الخروج
              </button>
            </div>
          </div>
        </div>
      </div>

      {toast && <div className="page-toast page-toast--active">{toast}</div>}
    </div>
  );
}
