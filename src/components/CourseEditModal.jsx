import React, { useState } from 'react';
import Icon from './ui/Icon';

const CourseEditModal = ({ course, onClose, onSave, courseTypes, modalities }) => {
  const [formData, setFormData] = useState({
    name: course.name,
    idCourseType: course.courseType.id,
    idModality: course.modality.id,
    // Mantenemos los precios como strings para el input, se convertirán a número al guardar
    institutions: course.institutions.map(inst => ({
      institution: { id: inst.institution.id },
      price: inst.price.toString(), 
    })),
  });

  // Guardamos las instituciones originales para mostrar sus nombres
  const originalInstitutions = course.institutions;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePriceChange = (index, newPrice) => {
    // Permite solo números y un punto decimal
    if (/^[0-9]*\.?[0-9]*$/.test(newPrice)) {
        const updatedInstitutions = [...formData.institutions];
        updatedInstitutions[index].price = newPrice;
        setFormData(prev => ({ ...prev, institutions: updatedInstitutions }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Preparamos los datos para el envío, convirtiendo los precios a números
    const submissionData = {
        ...formData,
        idCourseType: parseInt(formData.idCourseType, 10),
        idModality: parseInt(formData.idModality, 10),
        institutions: formData.institutions.map(inst => ({
            ...inst,
            price: parseFloat(inst.price) || 0,
        })),
    };
    onSave(submissionData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50">
      <div className="bg-dark-surface rounded-lg shadow-2xl w-full max-w-lg p-8 m-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-dark-text-primary">Editar Curso</h2>
          <button onClick={onClose} className="text-dark-text-secondary hover:text-dark-text-primary">
            <Icon path="M6 18L18 6M6 6l12 12" className="w-6 h-6" />
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          {/* Nombre del Curso */}
          <div className="mb-4">
            <label htmlFor="name" className="block text-sm font-medium text-dark-text-secondary mb-2">Nombre del Curso</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full bg-dark-bg border border-dark-border rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-brand-accent text-dark-text-primary"
              required
            />
          </div>

          {/* Tipo y Modalidad */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label htmlFor="idCourseType" className="block text-sm font-medium text-dark-text-secondary mb-2">Tipo de Curso</label>
              <select
                id="idCourseType"
                name="idCourseType"
                value={formData.idCourseType}
                onChange={handleChange}
                className="w-full bg-dark-bg border border-dark-border rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-brand-accent text-dark-text-primary"
              >
                {courseTypes.map(type => (
                  <option key={type.id} value={type.id}>{type.description}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="idModality" className="block text-sm font-medium text-dark-text-secondary mb-2">Modalidad</label>
              <select
                id="idModality"
                name="idModality"
                value={formData.idModality}
                onChange={handleChange}
                className="w-full bg-dark-bg border border-dark-border rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-brand-accent text-dark-text-primary"
              >
                {modalities.map(modality => (
                  <option key={modality.id} value={modality.id}>{modality.description}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Precios por Institución */}
          <div className="mb-8">
            <h3 className="text-lg font-medium text-dark-text-primary mb-3">Precios por Institución</h3>
            <div className="space-y-3 max-h-40 overflow-y-auto pr-2">
              {originalInstitutions.map((inst, index) => (
                <div key={inst.institution.id} className="flex items-center justify-between gap-4">
                  <span className="text-dark-text-secondary flex-1">{inst.institution.name}</span>
                  {/* --- CAMBIOS PRINCIPALES AQUÍ --- */}
                  <input
                    type="text"
                    inputMode="decimal" // Mejora la experiencia en móviles mostrando un teclado numérico
                    pattern="[0-9]*[.]?[0-9]*" // Patrón para validar un número con punto decimal
                    value={formData.institutions[index].price}
                    onChange={(e) => handlePriceChange(index, e.target.value)}
                    className="w-32 bg-dark-bg border border-dark-border rounded-lg py-1 px-3 text-right focus:outline-none focus:ring-2 focus:ring-brand-accent text-dark-text-primary"
                    required
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Botones de Acción */}
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
              Guardar Cambios
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CourseEditModal;