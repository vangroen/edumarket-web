import React, { useState, useEffect } from 'react';
import Icon from './ui/Icon';
import ErrorModal from './ui/ErrorModal'; // NUEVO: Importamos el ErrorModal

const AgentEditModal = ({ agent, onClose, onSave, catalogs }) => {
    const [formData, setFormData] = useState({
        firstName: '', lastName: '', email: '', phone: '', address: '',
        documentNumber: '', idDocumentType: '',
    });

    // --- NUEVOS ESTADOS PARA MANEJAR ERRORES Y GUARDADO ---
    const [saveError, setSaveError] = useState('');
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (agent) {
            setFormData({
                firstName: agent.person.firstName || '',
                lastName: agent.person.lastName || '',
                email: agent.person.email || '',
                phone: agent.person.phone || '',
                address: agent.person.address || '',
                documentNumber: agent.person.documentNumber || '',
                idDocumentType: agent.person.documentType?.id || '',
            });
        }
    }, [agent]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    // --- MODIFICADO: handleSubmit ahora maneja el estado de guardado y los errores ---
    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaveError('');
        setIsSaving(true);
        try {
            await onSave(formData);
        } catch (error) {
            setSaveError(error.message);
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <>
            <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50">
                <div className="bg-dark-surface rounded-lg shadow-2xl w-full max-w-2xl p-8 m-4">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold text-dark-text-primary">Editar Agente</h2>
                        <button onClick={onClose} className="text-dark-text-secondary hover:text-dark-text-primary">
                            <Icon path="M6 18L18 6M6 6l12 12" className="w-6 h-6" />
                        </button>
                    </div>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <h3 className="text-lg font-medium text-dark-text-primary mb-4 border-b border-dark-border pb-2">Datos Personales</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <input name="firstName" value={formData.firstName} onChange={handleChange} placeholder="Nombres" required className="w-full bg-dark-bg border border-dark-border rounded-lg py-2 px-4 text-dark-text-primary" />
                                <input name="lastName" value={formData.lastName} onChange={handleChange} placeholder="Apellidos" required className="w-full bg-dark-bg border border-dark-border rounded-lg py-2 px-4 text-dark-text-primary" />
                                <input name="email" type="email" value={formData.email} onChange={handleChange} placeholder="Email" required className="w-full bg-dark-bg border border-dark-border rounded-lg py-2 px-4 text-dark-text-primary" />
                                <input name="phone" value={formData.phone} onChange={handleChange} placeholder="Teléfono" required className="w-full bg-dark-bg border border-dark-border rounded-lg py-2 px-4 text-dark-text-primary" />
                                <input name="address" value={formData.address} onChange={handleChange} placeholder="Dirección" required className="w-full bg-dark-bg border border-dark-border rounded-lg py-2 px-4 text-dark-text-primary md:col-span-2" />
                                <select name="idDocumentType" value={formData.idDocumentType} onChange={handleChange} required className="w-full bg-dark-bg border border-dark-border rounded-lg py-2 px-4 text-dark-text-primary">
                                    <option value="" disabled>Seleccione tipo de documento</option>
                                    {catalogs.documentTypes?.map(type => <option key={type.id} value={type.id}>{type.description}</option>)}
                                </select>
                                <input name="documentNumber" value={formData.documentNumber} onChange={handleChange} placeholder="Número de Documento" required className="w-full bg-dark-bg border border-dark-border rounded-lg py-2 px-4 text-dark-text-primary" />
                            </div>
                        </div>
                        <div className="flex justify-end gap-4 pt-4">
                            <button type="button" onClick={onClose} className="px-6 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 font-semibold transition-colors">Cancelar</button>
                            <button type="submit" disabled={isSaving} className="px-6 py-2 bg-brand-accent text-white rounded-lg hover:bg-blue-600 font-semibold shadow transition-colors disabled:bg-slate-500 disabled:cursor-wait">
                                {isSaving ? 'Guardando...' : 'Guardar Cambios'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            {/* NUEVO: Mostramos el ErrorModal si saveError tiene contenido */}
            {saveError && (
                <ErrorModal message={saveError} onClose={() => setSaveError('')} />
            )}
        </>
    );
};

export default AgentEditModal;