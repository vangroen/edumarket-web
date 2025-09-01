import React, { useState, useEffect } from 'react';
import Icon from '../components/ui/Icon';
import CourseEditModal from '../components/CourseEditModal';
import { fetchData, updateData } from '../services/api';

// Componente para las "píldoras" de tipo de curso. No cambia.
const CourseTypePill = ({ type }) => {
  const isEspecializacion = type.toLowerCase().includes('especialización');
  const pillClasses = `px-3 py-1 text-xs font-semibold rounded-full capitalize ${isEspecializacion ? 'bg-purple-500/20 text-purple-300' : 'bg-blue-500/20 text-blue-300'
    }`;
  return <span className={pillClasses}>{type}</span>;
};

// --- NUEVO COMPONENTE: Píldora para la Modalidad ---
const ModalityPill = ({ modality }) => {
    // Asignamos un color diferente dependiendo de la modalidad
    const isVirtual = modality.toLowerCase().includes('virtual');
    const pillClasses = `px-3 py-1 text-xs font-semibold rounded-full capitalize ${isVirtual ? 'bg-cyan-500/20 text-cyan-300' : 'bg-green-500/20 text-green-300'
      }`;
    return <span className={pillClasses}>{modality}</span>;
  };


const CoursesPage = () => {
  const [courses, setCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [courseTypes, setCourseTypes] = useState([]);
  const [modalities, setModalities] = useState([]);

  const loadData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const [coursesData, typesData, modalitiesData] = await Promise.all([
        fetchData('/courses'),
        fetchData('/course-type'),
        fetchData('/modality')
      ]);
      setCourses(coursesData);
      setCourseTypes(typesData);
      setModalities(modalitiesData);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-PE', {
      style: 'currency',
      currency: 'PEN',
    }).format(amount);
  };

  const handleEditClick = (course) => {
    setEditingCourse(course);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingCourse(null);
  };

  const handleSaveChanges = async (updatedData) => {
    if (!editingCourse) return;
    try {
      await updateData(`/courses/${editingCourse.id}`, updatedData);
      handleCloseModal();
      loadData();
    } catch (err) {
      console.error("Error al guardar el curso:", err);
      setError("No se pudo guardar el curso. Inténtalo de nuevo.");
    }
  };

  return (
    <div>
        {/* ... (El encabezado de la página no cambia) ... */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8">
            <div>
            <h1 className="text-3xl font-bold text-dark-text-primary">Gestión de Cursos</h1>
            <p className="text-dark-text-secondary mt-1">
                Administra la información de los cursos.
            </p>
            </div>
            <div className="flex items-center gap-4 mt-4 md:mt-0">
            <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Icon path="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" className="w-5 h-5 text-dark-text-secondary" />
                </div>
                <input
                type="text"
                placeholder="Buscar curso..."
                className="w-full bg-dark-surface border border-dark-border rounded-lg py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-brand-accent text-dark-text-primary"
                />
            </div>
            <button className="flex items-center justify-center px-4 py-2 bg-brand-accent text-white rounded-lg hover:bg-blue-600 font-semibold shadow transition-colors flex-shrink-0">
                <Icon path="M12 4.5v15m7.5-7.5h-15" className="w-5 h-5 mr-2" />
                Añadir Curso
            </button>
            </div>
      </div>
      <div className="bg-dark-surface rounded-lg shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="border-b border-dark-border">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-dark-text-primary uppercase tracking-wider">Nombre del Curso</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-dark-text-primary uppercase tracking-wider">Tipo</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-dark-text-primary uppercase tracking-wider">Instituciones</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-dark-text-primary uppercase tracking-wider">Costo</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-dark-text-primary uppercase tracking-wider">Modalidad</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-dark-text-primary uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            {!isLoading && !error && (
              <tbody className="divide-y divide-dark-border">
                {courses.map((course) => (
                  <tr key={course.id}>
                    <td className="px-6 py-4 text-sm font-medium text-dark-text-primary align-top">{course.name}</td>
                    <td className="px-6 py-4 text-sm align-top">
                      <CourseTypePill type={course.courseType.description} />
                    </td>
                    <td className="px-6 py-4 text-sm text-dark-text-primary align-top">
                      <div className="flex flex-col gap-y-2">
                        {course.institutions.map(({ institution }) => (
                          <div key={institution.id} className="truncate" title={institution.name}>{institution.name}</div>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-dark-text-secondary align-top whitespace-nowrap">
                      <div className="flex flex-col gap-y-2">
                        {course.institutions.map(({ institution, price }) => (
                          <div key={institution.id}>{formatCurrency(price)}</div>
                        ))}
                      </div>
                    </td>
                    {/* --- CAMBIO AQUÍ: Usamos el nuevo componente ModalityPill --- */}
                    <td className="px-6 py-4 text-sm align-top">
                        <ModalityPill modality={course.modality.description} />
                    </td>
                    <td className="px-6 py-4 text-sm text-dark-text-secondary align-top">
                      <div className="flex items-center space-x-4">
                        <button onClick={() => handleEditClick(course)} className="hover:text-dark-text-primary" title="Editar curso">
                          <Icon path="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931z" className="w-5 h-5" />
                        </button>
                        <button className="hover:text-red-500" title="Eliminar curso">
                          <Icon path="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.134-2.036-2.134H8.718c-1.126 0-2.037.955-2.037 2.134v.916m7.5 0a48.667 48.667 0 00-7.5 0" className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            )}
          </table>
        </div>
        
        {/* ... (Resto del componente sin cambios) ... */}
        {isLoading && <p className="p-4 text-center text-dark-text-secondary">Cargando cursos...</p>}
        {error && <p className="p-4 text-center text-red-400">Error al cargar los datos: {error}</p>}
        {!isLoading && !error && courses.length === 0 && <p className="p-4 text-center text-dark-text-secondary">No se encontraron cursos.</p>}

        <div className="flex justify-between items-center p-4 text-sm text-dark-text-secondary">
          <p>Mostrando {courses.length} de {courses.length} cursos</p>
        </div>
      </div>

      {isModalOpen && (
        <CourseEditModal 
          course={editingCourse}
          onClose={handleCloseModal}
          onSave={handleSaveChanges}
          courseTypes={courseTypes}
          modalities={modalities}
        />
      )}
    </div>
  );
};

export default CoursesPage;