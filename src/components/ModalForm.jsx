// src/components/ModalForm.jsx
import React from "react";
import ImageUpload from "./ImageUpload";
import { FaTrash } from "react-icons/fa";
import "../styles/modalForm.css";

export default function ModalForm({
  isOpen,
  onClose,
  onSubmit,
  onDelete,
  title,
  isEditing,
  formType,
  formData,
  setFormData,
  onMainImageChange,
  onOtherImagesChange,
  availableTypes = [],
  isUploading = false,
}) {
  if (!isOpen) return null;
  const isArtwork = formType === "artwork";

  // Largeur+Hauteur = SUM_EM
  const SUM_EM = 50;
  let dimensionsStyle = {};
  if (
    isArtwork &&
    formData.width &&
    formData.height &&
    Number(formData.width) > 0 &&
    Number(formData.height) > 0
  ) {
    const w = Number(formData.width);
    const h = Number(formData.height);
    const total = w + h;
    const widthEm = SUM_EM * (w / total);
    const heightEm = SUM_EM * (h / total);
    dimensionsStyle = {
      width: `${widthEm.toFixed(2)}em`,
      height: `${heightEm.toFixed(2)}em`,
    };
  }

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2 className="modal-title">{title}</h2>
        <form onSubmit={onSubmit} className="modal-form">
          {/* TITRE */}
          <div className="form-group full-width">
            <label>Titre</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              required
            />
          </div>

          {/* BLOC SPÉCIFIQUE ŒUVRE */}
          {isArtwork ? (
            <>
              {/* TYPE + DISPONIBLE + PRIX */}
              <div className="flex-row-three full-width">
                <div className="form-group">
                  <label>Type</label>
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleInputChange}
                  >
                    {availableTypes.map((t) => (
                      <option key={t} value={t}>
                        {t.charAt(0).toUpperCase() + t.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Statut</label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                  >
                    <option value="Disponible">Disponible</option>
                    <option value="Vendu">Vendu</option>
                    <option value="Indisponible">Indisponible</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Prix (€)</label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              {/* DESCRIPTION */}
              <div className="form-group full-width">
                <label>Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={3}
                  required
                />
              </div>

              {/* RECTANGLE "TOILE" AVEC IMAGE PRINCIPALE */}
              <div className="form-group full-width">
                <label>Image principale</label>
                <div
                  className="canvas-preview full-width"
                  style={dimensionsStyle}
                >
                  <ImageUpload
                    images={formData.main_image}
                    onImagesChange={onMainImageChange}
                    multiple={false}
                    label=""
                    showInCanvas={true}
                  />
                </div>
              </div>

              {/* DIMENSIONS EN BAS */}
              <div className="dimensions-inputs full-width">
                <div className="form-group">
                  <label>Longueur (cm)</label>
                  <input
                    type="number"
                    name="height"
                    value={formData.height}
                    onChange={handleInputChange}
                    required
                    min={1}
                  />
                </div>
                <div className="form-group">
                  <label>Largeur (cm)</label>
                  <input
                    type="number"
                    name="width"
                    value={formData.width}
                    onChange={handleInputChange}
                    required
                    min={1}
                  />
                </div>
              </div>
            </>
          ) : (
            <>
              {/* BLOC ÉVÉNEMENT */}
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

              {/* DESCRIPTION POUR ÉVÉNEMENTS */}
              <div className="form-group full-width">
                <label>Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={3}
                  required
                />
              </div>
            </>
          )}

          {/* UPLOADS */}
          {!isArtwork && (
            <div className="form-group full-width">
              <ImageUpload
                images={formData.main_image}
                onImagesChange={onMainImageChange}
                multiple={false}
                label="Image principale"
              />
            </div>
          )}
          {isArtwork && (
            <div className="form-group full-width">
              <ImageUpload
                images={formData.other_images}
                onImagesChange={onOtherImagesChange}
                multiple
                label="Images secondaires"
              />
            </div>
          )}
        </form>

        {/* BARRE D’ACTIONS */}
        <div className="form-actions">
          <button type="button" className="btn-secondary" onClick={onClose}>
            Annuler
          </button>
          {isEditing && (
            <button type="button" className="btn-danger" onClick={onDelete}>
              <FaTrash /> Supprimer
            </button>
          )}
          <button type="submit" className="btn-primary" onClick={onSubmit}>
            {isEditing ? "Enregistrer" : "Créer"}
          </button>
        </div>

        {isUploading && <p className="upload-message">Upload en cours...</p>}
      </div>
    </div>
  );
}
