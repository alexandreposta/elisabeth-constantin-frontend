import { FaInstagram, FaFacebookF, FaYoutube } from "react-icons/fa";
import { useState, useEffect } from "react";
import { subscribeToNewsletter } from "../api/newsletter";
import "../styles/footer.css";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [subscriptionStatus, setSubscriptionStatus] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Log de débogage au chargement du composant
  useEffect(() => {
    console.log('🔵 [Footer] Composant Footer chargé');
    console.log('🔵 [Footer] Module newsletter importé:', { subscribeToNewsletter });
  }, []);

  const handleNewsletterSubmit = async (e) => {
    e.preventDefault();
    console.log('🔄 [Footer] Début du processus d\'abonnement');
    console.log('🔄 [Footer] Email saisi:', email);
    
    if (!email || !email.includes("@")) {
      console.warn('⚠️ [Footer] Email invalide:', email);
      setSubscriptionStatus("Veuillez entrer une adresse email valide");
      return;
    }

    console.log('🔄 [Footer] Email valide, début de l\'abonnement...');
    setIsLoading(true);
    setSubscriptionStatus(""); // Clear previous status
    
    try {
      console.log('🔄 [Footer] Appel de subscribeToNewsletter...');
      const result = await subscribeToNewsletter(email);
      console.log('✅ [Footer] Résultat reçu:', result);
      
      setSubscriptionStatus("✅ Inscription réussie ! Vérifiez votre boîte mail.");
      setEmail("");
      console.log('✅ [Footer] État mis à jour avec succès');
    } catch (error) {
      console.error('❌ [Footer] Erreur attrapée:', error);
      console.error('❌ [Footer] Error type:', typeof error);
      console.error('❌ [Footer] Error message:', error.message);
      
      if (error.message && error.message.includes("déjà abonné")) {
        console.log('ℹ️ [Footer] Utilisateur déjà abonné');
        setSubscriptionStatus("Vous êtes déjà abonné(e) à notre newsletter !");
      } else {
        console.log('❌ [Footer] Erreur générique');
        setSubscriptionStatus(`Erreur: ${error.message || 'Réessayez plus tard'}`);
      }
    } finally {
      console.log('🔄 [Footer] Fin du processus, arrêt du loading');
      setIsLoading(false);
      setTimeout(() => {
        console.log('🔄 [Footer] Nettoyage du status après 4s');
        setSubscriptionStatus("")
      }, 4000);
    }
  };

  return (
    <footer className="footer">
      {/* Section Newsletter */}
      <div className="footer-newsletter">
        <h3 className="newsletter-title">Restez informé(e)</h3>
        <p className="newsletter-description">
          Recevez les dernières créations et événements en avant-première
        </p>
        <form className="newsletter-form" onSubmit={handleNewsletterSubmit}>
          <input
            type="email"
            placeholder="Votre adresse email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="newsletter-input"
            disabled={isLoading}
          />
          <button 
            type="submit" 
            className="newsletter-button"
            disabled={isLoading}
          >
            {isLoading ? "..." : "S'abonner"}
          </button>
        </form>
        {subscriptionStatus && (
          <p className={`newsletter-status ${subscriptionStatus.includes("✅") ? "success" : "error"}`}>
            {subscriptionStatus}
          </p>
        )}
      </div>
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
