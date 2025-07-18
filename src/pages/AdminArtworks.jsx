import { useState, useEffect, useRef } from "react";
import { FaPlus, FaTrash } from "react-icons/fa";
import "../styles/adminArtworks.css";
import "../styles/imageUpload.css";
import "../styles/typesManager.css";
import AdminHeader from "../components/AdminHeader";
import ImageUpload from "../components/ImageUpload";
import TypesManager from "../components/TypesManager";
import AdminCard from "../components/AdminCard";
import {
  getAllArtworks,
  createArtwork,
  updateArtwork,
  deleteArtworkById,
  getAllGalleryTypes,
} from "../api/artworks";

const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const CLOUDINARY_UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

export default function Admin() {
  const [artworks, setArtworks] = useState([]);
  const [artworkTypes, setArtworkTypes] = useState([]);
  const [sortBy, setSortBy] = useState("title");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingArtwork, setEditingArtwork] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    width: "",
    height: "",
    type: "paint",
    is_available: true,
    main_image: null,
    other_images: [],
  });

  useEffect(() => {
    fetchArtworks();
    fetchArtworkTypes();
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

  const fetchArtworks = async () => {
    const data = await getAllArtworks();
    setArtworks(data);
  };

  const fetchArtworkTypes = async () => {
    try {
      const types = await getAllGalleryTypes();
      setArtworkTypes(types);
    } catch (error) {
      console.error('Erreur lors du chargement des types d\'œuvres:', error);
      setArtworkTypes(['paint', '3D']); // Fallback
    }
  };

  const sortedArtworks = [...artworks].sort((a, b) => {
    switch (sortBy) {
      case "title":
        return a.title.localeCompare(b.title);
      case "price":
        return a.price - b.price;
      case "date":
        return new Date(b.created_at || b.createdAt || Date.now()) - new Date(a.created_at || a.createdAt || Date.now());
      case "status":
        return b.is_available - a.is_available;
      default:
        return 0;
    }
  });

  const handleSort = (e) => {
    setSortBy(e.target.value);
  };

  const openModal = (artwork = null) => {
    if (artwork) {
      setEditingArtwork(artwork);
      setFormData({
        title: artwork.title,
        description: artwork.description,
        price: artwork.price,
        width: artwork.width || "",
        height: artwork.height || "",
        type: artwork.type || "peinture",
        is_available: artwork.is_available,
        main_image: artwork.main_image,
        other_images: artwork.other_images || [],
      });
    } else {
      setEditingArtwork(null);
      setFormData({
        title: "",
        description: "",
        price: "",
        width: "",
        height: "",
        type: "peinture",
        is_available: true,
        main_image: null,
        other_images: [],
      });
    }
    setIsModalOpen(true);
  };

  const handleMainImageChange = (image) => {
    setFormData({ ...formData, main_image: image });
  };

  const handleOtherImagesChange = (images) => {
    setFormData({ ...formData, other_images: images });
  };

  const handleDelete = async () => {
    if (
      window.confirm(
        "Voulez-vous vraiment supprimer ce tableau ? Cette action est irréversible."
      )
    ) {
      await deleteArtworkById(editingArtwork["_id"] || editingArtwork.id);
      await fetchArtworks();
      setIsModalOpen(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      let mainUrl = editingArtwork?.main_image || "";
      if (formData.main_image && typeof formData.main_image !== 'string') {
        const formCloud = new FormData();
        formCloud.append("file", formData.main_image);
        formCloud.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

        const cloudRes = await fetch(
          `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/upload`,
          { method: "POST", body: formCloud }
        );
        const cloudData = await cloudRes.json();
        if (!cloudData.secure_url) {
          alert("L'upload de l'image principale a échoué !");
          return;
        }
        mainUrl = cloudData.secure_url;
      } else if (typeof formData.main_image === 'string') {
        mainUrl = formData.main_image;
      }

      const otherUrls = [];
      for (const img of formData.other_images) {
        if (typeof img === "string") {
          otherUrls.push(img);
        } else {
          const formCloud = new FormData();
          formCloud.append("file", img);
          formCloud.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

          const cloudRes = await fetch(
            `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/upload`,
            { method: "POST", body: formCloud }
          );
          const cloudData = await cloudRes.json();
          if (cloudData.secure_url) {
            otherUrls.push(cloudData.secure_url);
          }
        }
      }

      const payload = {
        title: formData.title,
        description: formData.description,
        price: parseFloat(formData.price),
        width: parseFloat(formData.width),
        height: parseFloat(formData.height),
        type: formData.type,
        is_available: formData.is_available,
        main_image: mainUrl,
        other_images: otherUrls,
      };

      if (!payload.title || !payload.main_image || isNaN(payload.price) || isNaN(payload.width) || isNaN(payload.height)) {
        alert("Titre, image principale, prix, largeur et hauteur sont obligatoires !");
        return;
      }

      if (editingArtwork) {
        await updateArtwork(editingArtwork["_id"] || editingArtwork.id, payload);
      } else {
        await createArtwork(payload);
      }

      await fetchArtworks();
      closeModal();
    } catch (error) {
      console.error("Erreur détaillée:", error);
      alert("Une erreur s'est produite: " + error.message);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingArtwork(null);
    setFormData({
      title: "",
      description: "",
      price: "",
      width: "",
      height: "",
      type: "paint",
      is_available: true,
      main_image: null,
      other_images: [],
    });
  };

  return (
    <>
      <AdminHeader />
      <div className="admin-container">
        <div className="admin-page-header">
          <h1 style={{ fontFamily: 'Dancing Script', fontSize: '3rem', color: '#2c3e50', margin: 0 }}>
            Gestion des Œuvres
          </h1>
          <div className="header-actions">
            <TypesManager 
              availableTypes={artworkTypes}
              onTypesChange={setArtworkTypes}
            />
            <button className="add-artwork-btn" onClick={() => openModal()}>
              <FaPlus />
              Ajouter une œuvre
            </button>
          </div>
        </div>
        
        <div className="admin-controls">
          <div className="sort-controls">
            <select
              className="sort-select"
              value={sortBy}
              onChange={handleSort}
            >
              <option value="title">Trier par titre</option>
              <option value="price">Trier par prix</option>
              <option value="date">Trier par date</option>
              <option value="status">Trier par disponibilité</option>
            </select>
          </div>
        </div>

      <div className="artworks-grid">
        {sortedArtworks.map((artwork) => (
          <AdminCard
            key={artwork._id}
            item={artwork}
            type="artwork"
            onEdit={() => openModal(artwork)}
            statusIndicator={artwork.is_available ? 'available' : 'sold'}
          />
        ))}
      </div>

      {isModalOpen && (
        <div
          className="modal-overlay"
          onClick={() => setIsModalOpen(false)}
        >
          <div className="edit-modal" onClick={(e) => e.stopPropagation()}>
            <h2 className="modal-title">{editingArtwork ? "Modifier l'œuvre" : "Nouvelle œuvre"}</h2>
            <form onSubmit={handleSubmit} className="edit-form">
              {/* Titre */}
              <div className="form-group">
                <label>Titre</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  required
                />
              </div>
              
              {/* Type - Disponible */}
              <div className="form-row">
                <div className="form-group">
                  <label>Type d'œuvre</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    required
                  >
                    {artworkTypes.map(type => (
                      <option key={type} value={type}>
                        {type.charAt(0).toUpperCase() + type.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div className="form-group checkbox-group">
                  <label>Disponible</label>
                  <input
                    type="checkbox"
                    checked={formData.is_available}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        is_available: e.target.checked,
                      })
                    }
                  />
                </div>
              </div>
              
              {/* Prix - Largeur - Longueur */}
              <div className="form-row">
                <div className="form-group">
                  <label>Prix (€)</label>
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) =>
                      setFormData({ ...formData, price: e.target.value })
                    }
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label>Largeur (cm)</label>
                  <input
                    type="number"
                    value={formData.width}
                    onChange={(e) =>
                      setFormData({ ...formData, width: e.target.value })
                    }
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label>Longueur (cm)</label>
                  <input
                    type="number"
                    value={formData.height}
                    onChange={(e) =>
                      setFormData({ ...formData, height: e.target.value })
                    }
                    required
                  />
                </div>
              </div>
              
              {/* Description */}
              <div className="form-group">
                <label>Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  required
                  rows={4}
                />
              </div>
              
              {/* Image principale */}
              <ImageUpload
                images={formData.main_image}
                onImagesChange={handleMainImageChange}
                multiple={false}
                label="Image principale"
              />
              
              {/* Images secondaires */}
              <ImageUpload
                images={formData.other_images}
                onImagesChange={handleOtherImagesChange}
                multiple={true}
                maxImages={5}
                label="Images secondaires"
              />
              
              <div className="form-actions">
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => setIsModalOpen(false)}
                >
                  Annuler
                </button>
                {editingArtwork && (
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
                  {editingArtwork ? "Enregistrer" : "Créer"}
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
