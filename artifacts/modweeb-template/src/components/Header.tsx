import Logo from "./Logo";
import ThemeToggle from "./ThemeToggle";

export default function Header() {
  return (
    <header className="custom-header">
      <div className="header-container">
        <a
          href="https://modweeb.com"
          className="header-brand"
          aria-label="Modweeb"
        >
          <div className="logo-box">
            <Logo />
          </div>
          <span className="header-title-text">Tools Modweeb</span>
        </a>
        <ThemeToggle />
      </div>
    </header>
  );
}
