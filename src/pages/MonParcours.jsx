import React from 'react';
import { FaPalette, FaHeart, FaLightbulb, FaCertificate, FaNewspaper } from 'react-icons/fa';
import '../styles/monParcours.css';
import image from '../assets/Salon/3.jpg';
import ArtistSchema from '../components/ArtistSchema';
import SEO from '../components/SEO';
import { useTranslation } from 'react-i18next';

const ICONS = {
  heart: FaHeart,
  lightbulb: FaLightbulb,
  palette: FaPalette,
  certificate: FaCertificate,
  newspaper: FaNewspaper,
};

export default function MonParcours() {
  const { t } = useTranslation();
  const sections = t('monParcours.sections', { returnObjects: true });
  const conclusionParagraphs = t('monParcours.conclusionParagraphs', { returnObjects: true });

  return (
    <div className="parcours-container">
      <SEO 
        title={t('monParcours.seo.title')}
        description={t('monParcours.seo.description')}
        url="https://elisabeth-constantin.fr/mon-parcours"
      />
      <ArtistSchema />
      <section className="parcours-hero">
        <div className="hero-content">
          <h1 className="hero-title">{t('monParcours.heroTitle')}</h1>
          <p className="hero-subtitle">
            {t('monParcours.heroSubtitle')}
          </p>
        </div>
        <div className="hero-image">
          <div className="artist-portrait">
            <img 
              src={image}
              alt="Portrait de l'artiste"
              className="portrait-img"
            />
          </div>
        </div>
      </section>

      {Array.isArray(sections) && sections.map((section, index) => {
        const IconComponent = ICONS[section.icon] || FaPalette;
        const isReverse = index % 2 === 1;
        return (
          <section
            key={section.title}
            className={`parcours-section ${isReverse ? 'reverse' : ''}`}
          >
            <div className="section-icon">
              <IconComponent />
            </div>
            <h2 className="section-title">{section.title}</h2>
            <div className="section-content">
              {section.paragraphs?.map((paragraph, idx) => (
                <p className="section-text" key={`${section.title}-${idx}`}>
                  {paragraph}
                </p>
              ))}
            </div>
          </section>
        );
      })}

      <section className="parcours-conclusion">
        <div className="conclusion-content">
          <h2 className="conclusion-title">{t('monParcours.conclusionTitle')}</h2>
          {conclusionParagraphs?.map((paragraph, idx) => (
            <p className="conclusion-text" key={`conclusion-${idx}`}>
              {paragraph}
            </p>
          ))}
        </div>
      </section>
    </div>
  );
}
