# 鬼滅の刃 // DEMON SLAYER CORPS SELECTOR

Selector interactivo de personajes del anime *Demon Slayer: Kimetsu no Yaiba* con estética HUD del Cuerpo de Exterminio, efectos de respiración animados, diseño de sonido por Web Audio y tema musical local por personaje.

## Características

- **Selector de 3 espadachines** — Tanjiro (Agua), Zenitsu (Rayo), Inosuke (Bestia) con radio buttons y cambio de tema dinámico
- **Efectos de respiración** — Partículas en canvas (Water, Thunder, Beast) que cambian con cada personaje
- **Diseño de sonido** — Chimes, sonido de desenvaine, impacto de espada y distorsión por personaje usando Web Audio API
- **Música ambiental** — Tema musical de cada personaje vía YouTube IFrame Player API
- **HUD atmosférico** — Reloj del zodiaco japonés (十二支), estado de misión, coordenadas del cuartel general
- **Tema visual dinámico** — Paleta de colores, glow, bordes y ambientación que cambian al seleccionar cada personaje
- **Animaciones CSS** — Entrada de tarjetas con perspectiva 3D, foil shimmer, breathing effects, responsive design
- **Variable fonts** — Roboto VF y Noto Sans Khmer VF locales; Google Fonts japonesas (Yuji Syuku, Zen Antique Soft, Zen Kaku Gothic New)

## Stack Tecnológico

| Capa | Tecnología |
|------|-----------|
| **Frontend** | HTML5, CSS3, JavaScript (Vanilla) |
| **Partículas** | Canvas 2D API |
| **Audio** | Web Audio API (OscillatorNode, Convolver, WaveShaper) |
| **Video/Música** | YouTube IFrame Player API |
| **Tipografía** | Variable fonts (WOFF2/WOFF/TTF) + Google Fonts |
| **Dev server** | Servor |
| **Deploy** | gh-pages |
| **Package manager** | pnpm |

## Prerrequisitos

- [Node.js](https://nodejs.org) 18 o superior
- [pnpm](https://pnpm.io) (recomendado) o npm

## Guía de inicio rápido

```bash
# 1. Clonar el repositorio
git clone <url-del-repo>
cd test_font

# 2. Instalar dependencias
pnpm install

# 3. Iniciar servidor de desarrollo
pnpm dev
```

Abrir en el navegador: `http://localhost:1234`

## Scripts disponibles

| Comando | Descripción |
|---------|-------------|
| `pnpm dev` | Inicia servidor de desarrollo con recarga automática en puerto 1234 |
| `pnpm deploy` | Publica en GitHub Pages (desde `src/`) |
| `pnpm install` | Instala dependencias |

## Estructura del proyecto

```
├── index.html                     # Punto de entrada — HTML del selector
├── package.json                   # Dependencias y scripts
├── DOSSIER_KIMETSU_DESIGN.md     # Guía de diseño visual completa
├── src/
│   ├── style.css                  # Sistema de estilos completo
│   ├── index.js                   # Punto de entrada JS
│   ├── audio/                     # Música local por personaje
│   │   ├── tanjiro.mp3
│   │   ├── zenitsu.mp3
│   │   └── inosuke.mp3
│   ├── fonts/
│   │   ├── roboto-vf.woff2        # Roboto Variable Font
│   │   ├── roboto-vf.woff
│   │   ├── roboto-vf.ttf
│   │   ├── NotoSansKhmer-vf.woff2 # Noto Sans Khmer Variable Font
│   │   ├── NotoSansKhmer-vf.woff
│   │   └── NotoSansKhmer-vf.ttf
│   ├── components/                # Web Components (cada uno con su CSS y JS)
│   │   ├── bg-particles/          # Fondo nocturno con partículas
│   │   ├── hud-header/            # Cabecera HUD
│   │   ├── hud-footer/            # Pie de página HUD
│   │   ├── slayer-card/           # Tarjeta de personaje
│   │   ├── slayer-details/        # Panel de información del espadachín
│   │   ├── music-player/          # Reproductor de música
│   │   └── particle-canvas/       # Canvas de partículas de respiración
│   └── lib/                       # Módulos de lógica
│       ├── atmosphere.js          # Efectos atmosféricos
│       ├── audio-engine.js        # Motor de audio (Web Audio API)
│       ├── breathing-effects.js   # Efectos de respiración
│       ├── data.js                # Datos de personajes
│       ├── events.js              # Sistema de eventos
│       ├── init.js                # Inicialización
│       └── slayer-selection.js    # Lógica de selección
```

## Arquitectura

### Web Components

La interfaz está organizada en Web Components nativos, cada uno con su propio CSS y JS:

| Componente | Función |
|-----------|---------|
| `<bg-particles>` | Fondo nocturno Taisho con partículas ambientales |
| `<hud-header>` | Cabecera HUD con reloj del zodiaco y estado de misión |
| `<hud-footer>` | Pie de página con coordenadas del cuartel general |
| `<slayer-card>` | Tarjeta de personaje con animación 3D y foil shimmer |
| `<slayer-details>` | Panel de información (bio, stats, habilidad) |
| `<music-player>` | Reproductor de música local por personaje |
| `<particle-canvas>` | Canvas de partículas de respiración |

### Módulos de lógica (`src/lib/`)

| Módulo | Función |
|--------|---------|
| `data.js` | Datos de personajes (bio, stats, colores) |
| `events.js` | Sistema de eventos personalizado |
| `init.js` | Inicialización de la aplicación |
| `slayer-selection.js` | Lógica de selección de personaje |
| `atmosphere.js` | Efectos atmosféricos visuales |
| `audio-engine.js` | Motor de sonido con Web Audio API |
| `breathing-effects.js` | Configuración de partículas por estilo |

### Flujo de selección de personaje

1. El usuario hace clic en un `<slayer-card>`
2. El `input[type=radio]` asociado se marca como `checked`
3. CSS aplica el tema dinámico mediante `:root:has(#radio-xxx:checked)` — cambia colores, glow, borde y opacidad de efectos
4. `selectSlayer(id)` en JS actualiza:
   - Panel de información (nombre, biografía, stats, habilidad)
   - Estilo de respiración (partículas del canvas)
   - Reproductor de música local del personaje
   - Sonido de desenvaine con perfil de audio del personaje
   - Efecto visual de transición (`is-style-switching`)

### Sistema de partículas

- Canvas 2D que renderiza partículas flotantes en tiempo real con `requestAnimationFrame`
- Cada estilo de respiración tiene su propia configuración: color, tamaño, velocidad, vida, deriva
- Thunder Breathing incluye trazos eléctricos adicionales
- Máximo 200 partículas simultáneas

### Diseño de sonido

- **Chime**: sonido sutil al hacer hover sobre una tarjeta no seleccionada — 3 osciladores con LFO tremolo
- **Draw sound**: sonido de desenvaine al seleccionar — pre-breath (ruido filtrado), noise sweep, oscilador metálico
- **Clash sound**: sonido de impacto al pulsar "Confirmar" — 4 osciladores con distorsión, noise burst, anillo metálico, cola con reverb y paneo estéreo
- Todos los perfiles (Water, Thunder, Beast) tienen parámetros únicos de frecuencia, tipo de onda, distorsión y reverberación

### Temas por personaje

| Personaje | Kanji | Breathing Style | Color acento | Color respiración |
|-----------|-------|----------------|-------------|-------------------|
| Tanjiro   | 水    | Water | Rojo (#c50030) | Cian (#4fc3f7) |
| Zenitsu   | 雷    | Thunder | Amarillo (#f6b83c) | Amarillo (#ffff33) |
| Inosuke   | 獣    | Beast | Verde azulado (#2d6471) | Turquesa (#78bfab) |

## Dependencias

### Producción (ninguna)

El proyecto es 100% vanilla — sin frameworks, sin librerías externas de UI, sin bundlers.

### Desarrollo

| Paquete | Versión | Propósito |
|---------|---------|-----------|
| [servor](https://github.com/lukejacksonn/servor) | ^4.0.2 | Servidor de desarrollo con recarga |
| [gh-pages](https://github.com/tschaub/gh-pages) | ^6.3.0 | Publicación a GitHub Pages |

### Recursos externos (runtime)

- [Google Fonts](https://fonts.google.com) — Yuji Syuku, Zen Antique Soft, Zen Kaku Gothic New

## Formato de fuentes

Las fuentes variables están disponibles en tres formatos:

| Formato | Uso |
|---------|-----|
| **WOFF2** | Formato recomendado para producción (mejor compresión) |
| **WOFF** | Fallback para navegadores antiguos |
| **TTF** | Formato original para conversión |

Para convertir fuentes TTF a WOFF2:

```bash
# Requiere woff2 (https://github.com/google/woff2)
woff2_compress src/fonts/roboto-vf.ttf
```

```bash
# Alternativa con pnpm
pnpx ttf2woff src/fonts/roboto-vf.ttf src/fonts/roboto-vf.woff
```

## Despliegue

### GitHub Pages

```bash
pnpm deploy
```

### Servidor estático

El proyecto es HTML/CSS/JS puro — copia los archivos a cualquier servidor web estático (Nginx, Apache, Vercel, Netlify, etc.).

## Personalización

Para añadir más personajes:

1. Añadir un `<slayer-card>` en `index.html` con `character="nuevo-id"` y atributos correspondientes
2. Agregar la entrada en `src/lib/data.js` con bio, stats, colores, etc.
3. Añadir tema CSS con `:root:has(#radio-nuevo-id:checked)` en `src/style.css`
4. Agregar perfil de sonido en `src/lib/audio-engine.js`
5. Añadir archivo de música local en `src/audio/nuevo-id.mp3`

## Licencia

ISC
