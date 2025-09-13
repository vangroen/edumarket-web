import React from 'react';
import Icon from './ui/Icon';

// Píldora para el Tipo de Institución
const TypePill = ({type}) => {
    const pillClasses = `px-3 py-1 text-xs font-semibold rounded-full capitalize ${
        type.toLowerCase() === 'universidad'
            ? 'bg-indigo-500/20 text-indigo-300'
            : 'bg-sky-500/20 text-sky-300'
    }`;
    return <span className={pillClasses}>{type}</span>;
};

// Píldora para el Tipo de Documento
const DocumentPill = ({type}) => {
    const pillClasses = `px-3 py-1 text-xs font-semibold rounded-full capitalize bg-green-500/20 text-green-300`;
    return <span className={pillClasses}>{type}</span>;
}

// Píldora para el Rango Académico
const AcademicRankPill = ({rank}) => {
    const pillClasses = `px-3 py-1 text-xs font-semibold rounded-full capitalize bg-amber-500/20 text-amber-300`;
    return <span className={pillClasses}>{rank}</span>;
}

// --- NUEVO --- Píldora para la Duración
const DurationPill = ({months}) => {
    if (!months) return null; // No renderiza nada si no hay meses
    const text = months > 1 ? `${months} Meses` : `${months} Mes`;
    const pillClasses = `px-3 py-1 text-xs font-semibold rounded-full capitalize bg-purple-500/20 text-purple-300`;
    return <span className={pillClasses}>{text}</span>;
}

// Componente auxiliar para mostrar un campo de detalle
const DetailField = ({label, value, children, className = ''}) => (
    <div className={className}>
        <p className="text-sm font-medium text-dark-text-secondary">{label}</p>
        {children ? <div className="text-base text-dark-text-primary mt-1">{children}</div> :
            <p className="text-base text-dark-text-primary">{value || 'No especificado'}</p>}
    </div>
);

const EnrollmentDetailsModal = ({enrollment, onClose}) => {
    if (!enrollment) return null;

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('es-PE', {style: 'currency', currency: 'PEN'}).format(amount);
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('es-PE', {dateStyle: 'long', timeStyle: 'short'}).format(date);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 p-4">
            <div className="bg-dark-surface rounded-lg shadow-2xl w-full max-w-4xl flex flex-col max-h-full">

                <div className="flex justify-between items-center p-8 pb-6">
                    <h2 className="text-2xl font-bold text-dark-text-primary">Detalles de la Matrícula</h2>
                    <button onClick={onClose} className="text-dark-text-secondary hover:text-dark-text-primary">
                        <Icon path="M6 18L18 6M6 6l12 12" className="w-6 h-6"/>
                    </button>
                </div>

                <div className="overflow-y-auto p-8 pt-0 space-y-10">

                    <div>
                        <h3 className="text-lg font-medium text-sky-400 mb-4 border-b border-dark-border pb-2">Información
                            General</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-x-4 gap-y-6">
                            <DetailField label="Curso" value={enrollment.course.name}/>
                            <DetailField label="Institución" value={enrollment.institution.name}/>
                            <DetailField label="Tipo de Institución">
                                <TypePill type={enrollment.institution.institutionType.description}/>
                            </DetailField>

                            <DetailField label="Costo de Matrícula"
                                         value={formatCurrency(enrollment.enrollmentFeeAmount)}/>
                            <DetailField label="Pago Mensual" value={formatCurrency(enrollment.monthlyFeeAmount)}/>
                            <DetailField label="Derechos Finales" value={formatCurrency(enrollment.finalRightsAmount)}/>

                            {/* --- CAMBIO AQUÍ: Duración ahora es una Píldora --- */}
                            <DetailField label="Duración del curso">
                                <DurationPill months={enrollment.course.durationInMonths}/>
                            </DetailField>
                            <DetailField label="Costo Total" value={formatCurrency(enrollment.totalEnrollmentCost)}/>
                            <DetailField label="Fecha de Matrícula" value={formatDate(enrollment.enrollmentDate)}/>
                        </div>
                    </div>

                    <div>
                        <h3 className="text-lg font-medium text-sky-400 mb-4 border-b border-dark-border pb-2">Datos del
                            Estudiante</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-x-4 gap-y-6">
                            <DetailField label="Nombres y Apellidos"
                                         value={`${enrollment.student.person.firstName} ${enrollment.student.person.lastName}`}/>
                            <DetailField label="Tipo de Documento">
                                <DocumentPill type={enrollment.student.person.documentType.description}/>
                            </DetailField>
                            <DetailField label="Número de Documento" value={enrollment.student.person.documentNumber}/>
                            <DetailField label="Rango Académico">
                                <AcademicRankPill rank={enrollment.student.academicRank.description}/>
                            </DetailField>
                            <DetailField label="Profesión" value={enrollment.student.profession.name}/>
                            <DetailField label="Institución de Origen" value={enrollment.student.institution.name}/>
                            <DetailField label="Email" value={enrollment.student.person.email}/>
                            <DetailField label="Teléfono" value={enrollment.student.person.phone}/>
                            <DetailField label="Dirección" value={enrollment.student.person.address}/>
                        </div>
                    </div>

                    <div>
                        <h3 className="text-lg font-medium text-sky-400 mb-4 border-b border-dark-border pb-2">Datos del
                            Agente</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-x-4 gap-y-6">
                            <DetailField label="Nombres y Apellidos"
                                         value={`${enrollment.agent.person.firstName} ${enrollment.agent.person.lastName}`}/>
                            <DetailField label="Tipo de Documento">
                                <DocumentPill type={enrollment.agent.person.documentType.description}/>
                            </DetailField>
                            <DetailField label="Número de Documento" value={enrollment.agent.person.documentNumber}/>
                            <DetailField label="Email" value={enrollment.agent.person.email}/>
                            <DetailField label="Teléfono" value={enrollment.agent.person.phone}/>
                            <DetailField label="Dirección" value={enrollment.agent.person.address}/>
                        </div>
                    </div>
                </div>

                <div className="flex-shrink-0 flex justify-end p-8 pt-6">
                    <button type="button" onClick={onClose}
                            className="px-6 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 font-semibold transition-colors">
                        Cerrar
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EnrollmentDetailsModal;