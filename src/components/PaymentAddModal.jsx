import React, { useState, useEffect } from 'react';
import Icon from './ui/Icon';
import ErrorModal from './ui/ErrorModal';
import ConfirmPaymentModal from './ConfirmPaymentModal'; // Importamos el nuevo modal
import { fetchData, createData } from '../services/api';

const PaymentAddModal = ({ scheduleItem, onClose, onSave }) => {
    const [idPaymentType, setIdPaymentType] = useState('');
    const [paymentTypes, setPaymentTypes] = useState([]);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState('');
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false); // Nuevo estado

    useEffect(() => {
        const loadPaymentTypes = async () => {
            try {
                const data = await fetchData('/payment-type');
                setPaymentTypes(data);
            } catch (err) {
                setError('No se pudieron cargar los tipos de pago.');
            }
        };
        loadPaymentTypes();
    }, []);

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('es-PE', { style: 'currency', currency: 'PEN' }).format(amount);
    };

    const handleActualSubmit = async () => {
        if (!idPaymentType) {
            setError('Debe seleccionar un tipo de pago.');
            return;
        }

        setIsSaving(true);
        setError('');

        const payload = {
            paymentDate: new Date().toISOString(),
            idPaymentType: parseInt(idPaymentType, 10),
            idPaymentSchedule: scheduleItem.id,
        };

        try {
            await createData('/payments', payload);
            onSave();
        } catch (err) {
            setError(err.message || 'Ocurrió un error al registrar el pago.');
        } finally {
            setIsSaving(false);
            setIsConfirmModalOpen(false);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsConfirmModalOpen(true);
    }

    return (
        <>
            <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-[60]">
                <form onSubmit={handleSubmit} className="bg-dark-surface rounded-lg shadow-2xl w-full max-w-md p-8 m-4">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold text-dark-text-primary">Registrar Pago</h2>
                        <button type="button" onClick={onClose} className="text-dark-text-secondary hover:text-dark-text-primary">
                            <Icon path="M6 18L18 6M6 6l12 12" className="w-6 h-6" />
                        </button>
                    </div>

                    <div className="space-y-6">
                        {/* Sección de Detalles de la cuota */}
                        <div>
                            <h3 className="text-lg font-medium text-sky-400 mb-4 border-b border-dark-border pb-2">Detalles de la Cuota</h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-dark-text-secondary mb-2">Concepto</label>
                                    <input
                                        type="text"
                                        value={scheduleItem.conceptType.description}
                                        disabled
                                        className="w-full bg-dark-bg border border-dark-border rounded-lg py-2 px-4 text-dark-text-primary disabled:bg-slate-800 disabled:text-dark-text-secondary"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-dark-text-secondary mb-2">Monto a Pagar</label>
                                    <input
                                        type="text"
                                        value={formatCurrency(scheduleItem.installmentAmount)}
                                        disabled
                                        className="w-full bg-dark-bg border border-dark-border rounded-lg py-2 px-4 text-dark-text-primary disabled:bg-slate-800 disabled:text-dark-text-secondary"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Sección de Datos del pago */}
                        <div>
                            <h3 className="text-lg font-medium text-sky-400 mb-4 border-b border-dark-border pb-2">Datos del Pago</h3>
                            <div>
                                <label htmlFor="paymentType" className="block text-sm font-medium text-dark-text-secondary mb-2">Tipo de Pago</label>
                                <select
                                    id="paymentType"
                                    value={idPaymentType}
                                    onChange={(e) => setIdPaymentType(e.target.value)}
                                    className="w-full bg-dark-bg border border-dark-border rounded-lg py-2 px-4 text-dark-text-primary"
                                    required
                                >
                                    <option value="" disabled>Seleccione tipo de pago</option>
                                    {paymentTypes.map(type => (
                                        <option key={type.id} value={type.id}>{type.description}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end gap-4 pt-8">
                        <button type="button" onClick={onClose} className="px-6 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 font-semibold transition-colors">Cancelar</button>
                        <button type="submit" disabled={isSaving} className="px-6 py-2 bg-brand-accent text-white rounded-lg hover:bg-blue-600 font-semibold shadow transition-colors disabled:bg-slate-500 disabled:cursor-wait">
                            {isSaving ? 'Procesando...' : 'Registrar Pago'}
                        </button>
                    </div>
                </form>
            </div>
            {error && <ErrorModal message={error} onClose={() => setError('')} />}
            {isConfirmModalOpen && (
                <ConfirmPaymentModal
                    amount={formatCurrency(scheduleItem.installmentAmount)}
                    onConfirm={handleActualSubmit}
                    onClose={() => setIsConfirmModalOpen(false)}
                />
            )}
        </>
    );
};

export default PaymentAddModal;