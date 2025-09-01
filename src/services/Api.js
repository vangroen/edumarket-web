// Define la URL base de tu API de Spring Boot
const API_BASE_URL = 'http://localhost:8080/api/v1';

/**
 * Función genérica para realizar peticiones a la API.
 * @param {string} endpoint - La ruta del recurso (ej. '/courses').
 * @returns {Promise<any>} - La respuesta de la API en formato JSON.
 */
export const fetchData = async (endpoint) => {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`);

    if (!response.ok) {
      // Si el servidor responde con un error, lo lanzamos para poder capturarlo
      const errorBody = await response.text();
      throw new Error(`Error ${response.status}: ${errorBody || response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`Fallo al obtener datos del endpoint: ${endpoint}`, error);
    // Re-lanzamos el error para que el componente que lo llama pueda manejarlo
    throw error;
  }
};
