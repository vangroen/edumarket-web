// Define la URL base de tu API de Spring Boot
const API_BASE_URL = 'http://localhost:8080/api/v1';

/**
 * Función genérica para realizar peticiones GET a la API.
 * @param {string} endpoint - La ruta del recurso (ej. '/courses').
 * @returns {Promise<any>} - La respuesta de la API en formato JSON.
 */
export const fetchData = async (endpoint) => {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`);

    if (!response.ok) {
      const errorBody = await response.text();
      throw new Error(`Error ${response.status}: ${errorBody || response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`Fallo al obtener datos del endpoint: ${endpoint}`, error);
    throw error;
  }
};

/**
 * Función genérica para enviar actualizaciones (PUT) a la API.
 * @param {string} endpoint - La ruta del recurso (ej. '/courses/4').
 * @param {object} data - El cuerpo de la petición con los datos a actualizar.
 * @returns {Promise<any>} - La respuesta de la API en formato JSON.
 */
export const updateData = async (endpoint, data) => {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      throw new Error(`Error ${response.status}: ${errorBody || response.statusText}`);
    }

    // Si el backend no devuelve cuerpo en el PUT, puedes retornar un objeto de éxito.
    // O si devuelve el objeto actualizado, puedes usar response.json().
    return await response.text().then(text => text ? JSON.parse(text) : {});

  } catch (error) {
    console.error(`Fallo al actualizar datos en el endpoint: ${endpoint}`, error);
    throw error;
  }
};