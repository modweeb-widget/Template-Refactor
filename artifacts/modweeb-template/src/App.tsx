import { Switch, Route } from "wouter";
import { ThemeProvider, useTheme } from "./context/ThemeContext";
import { AuthProvider } from "./context/AuthContext";
import Preloader from "./components/Preloader";
import Header from "./components/Header";
import ContentWrapper from "./components/ContentWrapper";
import Footer from "./components/Footer";
import LoginPage from "./pages/LoginPage";
import AccountPage from "./pages/AccountPage";

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
          <Route path="/login">
            <LoginPage mode="spa" />
          </Route>
          <Route path="/account">
            <AccountPage loginHref="/login" />
          </Route>
          <Route>{/* home placeholder */}</Route>
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
