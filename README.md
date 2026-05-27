# 鬼滅の刃 // DEMON SLAYER CORPS SELECTOR

Selector interactivo de personajes del anime *Demon Slayer: Kimetsu no Yaiba* con estética HUD del Cuerpo de Exterminio, efectos de respiración animados, diseño de sonido por Web Audio y tema musical por personaje vía YouTube.

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
├── index.html            # Punto de entrada — HTML del selector
├── style.css             # Sistema de estilos completo (~1800 líneas)
├── index.js              # Lógica JS: partículas, audio, YouTube, UI (~1000 líneas)
├── package.json          # Dependencias y scripts
├── pnpm-lock.yaml        # Lockfile de dependencias
├── DOSSIER_KIMETSU_DESIGN.md  # Guía de diseño visual completa
├── fonts/
│   ├── roboto-vf.woff2        # Roboto Variable Font
│   ├── roboto-vf.woff
│   ├── roboto-vf.ttf
│   ├── NotoSansKhmer-vf.woff2 # Noto Sans Khmer Variable Font
│   ├── NotoSansKhmer-vf.woff
│   └── NotoSansKhmer-vf.ttf
```

## Arquitectura

### Flujo de selección de personaje

1. El usuario hace clic en una tarjeta de personaje
2. El `input[type=radio]` asociado se marca como `checked`
3. CSS aplica el tema dinámico mediante `:root:has(#radio-xxx:checked)` — cambia colores, glow, borde y opacidad de efectos
4. `selectSlayer(id)` en JS actualiza:
   - Panel de información (nombre, biografía, stats, habilidad)
   - Estilo de respiración (partículas del canvas)
   - Tema musical vía YouTube IFrame API
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

- [YouTube IFrame API](https://developers.google.com/youtube/iframe_api_reference) — reproducción de temas musicales
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
woff2_compress roboto-vf.ttf
```

```bash
# Alternativa con pnpm
pnpx ttf2woff roboto-vf.ttf roboto-vf.woff
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

1. Añadir un `<article class="character-card">` en `index.html` con un radio button y `data-character="nuevo-id"`
2. Agregar la entrada en `SLAYERS` en `index.js` con bio, stats, videoId, etc.
3. Añadir tema CSS con `:root:has(#radio-nuevo-id:checked)` en `style.css`
4. Agregar perfil de sonido en `SOUND_PROFILES` en `index.js`

## Licencia

ISC
