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
 * Función genérica para enviar actualizaciones (PUT) a la API.
 */
export const updateData = async (endpoint, data) => {
  // Log para depuración: Muestra la URL y los datos que se enviarán.
  console.log('--- Iniciando Petición PUT ---');
  console.log('Endpoint:', `${API_BASE_URL}${endpoint}`);
  console.log('Datos a enviar:', JSON.stringify(data, null, 2));

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
      console.error('Error del servidor en PUT:', errorBody);
      throw new Error(`Error ${response.status}: ${errorBody || response.statusText}`);
    }
    
    console.log('¡Actualización exitosa!');
    return await response.text().then(text => text ? JSON.parse(text) : { success: true });

  } catch (error) {
    console.error(`Fallo al actualizar datos en el endpoint: ${endpoint}`, error);
    throw error;
  }
};

/**
 * Función genérica para crear registros (POST) en la API.
 */
export const createData = async (endpoint, data) => {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      throw new Error(`Error ${response.status}: ${errorBody || response.statusText}`);
    }
    
    return await response.text().then(text => text ? JSON.parse(text) : { success: true });

  } catch (error) {
    console.error(`Fallo al crear datos en el endpoint: ${endpoint}`, error);
    throw error;
  }
};