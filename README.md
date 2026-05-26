# Manejar fuentes en CSS

Existen comandos para transformar las tipografias.
Los formatos recomendados son Woff2 y Woff2

Comandos de ejemplos:

```bash

woff2_compress roboto-vf.ttf
```

```bash
pnpx ttf2woff roboto-vf.ttf roboto-vf.woff
```

## Ingresar en fuentes en CCS

Para las fuentes se usa @Font-Face:

```css
@font-face {
  font-family: "Roboto";
  font-display: swap;
  src:
    url("./fonts/roboto-vf.woff2") format("woff2"),
    url("./fonts/roboto-vf.woff") format("woff"),
    url("./fonts/roboto-vf.ttf") format("truetype");
}
```
