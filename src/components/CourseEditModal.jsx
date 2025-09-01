import React, { useState } from 'react';
import Icon from './ui/Icon';

const CourseEditModal = ({ course, onClose, onSave, courseTypes, modalities, allInstitutions }) => {
  // Inicializamos el estado del formulario con los datos actuales del curso
  const [formData, setFormData] = useState({
    name: course.name,
    idCourseType: course.courseType.id,
    idModality: course.modality.id,
    institutions: course.institutions.map(inst => ({
      institution: { id: inst.institution.id },
      price: inst.price.toString(), // Mantenemos como string para el input
    })),
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  // Lógica para añadir/quitar instituciones de la lista del formulario
  const handleInstitutionToggle = (institutionId) => {
    setFormData(prev => {
      const isSelected = prev.institutions.some(inst => inst.institution.id === institutionId);
      let newInstitutions;

      if (isSelected) {
        // Si ya está seleccionada, la quitamos de la lista
        newInstitutions = prev.institutions.filter(inst => inst.institution.id !== institutionId);
      } else {
        // Si no está, la añadimos con un precio por defecto
        newInstitutions = [...prev.institutions, { institution: { id: institutionId }, price: '0.00' }];
      }
      return { ...prev, institutions: newInstitutions };
    });
  };

  // Lógica para actualizar el precio de una institución específica
  const handlePriceChange = (institutionId, newPrice) => {
    if (/^[0-9]*\.?[0-9]*$/.test(newPrice)) {
        setFormData(prev => ({
            ...prev,
            institutions: prev.institutions.map(inst => 
                inst.institution.id === institutionId ? { ...inst, price: newPrice } : inst
            )
        }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.institutions.length === 0) {
        alert("Un curso debe tener al menos una institución asociada.");
        return;
    }
    // Preparamos los datos para el envío, convirtiendo a los tipos correctos
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
            {/* Campos de Nombre, Tipo y Modalidad */}
            <div className="mb-4">
                <label htmlFor="name" className="block text-sm font-medium text-dark-text-secondary mb-2">Nombre del Curso</label>
                <input
                type="text" id="name" name="name" value={formData.name} onChange={handleChange}
                className="w-full bg-dark-bg border border-dark-border rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-brand-accent text-dark-text-primary"
                required />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                    <label htmlFor="idCourseType" className="block text-sm font-medium text-dark-text-secondary mb-2">Tipo de Curso</label>
                    <select id="idCourseType" name="idCourseType" value={formData.idCourseType} onChange={handleChange}
                        className="w-full bg-dark-bg border border-dark-border rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-brand-accent text-dark-text-primary">
                        {courseTypes.map(type => (<option key={type.id} value={type.id}>{type.description}</option>))}
                    </select>
                </div>
                <div>
                    <label htmlFor="idModality" className="block text-sm font-medium text-dark-text-secondary mb-2">Modalidad</label>
                    <select id="idModality" name="idModality" value={formData.idModality} onChange={handleChange}
                        className="w-full bg-dark-bg border border-dark-border rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-brand-accent text-dark-text-primary">
                        {modalities.map(modality => (<option key={modality.id} value={modality.id}>{modality.description}</option>))}
                    </select>
                </div>
            </div>

          {/* Sección de Instituciones y Precios */}
          <div className="mb-8">
            <h3 className="text-lg font-medium text-dark-text-primary mb-3">Instituciones y Precios</h3>
            <div className="space-y-4 max-h-48 overflow-y-auto pr-2 border-t border-b border-dark-border py-4">
              {allInstitutions.map((institution) => {
                const isSelected = formData.institutions.some(i => i.institution.id === institution.id);
                const currentPrice = isSelected ? formData.institutions.find(i => i.institution.id === institution.id).price : '';
                
                return (
                  <div key={institution.id}>
                    <div className="flex items-center justify-between">
                      <label htmlFor={`inst-edit-${institution.id}`} className="flex items-center gap-3 text-dark-text-secondary cursor-pointer">
                        <input
                          type="checkbox"
                          id={`inst-edit-${institution.id}`}
                          checked={isSelected}
                          onChange={() => handleInstitutionToggle(institution.id)}
                          className="h-4 w-4 rounded bg-dark-bg border-dark-border text-brand-accent focus:ring-brand-accent"
                        />
                        {institution.name}
                      </label>
                      {isSelected && (
                        <input
                          type="text"
                          inputMode="decimal"
                          pattern="[0-9]*[.]?[0-9]*"
                          placeholder="S/ 0.00"
                          value={currentPrice}
                          onChange={(e) => handlePriceChange(institution.id, e.target.value)}
                          className="w-32 bg-dark-bg border border-dark-border rounded-lg py-1 px-3 text-right focus:outline-none focus:ring-2 focus:ring-brand-accent text-dark-text-primary"
                          required
                        />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Botones de Acción */}
          <div className="flex justify-end gap-4">
            <button type="button" onClick={onClose}
              className="px-6 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 font-semibold transition-colors">
              Cancelar
            </button>
            <button type="submit"
              className="px-6 py-2 bg-brand-accent text-white rounded-lg hover:bg-blue-600 font-semibold shadow transition-colors">
              Guardar Cambios
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CourseEditModal;