import { ThemeProvider, useTheme } from "./context/ThemeContext";
import { AuthProvider } from "./context/AuthContext";
import Preloader from "./components/Preloader";
import Header from "./components/Header";
import ContentWrapper from "./components/ContentWrapper";
import Footer from "./components/Footer";
import AccountPage from "./pages/AccountPage";

function AccountShell() {
  const { theme } = useTheme();

  return (
    <div
      className={`standalone-page-container${theme === "dark" ? " dark-mode" : ""}`}
      dir="rtl"
    >
      <Preloader />
      <Header />
      <ContentWrapper>
        <AccountPage loginHref="/login.html" />
      </ContentWrapper>
      <Footer />
    </div>
  );
}

export default function AccountApp() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AccountShell />
      </AuthProvider>
    </ThemeProvider>
  );
}
