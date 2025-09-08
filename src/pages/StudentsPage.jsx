import React, {useState, useEffect} from 'react';
import Icon from '../components/ui/Icon';
import StudentAddModal from '../components/StudentAddModal';
import StudentDetailsModal from '../components/StudentDetailModal';
import StudentEditModal from '../components/StudentEditModal';
import ConfirmDeleteModal from '../components/ConfirmDeleteModal';
import {fetchData, createData, updateData, deleteData} from '../services/api';

const StudentsPage = () => {
    const [students, setStudents] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // Estados para los modales
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingStudent, setEditingStudent] = useState(null);
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false); // 3. Nuevo estado para el modal de eliminar
    const [deletingStudent, setDeletingStudent] = useState(null); // Guarda el estudiante a eliminar

    // Estados para los datos de los formularios
    const [catalogs, setCatalogs] = useState({
        documentTypes: [],
        professions: [],
        institutions: [],
        academicRanks: [],
    });
    const [isModalDataLoaded, setIsModalDataLoaded] = useState(false);
    const [isOpeningModal, setIsOpeningModal] = useState(false);

    // Carga la lista principal de estudiantes
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

    // Carga los catálogos necesarios para los modales de "Añadir" y "Editar"
    const loadCatalogsAndOpen = async (action) => {
        if (isModalDataLoaded) {
            action();
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
            action(); // Ejecuta la acción (abrir modal de añadir o editar)
        } catch (err) {
            setError("No se pudieron cargar los datos para el formulario.");
        } finally {
            setIsOpeningModal(false);
        }
    };

    // --- MANEJADORES DE ACCIONES CRUD ---

    // AÑADIR
    const handleAddClick = () => {
        loadCatalogsAndOpen(() => setIsAddModalOpen(true));
    };

    const handleCreateStudent = async (formData) => {
        try {
            let personIdToUse = formData.idPerson;

            if (!personIdToUse) {
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
                personIdToUse = newPerson.id;
            }

            const studentPayload = {
                idProfession: parseInt(formData.idProfession, 10),
                idInstitution: parseInt(formData.idInstitution, 10),
                idAcademicRank: parseInt(formData.idAcademicRank, 10),
                idPerson: personIdToUse,
            };
            await createData('/students', studentPayload);

            setIsAddModalOpen(false);
            loadStudents();
        } catch (err) {
            // --- LÓGICA MEJORADA PARA CAPTURAR EL ERROR ---
            if (err.message && err.message.includes('409')) {
                try {
                    const jsonString = err.message.substring(err.message.indexOf('{'));
                    const errorDetails = JSON.parse(jsonString);
                    throw new Error(errorDetails.message || 'Esta persona ya está registrada como estudiante.');
                } catch (parseError) {
                    throw new Error('Esta persona ya está registrada como estudiante.');
                }
            }

            setError("Ocurrió un error al crear el estudiante.");
            console.error(err);
            throw err;
        }
    };

    // EDITAR
    const handleEditClick = (student) => {
        loadCatalogsAndOpen(() => {
            setEditingStudent(student);
            setIsEditModalOpen(true);
        });
    };

    const handleUpdateStudent = async (formData) => {
        if (!editingStudent) return;
        try {
            const personPayload = {
                firstName: formData.firstName,
                lastName: formData.lastName,
                email: formData.email,
                phone: formData.phone,
                address: formData.address,
                documentNumber: formData.documentNumber,
                idDocumentType: parseInt(formData.idDocumentType, 10),
            };
            await updateData(`/person/${editingStudent.person.id}`, personPayload);

            const studentPayload = {
                idProfession: parseInt(formData.idProfession, 10),
                idInstitution: parseInt(formData.idInstitution, 10),
                idAcademicRank: parseInt(formData.idAcademicRank, 10),
                idPerson: editingStudent.person.id,
            };
            await updateData(`/students/${editingStudent.id}`, studentPayload);

            setIsEditModalOpen(false);
            loadStudents();
        } catch (err) {
            setError("Ocurrió un error al actualizar el estudiante.");
            console.error(err);
        }
    };

    // VER DETALLES
    const handleViewDetails = (student) => {
        setSelectedStudent(student);
        setIsDetailsModalOpen(true);
    };

    const handleCloseDetailsModal = () => {
        setIsDetailsModalOpen(false);
        setSelectedStudent(null);
    };

    // --- 4. NUEVOS MANEJADORES PARA LA ELIMINACIÓN ---

    // Abre el modal de confirmación
    const handleDeleteClick = (student) => {
        setDeletingStudent(student);
        setIsDeleteModalOpen(true);
    };

    // Cierra el modal de confirmación
    const handleCloseDeleteModal = () => {
        setIsDeleteModalOpen(false);
        setDeletingStudent(null);
    };

    // Ejecuta la eliminación en dos pasos si el usuario confirma
    const handleConfirmDelete = async () => {
        if (!deletingStudent) return;
        try {
            setError(null);
            // Paso 1: Eliminar el estudiante
            await deleteData(`/students/${deletingStudent.id}`);

            // Paso 2: Eliminar la persona asociada
            await deleteData(`/person/${deletingStudent.person.id}`);

            // Si todo fue exitoso:
            handleCloseDeleteModal(); // Cierra el modal
            loadStudents(); // Recarga la lista de estudiantes

        } catch (err) {
            setError("No se pudo eliminar el estudiante. Inténtalo de nuevo.");
            console.error(err);
        }
    };

    return (
        <div>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-dark-text-primary">Gestión de Estudiantes</h1>
                    <p className="text-dark-text-secondary mt-1">Administra la información de los estudiantes.</p>
                </div>
                <div className="flex items-center gap-4 mt-4 md:mt-0">
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                            <Icon path="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
                                  className="w-5 h-5 text-dark-text-secondary"/>
                        </div>
                        <input type="text" placeholder="Buscar estudiante..."
                               className="w-full bg-dark-surface border border-dark-border rounded-lg py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-brand-accent text-dark-text-primary"/>
                    </div>
                    <button onClick={handleAddClick} disabled={isOpeningModal}
                            className="flex items-center justify-center px-4 py-2 bg-brand-accent text-white rounded-lg hover:bg-blue-600 font-semibold shadow transition-colors flex-shrink-0 disabled:bg-slate-500 disabled:cursor-wait">
                        {isOpeningModal ? (<Icon
                            path="M16.023 9.348h4.992v-.001a10.987 10.987 0 00-2.3-5.842 10.987 10.987 0 00-5.843-2.3v4.992c0 .341.166.658.437.853l3.708 2.966c.27.218.632.245.92.062a.965.965 0 00.505-.921z"
                            className="w-5 h-5 mr-2 animate-spin"/>) : (
                            <Icon path="M12 4.5v15m7.5-7.5h-15" className="w-5 h-5 mr-2"/>)}
                        {isOpeningModal ? 'Cargando...' : 'Añadir Estudiante'}
                    </button>
                </div>
            </div>

            <div className="bg-dark-surface rounded-lg shadow-lg overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full">
                        <thead className="bg-slate-800">
                        <tr>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-dark-text-primary uppercase tracking-wider">Nombre
                                Completo
                            </th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-dark-text-primary uppercase tracking-wider">Email</th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-dark-text-primary uppercase tracking-wider">Teléfono</th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-dark-text-primary uppercase tracking-wider">Documento</th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-dark-text-primary uppercase tracking-wider">Acciones</th>
                        </tr>
                        </thead>
                        <tbody className="divide-y divide-dark-border">
                        {!isLoading && !error && students.map((student) => (
                            <tr key={student.id} className="hover:bg-slate-700/50 transition-colors duration-150">
                                <td className="px-6 py-4 text-sm font-medium text-dark-text-primary whitespace-nowrap">{`${student.person.firstName} ${student.person.lastName}`}</td>
                                <td className="px-6 py-4 text-sm text-dark-text-secondary whitespace-nowrap">{student.person.email}</td>
                                <td className="px-6 py-4 text-sm text-dark-text-secondary whitespace-nowrap">{student.person.phone}</td>
                                <td className="px-6 py-4 text-sm text-dark-text-secondary whitespace-nowrap">
                                    {`${student.person.documentType.description}: ${student.person.documentNumber}`}
                                </td>
                                <td className="px-6 py-4 text-sm text-dark-text-secondary">
                                    <div className="flex items-center space-x-4">
                                        <button onClick={() => handleViewDetails(student)}
                                                className="hover:text-dark-text-primary" title="Ver detalles">
                                            <Icon
                                                path="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178zM15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                                className="w-5 h-5"/>
                                        </button>
                                        <button onClick={() => handleEditClick(student)}
                                                className="hover:text-dark-text-primary" title="Editar estudiante">
                                            <Icon
                                                path="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931z"
                                                className="w-5 h-5"/>
                                        </button>
                                        {/* 5. Conectar el botón de eliminar con su manejador */}
                                        <button onClick={() => handleDeleteClick(student)}
                                                className="hover:text-red-500" title="Eliminar estudiante">
                                            <Icon
                                                path="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.134-2.036-2.134H8.718c-1.126 0-2.037.955-2.037 2.134v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                                                className="w-5 h-5"/>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                    {isLoading && <p className="p-4 text-center text-dark-text-secondary">Cargando estudiantes...</p>}
                    {error && <p className="p-4 text-center text-red-400">{error}</p>}
                    {!isLoading && !error && students.length === 0 &&
                        <p className="p-4 text-center text-dark-text-secondary">No se encontraron estudiantes.</p>}
                </div>
                <div className="flex justify-between items-center p-4 text-sm text-dark-text-secondary">
                    <p>Mostrando {students.length} de {students.length} estudiantes</p>
                </div>
            </div>

            {isDetailsModalOpen && (
                <StudentDetailsModal student={selectedStudent} onClose={() => setIsDetailsModalOpen(false)}/>
            )}
            {isAddModalOpen && (
                <StudentAddModal onClose={() => setIsAddModalOpen(false)} onSave={handleCreateStudent}
                                 catalogs={catalogs}/>
            )}
            {isEditModalOpen && (
                <StudentEditModal student={editingStudent} onClose={() => setIsEditModalOpen(false)}
                                  onSave={handleUpdateStudent} catalogs={catalogs}/>
            )}
            {/* 6. Renderizado condicional del nuevo modal de confirmación */}
            {isDeleteModalOpen && (
                <ConfirmDeleteModal
                    itemType="al estudiante"
                    itemName={deletingStudent ? `${deletingStudent.person.firstName} ${deletingStudent.person.lastName}` : ''}
                    onClose={handleCloseDeleteModal}
                    onConfirm={handleConfirmDelete}
                />
            )}
        </div>
    );
};

export default StudentsPage;