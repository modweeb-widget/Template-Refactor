import { Switch, Route } from "wouter";
import { ThemeProvider, useTheme } from "./context/ThemeContext";
import { AuthProvider } from "./context/AuthContext";
import Preloader from "./components/Preloader";
import Header from "./components/Header";
import ContentWrapper from "./components/ContentWrapper";
import Footer from "./components/Footer";
import LoginPage from "./pages/LoginPage";
import AccountPage from "./pages/AccountPage";

function HomePage() {
  return <div className="home-placeholder" />;
}

function AppShell() {
  const { theme } = useTheme();
  return (
    <div
      className={`standalone-page-container${theme === "dark" ? " dark-mode" : ""}`}
      dir="rtl"
    >
      <Preloader />
      <Header />
      <ContentWrapper>
        <Switch>
          <Route path="/login" component={LoginPage} />
          <Route path="/account" component={AccountPage} />
          <Route component={HomePage} />
        </Switch>
      </ContentWrapper>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppShell />
      </AuthProvider>
    </ThemeProvider>
  );
}
