import { useState, useEffect, useRef } from "react";
import { FaPlus, FaTrash } from "react-icons/fa";
import "../styles/adminArtworks.css";
import "../styles/imageUpload.css";
import "../styles/typesManager.css";
import AdminHeader from "../components/AdminHeader";
import ModalForm from "../components/ModalForm";
import TypesManager from "../components/TypesManager";
import AdminCard from "../components/AdminCard";
import SortButton from "../components/SortButton";
import {
  getAllArtworks,
  createArtwork,
  updateArtwork,
  deleteArtworkById,
  getAllGalleryTypes,
} from "../api/artworks";
import { getAllArtworkTypes, ensureDefaultTypes } from "../api/artworkTypes";

const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const CLOUDINARY_UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

export default function Admin() {
  const [artworks, setArtworks] = useState([]);
  const [artworkTypes, setArtworkTypes] = useState([]);
  const [currentSort, setCurrentSort] = useState({ field: "title", direction: "asc" });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingArtwork, setEditingArtwork] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    width: "",
    height: "",
    type: "paint",
    status: "Disponible",
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
      // D'abord, s'assurer que les types par défaut existent
      try {
        await ensureDefaultTypes();
      } catch (error) {
        console.warn('Erreur lors de l\'initialisation des types par défaut:', error);
      }
      
      // Essayer d'abord la nouvelle API
      try {
        const types = await getAllArtworkTypes();
        setArtworkTypes(types);
        return;
      } catch (error) {
        console.warn('Nouvelle API échoue, fallback vers l\'ancienne:', error);
      }
      
      // Fallback vers l'ancienne API
      const types = await getAllGalleryTypes();
      setArtworkTypes(types);
    } catch (error) {
      console.error('Erreur lors du chargement des types d\'œuvres:', error);
      setArtworkTypes(['paint', '3D']); // Fallback
    }
  };

  const sortedArtworks = [...artworks].sort((a, b) => {
    let result = 0;
    
    switch (currentSort.field) {
      case "title":
        result = a.title.localeCompare(b.title);
        break;
      case "price":
        result = a.price - b.price;
        break;
      case "date":
        result = new Date(b.created_at || b.createdAt || Date.now()) - new Date(a.created_at || a.createdAt || Date.now());
        break;
      case "status":
        // Tri par statut : Disponible > Indisponible > Vendu
        const statusOrder = { "Disponible": 3, "Indisponible": 2, "Vendu": 1 };
        const statusA = artwork => artwork.status || (artwork.is_available ? "Disponible" : "Vendu");
        const statusB = artwork => artwork.status || (artwork.is_available ? "Disponible" : "Vendu");
        result = (statusOrder[statusA(b)] || 0) - (statusOrder[statusA(a)] || 0);
        break;
      default:
        result = 0;
    }
    
    return currentSort.direction === 'desc' ? -result : result;
  });

  const handleSort = (sortConfig) => {
    setCurrentSort(sortConfig);
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
        status: artwork.status || (artwork.is_available ? "Disponible" : "Vendu"),
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
        status: "Disponible",
        main_image: null,
        other_images: [],
      });
    }
    setIsModalOpen(true);
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

  // Upload Cloudinary pour images secondaires
  const handleOtherImagesChange = async (images) => {
    setIsUploading(true);
    const urls = [];
    for (const img of images) {
      if (typeof img === "string") {
        urls.push(img);
      } else {
        const formCloud = new FormData();
        formCloud.append("file", img);
        formCloud.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
        const cloudRes = await fetch(
          `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/upload`,
          { method: "POST", body: formCloud }
        );
        const cloudData = await cloudRes.json();
        if (cloudData.secure_url) urls.push(cloudData.secure_url);
      }
    }
    setFormData((prev) => ({ ...prev, other_images: urls }));
    setIsUploading(false);
  };

  const handleDelete = async () => {
    if (
      window.confirm(
        "Voulez-vous vraiment supprimer ce tableau ? Cette action est irréversible."
      )
    ) {
      const artworkId = editingArtwork.id || editingArtwork._id;
      await deleteArtworkById(artworkId);
      await fetchArtworks();
      setIsModalOpen(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        title: formData.title,
        description: formData.description,
        price: parseFloat(formData.price),
        width: parseFloat(formData.width),
        height: parseFloat(formData.height),
        type: formData.type,
        status: formData.status,
        main_image: formData.main_image,
        other_images: formData.other_images,
      };
      
      if (!payload.title || !payload.main_image || isNaN(payload.price) || isNaN(payload.width) || isNaN(payload.height)) {
        alert("Titre, image principale, prix, largeur et hauteur sont obligatoires !");
        return;
      }
      if (editingArtwork) {
        const artworkId = editingArtwork.id || editingArtwork._id;
        await updateArtwork(artworkId, payload);
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
      status: "Disponible",
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
              field="price"
              currentSort={currentSort}
              onSort={handleSort}
              label="Prix"
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
              label="Disponibilité"
              size="medium"
            />
          </div>
        </div>
        <div className="artworks-grid">
          {sortedArtworks.map((artwork) => (
            <AdminCard
              key={artwork.id || artwork._id}
              item={artwork}
              type="artwork"
              onEdit={() => openModal(artwork)}
              onDelete={async (item) => {
                if (window.confirm("Voulez-vous vraiment supprimer ce tableau ? Cette action est irréversible.")) {
                  const artworkId = item.id || item._id;
                  await deleteArtworkById(artworkId);
                  await fetchArtworks();
                }
              }}
              statusIndicator={
                artwork.status === 'Disponible' ? 'available' : 
                artwork.status === 'Vendu' ? 'sold' : 
                artwork.status === 'Indisponible' ? 'unavailable' :
                artwork.is_available ? 'available' : 'sold'  // Fallback pour compatibilité
              }
            />
          ))}
        </div>
        <ModalForm
          isOpen={isModalOpen}
          onClose={closeModal}
          onSubmit={handleSubmit}
          onDelete={editingArtwork ? handleDelete : undefined}
          title={editingArtwork ? "Modifier l'œuvre" : "Nouvelle œuvre"}
          isEditing={!!editingArtwork}
          formType="artwork"
          formData={formData}
          setFormData={setFormData}
          onMainImageChange={handleMainImageChange}
          onOtherImagesChange={handleOtherImagesChange}
          availableTypes={artworkTypes}
          isUploading={isUploading}
        />
      </div>
    </>
  );
}
