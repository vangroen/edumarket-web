import React from 'react';
import Icon from './ui/Icon';

// --- COMPONENTES REUTILIZADOS (COPIADOS DE EnrollmentDetailsModal) ---
// Estos componentes aseguran que los estilos de las "píldoras" sean idénticos.

const DocumentPill = ({ type }) => {
    const pillClasses = `px-3 py-1 text-xs font-semibold rounded-full capitalize bg-green-500/20 text-green-300`;
    return <span className={pillClasses}>{type}</span>;
}

const AcademicRankPill = ({ rank }) => {
    const pillClasses = `px-3 py-1 text-xs font-semibold rounded-full capitalize bg-amber-500/20 text-amber-300`;
    return <span className={pillClasses}>{rank}</span>;
}

// Componente de campo de detalle, ahora también admite 'children' para píldoras.
const DetailField = ({ label, value, children }) => (
    <div>
        <p className="text-sm font-medium text-dark-text-secondary">{label}</p>
        {children ? <div className="text-base text-dark-text-primary mt-1">{children}</div> :
            <p className="text-base text-dark-text-primary">{value || 'No especificado'}</p>}
    </div>
);

// --- COMPONENTE PRINCIPAL MODIFICADO ---

const StudentDetailsModal = ({ student, onClose }) => {
    if (!student) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 p-4">
            {/* Contenedor principal del modal, con tamaño y scroll adaptativo */}
            <div className="bg-dark-surface rounded-lg shadow-2xl w-full max-w-4xl flex flex-col max-h-full">

                {/* Cabecera del modal */}
                <div className="flex justify-between items-center p-8 pb-4 flex-shrink-0">
                    <h2 className="text-2xl font-bold text-dark-text-primary">Detalles del Estudiante</h2>
                    <button onClick={onClose} className="text-dark-text-secondary hover:text-dark-text-primary">
                        <Icon path="M6 18L18 6M6 6l12 12" className="w-6 h-6"/>
                    </button>
                </div>

                {/* Contenido principal con scroll */}
                <div className="overflow-y-auto p-8">
                    <div className="space-y-10 animate-fade-in">
                        {/* Sección de Datos Personales con el orden corregido */}
                        <div>
                            <h3 className="text-lg font-medium text-sky-400 mb-4 border-b border-dark-border pb-2">Datos Personales</h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-x-4 gap-y-6">
                                <DetailField label="Nombres y Apellidos" value={`${student.person.firstName} ${student.person.lastName}`} />
                                <DetailField label="Tipo de Documento">
                                    <DocumentPill type={student.person.documentType.description} />
                                </DetailField>
                                <DetailField label="Número de Documento" value={student.person.documentNumber} />
                                <DetailField label="Email" value={student.person.email} />
                                <DetailField label="Teléfono" value={student.person.phone} />
                                <DetailField label="Dirección" value={student.person.address} />
                            </div>
                        </div>

                        {/* Sección de Datos Académicos */}
                        <div>
                            <h3 className="text-lg font-medium text-sky-400 mb-4 border-b border-dark-border pb-2">Datos Académicos</h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-x-4 gap-y-6">
                                <DetailField label="Rango Académico">
                                    <AcademicRankPill rank={student.academicRank.description} />
                                </DetailField>
                                <DetailField label="Profesión" value={student.profession.name} />
                                <DetailField label="Institución de Origen" value={student.institution.name} />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Pie del modal */}
                <div className="flex-shrink-0 flex justify-end p-8 pt-6">
                    <button type="button" onClick={onClose} className="px-6 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 font-semibold transition-colors">
                        Cerrar
                    </button>
                </div>
            </div>
        </div>
    );
};

export default StudentDetailsModal;