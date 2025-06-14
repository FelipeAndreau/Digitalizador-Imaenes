import React from 'react';
import './ImageDetails.css';

const TechnicalSpecs = ({ resolution, colorDepth, aspectRatio, outputFormat, dpi, compression }) => {
  // Extraer dimensiones del ratio
  const [baseWidth, baseHeight] = aspectRatio.split(':').map(Number);
  
  // Calcular dimensiones finales
  const finalWidth = resolution;
  const finalHeight = Math.round((baseHeight * resolution) / baseWidth);

  // Conversión a medidas físicas
  const physicalWidth = finalWidth / dpi;
  const physicalHeight = finalHeight / dpi;
  const metricWidth = physicalWidth * 25.4;
  const metricHeight = physicalHeight * 25.4;

  return (
    <div className="specs-container">
      <table>
        <tbody>
          <tr>
            <th>Resolución</th>
            <td>{finalWidth} × {finalHeight} px</td>
          </tr>
          <tr>
            <th>Densidad</th>
            <td>{dpi} puntos/pulgada</td>
          </tr>
          <tr>
            <th>Dimensiones físicas</th>
            <td>{metricWidth.toFixed(1)} × {metricHeight.toFixed(1)} mm</td>
          </tr>
          <tr>
            <th>Proporción</th>
            <td>{aspectRatio}</td>
          </tr>
          <tr>
            <th>Bits de color</th>
            <td>{colorDepth} bits</td>
          </tr>
          <tr>
            <th>Formato</th>
            <td>{outputFormat}</td>
          </tr>
          <tr>
            <th>Nivel de compresión</th>
            <td>{Math.round(compression * 100)}%</td>
          </tr>
        </tbody>
      </table>
      <div className="density-info">
        <small>
          DPI (Puntos Por Pulgada) determina la densidad de píxeles al imprimir:
          <ul>
            <li>72 DPI - Calidad web</li>
            <li>150 DPI - Impresión estándar</li>
            <li>300 DPI - Alta calidad</li>
          </ul>
        </small>
      </div>
    </div>
  );
};

export default TechnicalSpecs;