# Buscador de lugares cercanos (café / restaurante / veterinaria)

App en React que busca lugares cercanos a un punto usando **OpenStreetMap** para el mapa y la **Overpass API** para la búsqueda — ambos gratis, sin API key, sin tarjeta de crédito.

## Cómo correrlo

```bash
npm install
npm run dev
```

No hay que crear cuenta en ningún lado ni configurar nada.

## Funciones

- **Cambiar el punto de búsqueda a mano**: escribe una ciudad/colonia (usa Nominatim, el buscador de direcciones de OSM), toca el mapa, o arrastra el pin azul. Ya no depende de que el navegador adivine bien tu ubicación.
- **Tres categorías**: cafeterías, restaurantes, veterinarias — cambia con un selector, sin tocar código.
- **Distancia** a cada lugar, con la lista ordenada del más cercano al más lejano.
- **Abierto ahora / Cerrado**, calculado en el navegador a partir del horario que tenga cargado OpenStreetMap (librería `opening_hours`).
- **Favoritos** guardados en `localStorage` — sobreviven a que cierres el navegador.
- **Filtros de lista**: por nombre, solo abiertos, solo favoritos.
- **Tocar una tarjeta** hace que el mapa vuele a ese lugar.
- **"Cómo llegar"** abre direcciones en Google Maps (es solo un link, no usa ninguna API de pago).
- **Diseño responsivo**: en pantallas angostas la lista se acomoda debajo del mapa.
- **Múltiples lugares mapeados como edificio** (no solo como punto) — antes se perdían.
- **Servidores Overpass de respaldo**: si el principal está saturado, reintenta con otros dos automáticamente.

## Estructura

```
src/
  components/
    MapView.jsx          mapa, pin arrastrable, círculo de radio, clic para mover el punto
    CafeList.jsx          lista con distancia, horario, favoritos, "cómo llegar"
    Filters.jsx            categoría + radio de búsqueda (dispara nueva consulta a Overpass)
    FiltrosLista.jsx      nombre / solo abiertos / solo favoritos (filtra lo ya cargado, sin red)
    BuscadorDireccion.jsx  autocompletar de ciudad/colonia vía Nominatim
  services/
    overpass.js            arma y manda las consultas a la Overpass API
  utils/
    distancia.js            fórmula haversine
    horario.js              envuelve la librería opening_hours con manejo de errores
  hooks/
    useFavoritos.js         favoritos persistidos en localStorage
```

## Limitaciones conocidas

- **Nominatim** (el buscador de direcciones) pide máximo 1 petición por segundo de uso — está bien para un usuario buscando manualmente, no para automatizarlo.
- **Overpass pública** no tiene garantía de uptime; por eso hay servidores de respaldo, pero en horas pico puede tardar varios segundos.
- **"Abierto ahora"** depende de que el horario esté bien cargado en OpenStreetMap y de que el reloj/zona horaria del navegador del usuario sea correcto — si un horario está mal escrito en OSM, se muestra el texto crudo en vez de adivinar.
- El bundle de producción pasa los 500 KB (sobre todo por Leaflet + la librería de horarios) — para un proyecto real convendría *code splitting*, aquí no se hizo por mantener el alcance enfocado en la funcionalidad.
- Los favoritos viven en `localStorage` de este navegador — no se sincronizan entre dispositivos (necesitaría una cuenta y un backend).
