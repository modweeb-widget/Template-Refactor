import { ThemeProvider, useTheme } from "./context/ThemeContext";
import Preloader from "./components/Preloader";
import Header from "./components/Header";
import ContentWrapper from "./components/ContentWrapper";
import Footer from "./components/Footer";

function AppShell() {
  const { theme } = useTheme();

  return (
    <div
      className={`standalone-page-container${theme === "dark" ? " dark-mode" : ""}`}
      dir="rtl"
    >
      <Preloader />
      <Header />
      <ContentWrapper />
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AppShell />
    </ThemeProvider>
  );
}
