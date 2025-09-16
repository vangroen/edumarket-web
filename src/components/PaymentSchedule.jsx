import React, { useState, useEffect } from 'react';
import { fetchData } from '../services/api';
import PaymentAddModal from './PaymentAddModal';
import PaymentDetailsModal from './PaymentDetailsModal';

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

const ScheduleSkeletonRow = () => (
    <tr className="animate-pulse">
        <td className="px-6 py-4"><div className="h-4 bg-slate-700 rounded w-2/3"></div></td>
        <td className="px-6 py-4"><div className="h-4 bg-slate-700 rounded w-24 ml-auto"></div></td>
        <td className="px-6 py-4"><div className="h-4 bg-slate-700 rounded w-28 mx-auto"></div></td>
        <td className="px-6 py-4"><div className="h-6 bg-slate-700 rounded-full w-24 mx-auto"></div></td>
        <td className="px-6 py-4"><div className="h-8 w-24 bg-slate-700 rounded-lg mx-auto"></div></td>
    </tr>
);

const PaymentSchedule = ({ enrollmentId }) => {
    const [schedule, setSchedule] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
    const [selectedScheduleItem, setSelectedScheduleItem] = useState(null);

    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
    const [selectedPaymentDetails, setSelectedPaymentDetails] = useState(null);
    const [isFetchingDetails, setIsFetchingDetails] = useState(false);


    const loadSchedule = async () => {
        if (!enrollmentId) return;
        setError(null);
        try {
            // Simulación de carga
            await new Promise(resolve => setTimeout(resolve, 1500));
            const allSchedules = await fetchData('/payments-schedules');
            const filteredSchedule = allSchedules.filter(item => item.enrollmentId === enrollmentId);
            setSchedule(filteredSchedule);
        } catch (err) {
            setError('No se pudo cargar el cronograma de pagos.');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        setIsLoading(true);
        loadSchedule();
    }, [enrollmentId]);

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
        loadSchedule();
    };

    const handleOpenDetailsModal = async (scheduleItem) => {
        setIsDetailsModalOpen(true);
        setIsFetchingDetails(true);
        setSelectedPaymentDetails(null);
        try {
            const paymentData = await fetchData(`/payments/${scheduleItem.id}`);
            setSelectedPaymentDetails(paymentData);
        } catch (err) {
            setError('No se pudo cargar el detalle del pago.');
            setIsDetailsModalOpen(false);
        } finally {
            setIsFetchingDetails(false);
        }
    };

    const handleCloseDetailsModal = () => {
        setIsDetailsModalOpen(false);
        setSelectedPaymentDetails(null);
    };

    const formatCurrency = (amount) => new Intl.NumberFormat('es-PE', { style: 'currency', currency: 'PEN' }).format(amount);
    const formatDate = (dateString) => new Intl.DateTimeFormat('es-PE', { year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date(dateString));

    if (isLoading) {
        return (
            // === INICIO DE CAMBIOS ===
            // La estructura del esqueleto ahora coincide con la de la tabla cargada
            <div className="rounded-lg border border-dark-border flex flex-col h-full">
                <div className="overflow-auto flex-1">
                    <table className="min-w-full">
                        <thead className="bg-slate-800 sticky top-0 z-10 border-b border-dark-border">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-dark-text-secondary uppercase tracking-wider">Concepto</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-dark-text-secondary uppercase tracking-wider">Monto</th>
                            <th className="px-6 py-3 text-center text-xs font-medium text-dark-text-secondary uppercase tracking-wider">Fecha de Vencimiento</th>
                            <th className="px-6 py-3 text-center text-xs font-medium text-dark-text-secondary uppercase tracking-wider">Estado</th>
                            <th className="px-6 py-3 text-center text-xs font-medium text-dark-text-secondary uppercase tracking-wider">Acciones</th>
                        </tr>
                        </thead>
                        <tbody className="divide-y divide-dark-border">{[...Array(6)].map((_, index) => <ScheduleSkeletonRow key={index} />)}</tbody>
                    </table>
                </div>
            </div>
            // === FIN DE CAMBIOS ===
        );
    }

    if (error) { return <p className="p-4 text-center text-red-400">{error}</p>; }

    return (
        <>
            <div className="rounded-lg border border-dark-border flex flex-col h-full">
                <div className="overflow-auto flex-1">
                    <table className="min-w-full">
                        <thead className="bg-slate-800 sticky top-0 z-10 border-b border-dark-border">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-dark-text-secondary uppercase tracking-wider">Concepto</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-dark-text-secondary uppercase tracking-wider">Monto</th>
                            <th className="px-6 py-3 text-center text-xs font-medium text-dark-text-secondary uppercase tracking-wider">Fecha de Vencimiento</th>
                            <th className="px-6 py-3 text-center text-xs font-medium text-dark-text-secondary uppercase tracking-wider">Estado</th>
                            <th className="px-6 py-3 text-center text-xs font-medium text-dark-text-secondary uppercase tracking-wider">Acciones</th>
                        </tr>
                        </thead>
                        <tbody className="divide-y divide-dark-border">
                        {schedule.map((item) => (
                            <tr key={item.id} className="hover:bg-slate-700/50">
                                <td className="px-6 py-4 text-sm text-dark-text-primary">{item.conceptType.description}</td>
                                <td className="px-6 py-4 text-sm text-dark-text-primary whitespace-nowrap text-right">{formatCurrency(item.installmentAmount)}</td>
                                <td className="px-6 py-4 text-sm text-dark-text-secondary whitespace-nowrap text-center">{formatDate(item.installmentDueDate)}</td>
                                <td className="px-6 py-4 text-sm text-dark-text-secondary text-center"><PaymentStatusPill status={item.installmentStatus.status} /></td>
                                <td className="px-6 py-4 text-sm text-center">
                                    {item.installmentStatus.status.toLowerCase() !== 'pagado' ? (
                                        <button
                                            onClick={() => handleOpenPaymentModal(item)}
                                            className="px-3 py-1.5 bg-brand-accent/80 text-white rounded-lg hover:bg-brand-accent text-xs font-semibold transition-colors"
                                        >
                                            Registrar Pago
                                        </button>
                                    ) : (
                                        <button
                                            onClick={() => handleOpenDetailsModal(item)}
                                            className="px-3 py-1.5 bg-slate-600/80 text-white rounded-lg hover:bg-slate-600 text-xs font-semibold transition-colors"
                                            disabled={isFetchingDetails}
                                        >
                                            Ver Detalle
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {isPaymentModalOpen && (
                <PaymentAddModal
                    scheduleItem={selectedScheduleItem}
                    onClose={handleClosePaymentModal}
                    onSave={handleSavePayment}
                />
            )}

            {isDetailsModalOpen && (
                <PaymentDetailsModal
                    payment={selectedPaymentDetails}
                    onClose={handleCloseDetailsModal}
                />
            )}
        </>
    );
};

export default PaymentSchedule;