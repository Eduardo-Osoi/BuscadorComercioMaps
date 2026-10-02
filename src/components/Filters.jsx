export default function Filters({ radio, setRadio, tipoLugar, setTipoLugar }) {
  return (
    <div className="filters">
      <label>Qué buscar</label>
      <select value={tipoLugar} onChange={e => setTipoLugar(e.target.value)}>
        <option value="cafe">☕ Cafeterías</option>
        <option value="restaurant">🍽️ Restaurantes</option>
        <option value="veterinary">🐾 Veterinarias</option>
      </select>

      <label>Radio de búsqueda</label>
      <select value={radio} onChange={e => setRadio(Number(e.target.value))}>
        <option value="1000">1 km</option>
        <option value="2000">2 km</option>
        <option value="5000">5 km</option>
        <option value="10000">10 km</option>
      </select>
    </div>
  );
}
