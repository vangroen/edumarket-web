import React, { useState, useEffect } from 'react';
// --- CORRECCIÓN DE RUTA ---
import Icon from '../ui/Icon';

const CatalogItemModal = ({ item, onClose, onSave, catalogTitle, displayField }) => {
  const [value, setValue] = useState('');

  useEffect(() => {
    // Si estamos editando, usamos el displayField para obtener el valor correcto
    if (item) {
      setValue(item[displayField] || '');
    }
  }, [item, displayField]);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Devolvemos un objeto con el campo dinámico
    onSave({ ...item, [displayField]: value });
  };

  const modalTitle = item ? `Editar ${catalogTitle}` : `Añadir Nuevo ${catalogTitle}`;
  const labelText = displayField.charAt(0).toUpperCase() + displayField.slice(1);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50">
      <div className="bg-dark-surface rounded-lg shadow-2xl w-full max-w-md p-8 m-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-dark-text-primary">{modalTitle}</h2>
          <button onClick={onClose} className="text-dark-text-secondary hover:text-dark-text-primary">
            <Icon path="M6 18L18 6M6 6l12 12" className="w-6 h-6" />
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label htmlFor="catalog-item-value" className="block text-sm font-medium text-dark-text-secondary mb-2">
              {labelText}
            </label>
            <input
              type="text"
              id="catalog-item-value"
              name="value"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              className="w-full bg-dark-bg border border-dark-border rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-brand-accent text-dark-text-primary"
              required
              autoFocus
            />
          </div>
          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 font-semibold transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-brand-accent text-white rounded-lg hover:bg-blue-600 font-semibold shadow transition-colors"
            >
              Guardar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CatalogItemModal;