import React, { useState, useEffect } from 'react';
import Icon from '../components/ui/Icon';
import CourseEditModal from '../components/CourseEditModal';
import CourseAddModal from '../components/CourseAddModal';
import ConfirmDeleteModal from '../components/ConfirmDeleteModal';
import { fetchData, updateData, createData, deleteData } from '../services/api';

// --- (Componentes de Píldoras no cambian) ---
const CourseTypePill = ({ type }) => {
    const isEspecializacion = type.toLowerCase().includes('especialización');
    const pillClasses = `px-3 py-1 text-xs font-semibold rounded-full capitalize ${isEspecializacion ? 'bg-purple-500/20 text-purple-300' : 'bg-blue-500/20 text-blue-300'}`;
    return <span className={pillClasses}>{type}</span>;
};
const ModalityPill = ({ modality }) => {
    const isVirtual = modality.toLowerCase().includes('virtual');
    const pillClasses = `px-3 py-1 text-xs font-semibold rounded-full capitalize ${isVirtual ? 'bg-cyan-500/20 text-cyan-300' : 'bg-green-500/20 text-green-300'}`;
    return <span className={pillClasses}>{modality}</span>;
};

// --- NUEVO: Componente para la fila "esqueleto" de Cursos ---
const CourseSkeletonRow = () => (
    <tr className="animate-pulse">
        <td className="px-6 py-4"><div className="h-4 bg-slate-700 rounded w-5/6"></div></td>
        <td className="px-6 py-4"><div className="h-4 bg-slate-700 rounded w-2/3"></div></td>
        <td className="px-6 py-4"><div className="h-4 bg-slate-700 rounded w-20"></div></td>
        <td className="px-6 py-4"><div className="h-4 bg-slate-700 rounded w-24"></div></td>
        <td className="px-6 py-4"><div className="h-6 bg-slate-700 rounded-full w-24"></div></td>
        <td className="px-6 py-4"><div className="h-6 bg-slate-700 rounded-full w-28"></div></td>
        <td className="px-6 py-4">
            <div className="flex items-center space-x-4">
                <div className="h-5 w-5 bg-slate-700 rounded"></div>
                <div className="h-5 w-5 bg-slate-700 rounded"></div>
            </div>
        </td>
    </tr>
);

const CoursesPage = () => {
    // ... (estados no cambian)
    const [courses, setCourses] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    // ... (el resto de los estados)
    const [error, setError] = useState(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingCourse, setEditingCourse] = useState(null);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [deletingCourse, setDeletingCourse] = useState(null);
    const [courseTypes, setCourseTypes] = useState([]);
    const [modalities, setModalities] = useState([]);
    const [allInstitutions, setAllInstitutions] = useState([]);
    const [isModalDataLoaded, setIsModalDataLoaded] = useState(false);
    const [isOpeningModal, setIsOpeningModal] = useState(false);

    const loadCourses = async () => {
        setIsLoading(true);
        setError(null);
        try {
            // Simulación de carga
            await new Promise(resolve => setTimeout(resolve, 1500));
            const coursesData = await fetchData('/courses');
            setCourses(coursesData);
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadCourses();
    }, []);

    // ... (el resto de las funciones no cambian)
    const loadModalDataAndOpen = async (openAction) => {
        if (isModalDataLoaded) {
            openAction();
            return;
        }
        setIsOpeningModal(true);
        setError(null);
        try {
            const [typesData, modalitiesData, institutionsData] = await Promise.all([
                fetchData('/course-type'),
                fetchData('/modality'),
                fetchData('/institution')
            ]);
            setCourseTypes(typesData);
            setModalities(modalitiesData);
            setAllInstitutions(institutionsData);
            setIsModalDataLoaded(true);
            openAction();
        } catch (err) {
            setError("Error al cargar datos para el formulario.");
        } finally {
            setIsOpeningModal(false);
        }
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('es-PE', { style: 'currency', currency: 'PEN' }).format(amount);
    };

    const handleEditClick = (course) => {
        loadModalDataAndOpen(() => {
            setEditingCourse(course);
            setIsEditModalOpen(true);
        });
    };

    const handleSaveChanges = async (updatedData) => {
        if (!editingCourse) return;
        try {
            await updateData(`/courses/${editingCourse.id}`, updatedData);
            setIsEditModalOpen(false);
            setEditingCourse(null);
            loadCourses();
        } catch (err) {
            setError("No se pudo actualizar el curso. Revisa la consola para más detalles.");
        }
    };

    const handleAddClick = () => {
        loadModalDataAndOpen(() => {
            setIsAddModalOpen(true);
        });
    };

    const handleCreateCourse = async (newCourseData) => {
        try {
            await createData('/courses', newCourseData);
            setIsAddModalOpen(false);
            loadCourses();
        } catch (err) {
            setError("No se pudo crear el curso.");
        }
    };

    const handleDeleteClick = (course) => {
        setDeletingCourse(course);
        setIsDeleteModalOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (!deletingCourse) return;
        try {
            setError(null);
            await deleteData(`/courses/${deletingCourse.id}`);
            setIsDeleteModalOpen(false);
            setDeletingCourse(null);
            loadCourses();
        } catch (err) {
            setError("No se pudo eliminar el curso. Inténtalo de nuevo.");
        }
    };

    return (
        <div>
            {/* ... (Cabecera de la página no cambia) ... */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-dark-text-primary">Gestión de Cursos</h1>
                    <p className="text-dark-text-secondary mt-1">Administra la información de los cursos.</p>
                </div>
                <div className="flex items-center gap-4 mt-4 md:mt-0">
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                            <Icon path="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" className="w-5 h-5 text-dark-text-secondary" />
                        </div>
                        <input type="text" placeholder="Buscar curso..." className="w-full bg-dark-surface border border-dark-border rounded-lg py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-brand-accent text-dark-text-primary" />
                    </div>
                    <button onClick={handleAddClick} disabled={isOpeningModal} className="flex items-center justify-center px-4 py-2 bg-brand-accent text-white rounded-lg hover:bg-blue-600 font-semibold shadow transition-colors flex-shrink-0 disabled:bg-slate-500 disabled:cursor-wait">
                        {isOpeningModal ? (<Icon path="M16.023 9.348h4.992v-.001a10.987 10.987 0 00-2.3-5.842 10.987 10.987 0 00-5.843-2.3v4.992c0 .341.166.658.437.853l3.708 2.966c.27.218.632.245.92.062a.965.965 0 00.505-.921z" className="w-5 h-5 mr-2 animate-spin" />) : (<Icon path="M12 4.5v15m7.5-7.5h-15" className="w-5 h-5 mr-2" />)}
                        {isOpeningModal ? 'Cargando...' : 'Añadir Curso'}
                    </button>
                </div>
            </div>

            <div className="bg-dark-surface rounded-lg shadow-lg overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full">
                        <thead className="border-b border-dark-border">
                        <tr>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-dark-text-primary uppercase tracking-wider">Nombre del Curso</th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-dark-text-primary uppercase tracking-wider">Instituciones</th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-dark-text-primary uppercase tracking-wider">Duración</th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-dark-text-primary uppercase tracking-wider">Costo</th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-dark-text-primary uppercase tracking-wider">Modalidad</th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-dark-text-primary uppercase tracking-wider">Tipo</th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-dark-text-primary uppercase tracking-wider">Acciones</th>
                        </tr>
                        </thead>
                        <tbody className="divide-y divide-dark-border">
                        {isLoading ? (
                            [...Array(5)].map((_, index) => <CourseSkeletonRow key={index} />)
                        ) : (
                            !error && courses.map((course) => (
                                <tr key={course.id} className="hover:bg-slate-700/50 transition-colors duration-150">
                                    <td className="px-6 py-4 text-sm font-medium text-dark-text-primary align-top">{course.name}</td>
                                    <td className="px-6 py-4 text-sm text-dark-text-primary align-top">
                                        <div className="flex flex-col gap-y-2">
                                            {course.institutions.map(({ institution }) => (
                                                <div key={institution.id} className="truncate" title={institution.name}>{institution.name}</div>
                                            ))}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-dark-text-secondary align-top whitespace-nowrap">
                                        <div className="flex flex-col gap-y-2">
                                            {course.institutions.map(({ institution, durationInMonths }) => (
                                                <div key={institution.id}>{durationInMonths} meses</div>
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
                                    <td className="px-6 py-4 text-sm align-top">
                                        <ModalityPill modality={course.modality.description} />
                                    </td>
                                    <td className="px-6 py-4 text-sm align-top">
                                        <CourseTypePill type={course.courseType.description} />
                                    </td>
                                    <td className="px-6 py-4 text-sm text-dark-text-secondary align-top">
                                        <div className="flex items-center space-x-4">
                                            <button onClick={() => handleEditClick(course)} disabled={isOpeningModal} className="hover:text-dark-text-primary disabled:text-slate-600 disabled:cursor-wait" title="Editar curso">
                                                <Icon path="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931z" className="w-5 h-5" />
                                            </button>
                                            <button onClick={() => handleDeleteClick(course)} className="hover:text-red-500" title="Eliminar curso">
                                                <Icon path="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.134-2.036-2.134H8.718c-1.126 0-2.037.955-2.037 2.134v.916m7.5 0a48.667 48.667 0 00-7.5 0" className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                        </tbody>
                    </table>
                </div>
                {error && <p className="p-4 text-center text-red-400">{error}</p>}
                {!isLoading && !error && courses.length === 0 && <p className="p-4 text-center text-dark-text-secondary">No se encontraron cursos.</p>}
                <div className="flex justify-between items-center p-4 text-sm text-dark-text-secondary">
                    <p>Mostrando {courses.length} de {courses.length} cursos</p>
                </div>
            </div>

            {/* ... (resto de los modales no cambian) ... */}
            {isEditModalOpen && (
                <CourseEditModal
                    course={editingCourse}
                    onClose={() => setIsEditModalOpen(false)}
                    onSave={handleSaveChanges}
                    courseTypes={courseTypes}
                    modalities={modalities}
                    allInstitutions={allInstitutions}
                />
            )}
            {isAddModalOpen && (
                <CourseAddModal
                    onClose={() => setIsAddModalOpen(false)}
                    onSave={handleCreateCourse}
                    courseTypes={courseTypes}
                    modalities={modalities}
                    allInstitutions={allInstitutions}
                />
            )}
            {isDeleteModalOpen && (
                <ConfirmDeleteModal
                    itemType="el curso"
                    itemName={deletingCourse?.name}
                    onClose={() => setIsDeleteModalOpen(false)}
                    onConfirm={handleConfirmDelete}
                />
            )}
        </div>
    );
};

export default CoursesPage;