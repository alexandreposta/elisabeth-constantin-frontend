import React from 'react';
import SEOHead from '../components/SEOHead';
import '../styles/legal.css';

export default function PolitiqueConfidentialite() {
  return (
    <div className="legal-page-container">
      <SEOHead
        title="Politique de Confidentialité - Élisabeth Constantin"
        description="Politique de confidentialité du site elisabeth-constantin.fr"
        noindex={true}
      />
      <div className="legal-content">
        <h1>Politique de Confidentialité</h1>
        
        <section className="legal-section">
          <h2>Introduction</h2>
          <div className="legal-info">
            <p>Cette politique de confidentialité explique comment Élisabeth Constantin collecte, utilise et protège vos informations personnelles lorsque vous utilisez notre site web et nos services.</p>
            <p>Nous nous engageons à protéger votre vie privée et à respecter le Règlement Général sur la Protection des Données (RGPD) ainsi que la loi française Informatique et Libertés.</p>
          </div>
        </section>

        <section className="legal-section">
          <h2>Responsable du traitement</h2>
          <div className="legal-info">
            <p><strong>Responsable du traitement :</strong> Élisabeth Constantin</p>
            <p><strong>Adresse :</strong> [Votre adresse]</p>
            <p><strong>Email :</strong> contact@elisabethconstantin.com</p>
            <p><strong>Téléphone :</strong> +33 6 85 50 09 73</p>
          </div>
        </section>

        <section className="legal-section">
          <h2>Données collectées</h2>
          <div className="legal-info">
            <h3>Données collectées lors de vos commandes :</h3>
            <ul>
              <li><strong>Informations personnelles :</strong> nom, prénom, adresse email</li>
              <li><strong>Informations de livraison :</strong> adresse postale complète, numéro de téléphone</li>
              <li><strong>Informations de paiement :</strong> données traitées de manière sécurisée par notre prestataire Stripe (nous ne stockons pas vos données bancaires)</li>
              <li><strong>Historique des commandes :</strong> œuvres achetées, montants, dates</li>
            </ul>
            
            <h3>Données collectées lors de la navigation :</h3>
            <ul>
              <li><strong>Données techniques :</strong> adresse IP, type de navigateur, système d'exploitation</li>
              <li><strong>Données de navigation :</strong> pages visitées, durée de visite, source de trafic</li>
              <li><strong>Cookies :</strong> voir notre <a href="/politique-cookies">politique de cookies</a></li>
            </ul>
            
            <h3>Données collectées lors de la prise de contact :</h3>
            <ul>
              <li><strong>Formulaire de contact :</strong> nom, email, message</li>
              <li><strong>Correspondance :</strong> échanges par email ou téléphone</li>
            </ul>
          </div>
        </section>

        <section className="legal-section">
          <h2>Finalités du traitement</h2>
          <div className="legal-info">
            <p>Vos données personnelles sont collectées et traitées pour les finalités suivantes :</p>
            <ul>
              <li><strong>Gestion des commandes :</strong> traitement, préparation, expédition et suivi des commandes</li>
              <li><strong>Gestion de la relation client :</strong> répondre à vos questions, gérer les réclamations, assurer le service après-vente</li>
              <li><strong>Gestion des paiements :</strong> traitement sécurisé des transactions financières</li>
              <li><strong>Lutte contre la fraude :</strong> prévention et détection des activités frauduleuses</li>
              <li><strong>Amélioration de nos services :</strong> analyse du comportement des utilisateurs pour améliorer l'expérience</li>
              <li><strong>Obligations légales :</strong> respect de nos obligations comptables et fiscales</li>
              <li><strong>Marketing (avec votre consentement) :</strong> envoi d'informations sur nos nouvelles œuvres et expositions</li>
            </ul>
          </div>
        </section>

        <section className="legal-section">
          <h2>Base légale des traitements</h2>
          <div className="legal-info">
            <p>Le traitement de vos données personnelles repose sur les bases légales suivantes :</p>
            <ul>
              <li><strong>Exécution d'un contrat :</strong> pour la gestion de vos commandes et la relation commerciale</li>
              <li><strong>Obligation légale :</strong> pour respecter nos obligations comptables, fiscales et de lutte contre le blanchiment</li>
              <li><strong>Intérêt légitime :</strong> pour l'amélioration de nos services et la sécurité du site</li>
              <li><strong>Consentement :</strong> pour les communications marketing et l'utilisation de certains cookies</li>
            </ul>
          </div>
        </section>

        <section className="legal-section">
          <h2>Durée de conservation</h2>
          <div className="legal-info">
            <p>Vos données personnelles sont conservées pendant les durées suivantes :</p>
            <ul>
              <li><strong>Données de commande :</strong> 10 ans après la commande (obligations comptables)</li>
              <li><strong>Données de facturation :</strong> 10 ans après la dernière transaction</li>
              <li><strong>Données de contact :</strong> 3 ans après le dernier contact</li>
              <li><strong>Données de navigation :</strong> 13 mois maximum</li>
              <li><strong>Données marketing :</strong> jusqu'à votre désinscription ou 3 ans sans interaction</li>
            </ul>
            <p>À l'issue de ces durées, vos données sont supprimées de manière sécurisée ou anonymisées.</p>
          </div>
        </section>

        <section className="legal-section">
          <h2>Destinataires des données</h2>
          <div className="legal-info">
            <p>Vos données personnelles peuvent être transmises aux destinataires suivants :</p>
            <ul>
              <li><strong>Services internes :</strong> personnel autorisé d'Élisabeth Constantin</li>
              <li><strong>Prestataires de service :</strong>
                <ul>
                  <li>Stripe (traitement des paiements)</li>
                  <li>Services de livraison (La Poste, transporteurs)</li>
                  <li>Hébergeur web</li>
                  <li>Services d'analytics (Google Analytics, si utilisé)</li>
                </ul>
              </li>
              <li><strong>Autorités compétentes :</strong> en cas d'obligation légale ou de réquisition judiciaire</li>
            </ul>
            <p>Tous nos prestataires s'engagent contractuellement à respecter la confidentialité et la sécurité de vos données.</p>
          </div>
        </section>

        <section className="legal-section">
          <h2>Transferts hors Union Européenne</h2>
          <div className="legal-info">
            <p>Certains de nos prestataires peuvent être situés hors de l'Union Européenne :</p>
            <ul>
              <li><strong>Stripe :</strong> société américaine bénéficiant de garanties appropriées (clauses contractuelles types)</li>
              <li><strong>Services cloud :</strong> peuvent impliquer des transferts vers des pays tiers avec garanties adéquates</li>
            </ul>
            <p>Tous les transferts sont encadrés par des garanties appropriées conformément au RGPD.</p>
          </div>
        </section>

        <section className="legal-section">
          <h2>Sécurité des données</h2>
          <div className="legal-info">
            <p>Nous mettons en œuvre des mesures techniques et organisationnelles appropriées pour protéger vos données :</p>
            <ul>
              <li><strong>Chiffrement :</strong> transmission sécurisée par protocole HTTPS</li>
              <li><strong>Accès restreint :</strong> limitation de l'accès aux données aux seules personnes autorisées</li>
              <li><strong>Sauvegardes :</strong> sauvegardes régulières et sécurisées</li>
              <li><strong>Mise à jour :</strong> maintien à jour des systèmes de sécurité</li>
              <li><strong>Surveillance :</strong> monitoring des accès et des activités suspectes</li>
            </ul>
          </div>
        </section>

        <section className="legal-section">
          <h2>Vos droits</h2>
          <div className="legal-info">
            <p>Conformément au RGPD, vous disposez des droits suivants :</p>
            <ul>
              <li><strong>Droit d'accès :</strong> obtenir une copie de vos données personnelles</li>
              <li><strong>Droit de rectification :</strong> corriger des données inexactes ou incomplètes</li>
              <li><strong>Droit à l'effacement :</strong> demander la suppression de vos données</li>
              <li><strong>Droit à la limitation :</strong> restreindre le traitement de vos données</li>
              <li><strong>Droit à la portabilité :</strong> récupérer vos données dans un format structuré</li>
              <li><strong>Droit d'opposition :</strong> vous opposer au traitement de vos données</li>
              <li><strong>Droit de retirer votre consentement :</strong> pour les traitements basés sur le consentement</li>
            </ul>
            
            <h3>Comment exercer vos droits :</h3>
            <ul>
              <li><strong>Par email :</strong> contact@elisabethconstantin.com</li>
              <li><strong>Par courrier :</strong> [Votre adresse]</li>
            </ul>
            <p>Nous vous répondrons dans un délai maximum d'un mois. Une pièce d'identité pourra être demandée pour vérifier votre identité.</p>
          </div>
        </section>

        <section className="legal-section">
          <h2>Réclamations</h2>
          <div className="legal-info">
            <p>Si vous estimez que le traitement de vos données personnelles constitue une violation du RGPD, vous avez le droit d'introduire une réclamation auprès de la CNIL :</p>
            <ul>
              <li><strong>Site web :</strong> <a href="https://www.cnil.fr" target="_blank" rel="noopener noreferrer">www.cnil.fr</a></li>
              <li><strong>Adresse :</strong> 3 Place de Fontenoy - TSA 80715 - 75334 PARIS CEDEX 07</li>
              <li><strong>Téléphone :</strong> 01 53 73 22 22</li>
            </ul>
          </div>
        </section>

        <section className="legal-section">
          <h2>Modifications</h2>
          <div className="legal-info">
            <p>Cette politique de confidentialité peut être modifiée à tout moment. En cas de modification substantielle, nous vous en informerons par email ou par un avis sur notre site web.</p>
            <p>Nous vous encourageons à consulter régulièrement cette page pour prendre connaissance des éventuelles modifications.</p>
          </div>
        </section>

        <section className="legal-section">
          <h2>Contact</h2>
          <div className="legal-info">
            <p>Pour toute question concernant cette politique de confidentialité ou le traitement de vos données personnelles, vous pouvez nous contacter :</p>
            <ul>
              <li><strong>Email :</strong> contact@elisabethconstantin.com</li>
              <li><strong>Téléphone :</strong> +33 6 85 50 09 73</li>
              <li><strong>Adresse :</strong> [Votre adresse]</li>
            </ul>
          </div>
        </section>

        <div className="legal-footer">
          <p><em>Dernière mise à jour : {new Date().toLocaleDateString('fr-FR')}</em></p>
        </div>
      </div>
    </div>
  );
}
