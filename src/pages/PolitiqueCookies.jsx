import React from 'react';
import { Helmet } from 'react-helmet-async';
import '../styles/legal.css';

export default function PolitiqueCookies() {
  return (
    <div className="legal-page-container">
      <Helmet>
        <title>Politique de Cookies - Élisabeth Constantin</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      <div className="legal-content">
        <h1>Politique de Cookies</h1>
        
        <section className="legal-section">
          <h2>Qu'est-ce qu'un cookie ?</h2>
          <div className="legal-info">
            <p>Un cookie est un petit fichier texte déposé sur votre terminal (ordinateur, tablette, smartphone) lors de la visite d'un site web. Il permet au site de mémoriser des informations sur votre visite, comme votre langue de préférence et d'autres paramètres.</p>
            <p>Les cookies peuvent rendre votre visite suivante plus facile et le site plus utile pour vous.</p>
          </div>
        </section>

        <section className="legal-section">
          <h2>Cookies utilisés sur notre site</h2>
          <div className="legal-info">
            <p>Notre site utilise un nombre minimal de cookies, strictement nécessaires à son fonctionnement. Nous n'utilisons pas de cookies de tracking, d'analyse ou de publicité.</p>
            
            <h3>Cookies strictement nécessaires</h3>
            <p>Ces cookies sont indispensables au fonctionnement du site et ne peuvent pas être désactivés. Ils sont généralement activés en réponse à des actions de votre part équivalant à une demande de services.</p>
            <ul>
              <li><strong>Authentification administrateur :</strong> cookies sécurisés (httpOnly) pour maintenir la session des administrateurs du site</li>
              <li><strong>Sécurité :</strong> protection contre les attaques CSRF et autres menaces de sécurité</li>
            </ul>
            <p><em>Base légale : intérêt légitime (fonctionnement et sécurité du site)</em></p>

            <h3>Cookies de paiement (Stripe)</h3>
            <p>Lors d'un achat, le service de paiement Stripe peut déposer des cookies nécessaires au traitement sécurisé de votre commande :</p>
            <ul>
              <li><strong>Stripe :</strong> cookies de session pour le processus de paiement sécurisé</li>
              <li><strong>Sécurité des paiements :</strong> protection contre la fraude et validation des transactions</li>
            </ul>
            <p>Ces cookies sont automatiquement supprimés à la fin de votre session de paiement.</p>
            <p><em>Base légale : exécution du contrat de vente</em></p>
            <p>Stripe a sa propre politique de cookies que nous vous invitons à consulter : <a href="https://stripe.com/privacy" target="_blank" rel="noopener noreferrer">Politique de confidentialité Stripe</a></p>
          </div>
        </section>

        <section className="legal-section">
          <h2>Durée de conservation</h2>
          <div className="legal-info">
            <p>Les cookies sont conservés pour des durées variables selon leur fonction :</p>
            <ul>
              <li><strong>Cookies d'authentification admin :</strong> durée de la session administrative (supprimés à la déconnexion)</li>
              <li><strong>Cookies de paiement Stripe :</strong> durée de la session de paiement uniquement</li>
            </ul>
            <p>Aucun cookie n'est conservé à des fins de tracking ou d'analyse sur le long terme.</p>
          </div>
        </section>

        <section className="legal-section">
          <h2>Gestion de vos préférences</h2>
          <div className="legal-info">
            <h3>Cookies strictement nécessaires</h3>
            <p>Les cookies que nous utilisons sont strictement nécessaires au fonctionnement du site et à la sécurité des paiements. Ils ne peuvent pas être désactivés sans compromettre ces fonctionnalités essentielles.</p>
            <p>Aucun consentement n'est requis pour ces cookies car ils sont indispensables au service que vous demandez.</p>

            <h3>Paramétrage via votre navigateur</h3>
            <p>Vous pouvez toutefois paramétrer votre navigateur pour être informé des cookies ou les bloquer :</p>
            <ul>
              <li>Être averti avant l'enregistrement d'un cookie</li>
              <li>Supprimer les cookies déjà enregistrés</li>
              <li>Bloquer tous les cookies (peut affecter le fonctionnement du site)</li>
            </ul>

            <h4>Instructions par navigateur :</h4>
            <ul>
              <li><strong>Chrome :</strong> Menu &gt; Paramètres &gt; Confidentialité et sécurité &gt; Cookies</li>
              <li><strong>Firefox :</strong> Menu &gt; Paramètres &gt; Vie privée et sécurité &gt; Cookies</li>
              <li><strong>Safari :</strong> Préférences &gt; Confidentialité &gt; Cookies</li>
              <li><strong>Edge :</strong> Menu &gt; Paramètres &gt; Confidentialité &gt; Cookies</li>
            </ul>
          </div>
        </section>

        <section className="legal-section">
          <h2>Conséquences du blocage des cookies</h2>
          <div className="legal-info">
            <p>Le blocage des cookies utilisés sur notre site peut avoir les conséquences suivantes :</p>
            
            <h3>Cookies d'authentification :</h3>
            <p>Le blocage de ces cookies empêchera :</p>
            <ul>
              <li>L'accès à l'interface d'administration du site</li>
              <li>La gestion du contenu par les administrateurs</li>
            </ul>
            <p><em>Note : Ces cookies n'affectent que les administrateurs du site, pas les visiteurs.</em></p>

            <h3>Cookies de paiement Stripe :</h3>
            <p>Le blocage de ces cookies peut empêcher :</p>
            <ul>
              <li>Le traitement sécurisé de vos commandes</li>
              <li>La protection contre la fraude</li>
              <li>La finalisation de vos achats</li>
            </ul>
            <p><em>Note : Ces cookies ne sont activés que lors du processus de paiement.</em></p>
          </div>
        </section>

        <section className="legal-section">
          <h2>Cookies et données personnelles</h2>
          <div className="legal-info">
            <p>Les cookies que nous utilisons peuvent contenir des données personnelles minimales :</p>
            <ul>
              <li>Identifiants de session administrateur (chiffrés et sécurisés)</li>
              <li>Données de session de paiement (traitées par Stripe)</li>
            </ul>
            
            <p>Ces données sont traitées conformément à notre <a href="/politique-confidentialite">Politique de confidentialité</a> et au RGPD.</p>
            
            <p>Vous disposez des droits suivants concernant ces données :</p>
            <ul>
              <li>Droit d'accès et de rectification</li>
              <li>Droit à l'effacement</li>
              <li>Droit d'opposition</li>
              <li>Droit à la portabilité</li>
            </ul>
            
            <p>Pour exercer ces droits : contact@elisabethconstantin.com</p>
          </div>
        </section>

        <section className="legal-section">
          <h2>Transferts de données</h2>
          <div className="legal-info">
            <p>Certains cookies peuvent entraîner des transferts de données vers des pays tiers :</p>
            
            <h3>Stripe (paiements) :</h3>
            <ul>
              <li>Données de paiement traitées aux États-Unis et en Europe</li>
              <li>Certification PCI-DSS et garanties appropriées</li>
              <li>Transferts conformes au RGPD</li>
              <li>Plus d'infos : <a href="https://stripe.com/privacy" target="_blank" rel="noopener noreferrer">Politique de confidentialité Stripe</a></li>
            </ul>
            
            <p>Aucun autre transfert de données via cookies n'est effectué vers des pays tiers.</p>
          </div>
        </section>

        <section className="legal-section">
          <h2>Contact et réclamations</h2>
          <div className="legal-info">
            <p>Pour toute question concernant notre utilisation des cookies :</p>
            <ul>
              <li><strong>Email :</strong> contact@elisabethconstantin.com</li>
              <li><strong>Téléphone :</strong> +33 6 85 50 09 73</li>
              <li><strong>Courrier :</strong> [Votre adresse]</li>
            </ul>
            
            <p>En cas de réclamation concernant l'utilisation de cookies, vous pouvez également contacter la CNIL :</p>
            <ul>
              <li><strong>Site web :</strong> <a href="https://www.cnil.fr" target="_blank" rel="noopener noreferrer">www.cnil.fr</a></li>
              <li><strong>Téléphone :</strong> 01 53 73 22 22</li>
            </ul>
          </div>
        </section>

        <section className="legal-section">
          <h2>Évolution de cette politique</h2>
          <div className="legal-info">
            <p>Cette politique de cookies peut être modifiée à tout moment, notamment :</p>
            <ul>
              <li>Pour se conformer aux évolutions réglementaires</li>
              <li>Lors de modifications techniques du site</li>
              <li>Pour améliorer l'information des utilisateurs</li>
            </ul>
            
            <p>En cas de modification substantielle, nous vous en informerons par :</p>
            <ul>
              <li>Une notification sur le site</li>
              <li>Un email si vous êtes client</li>
              <li>Une nouvelle demande de consentement si nécessaire</li>
            </ul>
            
            <p>Nous vous encourageons à consulter régulièrement cette page pour rester informé de nos pratiques.</p>
          </div>
        </section>

        <div className="legal-footer">
          <p><em>Dernière mise à jour : {new Date().toLocaleDateString('fr-FR')}</em></p>
        </div>
      </div>
    </div>
  );
}
