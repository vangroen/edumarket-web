import React from 'react';
import Icon from './ui/Icon';

// --- COMPONENTES REUTILIZADOS (COPIADOS DE OTROS MODALES PARA CONSISTENCIA) ---

const DocumentPill = ({ type }) => {
    const pillClasses = `px-3 py-1 text-xs font-semibold rounded-full capitalize bg-green-500/20 text-green-300`;
    return <span className={pillClasses}>{type}</span>;
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

const AgentDetailsModal = ({ agent, onClose }) => {
    if (!agent) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 p-4">
            {/* Contenedor principal del modal, con tamaño y scroll adaptativo */}
            <div className="bg-dark-surface rounded-lg shadow-2xl w-full max-w-4xl flex flex-col max-h-full">

                {/* Cabecera del modal */}
                <div className="flex justify-between items-center p-8 pb-4 flex-shrink-0">
                    <h2 className="text-2xl font-bold text-dark-text-primary">Detalles del Agente</h2>
                    <button onClick={onClose} className="text-dark-text-secondary hover:text-dark-text-primary">
                        <Icon path="M6 18L18 6M6 6l12 12" className="w-6 h-6"/>
                    </button>
                </div>

                {/* Contenido principal con scroll */}
                <div className="overflow-y-auto p-8">
                    <div className="space-y-10 animate-fade-in">
                        {/* Sección de Datos Personales con el orden y estilo unificado */}
                        <div>
                            <h3 className="text-lg font-medium text-sky-400 mb-4 border-b border-dark-border pb-2">Datos Personales</h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-x-4 gap-y-6">
                                <DetailField label="Nombres y Apellidos" value={`${agent.person.firstName} ${agent.person.lastName}`} />
                                <DetailField label="Tipo de Documento">
                                    <DocumentPill type={agent.person.documentType.description} />
                                </DetailField>
                                <DetailField label="Número de Documento" value={agent.person.documentNumber} />
                                <DetailField label="Email" value={agent.person.email} />
                                <DetailField label="Teléfono" value={agent.person.phone} />
                                <DetailField label="Dirección" value={agent.person.address} />
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

export default AgentDetailsModal;