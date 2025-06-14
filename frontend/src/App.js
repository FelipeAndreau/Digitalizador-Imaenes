import React, { useState, useEffect } from "react";
import "./App.css";
import ImageGallery from "./Components/ImageGallery/ImageGallery";
import ImageDetails from './Components/ImageDetails';

function App() {
  const [resolution, setResolution] = useState(500);
  const [dpi, setDpi] = useState(300); // 300 es el valor por defecto para impresión

  // índice de profundidad de color (0 → 1 bit, 1 → 8 bits, 2 → 24 bits)
  const [colorDepthIndex, setColorDepthIndex] = useState(1);
  const [colorDepth, setColorDepth] = useState(8);

  // Añadir el estado para compresión
  const [compression, setCompression] = useState(0.8); // 0.8 = 80% calidad

  const [selectedFile, setSelectedFile] = useState(null);
  const [originalImagePreviewUrl, setOriginalImagePreviewUrl] = useState(null);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [processedImage, setProcessedImage] = useState(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showGallery, setShowGallery] = useState(false);
  const [aspectRatio, setAspectRatio] = useState("1:1");
  const [showMenu, setShowMenu] = useState(false);
  const [outputFormat, setOutputFormat] = useState('JPG');

  // Array con las profundidades permitidas
  const DEPTHS = [1, 8, 24];

  const aspectRatios = [
    { id: "1:1", label: "1:1", width: 1, height: 1 },
    { id: "16:9", label: "16:9", width: 16, height: 9 },
    { id: "9:16", label: "9:16", width: 9, height: 16 },
    { id: "4:3", label: "4:3", width: 4, height: 3 },
    { id: "3:4", label: "3:4", width: 3, height: 4 },
    { id: "3:2", label: "3:2", width: 3, height: 2 },
    { id: "2:3", label: "2:3", width: 2, height: 3 },
  ];

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setOriginalImagePreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      alert("Por favor seleccioná un archivo primero");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("Archivo", selectedFile);
      formData.append("Nombre", selectedFile.name);

      const res = await fetch("http://localhost:5288/api/Imagenes/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Error al subir la imagen");

      const data = await res.json();
      setUploadedImage(data);
      setProcessedImage(null);
      alert("Imagen subida correctamente");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleProcess = async () => {
    if (!uploadedImage) {
      alert("Primero subí una imagen");
      return;
    }

    setLoading(true);
    setError(null);

    const payload = {
      AnchoResolucion: resolution,
      AltoResolucion: resolution,
      ProfundidadBits: colorDepth,
      IdAlgoritmoCompresion: 1,
      Algoritmo: outputFormat === 'JPG' ? 'JPEG' : outputFormat,
      RatioCompresion: compression
    };

    try {
      const res = await fetch(
        `http://localhost:5288/api/ImagenesProcesadas/procesar/${uploadedImage.idImagen}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      if (!res.ok) throw new Error(await res.text());

      const data = await res.json();
      setProcessedImage(data);
    } catch (err) {
      setError(err.message);
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchProcessedImageData = async () => {
    if (!processedImage) return;

    setLoading(true);
    setError(null);

    try {
      const res = await fetch(
        `http://localhost:5288/api/ImagenesProcesadas/${processedImage.idImagenProcesada}`
      );
      if (!res.ok) throw new Error("No se pudo obtener imagen procesada");

      const data = await res.json();
      if (!data.DatosProcesadosBase64) throw new Error("Imagen procesada sin datos");

      // Usar el formato correcto en el data URL
      const formato = outputFormat.toLowerCase();
      setImagePreviewUrl(`data:image/${formato};base64,${data.DatosProcesadosBase64}`);
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (processedImage) fetchProcessedImageData();
    else setImagePreviewUrl(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [processedImage]);

  const handleDownload = () => {
    if (!imagePreviewUrl) return;
    const link = document.createElement("a");
    link.href = imagePreviewUrl;
    // Usar el formato seleccionado para la extensión del archivo
    link.download = `imagen-digitalizada.${outputFormat.toLowerCase()}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleReset = () => {
    setResolution(500);
    setColorDepthIndex(1);
    setColorDepth(8);
    setCompression(0.8);
    setSelectedFile(null);
    setOriginalImagePreviewUrl(null);
    setUploadedImage(null);
    setProcessedImage(null);
    setImagePreviewUrl(null);
    setError(null);
  };

  const toggleGallery = () => setShowGallery(!showGallery);

  const handleImageSelect = (image) => {
    setShowGallery(false);
    setUploadedImage(image);
    setSelectedFile(null);
    setProcessedImage(null);
    setImagePreviewUrl(null);
    if (image.datosImagenBase64) {
      setOriginalImagePreviewUrl(`data:image/png;base64,${image.datosImagenBase64}`);
    } else {
      setOriginalImagePreviewUrl(null);
    }
  };

  const handleColorDepthChange = (e) => {
    const idx = Number(e.target.value); // 0, 1 o 2
    setColorDepthIndex(idx);
    setColorDepth(DEPTHS[idx]);
  };

  const setDepthPreset = (targetDepth) => {
    const idx = DEPTHS.indexOf(targetDepth);
    if (idx !== -1) {
      setColorDepthIndex(idx);
      setColorDepth(targetDepth);
    }
  };

  const handleAspectRatioChange = (ratio) => {
    setAspectRatio(ratio);
    const selectedRatio = aspectRatios.find((r) => r.id === ratio);
    if (selectedRatio) {
      const base = resolution;
      const newWidth = Math.round(base * (selectedRatio.width / selectedRatio.height));
      setResolution(newWidth);
    }
  };

  const toggleMenu = () => setShowMenu(!showMenu);

  return (
    <div className="App">
      <header className="app-header">
        <h1>Redimensionar Imagen</h1>
        <button className="menu-btn" onClick={toggleMenu}>
          <div className="hamburger">
            <span></span>
            <span></span>
            <span></span>
          </div>
        </button>
        
        {showMenu && (
          <div className="menu-overlay">
            <div className="menu-content">
              <button onClick={() => {
                toggleGallery();
                setShowMenu(false);
              }}>
                Galería
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Añadir el componente ImageGallery */}
      {showGallery && (
        <div className="gallery-overlay">
          <ImageGallery
            onClose={toggleGallery}
            onSelect={handleImageSelect}
          />
        </div>
      )}

      <div className="image-panels">
        {/* Panel Imagen Original */}
        <div className="panel">
          <h2>Imagen Original</h2>
          <div className="image-drop-area">
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              style={{
                position: "absolute",
                width: "100%",
                height: "100%",
                opacity: 0,
                cursor: "pointer",
                zIndex: 2,
              }}
            />
            {originalImagePreviewUrl ? (
              <img
                src={originalImagePreviewUrl}
                alt="Vista previa"
                style={{
                  maxWidth: "100%",
                  maxHeight: "100%",
                  objectFit: "contain",
                }}
              />
            ) : (
              <div className="upload-placeholder">
                <div className="upload-icon">📁</div>
                <div className="upload-text">
                  <strong>Haz clic aquí</strong> o arrastra una imagen
                  <br />
                  para comenzar
                </div>
              </div>
            )}
          </div>
          <div style={{ display: "flex", gap: "10px", marginTop: "1rem" }}>
            <button className="btn-primary" onClick={handleUpload}>
              {loading ? "Subiendo..." : "Cargar Imagen"}
            </button>
          </div>
        </div>

        {/* Panel Controles */}
        <div className="params">
          <h2>Parámetros de Procesamiento</h2>

          <div className="param-group">
            <h3>Relación de Aspecto</h3>
            <div className="aspect-ratio-buttons">
              {aspectRatios.map((ratio) => (
                <button
                  key={ratio.id}
                  className={`control-button ${aspectRatio === ratio.id ? "active" : ""}`}
                  onClick={() => handleAspectRatioChange(ratio.id)}
                >
                  {ratio.label}
                </button>
              ))}
            </div>
          </div>

          <div className="control-buttons">
            <button
              className={`control-button ${resolution === 100 ? "active" : ""}`}
              onClick={() => setResolution(100)}
            >
              100×100
            </button>
            <button
              className={`control-button ${resolution === 500 ? "active" : ""}`}
              onClick={() => setResolution(500)}
            >
              500×500
            </button>
            <button
              className={`control-button ${resolution === 1000 ? "active" : ""}`}
              onClick={() => setResolution(1000)}
            >
              1000×1000
            </button>
          </div>

          <div className="control-buttons">
            <button
              className={`control-button ${colorDepth === 1 ? "active" : ""}`}
              onClick={() => setDepthPreset(1)}
            >
              1 bit
            </button>
            <button
              className={`control-button ${colorDepth === 8 ? "active" : ""}`}
              onClick={() => setDepthPreset(8)}
            >
              8 bits
            </button>
            <button
              className={`control-button ${colorDepth === 24 ? "active" : ""}`}
              onClick={() => setDepthPreset(24)}
            >
              24 bits
            </button>
          </div>

          <div className="param-group">
            <h3>Ajustes opcionales</h3>
            <div className="format-selector">
              <label>Formato de destino:</label>
              <select 
                value={outputFormat} 
                onChange={(e) => setOutputFormat(e.target.value)}
              >
                <option value="JPG">JPG</option>
                <option value="PNG">PNG</option>
              </select>
            </div>
          </div>

          <div className="param-group">
            <h3>Compresión</h3>
            <div className="compression-control">
              <input 
                type="range"
                min="0.1"
                max="1"
                step="0.1"
                value={compression}
                onChange={(e) => setCompression(parseFloat(e.target.value))}
              />
              <div className="compression-labels">
                <span>Máxima compresión</span>
                <span>{Math.round(compression * 100)}%</span>
                <span>Mejor calidad</span>
              </div>
            </div>
          </div>

          <div className="param-group">
            <h3>Resolución de impresión (DPI)</h3>
            <div className="dpi-controls">
              <button
                className={`control-button ${dpi === 72 ? "active" : ""}`}
                onClick={() => setDpi(72)}
              >
                72 DPI
                <small>Web</small>
              </button>
              <button
                className={`control-button ${dpi === 150 ? "active" : ""}`}
                onClick={() => setDpi(150)}
              >
                150 DPI
                <small>Básica</small>
              </button>
              <button
                className={`control-button ${dpi === 300 ? "active" : ""}`}
                onClick={() => setDpi(300)}
              >
                300 DPI
                <small>Impresión</small>
              </button>
            </div>
          </div>

          <button
            className="btn-primary"
            onClick={handleProcess}
            disabled={loading || !uploadedImage}
            style={{ width: "100%", marginTop: "1rem" }}
          >
            {loading ? "Procesando..." : "Procesar Imagen"}
          </button>
        </div>

        {/* Panel Imagen Procesada */}
        <div className="panel">
          <h2>Imagen Procesada</h2>
          <div className="image-drop-area digitalized">
            {loading && <p>Procesando...</p>}
            {!loading && imagePreviewUrl && (
              <img
                src={imagePreviewUrl}
                alt="Imagen procesada"
                style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }}
              />
            )}
          </div>
          <button onClick={handleDownload} disabled={!imagePreviewUrl}>
            Descargar
          </button>
        </div>

        {/* Panel Detalles técnicos */}
        <div className="panel">
          <h2>Detalles técnicos</h2>
          <ImageDetails 
            resolution={resolution}
            colorDepth={colorDepth}
            aspectRatio={aspectRatio}
            outputFormat={outputFormat}
            dpi={dpi}  // Añadir esta línea
          />
        </div>
      </div>
    </div>
  );
}

export default App;
