import React, { useState, useEffect } from 'react';
import Icon from '../components/ui/Icon';
import StudentAddModal from '../components/StudentAddModal'; // 1. Importar el nuevo modal
import { fetchData, createData } from '../services/api';

const StatusPill = ({ isActive }) => {
  const pillClasses = `px-3 py-1 text-xs font-semibold rounded-full capitalize ${
    isActive ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-400'
  }`;
  return <span className={pillClasses}>{isActive ? 'Activo' : 'Inactivo'}</span>;
};

const StudentsPage = () => {
  const [students, setStudents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Estados para el modal
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isModalDataLoaded, setIsModalDataLoaded] = useState(false);
  const [isOpeningModal, setIsOpeningModal] = useState(false);

  // Estado para guardar todos los catálogos necesarios para el formulario
  const [catalogs, setCatalogs] = useState({
    documentTypes: [],
    professions: [],
    institutions: [],
    academicRanks: [],
  });

  const loadStudents = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchData('/students');
      setStudents(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message);
      setStudents([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadStudents();
  }, []);

  // Carga los catálogos necesarios para el modal de "Añadir"
  const loadCatalogsForModal = async () => {
    if (isModalDataLoaded) {
      setIsAddModalOpen(true);
      return;
    }
    setIsOpeningModal(true);
    try {
      const [docs, professions, institutions, ranks] = await Promise.all([
        fetchData('/document-type'),
        fetchData('/profession'),
        fetchData('/institution'),
        fetchData('/academic-rank'),
      ]);
      setCatalogs({
        documentTypes: docs,
        professions: professions,
        institutions: institutions,
        academicRanks: ranks,
      });
      setIsModalDataLoaded(true);
      setIsAddModalOpen(true);
    } catch (err) {
      setError("No se pudieron cargar los datos para el formulario.");
    } finally {
      setIsOpeningModal(false);
    }
  };
  
  // --- LÓGICA DE GUARDADO EN DOS PASOS ---
  const handleCreateStudent = async (formData) => {
    try {
      // Paso 1: Crear la Persona
      const personPayload = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        documentNumber: formData.documentNumber,
        idDocumentType: parseInt(formData.idDocumentType, 10),
      };
      const newPerson = await createData('/person', personPayload);

      // Paso 2: Usar el ID de la persona creada para crear el Estudiante
      const studentPayload = {
        idProfession: parseInt(formData.idProfession, 10),
        idInstitution: parseInt(formData.idInstitution, 10),
        idAcademicRank: parseInt(formData.idAcademicRank, 10),
        idPerson: newPerson.id, // Usamos el ID de la respuesta anterior
      };
      await createData('/students', studentPayload);

      // Si todo fue exitoso:
      setIsAddModalOpen(false);
      loadStudents(); // Recargar la tabla de estudiantes

    } catch (err) {
      setError("Ocurrió un error al crear el estudiante. Por favor, inténtalo de nuevo.");
      console.error(err);
    }
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8">
        <div>
          <h1 className="text-3xl font-bold text-dark-text-primary">Gestión de Estudiantes</h1>
          <p className="text-dark-text-secondary mt-1">
            Administra la información de los estudiantes.
          </p>
        </div>
        <div className="flex items-center gap-4 mt-4 md:mt-0">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Icon path="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" className="w-5 h-5 text-dark-text-secondary" />
            </div>
            <input
              type="text"
              placeholder="Buscar estudiante..."
              className="w-full bg-dark-surface border border-dark-border rounded-lg py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-brand-accent text-dark-text-primary"
            />
          </div>
          <button onClick={loadCatalogsForModal} disabled={isOpeningModal} className="flex items-center justify-center px-4 py-2 bg-brand-accent text-white rounded-lg hover:bg-blue-600 font-semibold shadow transition-colors flex-shrink-0 disabled:bg-slate-500 disabled:cursor-wait">
            {isOpeningModal ? (<Icon path="M16.023 9.348h4.992v-.001a10.987 10.987 0 00-2.3-5.842 10.987 10.987 0 00-5.843-2.3v4.992c0 .341.166.658.437.853l3.708 2.966c.27.218.632.245.92.062a.965.965 0 00.505-.921z" className="w-5 h-5 mr-2 animate-spin" />) : (<Icon path="M12 4.5v15m7.5-7.5h-15" className="w-5 h-5 mr-2" />)}
            {isOpeningModal ? 'Cargando...' : 'Añadir Estudiante'}
          </button>
        </div>
      </div>

      <div className="bg-dark-surface rounded-lg shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-slate-800">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-dark-text-primary uppercase tracking-wider">Nombre Completo</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-dark-text-primary uppercase tracking-wider">Email</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-dark-text-primary uppercase tracking-wider">Teléfono</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-dark-text-primary uppercase tracking-wider">Documento</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-dark-text-primary uppercase tracking-wider">Estado</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-dark-text-primary uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-dark-border">
              {!isLoading && !error && students.map((student) => (
                <tr key={student.id} className="hover:bg-slate-700/50 transition-colors duration-150">
                  <td className="px-6 py-4 text-sm font-medium text-dark-text-primary whitespace-nowrap">{`${student.person.firstName} ${student.person.lastName}`}</td>
                  <td className="px-6 py-4 text-sm text-dark-text-secondary whitespace-nowrap">{student.person.email}</td>
                  <td className="px-6 py-4 text-sm text-dark-text-secondary whitespace-nowrap">{student.person.phone}</td>
                  <td className="px-6 py-4 text-sm text-dark-text-secondary whitespace-nowrap">{student.person.documentNumber}</td>
                  <td className="px-6 py-4 text-sm">
                    <StatusPill isActive={student.person.active} />
                  </td>
                  <td className="px-6 py-4 text-sm text-dark-text-secondary">
                    <div className="flex items-center space-x-4">
                      <button className="hover:text-dark-text-primary" title="Editar estudiante">
                        <Icon path="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931z" className="w-5 h-5" />
                      </button>
                      <button className="hover:text-red-500" title="Eliminar estudiante">
                        <Icon path="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.134-2.036-2.134H8.718c-1.126 0-2.037.955-2.037 2.134v.916m7.5 0a48.667 48.667 0 00-7.5 0" className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {isLoading && <p className="p-4 text-center text-dark-text-secondary">Cargando estudiantes...</p>}
          {error && <p className="p-4 text-center text-red-400">{error}</p>}
          {!isLoading && !error && students.length === 0 && <p className="p-4 text-center text-dark-text-secondary">No se encontraron estudiantes.</p>}
        </div>
        <div className="flex justify-between items-center p-4 text-sm text-dark-text-secondary">
          <p>Mostrando {students.length} de {students.length} estudiantes</p>
        </div>
      </div>

      {isAddModalOpen && (
        <StudentAddModal 
            onClose={() => setIsAddModalOpen(false)}
            onSave={handleCreateStudent}
            catalogs={catalogs}
        />
      )}
    </div>
  );
};

export default StudentsPage;