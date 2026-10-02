export default function FiltrosLista({ texto, setTexto, soloAbiertos, setSoloAbiertos, soloFavoritos, setSoloFavoritos }) {
  return (
    <div className="filtros-lista">
      <input
        className="filtros-lista__buscar"
        value={texto}
        onChange={e => setTexto(e.target.value)}
        placeholder="Filtrar por nombre..."
      />
      <div className="filtros-lista__casillas">
        <label>
          <input type="checkbox" checked={soloAbiertos} onChange={e => setSoloAbiertos(e.target.checked)} />
          Solo abiertos
        </label>
        <label>
          <input type="checkbox" checked={soloFavoritos} onChange={e => setSoloFavoritos(e.target.checked)} />
          Solo favoritos
        </label>
      </div>
    </div>
  );
}
