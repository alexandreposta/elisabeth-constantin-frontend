import React, { useState, useEffect } from 'react';
import { FaPlus, FaTrash } from 'react-icons/fa';
import { eventsAPI } from '../api/events';
import AdminHeader from '../components/AdminHeader';
import ImageUpload from '../components/ImageUpload';
import AdminCard from '../components/AdminCard';
import '../styles/adminArtworks.css';
import '../styles/imageUpload.css';

const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const CLOUDINARY_UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

function AdminEvents() {
  const [events, setEvents] = useState([]);
  const [sortBy, setSortBy] = useState('title');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  // État du formulaire
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    start_date: '',
    end_date: '',
    location: '',
    start_time: '',
    end_time: '',
    main_image: null,
    status: 'upcoming',
    is_active: true
  });

  useEffect(() => {
    loadEvents();
  }, []);

  // Empêcher le scroll quand la modale est ouverte
  useEffect(() => {
    if (isModalOpen) {
      document.body.classList.add('modal-open');
    } else {
      document.body.classList.remove('modal-open');
    }

    // Cleanup au démontage du composant
    return () => {
      document.body.classList.remove('modal-open');
    };
  }, [isModalOpen]);

  const loadEvents = async () => {
    try {
      setLoading(true);
      const data = await eventsAPI.getAllEvents();
      setEvents(data);
    } catch (err) {
      setError('Erreur lors du chargement des événements');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const sortedEvents = [...events].sort((a, b) => {
    switch (sortBy) {
      case 'title':
        return a.title.localeCompare(b.title);
      case 'date':
        return new Date(a.start_date) - new Date(b.start_date);
      case 'status':
        return a.status.localeCompare(b.status);
      default:
        return 0;
    }
  });

  const handleSort = (e) => {
    setSortBy(e.target.value);
  };

  const openModal = (event = null) => {
    if (event) {
      setFormData({
        title: event.title || '',
        description: event.description || '',
        start_date: event.start_date || '',
        end_date: event.end_date || '',
        location: event.location || '',
        start_time: event.start_time || '',
        end_time: event.end_time || '',
        main_image: event.main_image || null,
        status: event.status || 'upcoming',
        is_active: event.is_active || true
      });
      setEditingEvent(event);
    } else {
      setFormData({
        title: '',
        description: '',
        start_date: '',
        end_date: '',
        location: '',
        start_time: '',
        end_time: '',
        main_image: null,
        status: 'upcoming',
        is_active: true
      });
      setEditingEvent(null);
    }
    setIsModalOpen(true);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleImageChange = async (image) => {
    if (!image) {
      setFormData(prev => ({ ...prev, main_image: null }));
      return;
    }

    if (typeof image === 'string') {
      setFormData(prev => ({ ...prev, main_image: image }));
      return;
    }

    setFormData(prev => ({ ...prev, main_image: image }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let imageUrl = formData.main_image;
      
      // Upload image si c'est un fichier
      if (formData.main_image && typeof formData.main_image !== 'string') {
        setIsUploading(true);
        const cloudFormData = new FormData();
        cloudFormData.append('file', formData.main_image);
        cloudFormData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
        
        const response = await fetch(
          `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/upload`,
          {
            method: 'POST',
            body: cloudFormData,
          }
        );
        
        const data = await response.json();
        
        if (data.secure_url) {
          imageUrl = data.secure_url;
        } else {
          alert('Erreur lors de l\'upload de l\'image');
          return;
        }
      }

      // Préparer les données de l'événement
      const eventData = {
        ...formData,
        main_image: imageUrl,
        start_date: new Date(formData.start_date).toISOString(),
        end_date: new Date(formData.end_date).toISOString()
      };

      if (editingEvent) {
        await eventsAPI.updateEvent(editingEvent.id, eventData);
      } else {
        await eventsAPI.createEvent(eventData);
      }

      await loadEvents();
      setIsModalOpen(false);
    } catch (err) {
      alert('Erreur lors de la sauvegarde de l\'événement');
      console.error(err);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async () => {
    if (editingEvent && window.confirm('Êtes-vous sûr de vouloir supprimer cet événement ?')) {
      try {
        await eventsAPI.deleteEvent(editingEvent.id);
        await loadEvents();
        setIsModalOpen(false);
      } catch (err) {
        alert('Erreur lors de la suppression de l\'événement');
      }
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) return <div className="admin-loading">Chargement...</div>;
  if (error) return <div className="admin-error">{error}</div>;

  return (
    <>
      <AdminHeader />
      <div className="admin-container">
        <div className="admin-page-header">
          <h1 style={{ fontFamily: 'Dancing Script', fontSize: '3rem', color: '#2c3e50', margin: 0 }}>
            Gestion des Événements
          </h1>
          <button className="add-artwork-btn" onClick={() => openModal()}>
            <FaPlus />
            Ajouter un événement
          </button>
        </div>
        
        <div className="sort-controls">
          <select
            className="sort-select"
            value={sortBy}
            onChange={handleSort}
          >
            <option value="title">Trier par titre</option>
            <option value="date">Trier par date</option>
            <option value="status">Trier par statut</option>
          </select>
        </div>

        <div className="artworks-grid">
          {sortedEvents.map((event) => (
            <AdminCard
              key={event.id}
              item={event}
              type="event"
              onEdit={() => openModal(event)}
              statusIndicator={event.status === 'upcoming' ? 'upcoming' : 'past'}
            />
          ))}
        </div>

        {isModalOpen && (
          <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
            <div className="edit-modal" onClick={(e) => e.stopPropagation()}>
              <h2 className="modal-title">{editingEvent ? "Modifier l'événement" : "Nouvel événement"}</h2>
              <form onSubmit={handleSubmit} className="edit-form">
                <div className="form-group">
                  <label>Titre</label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Date de début</label>
                    <input
                      type="date"
                      name="start_date"
                      value={formData.start_date}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Date de fin</label>
                    <input
                      type="date"
                      name="end_date"
                      value={formData.end_date}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Heure de début</label>
                    <input
                      type="time"
                      name="start_time"
                      value={formData.start_time}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Heure de fin</label>
                    <input
                      type="time"
                      name="end_time"
                      value={formData.end_time}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Lieu</label>
                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Statut</label>
                    <select
                      name="status"
                      value={formData.status}
                      onChange={handleInputChange}
                    >
                      <option value="upcoming">À venir</option>
                      <option value="ongoing">En cours</option>
                      <option value="completed">Terminé</option>
                      <option value="cancelled">Annulé</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label>Description</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    required
                    rows={4}
                    placeholder="Décrivez votre événement en détail..."
                  />
                </div>

                <ImageUpload
                  images={formData.main_image}
                  onImagesChange={handleImageChange}
                  multiple={false}
                  label="Image principale"
                />

                {isUploading && <p>Upload en cours...</p>}

                <div className="form-actions">
                  <button
                    type="button"
                    className="btn-secondary"
                    onClick={() => setIsModalOpen(false)}
                  >
                    Annuler
                  </button>
                  {editingEvent && (
                    <button
                      type="button"
                      className="btn-danger"
                      onClick={handleDelete}
                    >
                      <FaTrash /> Supprimer
                    </button>
                  )}
                  <button
                    type="submit"
                    className="btn-primary"
                  >
                    {editingEvent ? "Enregistrer" : "Créer"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default AdminEvents;
