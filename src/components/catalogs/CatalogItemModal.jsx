import React, { useState, useEffect } from 'react';
// --- RUTA CORREGIDA ---
import Icon from '../ui/Icon';

const translations = {
    description: 'Descripción',
    status: 'Estado',
    name: 'Nombre',
};

const CatalogItemModal = ({ item, onClose, onSave, catalogInfo, selectOptions }) => {
  const { title, fields } = catalogInfo;
  const [formData, setFormData] = useState({});

  // Inicializar el estado del formulario
  useEffect(() => {
    const initialState = {};
    fields.forEach(field => {
      if (item) { // Si estamos editando un item existente
        // Para 'select', el valor es el ID, ej: item.institutionType.id
        const fieldValue = field.type === 'select' ? item[field.name.replace('id', '').toLowerCase()]?.id : item[field.name];
        initialState[field.name] = fieldValue || '';
      } else { // Si estamos creando un nuevo item
        // El valor inicial es vacío para forzar la selección
        initialState[field.name] = '';
      }
    });
    setFormData(initialState);
  }, [item, fields]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ ...item, ...formData });
  };

  const getTranslatedText = (field) => {
    return translations[field] || field.charAt(0).toUpperCase() + field.slice(1);
  };

  const modalTitle = item ? `Editar ${title}` : `Añadir Nuevo ${title}`;
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50">
      <div className="bg-dark-surface rounded-lg shadow-2xl w-full max-w-md p-8 m-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-dark-text-primary">{modalTitle}</h2>
          <button onClick={onClose} className="text-dark-text-secondary hover:text-dark-text-primary">
            <Icon path="M6 18L18 6M6 6l12 12" className="w-6 h-6" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          {fields.map(field => (
            <div key={field.name}>
              <label htmlFor={field.name} className="block text-sm font-medium text-dark-text-secondary mb-2">
                {field.label}
              </label>
              {field.type === 'text' ? (
                <input
                  type="text"
                  id={field.name}
                  name={field.name}
                  value={formData[field.name] || ''}
                  onChange={handleChange}
                  className="w-full bg-dark-bg border border-dark-border rounded-lg py-2 px-4 text-dark-text-primary"
                  required
                />
              ) : (
                // --- CAMBIOS AQUÍ ---
                <select
                  id={field.name}
                  name={field.name}
                  value={formData[field.name] || ''}
                  onChange={handleChange}
                  className="w-full bg-dark-bg border border-dark-border rounded-lg py-2 px-4 text-dark-text-primary"
                  required // Hacemos el campo obligatorio
                >
                  {/* 1. Añadimos una opción deshabilitada como placeholder */}
                  <option value="" disabled>Seleccione una Institución</option>

                  {/* 2. Mapeamos el resto de las opciones */}
                  {selectOptions[field.name]?.map(option => (
                    <option key={option.id} value={option.id}>{option.description || option.name}</option>
                  ))}
                </select>
              )}
            </div>
          ))}
          <div className="flex justify-end gap-4 pt-4">
            <button type="button" onClick={onClose} className="px-6 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700">Cancelar</button>
            <button type="submit" className="px-6 py-2 bg-brand-accent text-white rounded-lg hover:bg-blue-600">Guardar</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CatalogItemModal;