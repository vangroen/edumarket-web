import React from 'react';
import Icon from './ui/Icon';

// Componente para mostrar un campo de detalle, estilo consistente
const DetailField = ({ label, value }) => (
    <div>
        <p className="text-sm font-medium text-dark-text-secondary">{label}</p>
        <p className="text-lg text-dark-text-primary font-semibold">{value}</p>
    </div>
);

const PaymentDetailsModal = ({ payment, onClose }) => {
    // Formatea la fecha para que sea más legible
    const formatDate = (dateString) => {
        if (!dateString) return 'No disponible';
        const date = new Date(dateString);
        const options = {
            year: 'numeric', month: 'long', day: 'numeric',
            hour: '2-digit', minute: '2-digit', hour12: true,
        };
        return new Intl.DateTimeFormat('es-ES', options).format(date);
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('es-PE', { style: 'currency', currency: 'PEN' }).format(amount);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-[60]">
            <div className="bg-dark-surface rounded-lg shadow-2xl w-full max-w-md p-8 m-4">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-dark-text-primary">Detalles del Pago</h2>
                    <button type="button" onClick={onClose} className="text-dark-text-secondary hover:text-dark-text-primary">
                        <Icon path="M6 18L18 6M6 6l12 12" className="w-6 h-6" />
                    </button>
                </div>

                {/* Muestra un esqueleto de carga si los datos aún no están listos */}
                {!payment ? (
                    <div className="space-y-4 animate-pulse">
                        <div className="h-6 bg-slate-700 rounded w-3/4"></div>
                        <div className="h-6 bg-slate-700 rounded w-1/2"></div>
                        <div className="h-6 bg-slate-700 rounded w-2/3"></div>
                    </div>
                ) : (
                    <div className="space-y-4">
                        <DetailField label="Concepto" value={payment.conceptType?.description} />
                        <DetailField label="Monto Pagado" value={formatCurrency(payment.installmentAmount)} />
                        <DetailField label="Fecha de Pago" value={formatDate(payment.paymentDate)} />
                        <DetailField label="Tipo de Pago" value={payment.paymentType?.description} />
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

export default PaymentDetailsModal;