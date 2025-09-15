import React, { useState, useEffect } from 'react';
import Icon from '../components/ui/Icon';
import EnrollmentDetailsModal from '../components/EnrollmentDetailsModal';
import EnrollmentAddModal from '../components/EnrollmentAddModal';
import { fetchData, createData } from '../services/api';

// --- NUEVO: Componente para la fila "esqueleto" de Matrículas ---
const EnrollmentSkeletonRow = () => (
    <tr className="animate-pulse">
        <td className="px-6 py-4"><div className="h-4 bg-slate-700 rounded w-3/4"></div></td>
        <td className="px-6 py-4"><div className="h-4 bg-slate-700 rounded w-5/6"></div></td>
        <td className="px-6 py-4"><div className="h-4 bg-slate-700 rounded w-2/3"></div></td>
        <td className="px-6 py-4"><div className="h-4 bg-slate-700 rounded w-24"></div></td>
        <td className="px-6 py-4"><div className="h-4 bg-slate-700 rounded w-28"></div></td>
        <td className="px-6 py-4">
            <div className="flex items-center space-x-4">
                <div className="h-5 w-5 bg-slate-700 rounded"></div>
            </div>
        </td>
    </tr>
);

const EnrollmentsPage = () => {
    const [enrollments, setEnrollments] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
    const [selectedEnrollment, setSelectedEnrollment] = useState(null);

    // Estados para el modal de añadir
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [catalogs, setCatalogs] = useState({ students: [], agents: [], courses: [] });
    const [isModalDataLoaded, setIsModalDataLoaded] = useState(false);
    const [isOpeningModal, setIsOpeningModal] = useState(false);


    const loadEnrollments = async () => {
        setIsLoading(true);
        setError(null);
        try {
            // Simulación de carga
            await new Promise(resolve => setTimeout(resolve, 1500));
            const data = await fetchData('/enrollment');
            setEnrollments(Array.isArray(data) ? data : []);
        } catch (err) {
            setError(err.message);
            setEnrollments([]);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadEnrollments();
    }, []);

    // ... (el resto de las funciones no cambian)
    const loadCatalogsAndOpen = async (action) => {
        if (isModalDataLoaded) {
            action();
            return;
        }
        setIsOpeningModal(true);
        try {
            const [studentsData, agentsData, coursesData] = await Promise.all([
                fetchData('/students'),
                fetchData('/agents'),
                fetchData('/courses')
            ]);
            setCatalogs({
                students: studentsData,
                agents: agentsData,
                courses: coursesData,
            });
            setIsModalDataLoaded(true);
            action();
        } catch (err) {
            setError("No se pudieron cargar los datos para el formulario.");
        } finally {
            setIsOpeningModal(false);
        }
    };

    const handleAddClick = () => {
        loadCatalogsAndOpen(() => setIsAddModalOpen(true));
    };

    const handleCreateEnrollment = async (payload) => {
        try {
            await createData('/enrollment', payload);
            setIsAddModalOpen(false);
            loadEnrollments();
        } catch (err) {
            console.error(err);
            throw err;
        }
    };

    const handleViewDetails = (enrollment) => {
        setSelectedEnrollment(enrollment);
        setIsDetailsModalOpen(true);
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('es-PE', { style: 'currency', currency: 'PEN' }).format(amount);
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('es-PE', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
        }).format(date);
    };

    return (
        <div>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-dark-text-primary">Gestión de Matrículas</h1>
                    <p className="text-dark-text-secondary mt-1">Consulta y registra la información de las matrículas.</p>
                </div>
                <div className="flex items-center gap-4 mt-4 md:mt-0">
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                            <Icon path="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" className="w-5 h-5 text-dark-text-secondary"/>
                        </div>
                        <input type="text" placeholder="Buscar matrícula..." className="w-full bg-dark-surface border border-dark-border rounded-lg py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-brand-accent text-dark-text-primary"/>
                    </div>
                    <button onClick={handleAddClick} disabled={isOpeningModal} className="flex items-center justify-center px-4 py-2 bg-brand-accent text-white rounded-lg hover:bg-blue-600 font-semibold shadow transition-colors flex-shrink-0 disabled:bg-slate-500 disabled:cursor-wait">
                        {isOpeningModal ? (
                            <Icon path="M16.023 9.348h4.992v-.001a10.987 10.987 0 00-2.3-5.842 10.987 10.987 0 00-5.843-2.3v4.992c0 .341.166.658.437.853l3.708 2.966c.27.218.632.245.92.062a.965.965 0 00.505-.921z" className="w-5 h-5 mr-2 animate-spin"/>
                        ) : (
                            <Icon path="M12 4.5v15m7.5-7.5h-15" className="w-5 h-5 mr-2"/>
                        )}
                        {isOpeningModal ? 'Cargando...' : 'Añadir Matrícula'}
                    </button>
                </div>
            </div>

            <div className="bg-dark-surface rounded-lg shadow-lg overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full">
                        <thead className="border-b border-dark-border">
                        <tr>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-dark-text-primary uppercase tracking-wider">Alumno</th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-dark-text-primary uppercase tracking-wider">Curso</th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-dark-text-primary uppercase tracking-wider">Institución</th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-dark-text-primary uppercase tracking-wider">Costo Total</th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-dark-text-primary uppercase tracking-wider">Fecha de Matrícula</th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-dark-text-primary uppercase tracking-wider">Acciones</th>
                        </tr>
                        </thead>
                        <tbody className="divide-y divide-dark-border">
                        {isLoading ? (
                            [...Array(5)].map((_, index) => <EnrollmentSkeletonRow key={index} />)
                        ) : (
                            !error && enrollments.map((enroll) => (
                                <tr key={enroll.id} className="hover:bg-slate-700/50 transition-colors duration-150">
                                    <td className="px-6 py-4 text-sm text-dark-text-primary align-top">
                                        <div className="max-w-xs" title={`${enroll.student.person.firstName} ${enroll.student.person.lastName}`}>
                                            {`${enroll.student.person.firstName} ${enroll.student.person.lastName}`}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm font-medium text-dark-text-primary align-top">
                                        <div className="max-w-xs" title={enroll.course.name}>
                                            {enroll.course.name}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-dark-text-secondary align-top">
                                        <div className="max-w-xs" title={enroll.institution.name}>
                                            {enroll.institution.name}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-dark-text-secondary align-top">
                                        {formatCurrency(enroll.totalEnrollmentCost)}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-dark-text-secondary align-top">
                                        {formatDate(enroll.enrollmentDate)}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-dark-text-secondary align-top">
                                        <div className="flex items-center space-x-4">
                                            <button onClick={() => handleViewDetails(enroll)}
                                                    className="hover:text-dark-text-primary" title="Ver detalles">
                                                <Icon
                                                    path="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178zM15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                                    className="w-5 h-5"/>
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
                {!isLoading && !error && enrollments.length === 0 &&
                    <p className="p-4 text-center text-dark-text-secondary">No se encontraron matrículas.</p>}
            </div>

            {isAddModalOpen && (
                <EnrollmentAddModal
                    onClose={() => setIsAddModalOpen(false)}
                    onSave={handleCreateEnrollment}
                    catalogs={catalogs}
                />
            )}

            {isDetailsModalOpen && (
                <EnrollmentDetailsModal
                    enrollment={selectedEnrollment}
                    onClose={() => setIsDetailsModalOpen(false)}
                />
            )}
        </div>
    );
};

export default EnrollmentsPage;