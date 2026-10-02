import { useEffect, useState } from "react";

const CLAVE_STORAGE = "buscador-favoritos";

function leerFavoritosGuardados() {
  try {
    const guardado = localStorage.getItem(CLAVE_STORAGE);
    return guardado ? JSON.parse(guardado) : [];
  } catch {
    return [];
  }
}

export function useFavoritos() {
  const [favoritos, setFavoritos] = useState(leerFavoritosGuardados);

  useEffect(() => {
    localStorage.setItem(CLAVE_STORAGE, JSON.stringify(favoritos));
  }, [favoritos]);

  function esFavorito(id) {
    return favoritos.includes(id);
  }

  function alternarFavorito(id) {
    setFavoritos(actuales =>
      actuales.includes(id) ? actuales.filter(f => f !== id) : [...actuales, id]
    );
  }

  return { favoritos, esFavorito, alternarFavorito };
}
