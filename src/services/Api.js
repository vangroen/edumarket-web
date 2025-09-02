// Define la URL base de tu API de Spring Boot
const API_BASE_URL = 'http://localhost:8080/api/v1';

/**
 * Función genérica para realizar peticiones GET a la API.
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
 * Función genérica para crear registros (POST) en la API.
 */
export const createData = async (endpoint, data) => {
    // ... (código existente sin cambios)
};

/**
 * Función genérica para enviar actualizaciones (PUT) a la API.
 */
export const updateData = async (endpoint, data) => {
    // ... (código existente sin cambios)
};

/**
 * NUEVA FUNCIÓN (si no existe): Para eliminar registros (DELETE).
 */
export const deleteData = async (endpoint) => {
  console.log('--- Iniciando Petición DELETE ---');
  console.log('Endpoint:', `${API_BASE_URL}${endpoint}`);
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      const errorBody = await response.text();
      console.error('Error del servidor en DELETE:', errorBody);
      throw new Error(`Error ${response.status}: ${errorBody || response.statusText}`);
    }
    
    console.log('¡Eliminación exitosa!');
    return { success: true };

  } catch (error) {
    console.error(`Fallo al eliminar datos en el endpoint: ${endpoint}`, error);
    throw error;
  }
};