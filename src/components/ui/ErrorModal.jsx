import React from 'react';
import Icon from './Icon'; // Asegúrate de que la ruta a tu componente Icon es correcta

const ErrorModal = ({ message, onClose }) => {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-[70]"> {/* Mayor z-index */}
            <div className="bg-dark-surface rounded-lg shadow-2xl w-full max-w-sm p-6 m-4 text-center">
                <div className="flex justify-center mb-4">
                    <Icon path="M12 9v3.75m-9.303 3.376c-.866 1.5.305 3.25 1.945 3.25H19.302c1.64 0 2.813-1.75 1.945-3.25L11.702 4.19c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
                          className="w-10 h-10 text-red-500" />
                </div>
                <h3 className="text-xl font-bold text-dark-text-primary mb-3">Error</h3>
                <p className="text-dark-text-secondary mb-6">{message}</p>
                <button
                    onClick={onClose}
                    className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-semibold transition-colors w-full"
                >
                    Aceptar
                </button>
            </div>
        </div>
    );
};

export default ErrorModal;