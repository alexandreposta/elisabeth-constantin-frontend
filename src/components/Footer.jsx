import { FaInstagram, FaFacebookF, FaYoutube } from "react-icons/fa";
import "../styles/footer.css";
import NewsletterSubscribe from './NewsletterSubscribe';
import { useTranslation } from "react-i18next";

export default function Footer() {
  const { t } = useTranslation();
  const currentYear = new Date().getFullYear();

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
          {t('footer.links.orders')}
        </a>
        <a href="/mentions-legales" className="footer-link">
          {t('footer.links.mentions')}
        </a>
        <a href="/politique-confidentialite" className="footer-link">
          {t('footer.links.privacy')}
        </a>
        <a href="/conditions-generales-vente" className="footer-link">
          {t('footer.links.terms')}
        </a>
        <a href="/politique-cookies" className="footer-link">
          {t('footer.links.cookies')}
        </a>
        <a href="/admin/dashboard" className="footer-link admin-link">
          {t('footer.links.admin')}
        </a>
      </div>
      <div className="footer-copy">
        {t('footer.caption', { year: currentYear })}
      </div>
      <div className="footer-oblig">
        {t('footer.contact')}
      </div>
    </footer>
  );
}
