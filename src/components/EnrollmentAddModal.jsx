import React, { useState, useMemo } from 'react';
import Icon from './ui/Icon';
import ErrorModal from './ui/ErrorModal';

const EnrollmentAddModal = ({ onClose, onSave, catalogs }) => {
    const [formData, setFormData] = useState({
        idStudent: '',
        idAgent: '',
        idCourse: '',
        idInstitution: '',
        enrollmentFeeAmount: '',
        finalRightsAmount: '',
        // El campo monthlyFeeAmount se ha eliminado del estado
    });
    const [isSaving, setIsSaving] = useState(false);
    const [saveError, setSaveError] = useState('');

    const availableInstitutions = useMemo(() => {
        if (!formData.idCourse || !catalogs.courses) {
            return [];
        }
        const selectedCourse = catalogs.courses.find(c => c.id === parseInt(formData.idCourse));
        return selectedCourse ? selectedCourse.institutions.map(courseInst => courseInst.institution) : [];
    }, [formData.idCourse, catalogs.courses]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        const newFormData = { ...formData, [name]: value };

        if (name === 'idCourse') {
            newFormData.idInstitution = '';
        }

        setFormData(newFormData);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaveError('');
        setIsSaving(true);
        try {
            // Se asume que el backend no requiere 'monthlyFeeAmount' o lo calcula internamente.
            // Si lo requiere con valor 0, puedes añadir: monthlyFeeAmount: 0.00
            const payload = {
                enrollmentDate: new Date().toISOString(),
                idStudent: parseInt(formData.idStudent, 10),
                idAgent: parseInt(formData.idAgent, 10),
                idCourse: parseInt(formData.idCourse, 10),
                idInstitution: parseInt(formData.idInstitution, 10),
                enrollmentFeeAmount: parseFloat(formData.enrollmentFeeAmount),
                finalRightsAmount: parseFloat(formData.finalRightsAmount),
            };
            await onSave(payload);
        } catch (error) {
            setSaveError(error.message || 'Ocurrió un error al guardar la matrícula.');
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <>
            <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 p-4">
                <form onSubmit={handleSubmit} className="bg-dark-surface rounded-lg shadow-2xl w-full max-w-2xl flex flex-col max-h-full">
                    <div className="flex justify-between items-center p-8 pb-6 border-b border-dark-border">
                        <h2 className="text-2xl font-bold text-dark-text-primary">Registrar Nueva Matrícula</h2>
                        <button type="button" onClick={onClose} className="text-dark-text-secondary hover:text-dark-text-primary">
                            <Icon path="M6 18L18 6M6 6l12 12" className="w-6 h-6" />
                        </button>
                    </div>

                    <div className="overflow-y-auto p-8 space-y-6">
                        <div>
                            <h3 className="text-lg font-medium text-sky-400 mb-4 border-b border-dark-border pb-2">Datos del Curso</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <select name="idCourse" value={formData.idCourse} onChange={handleChange} required className="w-full bg-dark-bg border border-dark-border rounded-lg py-2 px-4 text-dark-text-primary">
                                    <option value="" disabled>Seleccione un curso</option>
                                    {catalogs.courses?.map(course => <option key={course.id} value={course.id}>{course.name}</option>)}
                                </select>
                                <select name="idInstitution" value={formData.idInstitution} onChange={handleChange} required disabled={!formData.idCourse} className="w-full bg-dark-bg border border-dark-border rounded-lg py-2 px-4 text-dark-text-primary disabled:bg-slate-800 disabled:text-dark-text-secondary">
                                    <option value="" disabled>Seleccione una institución</option>
                                    {availableInstitutions.map(inst => <option key={inst.id} value={inst.id}>{inst.name}</option>)}
                                </select>
                            </div>
                        </div>

                        <div>
                            <h3 className="text-lg font-medium text-sky-400 mb-4 border-b border-dark-border pb-2">Participantes</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <select name="idStudent" value={formData.idStudent} onChange={handleChange} required className="w-full bg-dark-bg border border-dark-border rounded-lg py-2 px-4 text-dark-text-primary">
                                    <option value="" disabled>Seleccione un estudiante</option>
                                    {catalogs.students?.map(student => <option key={student.id} value={student.id}>{`${student.person.firstName} ${student.person.lastName}`}</option>)}
                                </select>
                                <select name="idAgent" value={formData.idAgent} onChange={handleChange} required className="w-full bg-dark-bg border border-dark-border rounded-lg py-2 px-4 text-dark-text-primary">
                                    <option value="" disabled>Seleccione un agente</option>
                                    {catalogs.agents?.map(agent => <option key={agent.id} value={agent.id}>{`${agent.person.firstName} ${agent.person.lastName}`}</option>)}
                                </select>
                            </div>
                        </div>

                        <div>
                            <h3 className="text-lg font-medium text-sky-400 mb-4 border-b border-dark-border pb-2">Costos</h3>
                            {/* --- CAMBIO AQUÍ: La rejilla ahora es de 2 columnas --- */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <input type="number" step="0.01" name="enrollmentFeeAmount" value={formData.enrollmentFeeAmount} onChange={handleChange} placeholder="Costo de Matrícula (S/.)" required className="w-full bg-dark-bg border border-dark-border rounded-lg py-2 px-4 text-dark-text-primary" />
                                <input type="number" step="0.01" name="finalRightsAmount" value={formData.finalRightsAmount} onChange={handleChange} placeholder="Derechos Finales (S/.)" required className="w-full bg-dark-bg border border-dark-border rounded-lg py-2 px-4 text-dark-text-primary" />
                            </div>
                        </div>
                    </div>

                    <div className="flex-shrink-0 flex justify-end gap-4 p-8 pt-6">
                        <button type="button" onClick={onClose} className="px-6 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 font-semibold transition-colors">Cancelar</button>
                        <button type="submit" disabled={isSaving} className="px-6 py-2 bg-brand-accent text-white rounded-lg hover:bg-blue-600 font-semibold shadow transition-colors disabled:bg-slate-500 disabled:cursor-wait">
                            {isSaving ? 'Guardando...' : 'Registrar Matrícula'}
                        </button>
                    </div>
                </form>
            </div>
            {saveError && (
                <ErrorModal message={saveError} onClose={() => setSaveError('')} />
            )}
        </>
    );
};

export default EnrollmentAddModal;