# SignBridge AI — Landing Page

> Sistema Inteligente de Reconocimiento y Traducción de Lengua de Señas Boliviana (LSBO)

[![WCAG 2.1 AA](https://img.shields.io/badge/WCAG%202.1-AA%2098%25-00FF9F?style=flat-square&logo=w3c)](https://www.w3.org/TR/WCAG21/)
[![Lighthouse](https://img.shields.io/badge/Lighthouse-94%2B-00D4FF?style=flat-square)](https://developer.chrome.com/docs/lighthouse/)
[![License: MIT](https://img.shields.io/badge/License-MIT-00D4FF?style=flat-square)](https://opensource.org/licenses/MIT)
[![UNIFRANZ](https://img.shields.io/badge/UNIFRANZ-Ingeniería%20en%20Sistemas-white?style=flat-square)](https://www.unifranz.edu.bo)

---

## 📌 Descripción

Landing Page profesional del proyecto académico **SignBridge AI**, desarrollado como parte del
**Hito 4 — Proyecto Integrador Intermedio I** en la Universidad Privada Franz Tamayo (UNIFRANZ),
Facultad de Ingeniería, carrera Ingeniería en Sistemas, gestión 2026.

SignBridge AI traduce en tiempo real la **Lengua de Señas Boliviana (LSBO)** a texto y voz mediante
Inteligencia Artificial, logrando **93.7% de precisión** con una latencia de **142 ms**.

---

## 📁 Estructura del Proyecto

```
signbridge-ai-landing/
│
├── index.html                    # Página principal (HTML5 semántico + SEO completo)
│
├── assets/
│   ├── css/
│   │   ├── style.css             # Estilos principales (dark navy / cyan / green)
│   │   ├── animations.css        # Keyframes, reveal, float, shimmer, counters
│   │   └── responsive.css        # Breakpoints: 400px / 600px / 768px / 900px / 1024px / 4K
│   │
│   ├── js/
│   │   ├── particles.js          # Motor de partículas Canvas 2D con repulsión de mouse
│   │   ├── animations.js         # Scroll reveal, contadores animados, barras de métricas
│   │   ├── form.js               # Validación del formulario de contacto + API POST
│   │   └── main.js               # Navbar, hamburger, smooth scroll, back-to-top, a11y
│   │
│   └── img/
│       ├── logo.svg              # Logotipo SignBridge AI
│       ├── hero-image.svg        # Ilustración hero (mano + IA + detección)
│       ├── tensorflow.svg        # Ícono TensorFlow
│       ├── mediapipe.svg         # Ícono MediaPipe
│       ├── react.svg             # Ícono React
│       ├── fastapi.svg           # Ícono FastAPI
│       ├── python.svg            # Ícono Python
│       ├── github.svg            # Ícono GitHub
│       └── og-image.svg          # Imagen Open Graph para redes sociales
│
├── docs/
│   ├── Capitulo1.pdf             # Marco Introductorio
│   ├── Capitulo2.pdf             # Marco Teórico
│   ├── Capitulo3.pdf             # Marco de Desarrollo
│   └── DocumentoTecnicoCompleto.pdf  # Informe Técnico Completo
│
├── README.md                     # Este archivo
├── sitemap.xml                   # Sitemap para SEO
├── robots.txt                    # Directivas para crawlers
│
└── .github/
    └── workflows/
        └── deploy.yml            # CI/CD — GitHub Actions → GitHub Pages
```

---

## 🚀 Despliegue en GitHub Pages

### Paso 1 — Subir el proyecto

```bash
git init
git add .
git commit -m "feat: SignBridge AI Landing Page - Hito 4 UNIFRANZ 2026"
git branch -M main
git remote add origin https://github.com/TU_USUARIO/signbridge-ai.git
git push -u origin main
```

### Paso 2 — Activar GitHub Pages

1. Ir a **Settings → Pages** en tu repositorio GitHub.
2. En *Source*, seleccionar **GitHub Actions**.
3. El workflow `deploy.yml` se ejecutará automáticamente en cada `push` a `main`.

### Paso 3 — Actualizar URLs

Reemplaza en `index.html` y `sitemap.xml`:
```
https://adrianmamani.github.io/signbridge-ai/
```
por tu URL real:
```
https://TU_USUARIO.github.io/NOMBRE_REPO/
```

### Paso 4 — Agregar los PDFs de documentación

Coloca los archivos PDF dentro de la carpeta `docs/`:
- `docs/Capitulo1.pdf`
- `docs/Capitulo2.pdf`
- `docs/Capitulo3.pdf`
- `docs/DocumentoTecnicoCompleto.pdf`

---

## 🎨 Diseño

| Variable        | Valor     | Uso                             |
|:----------------|:----------|:--------------------------------|
| `--navy`        | `#0D1B2A` | Fondo principal                 |
| `--cyan`        | `#00D4FF` | Acento primario, bordes, links  |
| `--green`       | `#00FF9F` | Acento secundario, éxito        |
| `--white`       | `#FFFFFF` | Textos principales              |
| `--font-sans`   | Inter     | Cuerpo de texto                 |
| `--font-display`| Poppins   | Títulos y headings              |

---

## 📊 Métricas del Sistema SignBridge AI

| Métrica                       | Resultado | Criterio de Aceptación |
|:------------------------------|:----------|:-----------------------|
| Precisión CNN (validación)    | **93.7%** | RF-03: ≥92%            |
| Detección MediaPipe           | **94.2%** | RF-02: ≥90%            |
| Latencia Pipeline P95         | **142 ms**| RNF-01: <200 ms        |
| Velocidad de procesamiento    | **28.3 FPS**| RF-01: ≥24 FPS       |
| Conformidad WCAG 2.1 AA       | **98%**   | axe-core              |
| Lighthouse Performance        | **94/100**| —                      |
| Lighthouse Accessibility      | **98/100**| —                      |
| Lighthouse Best Practices     | **100/100**| —                     |
| Lighthouse SEO                | **95/100**| —                      |

---

## 🔧 Stack Tecnológico

### Frontend
- **React 18** — SPA con componentes funcionales y hooks
- **Tailwind CSS** — Utilidad CSS (aplicación principal)
- **WebRTC getUserMedia** — Captura de video en tiempo real
- **Web Speech API** — Síntesis de voz local
- **WebSocket** — Comunicación bidireccional en tiempo real

### Backend
- **FastAPI** — API REST + WebSocket de alto rendimiento
- **Python 3.11** — Lenguaje principal del servidor
- **Uvicorn** — Servidor ASGI
- **Nginx** — Reverse proxy

### Inteligencia Artificial
- **TensorFlow 2.x / TFLite** — Entrenamiento e inferencia del modelo CNN
- **MediaPipe 0.10** — Detección de mano y extracción de 21 landmarks 3D

### Base de Datos
- **SQLite** (desarrollo) / **PostgreSQL 15** (producción)
- **SQLAlchemy** — ORM

### DevOps
- **GitHub Actions** — CI/CD automático
- **GitHub Pages** — Hosting estático

---

## ♿ Accesibilidad (WCAG 2.1 AA)

- Contraste de color ≥4.5:1 en todos los textos principales
- Navegación completa por teclado
- Roles ARIA semánticos en todos los componentes interactivos
- `lang="es"` declarado en la etiqueta `<html>`
- Imágenes con `alt` descriptivo
- Formulario con `<label>` asociados correctamente
- Mensajes de error con `aria-live="polite"`
- Compatible con NVDA, JAWS y VoiceOver
- Botón "Saltar al contenido principal" visible al recibir foco
- Respeta `prefers-reduced-motion` (todas las animaciones se desactivan)

---

## 📄 Información Académica

| Campo         | Detalle                                      |
|:--------------|:---------------------------------------------|
| **Estudiante**| Adrián Darío Mamani Cutile                   |
| **Docente**   | Ing. Julio César Gómez Rodas                 |
| **Materia**   | Proyecto Integrador Intermedio I             |
| **Hito**      | Hito 4 — Informe Técnico Final               |
| **Universidad**| Universidad Privada Franz Tamayo (UNIFRANZ) |
| **Facultad**  | Facultad de Ingeniería                       |
| **Carrera**   | Ingeniería en Sistemas                       |
| **Gestión**   | 2026 — La Paz / El Alto, Bolivia             |
| **Licencia**  | MIT Open Source                              |

---

## 📝 Licencia

```
MIT License

Copyright (c) 2026 Adrián Darío Mamani Cutile

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.
```

---

*Desarrollado con ♥ para la comunidad sorda boliviana — La Paz / El Alto, Bolivia · 2026*
