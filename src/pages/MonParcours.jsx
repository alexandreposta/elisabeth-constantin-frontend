import React from 'react';
import { FaPalette, FaHeart, FaLightbulb, FaUsers, FaCertificate, FaNewspaper } from 'react-icons/fa';
import '../styles/monParcours.css';
import image from '../assets/Salon/3.jpg';
import ArtistSchema from '../components/ArtistSchema';
import SEO from '../components/SEO';

export default function MonParcours() {
  return (
    <div className="parcours-container">
      <SEO 
        title="Mon Parcours - Élisabeth Constantin"
        description="Découvrez le parcours artistique d'Élisabeth Constantin, sa démarche créative unique dans le multiplan 3D, ses influences et sa vision de l'art contemporain."
        url="https://elisabeth-constantin.fr/mon-parcours"
      />
      <ArtistSchema />
      <section className="parcours-hero">
        <div className="hero-content">
          <h1 className="hero-title">Ma Démarche</h1>
          <p className="hero-subtitle">
            Découvrez ma vision artistique, mon parcours et les influences qui nourrissent ma création
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

      <section className="parcours-section">
        <div className="section-icon">
          <FaHeart />
        </div>
        <h2 className="section-title">Pourquoi je fais ça ?</h2>
        <div className="section-content">
          <p className="section-text">
            [Expliquez votre motivation profonde, ce qui vous pousse à créer, 
            l'émotion que vous souhaitez partager...]
          </p>
          <p className="section-text">
            [Décrivez l'impact que vous souhaitez avoir sur les spectateurs, 
            ce que l'art représente pour vous...]
          </p>
          <p className="section-text">
            [Partagez votre vision personnelle de l'art et son rôle dans votre vie...]
          </p>
        </div>
      </section>

      <section className="parcours-section reverse">
        <div className="section-icon">
          <FaLightbulb />
        </div>
        <h2 className="section-title">Mes débuts</h2>
        <div className="section-content">
          <p className="section-text">
            [Racontez vos premiers pas dans l'art, votre découverte de cette passion, 
            les circonstances qui vous ont menée vers cette voie...]
          </p>
          <p className="section-text">
            [Décrivez vos premières œuvres, vos premiers apprentissages, 
            les défis que vous avez rencontrés...]
          </p>
          <p className="section-text">
            [Partagez les moments marquants de vos débuts, les personnes qui vous ont inspirée 
            ou soutenue dans cette aventure...]
          </p>
        </div>
      </section>

      <section className="parcours-section">
        <div className="section-icon">
          <FaPalette />
        </div>
        <h2 className="section-title">Mon orientation artistique</h2>
        <div className="section-content">
          <p className="section-text">
            [Décrivez votre style artistique, vos techniques préférées, 
            les influences qui façonnent votre travail...]
          </p>
          <p className="section-text">
            [Expliquez l'évolution de votre style au fil du temps, 
            les expérimentations qui ont marqué votre parcours...]
          </p>
          <p className="section-text">
            [Partagez votre approche créative, votre processus de création, 
            ce qui rend votre art unique...]
          </p>
        </div>
      </section>

      <section className="parcours-section reverse">
        <div className="section-icon">
          <FaCertificate />
        </div>
        <h2 className="section-title">Mes certifications</h2>
        <div className="section-content">
          <p className="section-text">
            [Listez vos formations artistiques, diplômes, certifications 
            qui ont enrichi votre pratique...]
          </p>
          <p className="section-text">
            [Décrivez les stages, workshops, formations continues 
            qui ont contribué à votre développement artistique...]
          </p>
          <p className="section-text">
            [Mentionnez vos participations à des concours, prix reçus, 
            reconnaissances officielles...]
          </p>
        </div>
      </section>

      <section className="parcours-section">
        <div className="section-icon">
          <FaNewspaper />
        </div>
        <h2 className="section-title">Mes articles de presse</h2>
        <div className="section-content">
          <p className="section-text">
            [Présentez les articles de presse qui ont parlé de votre travail, 
            les interviews accordées, les reportages...]
          </p>
          <p className="section-text">
            [Partagez les moments de reconnaissance médiatique, 
            les événements qui ont attiré l'attention des médias...]
          </p>
          <p className="section-text">
            [Décrivez l'impact de ces publications sur votre carrière, 
            les opportunités qui en ont découlé...]
          </p>
        </div>
      </section>

      <section className="parcours-conclusion">
        <div className="conclusion-content">
          <h2 className="conclusion-title">Ma démarche aujourd'hui</h2>
          <p className="conclusion-text">
            [Décrivez votre démarche artistique actuelle, vos projets en cours, 
            votre évolution récente...]
          </p>
          <p className="conclusion-text">
            [Partagez vos aspirations futures, vos objectifs artistiques, 
            où vous souhaitez emmener votre art...]
          </p>
        </div>
      </section>
    </div>
  );
}
