import { useState } from "react";

// Nominatim es el buscador de direcciones de OpenStreetMap. es gratis pero
// pide maximo 1 peticion por segundo y un uso razonable (nada de barridos
// automaticos), asi que solo se usa cuando el usuario le da a "buscar"
export default function BuscadorDireccion({ onSeleccionar }) {
  const [texto, setTexto] = useState("");
  const [resultados, setResultados] = useState([]);
  const [buscando, setBuscando] = useState(false);
  const [error, setError] = useState("");

  async function buscar(e) {
    e.preventDefault();
    if (!texto.trim()) return;

    setBuscando(true);
    setError("");

    try {
      const url = `https://nominatim.openstreetmap.org/search?format=json&limit=5&q=${encodeURIComponent(texto)}`;
      const respuesta = await fetch(url);
      if (!respuesta.ok) throw new Error("fallo la busqueda");

      const datos = await respuesta.json();
      if (datos.length === 0) setError("No se encontró ese lugar.");
      setResultados(datos);
    } catch {
      setError("No se pudo buscar en este momento.");
      setResultados([]);
    } finally {
      setBuscando(false);
    }
  }

  function elegir(resultado) {
    onSeleccionar({ lat: parseFloat(resultado.lat), lng: parseFloat(resultado.lon) });
    setTexto(resultado.display_name);
    setResultados([]);
  }

  return (
    <form className="buscador-direccion" onSubmit={buscar}>
      <div className="buscador-direccion__campo">
        <input
          value={texto}
          onChange={e => setTexto(e.target.value)}
          placeholder="Buscar ciudad, colonia o dirección..."
        />
        <button type="submit" disabled={buscando}>{buscando ? "..." : "🔍"}</button>
      </div>

      {error && <p className="error" style={{ margin: "4px 0" }}>{error}</p>}

      {resultados.length > 0 && (
        <ul className="resultados-direccion">
          {resultados.map(r => (
            <li key={r.place_id} onClick={() => elegir(r)}>
              {r.display_name}
            </li>
          ))}
        </ul>
      )}
    </form>
  );
}
