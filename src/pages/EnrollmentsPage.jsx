import React, {useState, useEffect} from 'react';
import Icon from '../components/ui/Icon';
import EnrollmentDetailsModal from '../components/EnrollmentDetailsModal';
import {fetchData} from '../services/api';

const StatusPill = ({active}) => {
    const pillClasses = `px-3 py-1 text-xs font-semibold rounded-full capitalize ${active ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'}`;
    return <span className={pillClasses}>{active ? 'Activa' : 'Inactiva'}</span>;
};


const EnrollmentsPage = () => {
    const [enrollments, setEnrollments] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
    const [selectedEnrollment, setSelectedEnrollment] = useState(null);

    const loadEnrollments = async () => {
        setIsLoading(true);
        setError(null);
        try {
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

    const handleViewDetails = (enrollment) => {
        setSelectedEnrollment(enrollment);
        setIsDetailsModalOpen(true);
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('es-PE', {style: 'currency', currency: 'PEN'}).format(amount);
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('es-PE', {
            year: 'numeric', month: '2-digit', day: '2-digit',
        }).format(date);
    };

    return (<div>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8">
            <div>
                <h1 className="text-3xl font-bold text-dark-text-primary">Gestión de Matrículas</h1>
                <p className="text-dark-text-secondary mt-1">Consulta la información de las matrículas.</p>
            </div>
            <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <Icon path="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
                          className="w-5 h-5 text-dark-text-secondary"/>
                </div>
                <input type="text" placeholder="Buscar matrícula..."
                       className="w-full bg-dark-surface border border-dark-border rounded-lg py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-brand-accent text-dark-text-primary"/>
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
                        <th className="px-6 py-4 text-left text-sm font-semibold text-dark-text-primary uppercase tracking-wider">Costo
                            Total
                        </th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-dark-text-primary uppercase tracking-wider">Fecha
                            de Matrícula
                        </th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-dark-text-primary uppercase tracking-wider">Acciones</th>
                    </tr>
                    </thead>
                    {!isLoading && !error && (<tbody className="divide-y divide-dark-border">
                    {enrollments.map((enroll) => (
                        <tr key={enroll.id} className="hover:bg-slate-700/50 transition-colors duration-150">
                            {/* --- ALUMNO (AHORA CON WRAP) --- */}
                            <td className="px-6 py-4 text-sm text-dark-text-primary align-top">
                                <div className="max-w-xs"
                                     title={`${enroll.student.person.firstName} ${enroll.student.person.lastName}`}>
                                    {`${enroll.student.person.firstName} ${enroll.student.person.lastName}`}
                                </div>
                            </td>

                            {/* --- CURSO (AHORA CON WRAP) --- */}
                            <td className="px-6 py-4 text-sm font-medium text-dark-text-primary align-top">
                                <div className="max-w-xs" title={enroll.course.name}>
                                    {enroll.course.name}
                                </div>
                            </td>

                            {/* --- INSTITUCIÓN (AHORA CON WRAP) --- */}
                            <td className="px-6 py-4 text-sm text-dark-text-secondary align-top">
                                <div className="max-w-xs" title={enroll.institution.name}>
                                    {enroll.institution.name}
                                </div>
                            </td>

                            {/* --- CELDAS RESTANTES (SIN FORZAR UNA SOLA LÍNEA) --- */}
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
                    ))}
                    </tbody>)}
                </table>
            </div>
            {isLoading && <p className="p-4 text-center text-dark-text-secondary">Cargando matrículas...</p>}
            {error && <p className="p-4 text-center text-red-400">{error}</p>}
            {!isLoading && !error && enrollments.length === 0 &&
                <p className="p-4 text-center text-dark-text-secondary">No se encontraron matrículas.</p>}
        </div>

        {isDetailsModalOpen && (<EnrollmentDetailsModal
            enrollment={selectedEnrollment}
            onClose={() => setIsDetailsModalOpen(false)}
        />)}
    </div>);
};

export default EnrollmentsPage;