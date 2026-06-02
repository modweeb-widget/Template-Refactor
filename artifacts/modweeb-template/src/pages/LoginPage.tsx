import { useEffect, useRef, useState } from "react";
import { useAuth } from "../context/AuthContext";
import Logo from "../components/Logo";

const CLIENT_ID =
  "36053852280-iqmfrcu1m2vd8ai6sc4e10r6afaiiln0.apps.googleusercontent.com";

export type LoginMode = "spa" | "popup" | "standalone";

interface LoginPageProps {
  mode?: LoginMode;
  onSuccess?: () => void;
}

export default function LoginPage({ mode = "spa", onSuccess }: LoginPageProps) {
  const { isLoggedIn, login } = useAuth();
  const [toast, setToast] = useState("");
  const [loading, setLoading] = useState(false);
  const clientRef = useRef<GoogleTokenClient | null>(null);

  useEffect(() => {
    if (!isLoggedIn) return;
    if (mode === "spa") {
      window.location.href = "/account";
    } else if (mode === "standalone") {
      window.location.href = "/account.html";
    }
  }, [isLoggedIn, mode]);

  useEffect(() => {
    let attempts = 0;
    const tryInit = () => {
      if (window.google?.accounts?.oauth2) {
        clientRef.current = window.google.accounts.oauth2.initTokenClient({
          client_id: CLIENT_ID,
          scope: "openid profile email",
          callback: async (response) => {
            if (!response.access_token) {
              showToast("لم يتم العثور على رمز الوصول. يرجى المحاولة مرة أخرى.");
              setLoading(false);
              return;
            }
            await handleToken(response.access_token);
          },
        });
      } else if (attempts < 20) {
        attempts++;
        setTimeout(tryInit, 300);
      }
    };
    tryInit();
  }, []);

  function showToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(""), 3000);
  }

  async function handleToken(token: string) {
    try {
      showToast("جارٍ تسجيل الدخول، يرجى الانتظار...");
      const res = await fetch(
        "https://www.googleapis.com/oauth2/v3/userinfo",
        { headers: { Authorization: "Bearer " + token } }
      );
      if (!res.ok) throw new Error("Failed to fetch user info");
      const data = await res.json();

      const userData = {
        name: data.name as string,
        email: data.email as string,
        image: (data.picture as string) || "",
      };

      login(userData);
      showToast("تم تسجيل الدخول بنجاح!");

      if (mode === "popup") {
        if (window.opener) {
          window.opener.postMessage(
            { type: "loginSuccess", user: userData },
            "*"
          );
        }
        setTimeout(() => window.close(), 800);
      } else if (mode === "standalone") {
        const cbu = new URLSearchParams(window.location.search).get("cbu");
        const target = cbu ? decodeURIComponent(cbu) : "/account.html";
        setTimeout(() => { window.location.href = target; }, 800);
      } else {
        setTimeout(() => { window.location.href = "/account"; }, 800);
      }

      onSuccess?.();
    } catch {
      showToast("حدث خطأ أثناء تسجيل الدخول. يرجى المحاولة مرة أخرى.");
    } finally {
      setLoading(false);
    }
  }

  function handleGoogleLogin() {
    if (!clientRef.current) {
      showToast("جارٍ تهيئة الخدمة، يرجى المحاولة بعد لحظة.");
      return;
    }
    setLoading(true);
    clientRef.current.requestAccessToken();
  }

  return (
    <div className="login-page">
      <div className="login-page__inner">
        <div className="login-page__brand">
          <div className="login-page__brand-logo">
            <Logo />
          </div>
          <span className="login-page__brand-name">Modweeb Design</span>
        </div>

        <div className="login-card">
          <div className="login-card__head">
            <b className="login-card__title">مرحباً بعودتك</b>
            <p className="login-card__subtitle">
              تسجيل الدخول باستخدام حسابك الاجتماعي
            </p>
          </div>

          <div className="login-card__body">
            <button
              className="login-card__google-btn"
              onClick={handleGoogleLogin}
              disabled={loading}
            >
              <svg
                viewBox="0 0 24 24"
                className="login-card__google-icon"
                aria-hidden="true"
              >
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              {loading ? "جارٍ التسجيل..." : "تسجيل الدخول باستخدام Google"}
            </button>
          </div>
        </div>

        <p className="login-page__terms">
          بالنقر على متابعة، فإنك توافق على{" "}
          <a href="/terms.html" className="login-page__link">
            شروط الخدمة
          </a>{" "}
          و
          <br />
          <a href="/privacy-policy.html" className="login-page__link">
            سياسة الخصوصية
          </a>
          .
        </p>
      </div>

      {toast && <div className="page-toast page-toast--active">{toast}</div>}
    </div>
  );
}
