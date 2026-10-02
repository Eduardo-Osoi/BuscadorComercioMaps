import { calcularDistanciaKm, formatearDistancia } from "../utils/distancia";
import { calcularEstadoHorario } from "../utils/horario";

function urlComoLlegar(lat, lon) {
  return `https://www.google.com/maps/dir/?api=1&destination=${lat},${lon}`;
}

export default function CafeList({
  cafes,
  estado,
  radio,
  centro,
  favoritos,
  onAlternarFavorito,
  onSeleccionar,
  textoFiltro,
  soloAbiertos,
  soloFavoritos
}) {
  if (estado === "cargando") {
    return <p className="sin-resultados">Buscando lugares cercanos...</p>;
  }

  if (estado === "error") {
    return (
      <p className="error">
        No se pudo consultar OpenStreetMap (los servidores públicos a veces están saturados).
        Espera unos segundos y reintenta.
      </p>
    );
  }

  if (estado === "listo" && cafes.length === 0) {
    return (
      <p className="sin-resultados">
        No hay lugares mapeados en OpenStreetMap a {radio / 1000} km de este punto. Prueba con un radio
        mayor o mueve el punto de búsqueda.
      </p>
    );
  }

  const preparados = cafes
    .map(lugar => ({
      ...lugar,
      distanciaKm: centro ? calcularDistanciaKm(centro.lat, centro.lng, lugar.lat, lugar.lon) : null,
      horario: calcularEstadoHorario(lugar.horario),
      favorito: favoritos.includes(lugar.id)
    }))
    .sort((a, b) => (a.distanciaKm ?? 0) - (b.distanciaKm ?? 0));

  const filtrados = preparados.filter(lugar => {
    if (textoFiltro && !lugar.nombre.toLowerCase().includes(textoFiltro.toLowerCase())) return false;
    if (soloAbiertos && lugar.horario.abierto !== true) return false;
    if (soloFavoritos && !lugar.favorito) return false;
    return true;
  });

  if (filtrados.length === 0) {
    return <p className="sin-resultados">Ningún lugar coincide con estos filtros.</p>;
  }

  return (
    <>
      {filtrados.map(lugar => (
        <div className="card" key={lugar.id} onClick={() => onSeleccionar(lugar)}>
          <div className="card__encabezado">
            <h3>{lugar.nombre}</h3>
            <button
              type="button"
              className={`boton-favorito ${lugar.favorito ? "boton-favorito--activo" : ""}`}
              onClick={e => {
                e.stopPropagation();
                onAlternarFavorito(lugar.id);
              }}
              title={lugar.favorito ? "Quitar de favoritos" : "Agregar a favoritos"}
            >
              {lugar.favorito ? "★" : "☆"}
            </button>
          </div>

          <p>{lugar.direccion}</p>

          <p className="card__meta">
            {lugar.distanciaKm !== null && <span>📍 {formatearDistancia(lugar.distanciaKm)}</span>}
            {lugar.horario.conocido && (
              <span className={lugar.horario.abierto ? "estado-abierto" : "estado-cerrado"}>
                {lugar.horario.abierto ? "Abierto ahora" : "Cerrado ahora"}
              </span>
            )}
          </p>

          <p className="card__meta-secundaria">🕒 {lugar.horario.texto}</p>
          {lugar.telefono && <p className="card__meta-secundaria">📞 {lugar.telefono}</p>}

          <a
            href={urlComoLlegar(lugar.lat, lugar.lon)}
            target="_blank"
            rel="noreferrer"
            className="enlace-como-llegar"
            onClick={e => e.stopPropagation()}
          >
            Cómo llegar →
          </a>
        </div>
      ))}
    </>
  );
}
