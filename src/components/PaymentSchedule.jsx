import React, { useState, useEffect } from 'react';
import { fetchData } from '../services/api';
import PaymentAddModal from './PaymentAddModal'; // Importamos el nuevo modal

// Píldora para el estado del pago (sin cambios)
const PaymentStatusPill = ({ status }) => {
    let pillClasses = 'px-3 py-1 text-xs font-semibold rounded-full ';
    switch (status.toLowerCase()) {
        case 'pendiente de pago':
            pillClasses += 'bg-amber-500/20 text-amber-300';
            break;
        case 'pagado':
            pillClasses += 'bg-green-500/20 text-green-300';
            break;
        case 'vencido':
            pillClasses += 'bg-red-500/20 text-red-300';
            break;
        default:
            pillClasses += 'bg-slate-500/20 text-slate-300';
    }
    return <span className={pillClasses}>{status}</span>;
};

// ... (El componente ScheduleSkeletonRow no cambia)
const ScheduleSkeletonRow = () => (
    <tr className="animate-pulse">
        <td className="px-6 py-4">
            <div className="h-4 bg-slate-700 rounded w-2/3"></div>
        </td>
        <td className="px-6 py-4">
            <div className="h-4 bg-slate-700 rounded w-24"></div>
        </td>
        <td className="px-6 py-4">
            <div className="h-4 bg-slate-700 rounded w-28"></div>
        </td>
        <td className="px-6 py-4">
            <div className="h-6 bg-slate-700 rounded-full w-24"></div>
        </td>
        <td className="px-6 py-4">
            <div className="h-8 w-24 bg-slate-700 rounded-lg"></div>
        </td>
    </tr>
);

const PaymentSchedule = ({ enrollmentId }) => {
    const [schedule, setSchedule] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // --- NUEVOS ESTADOS PARA MANEJAR EL MODAL DE PAGO ---
    const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
    const [selectedScheduleItem, setSelectedScheduleItem] = useState(null);

    const loadSchedule = async () => {
        if (!enrollmentId) return;
        // No establecemos isLoading a true aquí para un refresco más suave
        setError(null);
        try {
            const allSchedules = await fetchData('/payments-schedules');
            const filteredSchedule = allSchedules.filter(item => item.enrollmentId === enrollmentId);
            setSchedule(filteredSchedule);
        } catch (err) {
            setError('No se pudo cargar el cronograma de pagos.');
        } finally {
            setIsLoading(false); // Aseguramos que el estado de carga termine
        }
    };

    useEffect(() => {
        setIsLoading(true); // Solo en la carga inicial
        loadSchedule();
    }, [enrollmentId]);

    // --- MANEJADORES PARA EL MODAL DE PAGO ---
    const handleOpenPaymentModal = (scheduleItem) => {
        setSelectedScheduleItem(scheduleItem);
        setIsPaymentModalOpen(true);
    };

    const handleClosePaymentModal = () => {
        setIsPaymentModalOpen(false);
        setSelectedScheduleItem(null);
    };

    const handleSavePayment = () => {
        handleClosePaymentModal();
        // Refrescamos la lista de pagos para ver el estado actualizado
        loadSchedule();
    };


    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('es-PE', { style: 'currency', currency: 'PEN' }).format(amount);
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('es-PE', { year: 'numeric', month: '2-digit', day: '2-digit' }).format(date);
    };

    // ... (el bloque de isLoading no cambia)
    if (isLoading) {
        return (
            <div className="overflow-x-auto rounded-lg border border-dark-border">
                <table className="min-w-full">
                    <thead className="bg-slate-800">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-dark-text-secondary uppercase tracking-wider">Concepto</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-dark-text-secondary uppercase tracking-wider">Monto</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-dark-text-secondary uppercase tracking-wider">Fecha de Vencimiento</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-dark-text-secondary uppercase tracking-wider">Estado</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-dark-text-secondary uppercase tracking-wider">Acciones</th>
                    </tr>
                    </thead>
                    <tbody className="divide-y divide-dark-border">
                    {[...Array(5)].map((_, index) => (
                        <ScheduleSkeletonRow key={index} />
                    ))}
                    </tbody>
                </table>
            </div>
        );
    }

    if (error) {
        return <p className="p-4 text-center text-red-400">{error}</p>;
    }

    return (
        <>
            <div className="overflow-x-auto rounded-lg border border-dark-border">
                <table className="min-w-full">
                    <thead className="bg-slate-800">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-dark-text-secondary uppercase tracking-wider">Concepto</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-dark-text-secondary uppercase tracking-wider">Monto</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-dark-text-secondary uppercase tracking-wider">Fecha de Vencimiento</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-dark-text-secondary uppercase tracking-wider">Estado</th>
                        {/* --- NUEVA COLUMNA DE ACCIONES --- */}
                        <th className="px-6 py-3 text-left text-xs font-medium text-dark-text-secondary uppercase tracking-wider">Acciones</th>
                    </tr>
                    </thead>
                    <tbody className="divide-y divide-dark-border">
                    {schedule.map((item) => (
                        <tr key={item.id} className="hover:bg-slate-700/50">
                            <td className="px-6 py-4 text-sm text-dark-text-primary">{item.conceptType.description}</td>
                            <td className="px-6 py-4 text-sm text-dark-text-primary whitespace-nowrap">{formatCurrency(item.installmentAmount)}</td>
                            <td className="px-6 py-4 text-sm text-dark-text-secondary whitespace-nowrap">{formatDate(item.installmentDueDate)}</td>
                            <td className="px-6 py-4 text-sm text-dark-text-secondary">
                                <PaymentStatusPill status={item.installmentStatus.status} />
                            </td>
                            {/* --- CELDA CON EL BOTÓN CONDICIONAL --- */}
                            <td className="px-6 py-4 text-sm">
                                {item.installmentStatus.status.toLowerCase() !== 'pagado' ? (
                                    <button
                                        onClick={() => handleOpenPaymentModal(item)}
                                        className="px-3 py-1.5 bg-brand-accent/80 text-white rounded-lg hover:bg-brand-accent text-xs font-semibold transition-colors"
                                    >
                                        Registrar Pago
                                    </button>
                                ) : (
                                    <span className="text-xs text-dark-text-secondary/70 italic">N/A</span>
                                )}
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
            {isPaymentModalOpen && (
                <PaymentAddModal
                    scheduleItem={selectedScheduleItem}
                    onClose={handleClosePaymentModal}
                    onSave={handleSavePayment}
                />
            )}
        </>
    );
};

export default PaymentSchedule;