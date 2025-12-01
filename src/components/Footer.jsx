import { FaInstagram, FaFacebookF, FaYoutube } from "react-icons/fa";
import "../styles/footer.css";
import NewsletterSubscribe from './NewsletterSubscribe';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-top">
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
        <div className="footer-newsletter">
          <NewsletterSubscribe />
        </div>
      </div>
      <div className="footer-links">
        <a href="/mes-commandes" className="footer-link">
          Suivi de commandes
        </a>
        <a href="/mentions-legales" className="footer-link">
          Mentions légales
        </a>
        <a href="/politique-confidentialite" className="footer-link">
          Politique de confidentialité
        </a>
        <a href="/conditions-generales-vente" className="footer-link">
          CGV
        </a>
        <a href="/politique-cookies" className="footer-link">
          Cookies
        </a>
        <a href="/admin/dashboard" className="footer-link admin-link">
          Dashboard Admin
        </a>
      </div>
      <div className="footer-copy">
        © {new Date().getFullYear()} Elisabeth Constantin. Tous droits réservés.
      </div>
      <div className="footer-oblig">
        Pour toute question, contactez-moi via les réseaux sociaux.
      </div>
    </footer>
  );
}
