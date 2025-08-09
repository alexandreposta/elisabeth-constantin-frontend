import React, { useState, useEffect } from 'react';
import { FaPlus, FaTrash } from 'react-icons/fa';
import { eventsAPI } from '../api/events';
import AdminHeader from '../components/AdminHeader';
import ModalForm from '../components/ModalForm';
import AdminCard from '../components/AdminCard';
import SortButton from '../components/SortButton';
import '../styles/adminArtworks.css';
import '../styles/imageUpload.css';

const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const CLOUDINARY_UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

function AdminEvents() {
  const [events, setEvents] = useState([]);
  const [currentSort, setCurrentSort] = useState({ field: "title", direction: "asc" });
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
    start_time: '09:00',
    end_time: '18:00',
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
    let result = 0;
    
    switch (currentSort.field) {
      case 'title':
        result = a.title.localeCompare(b.title);
        break;
      case 'date':
        result = new Date(a.start_date) - new Date(b.start_date);
        break;
      case 'status':
        result = a.status.localeCompare(b.status);
        break;
      default:
        result = 0;
    }
    
    return currentSort.direction === 'desc' ? -result : result;
  });

  const handleSort = (sortConfig) => {
    setCurrentSort(sortConfig);
  };

  // Fonction utilitaire pour convertir une date ISO en format YYYY-MM-DD
  const formatDateForInput = (isoDate) => {
    if (!isoDate) return '';
    try {
      const date = new Date(isoDate);
      if (isNaN(date.getTime())) return '';
      return date.toISOString().split('T')[0];
    } catch (error) {
      console.error('Erreur de conversion de date:', error);
      return '';
    }
  };

  // Fonction utilitaire pour extraire l'heure d'une date ISO en format HH:MM
  const formatTimeForInput = (isoDate) => {
    if (!isoDate) return '00:00';
    try {
      const date = new Date(isoDate);
      if (isNaN(date.getTime())) return '00:00';
      return date.toTimeString().split(' ')[0].substring(0, 5); // HH:MM
    } catch (error) {
      console.error('Erreur de conversion d\'heure:', error);
      return '00:00';
    }
  };

  const openModal = (event = null) => {
    if (event) {
      setFormData({
        title: event.title || '',
        description: event.description || '',
        start_date: formatDateForInput(event.start_date),
        end_date: formatDateForInput(event.end_date),
        location: event.location || '',
        start_time: (event.start_time && event.start_time !== '') ? event.start_time : formatTimeForInput(event.start_date),
        end_time: (event.end_time && event.end_time !== '') ? event.end_time : formatTimeForInput(event.end_date),
        main_image: event.main_image || null,
        status: event.status || 'upcoming',
        is_active: event.is_active !== undefined ? event.is_active : true
      });
      setEditingEvent(event);
    } else {
      setFormData({
        title: '',
        description: '',
        start_date: '',
        end_date: '',
        location: '',
        start_time: '09:00',
        end_time: '18:00',
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

  // Upload Cloudinary pour image principale
  const handleMainImageChange = async (image) => {
    if (!image) {
      setFormData((prev) => ({ ...prev, main_image: null }));
      return;
    }
    if (typeof image === "string") {
      setFormData((prev) => ({ ...prev, main_image: image }));
      return;
    }
    setIsUploading(true);
    const formCloud = new FormData();
    formCloud.append("file", image);
    formCloud.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
    const cloudRes = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/upload`,
      { method: "POST", body: formCloud }
    );
    const cloudData = await cloudRes.json();
    setIsUploading(false);
    if (cloudData.secure_url) {
      setFormData((prev) => ({ ...prev, main_image: cloudData.secure_url }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Validation des dates
      if (!formData.start_date || !formData.end_date) {
        alert('Les dates de début et de fin sont obligatoires');
        return;
      }

      // Validation et nettoyage des heures
      const startTime = formData.start_time || '09:00';
      const endTime = formData.end_time || '18:00';
      
      // Validation du format des heures (HH:MM)
      const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
      if (!timeRegex.test(startTime) || !timeRegex.test(endTime)) {
        alert('Les heures doivent être au format HH:MM (ex: 09:30)');
        return;
      }

      // Combiner date et heure pour créer des timestamps complets
      const startDateString = `${formData.start_date}T${startTime}:00`;
      const endDateString = `${formData.end_date}T${endTime}:00`;
      
      const startDateTime = new Date(startDateString);
      const endDateTime = new Date(endDateString);
      
      // Vérifier que les dates sont valides
      if (isNaN(startDateTime.getTime()) || isNaN(endDateTime.getTime())) {
        alert('Les dates ou heures saisies ne sont pas valides');
        return;
      }
      
      // Vérifier que la date de fin est après la date de début
      if (endDateTime <= startDateTime) {
        alert('La date et heure de fin doivent être postérieures à celles de début');
        return;
      }
      
      const eventData = {
        title: formData.title,
        description: formData.description,
        start_date: startDateTime.toISOString(),
        end_date: endDateTime.toISOString(),
        location: formData.location,
        start_time: startTime,
        end_time: endTime,
        main_image: formData.main_image,
        status: formData.status,
        is_active: formData.is_active
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
        
        <div className="admin-controls">
          <div className="sort-buttons-group">
            <span className="sort-buttons-label">Trier par :</span>
            <SortButton
              field="title"
              currentSort={currentSort}
              onSort={handleSort}
              label="Titre"
              size="medium"
            />
            <SortButton
              field="date"
              currentSort={currentSort}
              onSort={handleSort}
              label="Date"
              size="medium"
            />
            <SortButton
              field="status"
              currentSort={currentSort}
              onSort={handleSort}
              label="Statut"
              size="medium"
            />
          </div>
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

        <ModalForm
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleSubmit}
          onDelete={editingEvent ? handleDelete : undefined}
          title={editingEvent ? "Modifier l'événement" : "Nouvel événement"}
          isEditing={!!editingEvent}
          formType="event"
          formData={formData}
          setFormData={setFormData}
          onMainImageChange={handleMainImageChange}
          isUploading={isUploading}
        />
      </div>
    </>
  );
}

export default AdminEvents;
