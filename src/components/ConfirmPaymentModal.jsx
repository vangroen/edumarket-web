import React from 'react';
import Icon from './ui/Icon';

const ConfirmPaymentModal = ({ amount, onConfirm, onClose }) => {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-[70]">
            <div className="bg-dark-surface rounded-lg shadow-2xl w-full max-w-md p-8 m-4">
                <div className="flex items-start mb-4">
                    <div className="mr-4 flex-shrink-0 bg-blue-500/10 rounded-full p-3">
                        <Icon path="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" className="w-6 h-6 text-blue-400" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-dark-text-primary">Confirmar Registro de Pago</h2>
                        <p className="text-dark-text-secondary mt-2">
                            ¿Estás seguro de que quieres registrar un pago por el monto de <strong className="text-dark-text-primary font-semibold">{amount}</strong>?
                        </p>
                    </div>
                </div>
                <p className="text-sm text-amber-400/80 mb-6 ml-16">
                    Esta acción no se puede deshacer.
                </p>
                <div className="flex justify-end gap-4">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-6 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 font-semibold transition-colors"
                    >
                        Cancelar
                    </button>
                    <button
                        type="button"
                        onClick={onConfirm}
                        className="px-6 py-2 bg-brand-accent text-white rounded-lg hover:bg-blue-600 font-semibold shadow transition-colors"
                    >
                        Confirmar Pago
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmPaymentModal;