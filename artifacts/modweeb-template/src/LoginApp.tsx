import { ThemeProvider, useTheme } from "./context/ThemeContext";
import { AuthProvider } from "./context/AuthContext";
import Preloader from "./components/Preloader";
import Header from "./components/Header";
import ContentWrapper from "./components/ContentWrapper";
import Footer from "./components/Footer";
import LoginPage, { LoginMode } from "./pages/LoginPage";

function LoginShell() {
  const { theme } = useTheme();
  const isPopup =
    typeof window !== "undefined" &&
    window.opener !== null &&
    window.opener !== window;

  const mode: LoginMode = isPopup ? "popup" : "standalone";

  if (isPopup) {
    return (
      <div
        className={`standalone-page-container${theme === "dark" ? " dark-mode" : ""}`}
        dir="rtl"
        style={{ position: "relative", height: "100vh" }}
      >
        <Preloader />
        <ContentWrapper>
          <LoginPage mode={mode} />
        </ContentWrapper>
      </div>
    );
  }

  return (
    <div
      className={`standalone-page-container${theme === "dark" ? " dark-mode" : ""}`}
      dir="rtl"
    >
      <Preloader />
      <Header />
      <ContentWrapper>
        <LoginPage mode={mode} />
      </ContentWrapper>
      <Footer />
    </div>
  );
}

export default function LoginApp() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <LoginShell />
      </AuthProvider>
    </ThemeProvider>
  );
}
