// varios servidores publicos de Overpass: si uno esta saturado, probamos el siguiente
const SERVIDORES = [
  "https://overpass-api.de/api/interpreter",
  "https://overpass.kumi.systems/api/interpreter",
  "https://overpass.private.coffee/api/interpreter"
];

const FILTROS = {
  cafe: ['["amenity"="cafe"]', '["shop"="coffee"]'],
  restaurant: ['["amenity"="restaurant"]', '["amenity"="fast_food"]'],
  veterinary: ['["amenity"="veterinary"]']
};

// nwr = node + way + relation. antes solo buscaba node y se perdian los lugares
// que en OSM estan dibujados como edificio. "out center" da un punto para esos
function construirConsulta(lat, lon, radio, tipoLugar) {
  const filtros = FILTROS[tipoLugar] || FILTROS.cafe;
  const busquedas = filtros
    .map(f => `  nwr${f}(around:${radio},${lat},${lon});`)
    .join("\n");

  return `[out:json][timeout:25];
(
${busquedas}
);
out center;`;
}

function extraerDireccion(tags) {
  const calle = tags["addr:street"];
  const numero = tags["addr:housenumber"];

  if (calle && numero) return `${calle} ${numero}`;
  if (calle) return calle;
  return "Dirección no disponible";
}

function normalizarLugar(elemento) {
  const tags = elemento.tags || {};
  const lat = elemento.lat ?? elemento.center?.lat;
  const lon = elemento.lon ?? elemento.center?.lon;

  if (lat == null || lon == null) return null;

  return {
    id: `${elemento.type}-${elemento.id}`,
    nombre: tags.name || "Sin nombre",
    lat,
    lon,
    direccion: extraerDireccion(tags),
    horario: tags.opening_hours || "Horario no disponible",
    telefono: tags.phone || tags["contact:phone"] || null
  };
}

async function consultarServidor(url, consulta) {
  const controlador = new AbortController();
  const temporizador = setTimeout(() => controlador.abort(), 20000);

  try {
    const respuesta = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: "data=" + encodeURIComponent(consulta),
      signal: controlador.signal
    });

    if (!respuesta.ok) {
      throw new Error(`${url} respondio ${respuesta.status}`);
    }

    return await respuesta.json();
  } finally {
    clearTimeout(temporizador);
  }
}

export async function buscarLugaresCercanos(lat, lon, radio = 2000, tipoLugar = "cafe") {
  const consulta = construirConsulta(lat, lon, radio, tipoLugar);
  let ultimoError;

  for (const servidor of SERVIDORES) {
    try {
      const datos = await consultarServidor(servidor, consulta);
      return datos.elements.map(normalizarLugar).filter(Boolean);
    } catch (error) {
      console.warn("Overpass fallo, probando otro servidor:", error.message);
      ultimoError = error;
    }
  }

  throw ultimoError;
}
