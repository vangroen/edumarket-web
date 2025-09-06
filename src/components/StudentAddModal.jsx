import React, { useState, useMemo, useRef, useEffect } from 'react';
import Icon from '../components/ui/Icon';

// Hook personalizado para detectar clics fuera y cerrar el dropdown
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

const StudentAddModal = ({ onClose, onSave, catalogs }) => {
  const [formData, setFormData] = useState({
    firstName: '', lastName: '', email: '', phone: '', address: '', documentNumber: '',
    idDocumentType: '', idProfession: '', idInstitution: '', idAcademicRank: '',
  });

  const [institutionSearch, setInstitutionSearch] = useState('');
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
  }, [isSearchActive, institutionSearch]);

  const selectedInstitutionName = useMemo(() => {
    if (!formData.idInstitution) return '';
    const found = catalogs.institutions?.find(i => i.id === formData.idInstitution);
    return found ? found.name : '';
  }, [formData.idInstitution, catalogs.institutions]);

  const searchResults = useMemo(() => {
    if (!institutionSearch) return [];
    if (institutionSearch === selectedInstitutionName) return [];
    return catalogs.institutions?.filter(inst =>
      inst.name.toLowerCase().includes(institutionSearch.toLowerCase())
    );
  }, [institutionSearch, catalogs.institutions, selectedInstitutionName]);

  const handleSelectInstitution = (institution) => {
    setFormData(prev => ({ ...prev, idInstitution: institution.id }));
    setInstitutionSearch(institution.name);
    setIsSearchActive(false);
  };
  
  const handleSearchChange = (e) => {
    setInstitutionSearch(e.target.value);
    if (formData.idInstitution) {
      setFormData(prev => ({...prev, idInstitution: ''}));
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50">
        <div className="bg-dark-surface rounded-lg shadow-2xl w-full max-w-2xl p-8 m-4">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-dark-text-primary">Añadir Nuevo Estudiante</h2>
            <button type="button" onClick={onClose} className="text-dark-text-secondary hover:text-dark-text-primary">
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
                <select name="idDocumentType" value={formData.idDocumentType} onChange={handleChange} required className="w-full bg-dark-bg border border-dark-border rounded-lg py-2 px-4 text-dark-text-primary">
                  <option value="" disabled>Seleccione tipo de documento</option>
                  {catalogs.documentTypes?.map(type => <option key={type.id} value={type.id}>{type.description}</option>)}
                </select>
                <input name="documentNumber" value={formData.documentNumber} onChange={handleChange} placeholder="Número de Documento" required className="w-full bg-dark-bg border border-dark-border rounded-lg py-2 px-4 text-dark-text-primary" />
              </div>
            </div>

            {/* Sección de Datos Académicos */}
            <div>
              <h3 className="text-lg font-medium text-dark-text-primary mb-4 border-b border-dark-border pb-2">Datos Académicos</h3>
              <div className="flex flex-col gap-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <select name="idAcademicRank" value={formData.idAcademicRank} onChange={handleChange} required className="w-full bg-dark-bg border border-dark-border rounded-lg py-2 px-4 text-dark-text-primary">
                    <option value="" disabled>Seleccione rango académico</option>
                    {catalogs.academicRanks?.map(rank => <option key={rank.id} value={rank.id}>{rank.description}</option>)}
                  </select>
                  <select name="idProfession" value={formData.idProfession} onChange={handleChange} required className="w-full bg-dark-bg border border-dark-border rounded-lg py-2 px-4 text-dark-text-primary">
                    <option value="" disabled>Seleccione profesión</option>
                    {catalogs.professions?.map(prof => <option key={prof.id} value={prof.id}>{prof.name}</option>)}
                  </select>
                </div>
                <div className="relative">
                  {/* --- CAMBIO: El icono ahora es condicional --- */}
                  {!formData.idInstitution && (
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <Icon path="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" className="w-5 h-5 text-dark-text-secondary" />
                    </div>
                  )}
                  <input
                    ref={searchInputRef}
                    type="text"
                    value={formData.idInstitution ? selectedInstitutionName : institutionSearch}
                    onChange={handleSearchChange}
                    onFocus={() => setIsSearchActive(true)}
                    placeholder="Buscar y seleccionar institución..."
                    // --- CAMBIO: El padding ahora es dinámico ---
                    className={`w-full bg-dark-bg border border-dark-border rounded-lg py-2 text-dark-text-primary ${
                      formData.idInstitution ? 'pl-4 pr-10' : 'pl-10 pr-4'
                    }`}
                    required={!formData.idInstitution}
                  />
                  {formData.idInstitution && (
                    <button type="button" onClick={() => { setFormData(prev => ({...prev, idInstitution: ''})); setInstitutionSearch(''); }} className="absolute inset-y-0 right-0 flex items-center pr-3">
                      <Icon path="M6 18L18 6M6 6l12 12" className="w-5 h-5 text-dark-text-secondary" />
                    </button>
                  )}
                </div>
              </div>
            </div>
            
            <div className="flex justify-end gap-4 pt-4">
              <button type="button" onClick={onClose} className="px-6 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 font-semibold transition-colors">Cancelar</button>
              <button type="submit" className="px-6 py-2 bg-brand-accent text-white rounded-lg hover:bg-blue-600 font-semibold shadow transition-colors">Guardar Estudiante</button>
            </div>
          </form>
        </div>
      </div>

      {isSearchActive && searchResults.length > 0 && (
        <ul ref={dropdownRef} className="absolute z-[60] bg-slate-800 border border-dark-border rounded-lg shadow-lg max-h-56 overflow-y-auto" style={{ ...dropdownPosition }}>
          {searchResults.map(institution => (
            <li key={institution.id} onMouseDown={() => handleSelectInstitution(institution)} className="px-4 py-2 hover:bg-slate-700 cursor-pointer text-dark-text-primary">{institution.name}</li>
          ))}
        </ul>
      )}

      {isSearchActive && institutionSearch && searchResults.length === 0 && (
        <ul ref={dropdownRef} className="absolute z-[60] bg-slate-800 border border-dark-border rounded-lg shadow-lg" style={{ ...dropdownPosition }}>
            <li className="px-4 py-2 text-dark-text-secondary">No se encontraron resultados.</li>
        </ul>
      )}
    </>
  );
};

export default StudentAddModal;