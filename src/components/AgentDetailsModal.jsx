import React from 'react';
import Icon from './ui/Icon';

// --- NUEVO: Componente para el esqueleto de un campo de detalle ---
const DetailFieldSkeleton = () => (
    <div className="animate-pulse">
        <div className="h-3 bg-slate-600 rounded w-1/3 mb-2"></div>
        <div className="h-4 bg-slate-700 rounded w-3/4"></div>
    </div>
);

const DetailField = ({ label, value }) => (
    <div>
        <p className="text-sm font-medium text-dark-text-secondary">{label}</p>
        <p className="text-base text-dark-text-primary">{value || 'No especificado'}</p>
    </div>
);

const AgentDetailsModal = ({ agent, onClose }) => {
    const isLoading = !agent;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50">
            <div className="bg-dark-surface rounded-lg shadow-2xl w-full max-w-lg p-8 m-4">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-dark-text-primary">
                        Detalles del Agente
                    </h2>
                    <button onClick={onClose} className="text-dark-text-secondary hover:text-dark-text-primary">
                        <Icon path="M6 18L18 6M6 6l12 12" className="w-6 h-6" />
                    </button>
                </div>

                {isLoading ? (
                    <div className="space-y-6">
                        <div>
                            <h3 className="text-lg font-medium text-dark-text-primary mb-4 border-b border-dark-border pb-2">Datos Personales</h3>
                            <div className="grid grid-cols-2 gap-4">
                                {[...Array(7)].map((_, i) => <DetailFieldSkeleton key={i} />)}
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-6">
                        <div>
                            <h3 className="text-lg font-medium text-dark-text-primary mb-4 border-b border-dark-border pb-2">Datos Personales</h3>
                            <div className="grid grid-cols-2 gap-4">
                                <DetailField label="Nombres" value={agent.person.firstName} />
                                <DetailField label="Apellidos" value={agent.person.lastName} />
                                <DetailField label="Email" value={agent.person.email} />
                                <DetailField label="Teléfono" value={agent.person.phone} />
                                <DetailField label="Tipo de Documento" value={agent.person.documentType.description} />
                                <DetailField label="Número de Documento" value={agent.person.documentNumber} />
                                <div className="col-span-2">
                                    <DetailField label="Dirección" value={agent.person.address} />
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                <div className="flex justify-end pt-8">
                    <button type="button" onClick={onClose} className="px-6 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 font-semibold transition-colors">
                        Cerrar
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AgentDetailsModal;