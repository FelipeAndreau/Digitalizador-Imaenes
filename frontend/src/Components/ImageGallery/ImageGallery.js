import React, { useState, useEffect } from "react";
import "./ImageGallery.css";

const ImageGallery = ({ onClose, onSelect }) => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    try {
      const res = await fetch("http://localhost:5288/api/Imagenes");
      if (!res.ok) throw new Error("Error al obtener las imágenes");
      const data = await res.json();

      const seen = new Set();
      const uniqueImages = data.filter((img) => {
        if (seen.has(img.nombre)) return false;
        seen.add(img.nombre);
        return true;
      });

      setImages(uniqueImages);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="image-gallery-modal" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal-content">
        <div className="modal-header">
          <h2>Galería de Imágenes</h2>
          <button onClick={onClose} className="close-btn">
            Cerrar
          </button>
        </div>

        <div className="modal-body">
          {loading ? (
            <div className="loading">Cargando imágenes...</div>
          ) : error ? (
            <div className="error">Error: {error}</div>
          ) : images.length === 0 ? (
            <div className="no-images">No hay imágenes en la galería</div>
          ) : (
            <div className="gallery-grid">
              {images.map((image) => (
                <button
                  key={image.idImagen}
                  className="image-item"
                  onClick={() => onSelect(image)}
                >
                  <img
                    src={`data:image/png;base64,${image.datosImagenBase64}`}
                    alt={image.nombre}
                  />
                  <div>{image.nombre}</div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ImageGallery;
