import OpeningHours from "opening_hours";

// OSM esta lleno de horarios mal escritos por voluntarios, asi que si la
// libreria no puede parsearlo mostramos el texto crudo en vez de tronar
export function calcularEstadoHorario(textoHorario) {
  if (!textoHorario) {
    return { conocido: false, abierto: null, texto: "Horario no disponible" };
  }

  try {
    const oh = new OpeningHours(textoHorario);
    return { conocido: true, abierto: oh.getState(), texto: textoHorario };
  } catch {
    return { conocido: false, abierto: null, texto: textoHorario };
  }
}
