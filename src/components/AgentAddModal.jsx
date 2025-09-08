import React, { useState, useEffect } from 'react';
import Icon from './ui/Icon';
import { fetchData } from '../services/api';
import ErrorModal from '../components/ui/ErrorModal'; // NUEVO: Importamos el ErrorModal

const AgentAddModal = ({ onClose, onSave, catalogs }) => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        address: '',
        documentNumber: '',
        idDocumentType: '',
    });

    const [searchStatus, setSearchStatus] = useState('initial');
    const [personId, setPersonId] = useState(null);
    const [searchError, setSearchError] = useState('');
    const [saveError, setSaveError] = useState(''); // Estado para el error de guardado
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (!formData.documentNumber || !formData.idDocumentType) {
            return;
        }
        const debounceTimer = setTimeout(() => {
            handleDocumentCheck();
        }, 1500);
        return () => clearTimeout(debounceTimer);
    }, [formData.documentNumber, formData.idDocumentType]);

    const handleDocumentCheck = async () => {
        setSearchStatus('loading');
        setSearchError('');
        try {
            const personData = await fetchData(`/person/by-document/${formData.documentNumber}`);
            setFormData(prev => ({
                ...prev,
                firstName: personData.firstName,
                lastName: personData.lastName,
                email: personData.email,
                phone: personData.phone,
                address: personData.address,
                idDocumentType: personData.documentType.id,
            }));
            setPersonId(personData.id);
            setSearchStatus('found');
        } catch (error) {
            if (error.message && error.message.includes('404')) {
                setSearchStatus('notFound');
                setPersonId(null);
                setFormData(prev => ({
                    ...prev,
                    firstName: '', lastName: '', email: '', phone: '', address: ''
                }));
            } else {
                setSearchError('Error al buscar el documento. Intente de nuevo.');
                setSearchStatus('initial');
            }
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaveError(''); // Limpiamos el error antes de intentar guardar
        setIsSaving(true);
        try {
            await onSave({ ...formData, idPerson: personId });
        } catch (error) {
            setSaveError(error.message); // Almacenamos el mensaje de error para mostrarlo en el modal
        } finally {
            setIsSaving(false);
        }
    };

    const fieldsDisabled = searchStatus !== 'notFound';

    return (
        <>
            <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50">
                <div className="bg-dark-surface rounded-lg shadow-2xl w-full max-w-2xl p-8 m-4">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold text-dark-text-primary">Añadir Nuevo Agente</h2>
                        <button onClick={onClose} className="text-dark-text-secondary hover:text-dark-text-primary">
                            <Icon path="M6 18L18 6M6 6l12 12" className="w-6 h-6" />
                        </button>
                    </div>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <h3 className="text-lg font-medium text-dark-text-primary mb-4 border-b border-dark-border pb-2">Datos Personales</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <select name="idDocumentType" value={formData.idDocumentType} onChange={handleChange} required className="w-full bg-dark-bg border border-dark-border rounded-lg py-2 px-4 text-dark-text-primary">
                                    <option value="" disabled>Seleccione tipo de documento</option>
                                    {catalogs.documentTypes?.map(type => <option key={type.id} value={type.id}>{type.description}</option>)}
                                </select>
                                <input name="documentNumber" value={formData.documentNumber} onChange={handleChange} placeholder="Número de Documento" required className="w-full bg-dark-bg border border-dark-border rounded-lg py-2 px-4 text-dark-text-primary" />

                                {searchStatus === 'loading' && <p className="text-dark-text-secondary md:col-span-2">Buscando...</p>}
                                {searchError && <p className="text-red-400 md:col-span-2">{searchError}</p>}

                                <input name="firstName" value={formData.firstName} onChange={handleChange} placeholder="Nombres" required disabled={fieldsDisabled} className="w-full bg-dark-bg border border-dark-border rounded-lg py-2 px-4 text-dark-text-primary disabled:bg-slate-800 disabled:text-dark-text-secondary" />
                                <input name="lastName" value={formData.lastName} onChange={handleChange} placeholder="Apellidos" required disabled={fieldsDisabled} className="w-full bg-dark-bg border border-dark-border rounded-lg py-2 px-4 text-dark-text-primary disabled:bg-slate-800 disabled:text-dark-text-secondary" />
                                <input name="email" type="email" value={formData.email} onChange={handleChange} placeholder="Email" required disabled={fieldsDisabled} className="w-full bg-dark-bg border border-dark-border rounded-lg py-2 px-4 text-dark-text-primary disabled:bg-slate-800 disabled:text-dark-text-secondary" />
                                <input name="phone" value={formData.phone} onChange={handleChange} placeholder="Teléfono" required disabled={fieldsDisabled} className="w-full bg-dark-bg border border-dark-border rounded-lg py-2 px-4 text-dark-text-primary disabled:bg-slate-800 disabled:text-dark-text-secondary" />
                                <input name="address" value={formData.address} onChange={handleChange} placeholder="Dirección" required disabled={fieldsDisabled} className="w-full bg-dark-bg border border-dark-border rounded-lg py-2 px-4 text-dark-text-primary md:col-span-2 disabled:bg-slate-800 disabled:text-dark-text-secondary" />
                            </div>
                        </div>

                        <div className="flex justify-end gap-4 pt-4">
                            <button type="button" onClick={onClose} className="px-6 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 font-semibold transition-colors">Cancelar</button>
                            <button type="submit" disabled={isSaving} className="px-6 py-2 bg-brand-accent text-white rounded-lg hover:bg-blue-600 font-semibold shadow transition-colors disabled:bg-slate-500 disabled:cursor-wait">
                                {isSaving ? 'Guardando...' : 'Guardar Agente'}
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

export default AgentAddModal;