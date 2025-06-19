# DIGITALIZADOR-IMAGENES

Grupo 12: Felipe Andreau - Melissa Braunstein - Pilar Wagner -
Justina Lozano - Juanita Sellinger
Transform Images, Accelerate Web Performance Instantly

[![last commit](https://img.shields.io/badge/last%20commit-last%20saturday-blue)](#)
[![language](https://img.shields.io/badge/c%23-36.7%25-blue)](#)
[![languages](https://img.shields.io/badge/languages-6-blue)](#)

---

## 📖 Overview

**Digitalizador-Imagenes** es una potente herramienta web que permite a los usuarios cargar imágenes de alta resolución, aplicar muestreo, cuantización de color, compresión (JPEG o PNG), realizar comparaciones con la original (calculando MSE y PSNR), visualizar las diferencias y descargar la versión procesada. 

Cuenta con:
- Frontend React (Create React App)
- Backend ASP.NET Core (.NET 8)
- Almacenamiento en SQL Server

### 🎯 ¿Por qué usarlo?

- Optimiza la carga de imágenes para web.
- Permite experimentar con profundidad de color y resolución.
- Muestra diferencias cuantitativas (MSE, PSNR) y visuales (imagen de diferencias).
- Historial completo de cargas y procesos.

---

## 🧱 Estructura del Proyecto

```
/Web compresion de imagenes
├── Backend/              # ASP.NET Core Web API
│   ├── Controllers/
│   ├── Services/
│   ├── DTOs/, Models/, Data/, Migrations/
│   ├── Program.cs, appsettings.json
│
├── frontend/             # Aplicación React
│   ├── public/
│   ├── src/
│       ├── Components/
│           ├── Login/, ImageGallery/
│       ├── App.js, index.js
│   ├── package.json
│
├── DB_CONVERSOR_IMG/     # Scripts SQL
│   ├── Script1db.sql
│   ├── Script2db.sql
```

---

## 🚀 Getting Started

### 📦 Requisitos Previos

- Node.js y npm
- .NET 8 SDK
- SQL Server local

### ⚙ Instalación Manual

```bash
# Clonar el repositorio
git clone https://github.com/FelipeAndreau/Digitalizador-Imagenes

# Base de datos
Ejecutar scripts SQL en tu entorno de SQL Server:
- DB-Conversor/db.sql

# Backend
cd Backend
 dotnet restore
 dotnet run

# Frontend
cd frontend
npm install
npm start
```

### 🧪 Pruebas Iniciales

1. Inicia los servicios (DB, Backend, Frontend)
2. Accede a http://localhost:3000
3. Carga una imagen
4. Ajusta los parámetros:
   - Resolución
   - Profundidad de bits
   - Nivel de compresión
5. Procesa y descarga la imagen

---

## 🔁 Flujo de Uso (End-to-End)

### 1. Subida de Imagen
- Selección de imagen (`input type="file"`).
- Vista previa generada con FileReader.
- `POST /api/Imagenes/upload` con FormData.

### 2. Procesamiento
- Parámetros:
  - Resolución: 500x500 (por defecto)
  - Bits de profundidad: 1, 8, 24
  - Algoritmo: JPEG o PNG
- `POST /api/ImagenesProcesadas/procesar/{id}`

### 3. Visualización
- `GET /api/ImagenesProcesadas/{id}`
- Muestra:
  - Imagen procesada (JPG/PNG)
  - Imagen de diferencias (PNG)
  - Métricas MSE y PSNR

### 4. Historial
- `GET /api/Imagenes` para mostrar miniaturas
- Modal `ImageGallery` permite seleccionar imágenes antiguas

### 5. Descarga
- Generación de `data:image/jpeg;base64,...`
- `<a download="imagen-digitalizada.jpg">`

---

## 🧱 Arquitectura Técnica

### Backend (.NET 8, EF Core)
- ASP.NET Core Web API (`Backend/`)
- Entity Framework Core (DbContext + Migrations)
- Librería ImageSharp (SixLabors)
- Controllers:
  - `ImagenesController`
  - `ImagenesProcesadasController`
  - `ComparacionesController`
- DTOs para serialización JSON
- Lógica de procesamiento en `ImageProcessorService`

### Frontend (React)
- CRA (`frontend/`)
- `App.js` gestiona el estado general
- `ImageGallery.js` como componentes modulares
- `fetch()` con JSON y Base64 para interacciones

---

## 🔧 Principales Endpoints

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST   | `/api/Imagenes/upload` | Subir imagen original |
| POST   | `/api/ImagenesProcesadas/procesar/{id}` | Procesar con params |
| GET    | `/api/ImagenesProcesadas/{id}` | Obtener procesada |
| GET    | `/api/Imagenes` | Listar imágenes |
| GET    | `/api/Comparaciones` | Ver métricas previas |

---

## 📂 Stack de Tecnologías

![C#](https://img.shields.io/badge/-C%23-blue)
![JavaScript](https://img.shields.io/badge/-JavaScript-yellow)
![React](https://img.shields.io/badge/-React-61DAFB)
![SQL Server](https://img.shields.io/badge/-SQL--Server-lightgray)
![ImageSharp](https://img.shields.io/badge/-ImageSharp-purple)
![Entity Framework](https://img.shields.io/badge/-EF--Core-green)

---

## 📘 Licencia

Este proyecto es de código abierto bajo la licencia MIT.



