import { useState, useRef, useEffect } from "react";
import { useLocation } from "wouter";
import { useAuth } from "../context/AuthContext";

function isStandalonePage(): boolean {
  return window.location.pathname.endsWith(".html");
}

function goToPage(spaPath: string, navigate: (to: string) => void): void {
  if (isStandalonePage()) {
    const htmlMap: Record<string, string> = {
      "/login": "/login.html",
      "/account": "/account.html",
      "/": "/",
    };
    window.location.href = htmlMap[spaPath] ?? spaPath;
  } else {
    navigate(spaPath);
  }
}

export default function UserMenu() {
  const { user, isLoggedIn, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const [, navigate] = useLocation();
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, []);

  if (!isLoggedIn) {
    return (
      <button
        className="user-menu__login-btn"
        onClick={() => goToPage("/login", navigate)}
        aria-label="تسجيل الدخول"
        title="تسجيل الدخول"
      >
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
          <polyline points="10 17 15 12 10 7" />
          <line x1="15" y1="12" x2="3" y2="12" />
        </svg>
      </button>
    );
  }

  return (
    <div className="user-menu" ref={menuRef}>
      <button
        className="user-menu__trigger"
        onClick={() => setOpen((o) => !o)}
        aria-label="قائمة المستخدم"
        aria-expanded={open}
        aria-haspopup="true"
      >
        {user?.picture ? (
          <img
            src={user.picture}
            alt={user.name}
            className="user-menu__avatar"
            referrerPolicy="no-referrer"
          />
        ) : (
          <span className="user-menu__initials">
            {user?.name?.charAt(0) || "م"}
          </span>
        )}
      </button>

      {open && (
        <div className="user-menu__dropdown" role="menu">
          <div className="user-menu__header">
            {user?.picture ? (
              <img
                src={user.picture}
                alt={user.name}
                className="user-menu__dropdown-avatar"
                referrerPolicy="no-referrer"
              />
            ) : (
              <span className="user-menu__dropdown-initials">
                {user?.name?.charAt(0) || "م"}
              </span>
            )}
            <div className="user-menu__info">
              <span className="user-menu__name">{user?.name}</span>
              <span className="user-menu__email">{user?.email}</span>
            </div>
          </div>

          <div className="user-menu__divider" />

          <button
            className="user-menu__item"
            role="menuitem"
            onClick={() => {
              setOpen(false);
              goToPage("/account", navigate);
            }}
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
            حسابي
          </button>

          <button
            className="user-menu__item user-menu__item--danger"
            role="menuitem"
            onClick={() => {
              setOpen(false);
              logout();
              goToPage("/", navigate);
            }}
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
            تسجيل الخروج
          </button>
        </div>
      )}
    </div>
  );
}
