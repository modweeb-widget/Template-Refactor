import SocialLinks from "./SocialLinks";

export default function Footer() {
  return (
    <footer className="custom-footer">
      <div className="footer-container">
        <div className="footer-info">
          <span>&copy; 2026 جميع الحقوق محفوظة.</span>
          <span className="separator"></span>
          <span>
            صنع بـ 🤍 بواسطة{" "}
            <a
              href="https://github.com/modweeb"
              target="_blank"
              rel="noopener"
            >
              مود ويب
            </a>
            !
          </span>
        </div>
        <SocialLinks />
      </div>
    </footer>
  );
}
