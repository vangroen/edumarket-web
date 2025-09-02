import React, { useState, useEffect } from 'react';
// --- CORRECCIÓN DE RUTA ---
import Icon from '../ui/Icon';

const CatalogItemModal = ({ item, onClose, onSave, catalogInfo, selectOptions }) => {
  const [formData, setFormData] = useState({});

  useEffect(() => {
    if (catalogInfo?.fields) {
      const initialData = catalogInfo.fields.reduce((acc, field) => {
        acc[field.name] = item?.[field.name] ?? '';
        return acc;
      }, {});
      setFormData(initialData);
    }
  }, [item, catalogInfo]);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Combinamos el item original (para mantener el id) con los datos del formulario
    onSave({ ...item, ...formData });
  };

  if (!catalogInfo?.fields) {
    return null;
  }

  const { title: catalogTitle, fields } = catalogInfo;
  const modalTitle = item ? `Editar ${catalogTitle}` : `Añadir Nuevo ${catalogTitle}`;

  const renderField = (field) => {
    const labelText = field.label || (field.name.charAt(0).toUpperCase() + field.name.slice(1));

    return (
      <div key={field.name} className="mb-4">
        <label htmlFor={field.name} className="block text-sm font-medium text-dark-text-secondary mb-2">
          {labelText}
        </label>
        {field.type === 'select' ? (
          <select
            id={field.name}
            name={field.name}
            value={formData[field.name] || ''}
            onChange={handleChange}
            className="w-full bg-dark-bg border border-dark-border rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-brand-accent text-dark-text-primary"
            required={field.required}
          >
            <option value="">Seleccione una opción</option>
            {selectOptions?.[field.name]?.map(option => (
              <option key={option.id} value={option.id}>
                {option[field.optionLabel] || option.name}
              </option>
            ))}
          </select>
        ) : (
          <input
            type={field.type || 'text'}
            id={field.name}
            name={field.name}
            value={formData[field.name] || ''}
            onChange={handleChange}
            className="w-full bg-dark-bg border border-dark-border rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-brand-accent text-dark-text-primary"
            required={field.required}
            autoFocus={fields.indexOf(field) === 0}
          />
        )}
      </div>
    );
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

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
          {fields.map(renderField)}
          <div className="flex justify-end gap-4 mt-6">
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