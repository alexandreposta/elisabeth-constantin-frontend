import React from 'react';
import SEOHead from '../components/SEOHead';
import '../styles/legal.css';

export default function MentionsLegales() {
  return (
    <div className="legal-page-container">
      <SEOHead
        title="Mentions Légales - Élisabeth Constantin"
        description="Mentions légales du site elisabeth-constantin.fr"
        noindex={true}
      />
      <div className="legal-content">
        <h1>Mentions Légales</h1>
        
        <section className="legal-section">
          <h2>Identification de l'entreprise</h2>
          <div className="legal-info">
            <p><strong>Raison sociale :</strong> Élisabeth Constantin - Artiste Peintre</p>
            <p><strong>Statut juridique :</strong> Entreprise individuelle / Auto-entrepreneur</p>
            <p><strong>SIRET :</strong> [À compléter]</p>
            <p><strong>Code APE :</strong> 9003A (Création artistique relevant des arts plastiques)</p>
            <p><strong>Numéro de TVA intracommunautaire :</strong> [À compléter si applicable]</p>
          </div>
        </section>

        <section className="legal-section">
          <h2>Coordonnées</h2>
          <div className="legal-info">
            <p><strong>Adresse du siège social :</strong><br/>
            [Votre adresse complète]<br/>
            [Code postal] [Ville]<br/>
            France</p>
            <p><strong>Téléphone :</strong> +33 6 85 50 09 73</p>
            <p><strong>Email :</strong> contact@elisabethconstantin.com</p>
          </div>
        </section>

        <section className="legal-section">
          <h2>Directeur de la publication</h2>
          <div className="legal-info">
            <p><strong>Directeur de publication :</strong> Élisabeth Constantin</p>
            <p><strong>Responsable de la rédaction :</strong> Élisabeth Constantin</p>
          </div>
        </section>

        <section className="legal-section">
          <h2>Hébergement du site</h2>
          <div className="legal-info">
            <p><strong>Hébergeur :</strong> [Nom de votre hébergeur]</p>
            <p><strong>Adresse :</strong> [Adresse de l'hébergeur]</p>
            <p><strong>Téléphone :</strong> [Téléphone de l'hébergeur]</p>
            <p><strong>Site web :</strong> [Site web de l'hébergeur]</p>
          </div>
        </section>

        <section className="legal-section">
          <h2>Propriété intellectuelle</h2>
          <div className="legal-info">
            <p>L'ensemble de ce site relève de la législation française et internationale sur le droit d'auteur et la propriété intellectuelle. Tous les droits de reproduction sont réservés, y compris pour les documents téléchargeables et les représentations iconographiques et photographiques.</p>
            
            <p>Les œuvres d'art présentées sur ce site sont la propriété exclusive d'Élisabeth Constantin. Toute reproduction, représentation, modification, publication, adaptation de tout ou partie des éléments du site, quel que soit le moyen ou le procédé utilisé, est interdite, sauf autorisation écrite préalable.</p>
            
            <p>Toute exploitation non autorisée du site ou de l'un quelconque des éléments qu'il contient sera considérée comme constitutive d'une contrefaçon et poursuivie conformément aux dispositions des articles L.335-2 et suivants du Code de Propriété Intellectuelle.</p>
          </div>
        </section>

        <section className="legal-section">
          <h2>Responsabilité</h2>
          <div className="legal-info">
            <p>Les informations contenues sur ce site sont aussi précises que possible et le site remis à jour à différentes périodes de l'année, mais peut toutefois contenir des inexactitudes ou des omissions.</p>
            
            <p>Si vous constatez une lacune, erreur ou ce qui parait être un dysfonctionnement, merci de bien vouloir le signaler par email, à l'adresse contact@elisabethconstantin.com, en décrivant le problème de la manière la plus précise possible.</p>
            
            <p>Tout contenu téléchargé se fait aux risques et périls de l'utilisateur et sous sa seule responsabilité. En conséquence, l'artiste ne saurait être tenu responsable d'un quelconque dommage subi par l'ordinateur de l'utilisateur ou d'une quelconque perte de données consécutives au téléchargement.</p>
          </div>
        </section>

        <section className="legal-section">
          <h2>Droit applicable et attribution de juridiction</h2>
          <div className="legal-info">
            <p>Tout litige en relation avec l'utilisation du site www.elisabethconstantin.com est soumis au droit français. Il est fait attribution exclusive de juridiction aux tribunaux compétents de [Votre ville/département].</p>
          </div>
        </section>

        <section className="legal-section">
          <h2>Collecte et traitement des données personnelles</h2>
          <div className="legal-info">
            <p>Conformément au Règlement Général sur la Protection des Données (RGPD) et à la loi Informatique et Libertés, vous disposez d'un droit d'accès, de rectification, de suppression et de portabilité de vos données personnelles.</p>
            
            <p>Pour exercer ces droits ou pour toute question sur le traitement de vos données dans ce dispositif, vous pouvez contacter notre délégué à la protection des données (ou nous contacter directement) :</p>
            <ul>
              <li>Par voie électronique : contact@elisabethconstantin.com</li>
              <li>Par voie postale : [Votre adresse]</li>
            </ul>
            
            <p>Vous pouvez consulter notre <a href="/politique-confidentialite">Politique de confidentialité</a> pour plus d'informations sur le traitement de vos données.</p>
          </div>
        </section>

        <section className="legal-section">
          <h2>Médiateur de la consommation</h2>
          <div className="legal-info">
            <p>Conformément aux dispositions du Code de la consommation concernant le règlement amiable des litiges, Élisabeth Constantin adhère au Service du Médiateur du e-commerce de la FEVAD (Fédération du e-commerce et de la vente à distance) dont les coordonnées sont les suivantes :</p>
            <ul>
              <li>60 Rue La Boétie – 75008 Paris</li>
              <li><a href="https://www.mediateurfevad.fr" target="_blank" rel="noopener noreferrer">https://www.mediateurfevad.fr</a></li>
            </ul>
            <p>Après démarche préalable écrite des consommateurs vis-à-vis d'Élisabeth Constantin, le Service du Médiateur peut être saisi pour tout litige de consommation dont le règlement n'aurait pas abouti.</p>
          </div>
        </section>

        <div className="legal-footer">
          <p><em>Dernière mise à jour : {new Date().toLocaleDateString('fr-FR')}</em></p>
        </div>
      </div>
    </div>
  );
}
