import React, { useState, useEffect } from 'react';
import Icon from '../components/ui/Icon';

const StudentAddModal = ({ onClose, onSave, catalogs }) => {
  // Estado para manejar todos los campos del formulario
  const [formData, setFormData] = useState({
    // Campos para la entidad Persona
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    documentNumber: '',
    idDocumentType: '',
    // Campos para la entidad Estudiante
    idProfession: '',
    idInstitution: '',
    idAcademicRank: '',
  });

  // Pre-seleccionar el primer valor de los catálogos si existen
  useEffect(() => {
    setFormData(prev => ({
      ...prev,
      idDocumentType: catalogs.documentTypes?.[0]?.id || '',
      idProfession: catalogs.professions?.[0]?.id || '',
      idInstitution: catalogs.institutions?.[0]?.id || '',
      idAcademicRank: catalogs.academicRanks?.[0]?.id || '',
    }));
  }, [catalogs]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50">
      <div className="bg-dark-surface rounded-lg shadow-2xl w-full max-w-2xl p-8 m-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-dark-text-primary">Añadir Nuevo Estudiante</h2>
          <button onClick={onClose} className="text-dark-text-secondary hover:text-dark-text-primary">
            <Icon path="M6 18L18 6M6 6l12 12" className="w-6 h-6" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Sección de Datos Personales */}
          <div>
            <h3 className="text-lg font-medium text-dark-text-primary mb-4 border-b border-dark-border pb-2">Datos Personales</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input name="firstName" value={formData.firstName} onChange={handleChange} placeholder="Nombres" required className="w-full bg-dark-bg border border-dark-border rounded-lg py-2 px-4 text-dark-text-primary" />
              <input name="lastName" value={formData.lastName} onChange={handleChange} placeholder="Apellidos" required className="w-full bg-dark-bg border border-dark-border rounded-lg py-2 px-4 text-dark-text-primary" />
              <input name="email" type="email" value={formData.email} onChange={handleChange} placeholder="Email" required className="w-full bg-dark-bg border border-dark-border rounded-lg py-2 px-4 text-dark-text-primary" />
              <input name="phone" value={formData.phone} onChange={handleChange} placeholder="Teléfono" required className="w-full bg-dark-bg border border-dark-border rounded-lg py-2 px-4 text-dark-text-primary" />
              <input name="address" value={formData.address} onChange={handleChange} placeholder="Dirección" required className="w-full bg-dark-bg border border-dark-border rounded-lg py-2 px-4 text-dark-text-primary md:col-span-2" />
              <select name="idDocumentType" value={formData.idDocumentType} onChange={handleChange} className="w-full bg-dark-bg border border-dark-border rounded-lg py-2 px-4 text-dark-text-primary">
                {catalogs.documentTypes?.map(type => <option key={type.id} value={type.id}>{type.description}</option>)}
              </select>
              <input name="documentNumber" value={formData.documentNumber} onChange={handleChange} placeholder="Número de Documento" required className="w-full bg-dark-bg border border-dark-border rounded-lg py-2 px-4 text-dark-text-primary" />
            </div>
          </div>

          {/* Sección de Datos Académicos */}
          <div>
            <h3 className="text-lg font-medium text-dark-text-primary mb-4 border-b border-dark-border pb-2">Datos Académicos</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <select name="idAcademicRank" value={formData.idAcademicRank} onChange={handleChange} className="w-full bg-dark-bg border border-dark-border rounded-lg py-2 px-4 text-dark-text-primary">
                    {catalogs.academicRanks?.map(rank => <option key={rank.id} value={rank.id}>{rank.description}</option>)}
                </select>
                <select name="idInstitution" value={formData.idInstitution} onChange={handleChange} className="w-full bg-dark-bg border border-dark-border rounded-lg py-2 px-4 text-dark-text-primary">
                    {catalogs.institutions?.map(inst => <option key={inst.id} value={inst.id}>{inst.name}</option>)}
                </select>
                <select name="idProfession" value={formData.idProfession} onChange={handleChange} className="w-full bg-dark-bg border border-dark-border rounded-lg py-2 px-4 text-dark-text-primary">
                    {catalogs.professions?.map(prof => <option key={prof.id} value={prof.id}>{prof.name}</option>)}
                </select>
            </div>
          </div>
          
          <div className="flex justify-end gap-4 pt-4">
            <button type="button" onClick={onClose} className="px-6 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 font-semibold transition-colors">Cancelar</button>
            <button type="submit" className="px-6 py-2 bg-brand-accent text-white rounded-lg hover:bg-blue-600 font-semibold shadow transition-colors">Guardar Estudiante</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StudentAddModal;