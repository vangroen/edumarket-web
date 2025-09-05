import React, { useState, useEffect, useMemo, useRef } from 'react';
import Icon from './ui/Icon';

const useClickOutside = (ref, handler) => {
  useEffect(() => {
    const listener = (event) => {
      if (!ref.current || ref.current.contains(event.target)) return;
      handler(event);
    };
    document.addEventListener('mousedown', listener);
    document.addEventListener('touchstart', listener);
    return () => {
      document.removeEventListener('mousedown', listener);
      document.removeEventListener('touchstart', listener);
    };
  }, [ref, handler]);
};

const SelectedInstitutionRow = ({ institution, data, onRemove, onDataChange }) => {
    const typeTagClass = institution.institutionType.description.toLowerCase() === 'universidad'
        ? 'bg-gray-500 text-white'
        : 'bg-indigo-500 text-white';

    return (
        <div className="bg-dark-bg/50 p-3 rounded-lg grid grid-cols-[auto,1fr,auto,auto,auto] items-center gap-x-4">
            <input
                type="checkbox"
                checked={true}
                onChange={() => onRemove(institution.id)}
                className="h-5 w-5 rounded bg-blue-500 border-blue-500 text-white focus:ring-blue-600"
            />
            <div className="flex items-center gap-2 overflow-hidden">
                <span className="font-medium text-dark-text-primary truncate" title={institution.name}>
                    {institution.name}
                </span>
                <span className={`px-2 py-0.5 text-xs font-semibold rounded-full flex-shrink-0 ${typeTagClass}`}>
                    {institution.institutionType.description}
                </span>
            </div>
            <input
                type="text"
                value={data.price}
                onChange={(e) => onDataChange(institution.id, 'price', e.target.value)}
                placeholder="Precio (S/.)"
                className="w-28 bg-dark-bg border border-dark-border rounded-lg py-1 px-3 text-right text-dark-text-primary"
                required
            />
            <input
                type="text"
                value={data.durationInMonths}
                onChange={(e) => onDataChange(institution.id, 'durationInMonths', e.target.value)}
                placeholder="Duración"
                className="w-28 bg-dark-bg border border-dark-border rounded-lg py-1 px-3 text-right text-dark-text-primary"
                required
            />
             <span className="text-dark-text-secondary text-sm">meses</span>
        </div>
    );
};


const CourseEditModal = ({ course, onClose, onSave, courseTypes, modalities, allInstitutions }) => {
  const [formData, setFormData] = useState({ name: '', idCourseType: '', idModality: '', institutions: [] });
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearchActive, setIsSearchActive] = useState(false);
  const searchInputRef = useRef(null);
  const dropdownRef = useRef(null);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0, width: 0 });

  useClickOutside(dropdownRef, () => {
    if (document.activeElement !== searchInputRef.current) setIsSearchActive(false);
  });

  useEffect(() => {
    if (isSearchActive && searchInputRef.current) {
      const rect = searchInputRef.current.getBoundingClientRect();
      setDropdownPosition({ top: rect.bottom + 4, left: rect.left, width: rect.width });
    }
  }, [isSearchActive, searchTerm]);

  useEffect(() => {
    if (course) {
      setFormData({
        name: course.name || '',
        idCourseType: course.courseType?.id || '',
        idModality: course.modality?.id || '',
        institutions: course.institutions?.map(inst => ({ institution: { id: inst.institution.id }, price: inst.price.toString(), durationInMonths: inst.durationInMonths.toString() })) || [],
      });
    }
  }, [course]);

  const selectedInstitutionsData = useMemo(() => {
    const selectedIds = new Map(formData.institutions.map(inst => [inst.institution.id, inst]));
    return allInstitutions.filter(inst => selectedIds.has(inst.id)).map(inst => ({ ...inst, ...selectedIds.get(inst.id) }));
  }, [formData.institutions, allInstitutions]);

  const searchResults = useMemo(() => {
    if (!searchTerm) return [];
    const selectedIds = new Set(formData.institutions.map(inst => inst.institution.id));
    return allInstitutions.filter(inst => !selectedIds.has(inst.id) && inst.name.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [searchTerm, allInstitutions, formData.institutions]);

  const handleSelectInstitution = (institution) => {
    setFormData(prev => ({ ...prev, institutions: [...prev.institutions, { institution: { id: institution.id }, price: '', durationInMonths: '' }] }));
    setSearchTerm('');
    setIsSearchActive(false);
  };

  const handleRemoveInstitution = (institutionId) => {
    setFormData(prev => ({ ...prev, institutions: prev.institutions.filter(inst => inst.institution.id !== institutionId) }));
  };

  const handleInstitutionDataChange = (institutionId, field, value) => {
    if (field === 'price' && !/^[0-9]*\.?[0-9]*$/.test(value)) return;
    if (field === 'durationInMonths' && !/^[0-9]*$/.test(value)) return;
    setFormData(prev => ({ ...prev, institutions: prev.institutions.map(inst => inst.institution.id === institutionId ? { ...inst, [field]: value } : inst) }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.institutions.length === 0) {
      alert("Un curso debe tener al menos una institución asociada.");
      return;
    }
    const submissionData = { ...formData, idCourseType: parseInt(formData.idCourseType, 10), idModality: parseInt(formData.idModality, 10), institutions: formData.institutions.map(inst => ({...inst, price: parseFloat(inst.price) || 0, durationInMonths: parseInt(inst.durationInMonths, 10) || 0 }))};
    onSave(submissionData);
  };

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 p-4">
        <form onSubmit={handleSubmit} className="bg-dark-surface rounded-lg shadow-2xl w-full max-w-3xl flex flex-col max-h-full">
          <div className="flex justify-between items-center p-8 pb-6 flex-shrink-0 border-b border-dark-border">
            <h2 className="text-2xl font-bold text-dark-text-primary">Editar Curso</h2>
            <button type="button" onClick={onClose} className="text-dark-text-secondary hover:text-dark-text-primary"><Icon path="M6 18L18 6M6 6l12 12" className="w-6 h-6" /></button>
          </div>

          <div className="overflow-y-auto p-8 space-y-6">
            <fieldset>
                <legend className="text-lg font-semibold text-dark-text-primary mb-3">Información del Curso</legend>
                <div className="space-y-4">
                    <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Nombre del Curso" className="w-full bg-dark-bg border border-dark-border rounded-lg py-2 px-4 text-dark-text-primary" required />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <select name="idCourseType" value={formData.idCourseType} onChange={handleChange} className="w-full bg-dark-bg border border-dark-border rounded-lg py-2 px-4 text-dark-text-primary" required>
                            <option value="" disabled>Seleccione tipo de curso</option>
                            {courseTypes.map(type => <option key={type.id} value={type.id}>{type.description}</option>)}
                        </select>
                        <select name="idModality" value={formData.idModality} onChange={handleChange} className="w-full bg-dark-bg border border-dark-border rounded-lg py-2 px-4 text-dark-text-primary" required>
                            <option value="" disabled>Seleccione modalidad</option>
                            {modalities.map(modality => <option key={modality.id} value={modality.id}>{modality.description}</option>)}
                        </select>
                    </div>
                </div>
            </fieldset>

            <fieldset>
                <legend className="text-lg font-semibold text-dark-text-primary mb-2">Instituciones</legend>
                <p className="text-sm text-dark-text-secondary mb-4">Busca y añade o elimina las instituciones que imparten este curso.</p>

                <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none"><Icon path="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" className="w-5 h-5 text-dark-text-secondary" /></div>
                    <input ref={searchInputRef} type="text" placeholder="Buscar institución para añadir..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} onFocus={() => setIsSearchActive(true)} className="w-full bg-dark-bg border border-dark-border rounded-lg py-2 pl-10 pr-4 text-dark-text-primary"/>
                </div>

                <div className="space-y-2 mt-4">
                    {selectedInstitutionsData.map(inst => (
                         <SelectedInstitutionRow 
                            key={inst.id}
                            institution={inst}
                            data={inst}
                            onRemove={handleRemoveInstitution}
                            onDataChange={handleInstitutionDataChange}
                       />
                    ))}
                </div>
            </fieldset>
          </div>
          
          <div className="flex-shrink-0 flex justify-end gap-4 p-8 pt-6">
            <button type="button" onClick={onClose} className="px-6 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 font-semibold transition-colors">Cancelar</button>
            <button type="submit" className="px-6 py-2 bg-brand-accent text-white rounded-lg hover:bg-blue-600 font-semibold shadow transition-colors">Guardar Cambios</button>
          </div>
        </form>
      </div>
      
      {isSearchActive && searchTerm && (
        <ul ref={dropdownRef} className="absolute z-[60] bg-slate-800 border border-dark-border rounded-lg shadow-lg max-h-56 overflow-y-auto" style={{ ...dropdownPosition }}>
           {searchResults.length > 0 ? (
            searchResults.map(institution => (
                <li key={institution.id} onMouseDown={() => handleSelectInstitution(institution)} className="px-4 py-2 hover:bg-slate-700 cursor-pointer text-dark-text-primary">{institution.name}</li>
            ))
           ) : (
            <li className="px-4 py-2 text-dark-text-secondary">No se encontraron resultados.</li>
           )}
        </ul>
      )}
    </>
  );
};

export default CourseEditModal;