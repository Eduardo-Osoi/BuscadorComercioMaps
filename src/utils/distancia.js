const RADIO_TIERRA_KM = 6371;

function gradosARadianes(grados) {
  return (grados * Math.PI) / 180;
}

export function calcularDistanciaKm(lat1, lon1, lat2, lon2) {
  const dLat = gradosARadianes(lat2 - lat1);
  const dLon = gradosARadianes(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(gradosARadianes(lat1)) * Math.cos(gradosARadianes(lat2)) * Math.sin(dLon / 2) ** 2;

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return RADIO_TIERRA_KM * c;
}

export function formatearDistancia(km) {
  if (km < 1) return `${Math.round(km * 1000)} m`;
  return `${km.toFixed(1)} km`;
}
