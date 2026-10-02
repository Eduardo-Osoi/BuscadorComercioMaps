import { useEffect, useState } from "react";
import MapView from "./components/MapView";
import CafeList from "./components/CafeList";
import Filters from "./components/Filters";
import FiltrosLista from "./components/FiltrosLista";
import BuscadorDireccion from "./components/BuscadorDireccion";
import { useFavoritos } from "./hooks/useFavoritos";

const TITULOS = {
  cafe: "☕ Cafeterías cercanas",
  restaurant: "🍽️ Restaurantes cercanos",
  veterinary: "🐾 Veterinarias cercanas"
};

export default function App() {
  const [centro, setCentro] = useState(null);
  const [cafes, setCafes] = useState([]);
  const [estado, setEstado] = useState("cargando");
  const [radio, setRadio] = useState(2000);
  const [tipoLugar, setTipoLugar] = useState("cafe");
  const [errorUbicacion, setErrorUbicacion] = useState("");
  const [lugarSeleccionado, setLugarSeleccionado] = useState(null);

  const [textoFiltro, setTextoFiltro] = useState("");
  const [soloAbiertos, setSoloAbiertos] = useState(false);
  const [soloFavoritos, setSoloFavoritos] = useState(false);

  const { favoritos, alternarFavorito } = useFavoritos();

  function usarMiUbicacion() {
    setErrorUbicacion("");
    navigator.geolocation.getCurrentPosition(
      pos => setCentro({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      () => setErrorUbicacion("No pudimos obtener tu ubicación. Revisa los permisos del navegador."),
      { enableHighAccuracy: true, timeout: 15000 }
    );
  }

  useEffect(() => {
    usarMiUbicacion();
  }, []);

  return (
    <div className="app">
      <aside className="sidebar">
        <h2>{TITULOS[tipoLugar]}</h2>

        <BuscadorDireccion onSeleccionar={setCentro} />

        <button type="button" className="boton-mi-ubicacion" onClick={usarMiUbicacion}>
          📍 Usar mi ubicación actual
        </button>

        <Filters radio={radio} setRadio={setRadio} tipoLugar={tipoLugar} setTipoLugar={setTipoLugar} />

        {errorUbicacion && <p className="error">{errorUbicacion}</p>}
        {centro && (
          <p className="coordenadas">
            Buscando cerca de: {centro.lat.toFixed(4)}, {centro.lng.toFixed(4)}
            <br />
            (arrastra el pin o toca el mapa para cambiar el punto)
          </p>
        )}

        <FiltrosLista
          texto={textoFiltro}
          setTexto={setTextoFiltro}
          soloAbiertos={soloAbiertos}
          setSoloAbiertos={setSoloAbiertos}
          soloFavoritos={soloFavoritos}
          setSoloFavoritos={setSoloFavoritos}
        />

        <div className="lista-resultados">
          {centro && (
            <CafeList
              cafes={cafes}
              estado={estado}
              radio={radio}
              centro={centro}
              favoritos={favoritos}
              onAlternarFavorito={alternarFavorito}
              onSeleccionar={setLugarSeleccionado}
              textoFiltro={textoFiltro}
              soloAbiertos={soloAbiertos}
              soloFavoritos={soloFavoritos}
            />
          )}
        </div>
      </aside>

      <main className="map">
        <MapView
          centro={centro}
          onCentroCambiado={setCentro}
          cafes={cafes}
          setCafes={setCafes}
          setEstado={setEstado}
          radio={radio}
          tipoLugar={tipoLugar}
          lugarSeleccionado={lugarSeleccionado}
        />
      </main>
    </div>
  );
}
