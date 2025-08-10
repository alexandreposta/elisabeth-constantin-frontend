import { FaInstagram, FaFacebookF, FaYoutube } from "react-icons/fa";
import { useLanguage } from "../context/LanguageContext";
import "../styles/footer.css";

export default function Footer() {
  const { t } = useLanguage();
  
  return (
    <footer className="footer">
      <div className="footer-social">
        <a
          className="footer-icon"
          href="https://www.instagram.com/elisabeth_constantin/?hl=fr"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Instagram"
        >
          <FaInstagram />
        </a>
        <a
          className="footer-icon"
          href="https://www.facebook.com/Elisabethconstantin.8/"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Facebook"
        >
          <FaFacebookF />
        </a>
        <a
          className="footer-icon"
          href="https://www.youtube.com/@elisabethconstantin"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="YouTube"
        >
          <FaYoutube />
        </a>
      </div>
      <div className="footer-links">
        <a href="/mes-commandes" className="footer-link">
          {t('footer.track_orders', 'Suivi de commandes')}
        </a>
        <a href="/mentions-legales" className="footer-link">
          {t('footer.legal_notice', 'Mentions légales')}
        </a>
        <a href="/politique-confidentialite" className="footer-link">
          {t('footer.privacy_policy', 'Politique de confidentialité')}
        </a>
        <a href="/conditions-generales-vente" className="footer-link">
          {t('footer.terms', 'CGV')}
        </a>
        <a href="/politique-cookies" className="footer-link">
          {t('footer.cookies', 'Cookies')}
        </a>
        <a href="/admin/dashboard" className="footer-link admin-link">
          {t('admin.dashboard', 'Dashboard Admin')}
        </a>
      </div>
      <div className="footer-copy">
        © {new Date().getFullYear()} Elisabeth Constantin. {t('footer.rights', 'Tous droits réservés.')}
      </div>
      <div className="footer-oblig">
        {t('footer.contact', 'Pour toute question, contactez-moi via les réseaux sociaux.')}
      </div>
    </footer>
  );
}
