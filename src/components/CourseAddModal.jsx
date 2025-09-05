import React, { useState } from 'react';
import Icon from './ui/Icon';

const CourseAddModal = ({ onClose, onSave, courseTypes, modalities, allInstitutions }) => {
  const [formData, setFormData] = useState({
    name: '',
    idCourseType: '',
    idModality: '',
    institutions: [],
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleInstitutionToggle = (institutionId) => {
    setFormData(prev => {
      const isSelected = prev.institutions.some(inst => inst.institution.id === institutionId);
      let newInstitutions;
      if (isSelected) {
        newInstitutions = prev.institutions.filter(inst => inst.institution.id !== institutionId);
      } else {
        newInstitutions = [...prev.institutions, { institution: { id: institutionId }, price: '', durationInMonths: '' }];
      }
      return { ...prev, institutions: newInstitutions };
    });
  };

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

  const handleDurationChange = (institutionId, newDuration) => {
    if (/^[0-9]*$/.test(newDuration)) {
      setFormData(prev => ({
        ...prev,
        institutions: prev.institutions.map(inst =>
          inst.institution.id === institutionId ? { ...inst, durationInMonths: newDuration } : inst
        )
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.institutions.length === 0) {
      alert("Por favor, selecciona al menos una institución.");
      return;
    }
    const submissionData = {
      ...formData,
      idCourseType: parseInt(formData.idCourseType, 10),
      idModality: parseInt(formData.idModality, 10),
      institutions: formData.institutions.map(inst => ({
        ...inst,
        price: parseFloat(inst.price) || 0,
        durationInMonths: parseInt(inst.durationInMonths, 10) || 0,
      })),
    };
    onSave(submissionData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50">
      <div className="bg-dark-surface rounded-lg shadow-2xl w-full max-w-3xl p-8 m-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-dark-text-primary">Añadir Nuevo Curso</h2>
          <button onClick={onClose} className="text-dark-text-secondary hover:text-dark-text-primary">
            <Icon path="M6 18L18 6M6 6l12 12" className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="space-y-6">

            {/* --- SECCIÓN 1: INFORMACIÓN DEL CURSO --- */}
            <fieldset>
              <legend className="text-lg font-semibold text-dark-text-primary mb-3 pb-2 border-b border-dark-border w-full">
                Información del Curso
              </legend>
              <div className="space-y-4 pt-2">
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Nombre del Curso"
                  className="w-full bg-dark-bg border border-dark-border rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-brand-accent text-dark-text-primary"
                  required
                />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <select
                    id="idCourseType"
                    name="idCourseType"
                    value={formData.idCourseType}
                    onChange={handleChange}
                    className="w-full bg-dark-bg border border-dark-border rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-brand-accent text-dark-text-primary"
                    required
                  >
                    <option value="" disabled>Seleccione tipo de curso</option>
                    {courseTypes.map(type => (<option key={type.id} value={type.id}>{type.description}</option>))}
                  </select>
                  <select
                    id="idModality"
                    name="idModality"
                    value={formData.idModality}
                    onChange={handleChange}
                    className="w-full bg-dark-bg border border-dark-border rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-brand-accent text-dark-text-primary"
                    required
                  >
                    <option value="" disabled>Seleccione modalidad</option>
                    {modalities.map(modality => (<option key={modality.id} value={modality.id}>{modality.description}</option>))}
                  </select>
                </div>
              </div>
            </fieldset>

            {/* --- SECCIÓN 2: INSTITUCIONES, PRECIOS Y DURACIÓN --- */}
            <fieldset>
              <legend className="text-lg font-semibold text-dark-text-primary mb-3 pb-2 border-b border-dark-border w-full">
                Instituciones, Precios y Duración
              </legend>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 pt-2">
                {allInstitutions.map((institution) => {
                  const isSelected = formData.institutions.some(i => i.institution.id === institution.id);
                  const currentInstitution = isSelected ? formData.institutions.find(i => i.institution.id === institution.id) : {};

                  return (
                    <div key={institution.id} className="flex items-center justify-between gap-2">
                      <label htmlFor={`inst-${institution.id}`} className="flex-grow flex items-center gap-3 text-dark-text-secondary cursor-pointer">
                        <input
                          type="checkbox"
                          id={`inst-${institution.id}`}
                          checked={isSelected}
                          onChange={() => handleInstitutionToggle(institution.id)}
                          className="h-4 w-4 rounded bg-dark-bg border-dark-border text-brand-accent focus:ring-brand-accent"
                        />
                        {institution.name}
                      </label>
                      {isSelected && (
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            inputMode="decimal"
                            pattern="[0-9]*[.]?[0-9]*"
                            placeholder="S/ 0.00"
                            value={currentInstitution.price}
                            onChange={(e) => handlePriceChange(institution.id, e.target.value)}
                            className="w-24 bg-dark-bg border border-dark-border rounded-lg py-1 px-3 text-right focus:outline-none focus:ring-2 focus:ring-brand-accent text-dark-text-primary"
                            required
                            onClick={(e) => e.stopPropagation()}
                          />
                          <input
                            type="text"
                            inputMode="numeric"
                            pattern="[0-9]*"
                            placeholder="Meses"
                            value={currentInstitution.durationInMonths}
                            onChange={(e) => handleDurationChange(institution.id, e.target.value)}
                            className="w-20 bg-dark-bg border border-dark-border rounded-lg py-1 px-3 text-right focus:outline-none focus:ring-2 focus:ring-brand-accent text-dark-text-primary"
                            required
                            onClick={(e) => e.stopPropagation()}
                          />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </fieldset>
          </div>

          {/* Botones de Acción */}
          <div className="flex justify-end gap-4 mt-8">
            <button type="button" onClick={onClose}
              className="px-6 py-2 bg-dark-border text-dark-text-primary rounded-lg hover:opacity-80 font-semibold transition-opacity">
              Cancelar
            </button>
            <button type="submit"
              className="px-6 py-2 bg-brand-accent text-white rounded-lg hover:bg-blue-600 font-semibold shadow transition-colors">
              Guardar Curso
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CourseAddModal;