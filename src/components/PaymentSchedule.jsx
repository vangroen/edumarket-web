import React, { useState, useEffect } from 'react';
import { fetchData } from '../services/api';

// Píldora para el estado del pago (versión simplificada)
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


const PaymentSchedule = ({ enrollmentId }) => {
    const [schedule, setSchedule] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadSchedule = async () => {
            if (!enrollmentId) return;
            setIsLoading(true);
            setError(null);
            try {
                const allSchedules = await fetchData('/payments-schedules');
                const filteredSchedule = allSchedules.filter(item => item.enrollmentId === enrollmentId);
                setSchedule(filteredSchedule);
            } catch (err) {
                setError('No se pudo cargar el cronograma de pagos.');
            } finally {
                setIsLoading(false);
            }
        };

        loadSchedule();
    }, [enrollmentId]);

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('es-PE', { style: 'currency', currency: 'PEN' }).format(amount);
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('es-PE', { year: 'numeric', month: '2-digit', day: '2-digit' }).format(date);
    };

    if (isLoading) {
        return <p className="p-4 text-center text-dark-text-secondary">Cargando cronograma...</p>;
    }

    if (error) {
        return <p className="p-4 text-center text-red-400">{error}</p>;
    }

    return (
        <div className="overflow-x-auto rounded-lg border border-dark-border">
            <table className="min-w-full">
                <thead className="bg-slate-800">
                <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-dark-text-secondary uppercase tracking-wider">Concepto</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-dark-text-secondary uppercase tracking-wider">Monto</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-dark-text-secondary uppercase tracking-wider">Fecha de Vencimiento</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-dark-text-secondary uppercase tracking-wider">Estado</th>
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
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default PaymentSchedule;