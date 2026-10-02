import { useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap, useMapEvents } from "react-leaflet";
import L from "leaflet";
import iconoMarcador from "leaflet/dist/images/marker-icon.png";
import iconoSombra from "leaflet/dist/images/marker-shadow.png";
import iconoCentro from "leaflet/dist/images/marker-icon-2x.png";
import { buscarLugaresCercanos } from "../services/overpass";

// leaflet trae sus iconos por defecto pero con vite no se resuelven solos,
// hay que decirle explicitamente donde estan
L.Icon.Default.mergeOptions({
  iconUrl: iconoMarcador,
  shadowUrl: iconoSombra
});

const iconoPuntoBusqueda = new L.Icon({
  iconUrl: iconoCentro,
  shadowUrl: iconoSombra,
  iconSize: [30, 49],
  iconAnchor: [15, 49],
  className: "marcador-centro"
});

function ClicksEnMapa({ onClicMapa }) {
  useMapEvents({
    click(e) {
      onClicMapa({ lat: e.latlng.lat, lng: e.latlng.lng });
    }
  });
  return null;
}

// MapContainer solo lee "center" la primera vez; esto mueve la camara cuando
// el centro cambia por buscador de direccion o boton "usar mi ubicacion"
function SeguirCentro({ centro, recentrar }) {
  const map = useMap();
  const primeraVez = useRef(true);

  useEffect(() => {
    if (primeraVez.current) {
      primeraVez.current = false;
      return;
    }
    if (recentrar) map.flyTo([centro.lat, centro.lng], map.getZoom());
  }, [centro]);

  return null;
}

function VolarALugar({ lugar }) {
  const map = useMap();

  useEffect(() => {
    if (lugar) map.flyTo([lugar.lat, lugar.lon], 17);
  }, [lugar]);

  return null;
}

export default function MapView({
  centro,
  onCentroCambiado,
  cafes,
  setCafes,
  radio,
  tipoLugar,
  setEstado,
  lugarSeleccionado
}) {
  useEffect(() => {
    if (!centro) return;

    let cancelado = false;
    setEstado("cargando");

    buscarLugaresCercanos(centro.lat, centro.lng, radio, tipoLugar)
      .then(lugares => {
        if (cancelado) return;
        setCafes(lugares);
        setEstado("listo");
      })
      .catch(error => {
        if (cancelado) return;
        console.error("Error buscando lugares:", error);
        setCafes([]);
        setEstado("error");
      });

    return () => {
      cancelado = true;
    };
  }, [centro, radio, tipoLugar]);

  if (!centro) return <p style={{ padding: 15 }}>Esperando ubicación...</p>;

  return (
    <MapContainer center={[centro.lat, centro.lng]} zoom={15} style={{ width: "100%", height: "100%" }}>
      <ClicksEnMapa onClicMapa={onCentroCambiado} />
      <SeguirCentro centro={centro} recentrar={true} />
      <VolarALugar lugar={lugarSeleccionado} />

      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <Circle center={[centro.lat, centro.lng]} radius={radio} pathOptions={{ color: "#2563eb", fillOpacity: 0.06 }} />

      <Marker
        position={[centro.lat, centro.lng]}
        icon={iconoPuntoBusqueda}
        draggable
        eventHandlers={{
          dragend: e => onCentroCambiado(e.target.getLatLng())
        }}
      >
        <Popup>Arrástrame para cambiar el punto de búsqueda</Popup>
      </Marker>

      {cafes.map(lugar => (
        <Marker key={lugar.id} position={[lugar.lat, lugar.lon]}>
          <Popup>
            <strong>{lugar.nombre}</strong>
            <br />
            {lugar.direccion}
            <br />
            {lugar.horario}
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
