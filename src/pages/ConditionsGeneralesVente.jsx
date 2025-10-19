import React from 'react';
import { Helmet } from 'react-helmet-async';
import '../styles/legal.css';

export default function ConditionsGeneralesVente() {
  return (
    <div className="legal-page-container">
      <Helmet>
        <title>Conditions Générales de Vente - Élisabeth Constantin</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      <div className="legal-content">
        <h1>Conditions Générales de Vente</h1>
        
        <section className="legal-section">
          <h2>Article 1 - Objet et champ d'application</h2>
          <div className="legal-info">
            <p>Les présentes conditions générales de vente (CGV) s'appliquent à toutes les ventes d'œuvres d'art réalisées par Élisabeth Constantin, artiste peintre, via son site internet www.elisabethconstantin.com.</p>
            <p>Toute commande implique l'acceptation pleine et entière de ces conditions générales de vente par l'acheteur.</p>
            <p>Élisabeth Constantin se réserve le droit de modifier ses CGV à tout moment. Les CGV applicables sont celles en vigueur au moment de la validation de la commande.</p>
          </div>
        </section>

        <section className="legal-section">
          <h2>Article 2 - Identification du vendeur</h2>
          <div className="legal-info">
            <p><strong>Raison sociale :</strong> Élisabeth Constantin - Artiste Peintre</p>
            <p><strong>Statut :</strong> Entreprise individuelle / Auto-entrepreneur</p>
            <p><strong>SIRET :</strong> [À compléter]</p>
            <p><strong>Adresse :</strong> [Votre adresse]</p>
            <p><strong>Email :</strong> contact@elisabethconstantin.com</p>
            <p><strong>Téléphone :</strong> +33 6 85 50 09 73</p>
          </div>
        </section>

        <section className="legal-section">
          <h2>Article 3 - Produits</h2>
          <div className="legal-info">
            <p>Les œuvres proposées à la vente sont des créations artistiques originales et uniques réalisées par Élisabeth Constantin. Chaque œuvre est accompagnée :</p>
            <ul>
              <li>D'un certificat d'authenticité signé par l'artiste</li>
              <li>D'une facture détaillée</li>
              <li>D'informations sur les matériaux utilisés et les dimensions</li>
            </ul>
            <p>Les photographies et descriptions présentes sur le site sont les plus fidèles possibles mais ne peuvent assurer une similitude parfaite avec l'œuvre proposée, notamment en ce qui concerne les couleurs qui peuvent varier selon les écrans.</p>
            <p>Chaque œuvre étant unique, seul un exemplaire est disponible à la vente.</p>
          </div>
        </section>

        <section className="legal-section">
          <h2>Article 4 - Prix</h2>
          <div className="legal-info">
            <p>Les prix sont indiqués en euros, toutes taxes comprises (TTC), hors frais de livraison.</p>
            <p>Les prix peuvent être modifiés à tout moment, mais seront facturés sur la base des tarifs en vigueur au moment de la validation de la commande.</p>
            <p>Les frais de livraison sont offerts pour toute commande en France métropolitaine. Pour les autres destinations, les frais seront calculés selon le tarif en vigueur et communiqués avant validation de la commande.</p>
            <p>En cas d'augmentation de la TVA, les prix pourront être majorés du pourcentage d'augmentation.</p>
          </div>
        </section>

        <section className="legal-section">
          <h2>Article 5 - Commande</h2>
          <div className="legal-info">
            <p>Les commandes peuvent être passées uniquement via le site internet www.elisabethconstantin.com, 24h/24 et 7j/7.</p>
            
            <h3>Processus de commande :</h3>
            <ol>
              <li>Sélection de l'œuvre et ajout au panier</li>
              <li>Vérification du panier et des informations</li>
              <li>Saisie des informations de livraison et de facturation</li>
              <li>Choix du mode de paiement</li>
              <li>Validation et paiement de la commande</li>
              <li>Confirmation par email</li>
            </ol>
            
            <p>La vente sera considérée comme définitive après :</p>
            <ul>
              <li>Validation du paiement par notre prestataire</li>
              <li>Débit effectif du compte de l'acheteur</li>
              <li>Envoi de l'email de confirmation</li>
            </ul>
            
            <p>En cas d'indisponibilité de l'œuvre après passation de la commande, l'acheteur en sera informé dans les plus brefs délais et le remboursement sera effectué intégralement.</p>
          </div>
        </section>

        <section className="legal-section">
          <h2>Article 6 - Paiement</h2>
          <div className="legal-info">
            <p>Le paiement s'effectue intégralement lors de la commande par carte bancaire via notre prestataire sécurisé Stripe.</p>
            
            <h3>Moyens de paiement acceptés :</h3>
            <ul>
              <li>Cartes bancaires : Visa, Mastercard, American Express</li>
              <li>Paiement 100% sécurisé par chiffrement SSL</li>
            </ul>
            
            <p>Les données de paiement ne sont ni collectées ni stockées sur nos serveurs. Elles sont directement transmises de manière cryptée à notre prestataire de paiement Stripe, certifié PCI-DSS.</p>
            
            <p>En cas de refus de paiement par les organismes financiers, la commande sera automatiquement annulée et l'acheteur en sera informé par email.</p>
            
            <p>L'acheteur garantit qu'il est pleinement habilité à utiliser la carte de paiement pour régler sa commande et que cette carte donne effectivement droit au débit de son montant.</p>
          </div>
        </section>

        <section className="legal-section">
          <h2>Article 7 - Livraison</h2>
          <div className="legal-info">
            <h3>Zone de livraison :</h3>
            <p>Les livraisons sont effectuées en France métropolitaine, Corse et dans les pays de l'Union Européenne. Pour toute autre destination, nous contacter.</p>
            
            <h3>Délais de livraison :</h3>
            <ul>
              <li><strong>France métropolitaine :</strong> 2 à 5 jours ouvrés</li>
              <li><strong>Corse et DOM-TOM :</strong> 5 à 10 jours ouvrés</li>
              <li><strong>Union Européenne :</strong> 5 à 10 jours ouvrés</li>
            </ul>
            
            <p>Les délais de livraison courent à compter de la validation du paiement et de la confirmation de la commande.</p>
            
            <h3>Modalités de livraison :</h3>
            <ul>
              <li>Emballage professionnel adapé aux œuvres d'art</li>
              <li>Protection renforcée contre les chocs et l'humidité</li>
              <li>Assurance transport incluse</li>
              <li>Remise contre signature ou en point relais</li>
            </ul>
            
            <h3>Réception :</h3>
            <p>L'acheteur doit vérifier l'état de l'emballage en présence du transporteur. En cas de dommage apparent, il doit :</p>
            <ul>
              <li>Formuler des réserves écrites sur le bon de livraison</li>
              <li>Confirmer ces réserves par courrier recommandé au transporteur dans les 3 jours</li>
              <li>Nous informer immédiatement par email avec photos</li>
            </ul>
          </div>
        </section>

        <section className="legal-section">
          <h2>Article 8 - Droit de rétractation</h2>
          <div className="legal-info">
            <p>Conformément à l'article L221-28 du Code de la consommation, l'acheteur dispose d'un délai de 14 jours francs pour exercer son droit de rétractation sans avoir à justifier de motifs ni à payer de pénalités.</p>
            
            <p>Ce délai court à compter du jour de la réception de l'œuvre.</p>
            
            <h3>Modalités de rétractation :</h3>
            <ul>
              <li>Notification par email à : contact@elisabethconstantin.com</li>
              <li>Ou par courrier à notre adresse</li>
              <li>Utilisation possible du formulaire de rétractation ci-joint</li>
            </ul>
            
            <h3>Conditions de retour :</h3>
            <ul>
              <li>L'œuvre doit être retournée dans son emballage d'origine</li>
              <li>En parfait état, sans dommage ni altération</li>
              <li>Accompagnée de tous les accessoires et documents</li>
              <li>Dans un délai de 14 jours après notification de rétractation</li>
            </ul>
            
            <p>Les frais de retour sont à la charge de l'acheteur. Nous recommandons un envoi avec assurance et accusé de réception.</p>
            
            <p>Le remboursement sera effectué dans un délai de 14 jours après réception de l'œuvre retournée, par le même moyen de paiement que celui utilisé pour la commande.</p>
          </div>
        </section>

        <section className="legal-section">
          <h2>Article 9 - Garanties</h2>
          <div className="legal-info">
            <h3>Garantie légale de conformité :</h3>
            <p>Conformément aux articles L217-4 et suivants du Code de la consommation, l'acheteur bénéficie de la garantie légale de conformité. L'œuvre doit être conforme à la description donnée et posséder les qualités annoncées.</p>
            
            <h3>Garantie des vices cachés :</h3>
            <p>Conformément aux articles 1641 et suivants du Code civil, l'acheteur peut demander la résolution de la vente ou une réduction du prix en cas de vice caché rendant l'œuvre impropre à l'usage auquel elle est destinée.</p>
            
            <h3>Garantie artiste :</h3>
            <p>L'artiste garantit l'authenticité et l'originalité de toutes les œuvres vendues. Chaque œuvre est accompagnée d'un certificat d'authenticité.</p>
            
            <p>En cas de problème, contacter le service client dans les plus brefs délais à : contact@elisabethconstantin.com</p>
          </div>
        </section>

        <section className="legal-section">
          <h2>Article 10 - Propriété intellectuelle</h2>
          <div className="legal-info">
            <p>L'achat d'une œuvre transfère la propriété matérielle de l'œuvre à l'acheteur, mais l'artiste conserve tous les droits de propriété intellectuelle.</p>
            
            <h3>Droits de l'acheteur :</h3>
            <ul>
              <li>Propriété physique de l'œuvre</li>
              <li>Droit d'exposition privée</li>
              <li>Droit de revente (avec respect du droit de suite)</li>
            </ul>
            
            <h3>Droits conservés par l'artiste :</h3>
            <ul>
              <li>Droit de reproduction et de représentation</li>
              <li>Droit à l'intégrité de l'œuvre</li>
              <li>Droit de paternité</li>
              <li>Droit de suite en cas de revente</li>
            </ul>
            
            <p>Toute reproduction, même partielle, est interdite sans autorisation écrite préalable de l'artiste.</p>
          </div>
        </section>

        <section className="legal-section">
          <h2>Article 11 - Protection des données personnelles</h2>
          <div className="legal-info">
            <p>Les informations personnelles collectées lors de la commande sont nécessaires au traitement de celle-ci et à la gestion de la relation commerciale.</p>
            
            <p>Conformément au RGPD et à la loi Informatique et Libertés, l'acheteur dispose d'un droit d'accès, de rectification, de suppression et de portabilité de ses données.</p>
            
            <p>Pour plus d'informations, consulter notre <a href="/politique-confidentialite">Politique de confidentialité</a>.</p>
            
            <p>Pour exercer vos droits : contact@elisabethconstantin.com</p>
          </div>
        </section>

        <section className="legal-section">
          <h2>Article 12 - Responsabilité</h2>
          <div className="legal-info">
            <p>L'artiste ne pourra être tenue responsable de dommages directs ou indirects causés au matériel informatique de l'acheteur lors de l'accès au site.</p>
            
            <p>L'artiste décline toute responsabilité en cas de mauvaise utilisation de l'œuvre par l'acheteur.</p>
            
            <p>La responsabilité de l'artiste ne saurait être engagée en cas de :</p>
            <ul>
              <li>Force majeure ou cas fortuit</li>
              <li>Fait du prince</li>
              <li>Défaillance du réseau internet</li>
              <li>Mauvaise utilisation du site par l'acheteur</li>
            </ul>
          </div>
        </section>

        <section className="legal-section">
          <h2>Article 13 - Réclamations et litiges</h2>
          <div className="legal-info">
            <h3>Service client :</h3>
            <p>Pour toute réclamation, contacter le service client :</p>
            <ul>
              <li><strong>Email :</strong> contact@elisabethconstantin.com</li>
              <li><strong>Téléphone :</strong> +33 6 85 50 09 73</li>
              <li><strong>Courrier :</strong> [Votre adresse]</li>
            </ul>
            
            <h3>Médiation :</h3>
            <p>En cas de litige non résolu, l'acheteur peut recourir à une médiation conventionnelle ou à tout autre mode alternatif de règlement des différends.</p>
            
            <p>Plateforme de résolution des litiges en ligne de la Commission européenne : <a href="https://ec.europa.eu/consumers/odr/" target="_blank" rel="noopener noreferrer">https://ec.europa.eu/consumers/odr/</a></p>
            
            <h3>Droit applicable :</h3>
            <p>Les présentes CGV sont soumises au droit français. En cas de litige, compétence exclusive est attribuée aux tribunaux français.</p>
          </div>
        </section>

        <section className="legal-section">
          <h2>Article 14 - Dispositions diverses</h2>
          <div className="legal-info">
            <p>Si une ou plusieurs stipulations des présentes CGV étaient déclarées nulles en application d'une loi, d'un règlement ou d'une décision de justice, les autres stipulations garderont toute leur force et leur portée.</p>
            
            <p>Toute modification des CGV sera publiée sur le site et notifiée aux clients par email si nécessaire.</p>
            
            <p>L'archivage des communications et des bons de commande est effectué sur un support fiable et durable constituant une copie fidèle.</p>
          </div>
        </section>

        <div className="legal-footer">
          <h2>Formulaire de rétractation</h2>
          <div className="retractation-form">
            <p><strong>À compléter et renvoyer uniquement si vous souhaitez vous rétracter du contrat :</strong></p>
            <p>À l'attention d'Élisabeth Constantin<br/>
            [Votre adresse]<br/>
            Email : contact@elisabethconstantin.com</p>
            
            <p>Je/nous (*) vous notifie/notifions (*) par la présente ma/notre (*) rétractation du contrat portant sur la vente du bien ci-dessous :</p>
            <ul>
              <li>Commandé le (*)/reçu le (*) : ........................</li>
              <li>Nom du/des consommateur(s) : ........................</li>
              <li>Adresse du/des consommateur(s) : ........................</li>
              <li>Signature du/des consommateur(s) (uniquement en cas de notification du présent formulaire sur papier) : ........................</li>
              <li>Date : ........................</li>
            </ul>
            <p>(*) Rayez la mention inutile.</p>
          </div>
          
          <p><em>Dernière mise à jour : {new Date().toLocaleDateString('fr-FR')}</em></p>
        </div>
      </div>
    </div>
  );
}
