import React, { useState } from 'react';
import Icon from './ui/Icon';
import PaymentSchedule from "./PaymentSchedule.jsx";

// --- Todos los componentes auxiliares (Pills y DetailField) se mantienen igual ---
const TypePill = ({type}) => {
    const pillClasses = `px-3 py-1 text-xs font-semibold rounded-full capitalize ${
        type.toLowerCase() === 'universidad'
            ? 'bg-indigo-500/20 text-indigo-300'
            : 'bg-sky-500/20 text-sky-300'
    }`;
    return <span className={pillClasses}>{type}</span>;
};
const DocumentPill = ({type}) => {
    const pillClasses = `px-3 py-1 text-xs font-semibold rounded-full capitalize bg-green-500/20 text-green-300`;
    return <span className={pillClasses}>{type}</span>;
}
const AcademicRankPill = ({rank}) => {
    const pillClasses = `px-3 py-1 text-xs font-semibold rounded-full capitalize bg-amber-500/20 text-amber-300`;
    return <span className={pillClasses}>{rank}</span>;
}
const DurationPill = ({months}) => {
    if (!months) return null;
    const text = months > 1 ? `${months} Meses` : `${months} Mes`;
    const pillClasses = `px-3 py-1 text-xs font-semibold rounded-full capitalize bg-purple-500/20 text-purple-300`;
    return <span className={pillClasses}>{text}</span>;
}
const DetailField = ({label, value, children, className = ''}) => (
    <div className={className}>
        <p className="text-sm font-medium text-dark-text-secondary">{label}</p>
        {children ? <div className="text-base text-dark-text-primary mt-1">{children}</div> :
            <p className="text-base text-dark-text-primary">{value || 'No especificado'}</p>}
    </div>
);


const EnrollmentDetailsModal = ({enrollment, onClose}) => {
    if (!enrollment) return null;

    // --- 1. AÑADIR ESTADO PARA LA PESTAÑA ACTIVA ---
    const [activeTab, setActiveTab] = useState('details');

    // --- Funciones de formato (sin cambios) ---
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('es-PE', {style: 'currency', currency: 'PEN'}).format(amount);
    };
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const options = {
            year: 'numeric', month: '2-digit', day: '2-digit',
            hour: '2-digit', minute: '2-digit', hour12: true,
        };
        return new Intl.DateTimeFormat('es-PE', options).format(date).replace(',', '');
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 p-4">
            <div className="bg-dark-surface rounded-lg shadow-2xl w-full max-w-4xl flex flex-col max-h-full">

                <div className="flex justify-between items-center p-8 pb-4 flex-shrink-0">
                    <h2 className="text-2xl font-bold text-dark-text-primary">Detalles de la Matrícula</h2>
                    <button onClick={onClose} className="text-dark-text-secondary hover:text-dark-text-primary">
                        <Icon path="M6 18L18 6M6 6l12 12" className="w-6 h-6"/>
                    </button>
                </div>

                {/* Sección de Pestañas con diseño mejorado */}
                <div className="px-8 border-b border-dark-border">
                    <nav className="flex space-x-2 -mb-px">
                        <button
                            onClick={() => setActiveTab('details')}
                            className={`px-4 py-3 font-semibold text-sm rounded-t-lg transition-colors focus:outline-none border ${
                                activeTab === 'details'
                                    ? 'text-brand-accent bg-dark-surface border-dark-border border-b-dark-surface'
                                    : 'text-dark-text-secondary border-transparent hover:text-dark-text-primary'
                            }`}
                        >
                            Detalles Generales
                        </button>
                        <button
                            onClick={() => setActiveTab('schedule')}
                            className={`px-4 py-3 font-semibold text-sm rounded-t-lg transition-colors focus:outline-none border ${
                                activeTab === 'schedule'
                                    ? 'text-brand-accent bg-dark-surface border-dark-border border-b-dark-surface'
                                    : 'text-dark-text-secondary border-transparent hover:text-dark-text-primary'
                            }`}
                        >
                            Cronograma de Pagos
                        </button>
                    </nav>
                </div>

                {/* Contenido condicional de las pestañas */}
                <div className="overflow-y-auto p-8">
                    {activeTab === 'details' && (
                        <div className="space-y-10 animate-fade-in">
                            {/* Información General */}
                            <div>
                                <h3 className="text-lg font-medium text-sky-400 mb-4 border-b border-dark-border pb-2">Información General</h3>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-x-4 gap-y-6">
                                    <DetailField label="Curso" value={enrollment.course.name}/>
                                    <DetailField label="Institución" value={enrollment.institution.name}/>
                                    <DetailField label="Tipo de Institución">
                                        <TypePill type={enrollment.institution.institutionType.description}/>
                                    </DetailField>
                                    <DetailField label="Costo de Matrícula" value={formatCurrency(enrollment.enrollmentFeeAmount)}/>
                                    <DetailField label="Pago Mensual" value={formatCurrency(enrollment.monthlyFeeAmount)}/>
                                    <DetailField label="Derechos Finales" value={formatCurrency(enrollment.finalRightsAmount)}/>
                                    <DetailField label="Duración del curso">
                                        <DurationPill months={enrollment.course.durationInMonths}/>
                                    </DetailField>
                                    <DetailField label="Costo Total" value={formatCurrency(enrollment.totalEnrollmentCost)}/>
                                    <DetailField label="Fecha de Matrícula" value={formatDate(enrollment.enrollmentDate)}/>
                                </div>
                            </div>
                            {/* Datos del Estudiante */}
                            <div>
                                <h3 className="text-lg font-medium text-sky-400 mb-4 border-b border-dark-border pb-2">Datos del Estudiante</h3>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-x-4 gap-y-6">
                                    <DetailField label="Nombres y Apellidos" value={`${enrollment.student.person.firstName} ${enrollment.student.person.lastName}`}/>
                                    <DetailField label="Tipo de Documento"><DocumentPill type={enrollment.student.person.documentType.description}/></DetailField>
                                    <DetailField label="Número de Documento" value={enrollment.student.person.documentNumber}/>
                                    <DetailField label="Rango Académico"><AcademicRankPill rank={enrollment.student.academicRank.description}/></DetailField>
                                    <DetailField label="Profesión" value={enrollment.student.profession.name}/>
                                    <DetailField label="Institución de Origen" value={enrollment.student.institution.name}/>
                                    <DetailField label="Email" value={enrollment.student.person.email}/>
                                    <DetailField label="Teléfono" value={enrollment.student.person.phone}/>
                                    <DetailField label="Dirección" value={enrollment.student.person.address}/>
                                </div>
                            </div>
                            {/* Datos del Agente */}
                            <div>
                                <h3 className="text-lg font-medium text-sky-400 mb-4 border-b border-dark-border pb-2">Datos del Agente</h3>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-x-4 gap-y-6">
                                    <DetailField label="Nombres y Apellidos" value={`${enrollment.agent.person.firstName} ${enrollment.agent.person.lastName}`}/>
                                    <DetailField label="Tipo de Documento"><DocumentPill type={enrollment.agent.person.documentType.description}/></DetailField>
                                    <DetailField label="Número de Documento" value={enrollment.agent.person.documentNumber}/>
                                    <DetailField label="Email" value={enrollment.agent.person.email}/>
                                    <DetailField label="Teléfono" value={enrollment.agent.person.phone}/>
                                    <DetailField label="Dirección" value={enrollment.agent.person.address}/>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'schedule' && (
                        <div className="animate-fade-in">
                            <PaymentSchedule enrollmentId={enrollment.id} />
                        </div>
                    )}
                </div>

                <div className="flex-shrink-0 flex justify-end p-8 pt-6">
                    <button type="button" onClick={onClose} className="px-6 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 font-semibold transition-colors">
                        Cerrar
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EnrollmentDetailsModal;