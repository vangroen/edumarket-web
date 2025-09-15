import React from 'react';
import Icon from './ui/Icon';

// --- COMPONENTES REUTILIZADOS PARA CONSISTENCIA VISUAL ---

// Componente para mostrar un campo de detalle
const DetailField = ({ label, value, children }) => (
    <div>
        <p className="text-sm font-medium text-dark-text-secondary">{label}</p>
        {children ? <div className="text-base text-dark-text-primary mt-1">{children}</div> :
            <p className="text-base text-dark-text-primary">{value || 'No especificado'}</p>}
    </div>
);

// Píldora para el tipo de pago
const PaymentTypePill = ({ type }) => {
    if (!type) return null;
    const isDigital = type.toLowerCase().includes('yape') || type.toLowerCase().includes('plin');
    const pillClasses = `px-3 py-1 text-xs font-semibold rounded-full capitalize ${
        isDigital ? 'bg-teal-500/20 text-teal-300' : 'bg-blue-500/20 text-blue-300'
    }`;
    return <span className={pillClasses}>{type}</span>;
}

// --- NUEVO: Píldora específica para el concepto ---
const ConceptPill = ({ concept }) => {
    if (!concept) return null;
    const isEnrollment = concept.toLowerCase().includes('matrícula');
    const pillClasses = `px-3 py-1 text-xs font-semibold rounded-full capitalize ${
        isEnrollment ? 'bg-purple-500/20 text-purple-300' : 'bg-amber-500/20 text-amber-300'
    }`;
    return <span className={pillClasses}>{concept}</span>;
}


const PaymentDetailsModal = ({ payment, onClose }) => {
    // --- MODIFICADO: Formato de fecha ajustado ---
    const formatDate = (dateString) => {
        if (!dateString) return 'No disponible';
        const date = new Date(dateString);
        // Opciones para el formato "15/09/2025 10:58 a. m."
        const options = {
            year: 'numeric', month: '2-digit', day: '2-digit',
            hour: 'numeric', minute: '2-digit', hour12: true,
        };
        // Usamos 'es-PE' para el formato de Perú y reemplazamos caracteres innecesarios
        return new Intl.DateTimeFormat('es-PE', options).format(date).replace(',', '');
    };

    const formatCurrency = (amount) => {
        if (typeof amount !== 'number') return 'S/ 0.00';
        return new Intl.NumberFormat('es-PE', { style: 'currency', currency: 'PEN' }).format(amount);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-[60] p-4">
            <div className="bg-dark-surface rounded-lg shadow-2xl w-full max-w-2xl flex flex-col max-h-full">

                <div className="flex justify-between items-center p-8 pb-4 flex-shrink-0">
                    <h2 className="text-2xl font-bold text-dark-text-primary">Detalles del Pago</h2>
                    <button type="button" onClick={onClose} className="text-dark-text-secondary hover:text-dark-text-primary">
                        <Icon path="M6 18L18 6M6 6l12 12" className="w-6 h-6" />
                    </button>
                </div>

                <div className="overflow-y-auto p-8">
                    {!payment ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-6 animate-pulse">
                            <div className="space-y-2"><div className="h-3 bg-slate-700 rounded w-1/4"></div><div className="h-5 bg-slate-700 rounded w-3/4"></div></div>
                            <div className="space-y-2"><div className="h-3 bg-slate-700 rounded w-1/4"></div><div className="h-5 bg-slate-700 rounded w-1/2"></div></div>
                            <div className="space-y-2"><div className="h-3 bg-slate-700 rounded w-1/4"></div><div className="h-5 bg-slate-700 rounded w-3/4"></div></div>
                            <div className="space-y-2"><div className="h-3 bg-slate-700 rounded w-1/4"></div><div className="h-5 bg-slate-700 rounded w-1/2"></div></div>
                        </div>
                    ) : (
                        // --- MODIFICADO: Orden de los campos y uso de nuevas píldoras ---
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-6 animate-fade-in">
                            <DetailField label="Tipo de Pago">
                                <PaymentTypePill type={payment.paymentType?.description} />
                            </DetailField>
                            <DetailField label="Monto Pagado" value={formatCurrency(payment.paymentAmount)} />
                            <DetailField label="Concepto">
                                <ConceptPill concept={payment.paymentSchedule?.conceptType?.description} />
                            </DetailField>
                            <DetailField label="Fecha y Hora de Pago" value={formatDate(payment.paymentDate)} />
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

export default PaymentDetailsModal;