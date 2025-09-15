import React from 'react';
import Icon from './ui/Icon';

// --- COMPONENTES AUXILIARES ---

const DetailField = ({ label, children }) => (
    <div>
        <p className="text-sm font-medium text-dark-text-secondary mb-1">{label}</p>
        <div className="text-base text-dark-text-primary">{children}</div>
    </div>
);

const PaymentTypePill = ({ type }) => {
    if (!type) return null;
    const isDigital = type.toLowerCase().includes('yape') || type.toLowerCase().includes('plin');
    const pillClasses = `inline-block w-auto px-3 py-1 text-xs font-semibold rounded-full ${
        isDigital ? 'bg-[#5D3E8D] text-white' : 'bg-blue-500/20 text-blue-300'
    }`;
    return <span className={pillClasses}>{type}</span>;
}

const ConceptPill = ({ concept }) => {
    if (!concept) return null;
    const isEnrollment = concept.toLowerCase().includes('matrícula');
    const pillClasses = `inline-block w-auto px-3 py-1 text-xs font-semibold rounded-full ${
        isEnrollment ? 'bg-purple-500/20 text-purple-300' : 'bg-amber-500/20 text-amber-300'
    }`;
    return <span className={pillClasses}>{concept}</span>;
}


const PaymentDetailsModal = ({ payment, onClose }) => {
    const formatDate = (dateString) => {
        if (!dateString) return 'No disponible';
        const date = new Date(dateString);
        const options = {
            year: 'numeric', month: '2-digit', day: '2-digit',
            hour: 'numeric', minute: '2-digit', hour12: true,
        };
        return new Intl.DateTimeFormat('es-PE', options).format(date).replace(',', '');
    };

    const formatCurrency = (amount) => {
        if (typeof amount !== 'number') return 'S/ 0.00';
        return new Intl.NumberFormat('es-PE', { style: 'currency', currency: 'PEN' }).format(amount);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-[60] p-4">
            {/* === CAMBIO AQUÍ: Ancho máximo reducido de max-w-lg a max-w-md === */}
            <div className="bg-dark-surface rounded-lg shadow-2xl w-full max-w-md flex flex-col max-h-full">

                <div className="flex justify-between items-center p-6 pb-4">
                    <h2 className="text-2xl font-bold text-dark-text-primary">Detalles del Pago</h2>
                    <button type="button" onClick={onClose} className="text-dark-text-secondary hover:text-dark-text-primary">
                        <Icon path="M6 18L18 6M6 6l12 12" className="w-6 h-6" />
                    </button>
                </div>

                <div className="p-6">
                    {!payment ? (
                        <div className="grid grid-cols-2 gap-x-8 gap-y-6 animate-pulse">
                            {[...Array(4)].map((_, i) => (
                                <div key={i} className="space-y-2">
                                    <div className="h-4 bg-slate-700 rounded w-1/3"></div>
                                    <div className="h-5 bg-slate-700 rounded w-2/3"></div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 gap-x-8 gap-y-6 animate-fade-in">
                            <DetailField label="Tipo de Pago">
                                <PaymentTypePill type={payment.paymentType?.description} />
                            </DetailField>
                            <DetailField label="Monto Pagado">
                                {formatCurrency(payment.paymentAmount)}
                            </DetailField>
                            <DetailField label="Concepto">
                                <ConceptPill concept={payment.paymentSchedule?.conceptType?.description} />
                            </DetailField>
                            <DetailField label="Fecha y Hora de Pago">
                                {formatDate(payment.paymentDate)}
                            </DetailField>
                        </div>
                    )}
                </div>

                <div className="flex-shrink-0 flex justify-end p-6">
                    <button type="button" onClick={onClose} className="px-6 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 font-semibold transition-colors">
                        Cerrar
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PaymentDetailsModal;