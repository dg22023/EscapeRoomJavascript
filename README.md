# Escape Room: JavaScript Edition

Juego interactivo por niveles que pone a prueba el uso de diversas **APIs nativas de JavaScript** en el navegador. Cada nivel representa un desafío técnico que debe superarse para desbloquear el siguiente.

## Requisitos

- Navegador web moderno (Chrome, Firefox, Edge, Safari)
- Conexión a internet (solo para Bootstrap CDN)
- Permisos de geolocalización y cámara (según el nivel)

## Tecnologías

| Tecnología | Uso |
| :--- | :--- |
| HTML5 | Estructura del juego |
| CSS3 + Bootstrap 5.3 | Diseño responsive y componentes UI |
| JavaScript (ES6+) | Lógica de niveles y APIs del navegador |
| Geolocation API | Nivel 1 |
| Canvas API | Nivel 2 |
| MediaDevices API | Nivel 3 |
| Web Workers API | Niveles 4 y 5 |
| LocalStorage | Persistencia en Nivel 3 |
| Blob / Download | Exportación JSON en Nivel 5 |

## Estructura del Proyecto

```
EscapeRoomJavascript/
├── index.html            # Página principal con todos los niveles
├── css/
│   └── styles.css        # Estilos personalizados
├── js/
│   ├── main.js           # Estado global, navegación entre niveles
│   ├── nivel1.js         # Geolocalización
│   ├── nivel2.js         # Canvas (radar)
│   ├── nivel3.js         # Cámara + LocalStorage
│   ├── nivel4.js         # Web Worker (20k registros)
│   ├── nivel5.js         # Web Worker avanzado (250k registros)
│   ├── workerNivel4.js   # Worker del Nivel 4
│   └── worker-nivel5.js  # Worker del Nivel 5
├── PlanDesarrolloDWT_Parcial3.md
└── README.md
```

## Niveles

| Nivel | Nombre | API / Técnica | Descripción |
| :--- | :--- | :--- | :--- |
| 0 | Inicio | — | Pantalla de bienvenida |
| 1 | El Rastreador | Geolocation API | Obtener coordenadas del usuario |
| 2 | El Mapa | Canvas API | Dibujar radar con la ubicación obtenida |
| 3 | La Evidencia del Explorador | MediaDevices + LocalStorage | Capturar foto con la cámara y persistirla |
| 4 | El Núcleo de Procesamiento | Web Worker | Procesar 20,000 datos sin bloquear la UI |
| 5 | El Portal Cuántico | Web Worker + Exportación | Procesar 250,000 registros y descargar JSON |

## Cómo Implementar / Ejecutar

1. Clonar el repositorio:
   ```bash
   git clone <repo-url>
   cd EscapeRoomJavascript
   ```
2. Abrir `index.html` en un navegador (doble clic o servir con un servidor local):
   ```bash
   # Opcional: servidor local con Python o liveserver en vscode
   python3 -m http.server 8000
   ```
3. Hacer clic en **Comenzar Desafío** y superar cada nivel en orden.

> **Nota:** Los niveles se bloquean hasta completar el anterior. La navegación se controla desde `main.js` mediante el objeto `gameState`.

## Flujo de Trabajo (Git)

- `main` — Rama de entrega final
- `develop` — Rama de integración y pruebas
- `feature/nivel-1-2` — Niveles 1 y 2
- `feature/nivel-3` — Nivel 3
- `feature/nivel-4` — Nivel 4
- `feature/nivel-5` — Nivel 5

## Integrantes del Grupo

| Nombre | Correo/Codigo | Rama |
| :--- | :--- | :--- |
| Gabriel Ernesto Díaz Galdámez | dg22023 | `feature/nivel-1-2` |
| Ricardo Adan Patiño Hernandez | ph23011 | `feature/nivel-3` |
| Victor Noé Rodas Rivera | rr23027 | `feature/nivel-4` |
| Alexandra Quinteros Cárcamo| qc23006 | `feature/nivel-5` |
