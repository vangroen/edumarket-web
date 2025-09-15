import React, {useState, useEffect} from 'react';
import Icon from '../components/ui/Icon';
import AgentAddModal from '../components/AgentAddModal';
import AgentEditModal from '../components/AgentEditModal';
import AgentDetailsModal from '../components/AgentDetailsModal';
import ConfirmDeleteModal from '../components/ConfirmDeleteModal';
import {fetchData, createData, updateData, deleteData} from '../services/api';

// --- NUEVO: Componente para la fila "esqueleto" de Agentes ---
const AgentSkeletonRow = () => (
    <tr className="animate-pulse">
        <td className="px-6 py-4"><div className="h-4 bg-slate-700 rounded w-3/4"></div></td>
        <td className="px-6 py-4"><div className="h-4 bg-slate-700 rounded w-5/6"></div></td>
        <td className="px-6 py-4"><div className="h-4 bg-slate-700 rounded w-28"></div></td>
        <td className="px-6 py-4"><div className="h-4 bg-slate-700 rounded w-full"></div></td>
        <td className="px-6 py-4">
            <div className="flex items-center space-x-4">
                <div className="h-5 w-5 bg-slate-700 rounded"></div>
                <div className="h-5 w-5 bg-slate-700 rounded"></div>
                <div className="h-5 w-5 bg-slate-700 rounded"></div>
            </div>
        </td>
    </tr>
);

const AgentsPage = () => {
    // ... (los estados no cambian)
    const [agents, setAgents] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    // ... (el resto de los estados)
    const [error, setError] = useState(null);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingAgent, setEditingAgent] = useState(null);
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
    const [selectedAgent, setSelectedAgent] = useState(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [deletingAgent, setDeletingAgent] = useState(null);
    const [catalogs, setCatalogs] = useState({documentTypes: []});
    const [isModalDataLoaded, setIsModalDataLoaded] = useState(false);
    const [isOpeningModal, setIsOpeningModal] = useState(false);

    const loadAgents = async () => {
        setIsLoading(true);
        setError(null);
        try {
            // Simulación de carga
            await new Promise(resolve => setTimeout(resolve, 1500));
            const data = await fetchData('/agents');
            setAgents(Array.isArray(data) ? data : []);
        } catch (err) {
            setError(err.message);
            setAgents([]);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadAgents();
    }, []);

    // ... (el resto de las funciones no cambian)
    const loadCatalogsAndOpen = async (action) => {
        if (isModalDataLoaded) {
            action();
            return;
        }
        setIsOpeningModal(true);
        try {
            const docTypes = await fetchData('/document-type');
            setCatalogs({documentTypes: docTypes});
            setIsModalDataLoaded(true);
            action();
        } catch (err) {
            setError("No se pudieron cargar los datos para el formulario.");
        } finally {
            setIsOpeningModal(false);
        }
    };

    const handleAddClick = () => {
        loadCatalogsAndOpen(() => setIsAddModalOpen(true));
    };

    const handleCreateAgent = async (formData) => {
        try {
            let personIdToUse = formData.idPerson;
            if (!personIdToUse) {
                const personPayload = {
                    firstName: formData.firstName,
                    lastName: formData.lastName,
                    email: formData.email,
                    phone: formData.phone,
                    address: formData.address,
                    documentNumber: formData.documentNumber,
                    idDocumentType: parseInt(formData.idDocumentType, 10),
                };
                const newPerson = await createData('/person', personPayload);
                if (!newPerson || !newPerson.id) {
                    throw new Error("La creación de la persona no devolvió un ID válido.");
                }
                personIdToUse = newPerson.id;
            }
            const agentPayload = {idPerson: personIdToUse};
            await createData('/agents', agentPayload);
            setIsAddModalOpen(false);
            loadAgents();
        } catch (err) {
            if (err.message && err.message.includes('409')) {
                try {
                    const jsonString = err.message.substring(err.message.indexOf('{'));
                    const errorDetails = JSON.parse(jsonString);
                    throw new Error(errorDetails.message || 'Esta persona ya está registrada como agente.');
                } catch (parseError) {
                    throw new Error('Esta persona ya está registrada como agente.');
                }
            }
            setError("Ocurrió un error al crear el agente.");
            console.error(err);
            throw err;
        }
    };

    const handleEditClick = (agent) => {
        loadCatalogsAndOpen(() => {
            setEditingAgent(agent);
            setIsEditModalOpen(true);
        });
    };

    const handleUpdateAgent = async (formData) => {
        if (!editingAgent) return;
        try {
            const personPayload = {
                firstName: formData.firstName,
                lastName: formData.lastName,
                email: formData.email,
                phone: formData.phone,
                address: formData.address,
                documentNumber: formData.documentNumber,
                idDocumentType: parseInt(formData.idDocumentType, 10),
            };
            await updateData(`/person/${editingAgent.person.id}`, personPayload);
            setIsEditModalOpen(false);
            loadAgents();
        } catch (err) {
            if (err.message && err.message.includes('409')) {
                try {
                    const jsonString = err.message.substring(err.message.indexOf('{'));
                    const errorDetails = JSON.parse(jsonString);
                    throw new Error(errorDetails.message || 'El número de documento ya está en uso.');
                } catch (parseError) {
                    throw new Error('El número de documento ya está en uso por otra persona.');
                }
            }
            setError("Ocurrió un error al actualizar el agente.");
            console.error(err);
            throw err;
        }
    };

    const handleViewDetails = (agent) => {
        setSelectedAgent(agent);
        setIsDetailsModalOpen(true);
    };

    const handleDeleteClick = (agent) => {
        setDeletingAgent(agent);
        setIsDeleteModalOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (!deletingAgent) return;
        try {
            await deleteData(`/agents/${deletingAgent.id}`);
            await deleteData(`/person/${deletingAgent.person.id}`);
            setIsDeleteModalOpen(false);
            loadAgents();
        } catch (err) {
            setError("No se pudo eliminar el agente.");
            console.error(err);
        }
    };

    return (
        <div>
            {/* ... (Cabecera de la página no cambia) ... */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-dark-text-primary">Gestión de Agentes</h1>
                    <p className="text-dark-text-secondary mt-1">Administra la información de los agentes.</p>
                </div>
                <div className="flex items-center gap-4 mt-4 md:mt-0">
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                            <Icon path="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
                                  className="w-5 h-5 text-dark-text-secondary"/>
                        </div>
                        <input type="text" placeholder="Buscar agente..."
                               className="w-full bg-dark-surface border border-dark-border rounded-lg py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-brand-accent text-dark-text-primary"/>
                    </div>
                    <button onClick={handleAddClick} disabled={isOpeningModal}
                            className="flex items-center justify-center px-4 py-2 bg-brand-accent text-white rounded-lg hover:bg-blue-600 font-semibold shadow transition-colors flex-shrink-0 disabled:bg-slate-500 disabled:cursor-wait">
                        {isOpeningModal ? (<Icon
                            path="M16.023 9.348h4.992v-.001a10.987 10.987 0 00-2.3-5.842 10.987 10.987 0 00-5.843-2.3v4.992c0 .341.166.658.437.853l3.708 2.966c.27.218.632.245.92.062a.965.965 0 00.505-.921z"
                            className="w-5 h-5 mr-2 animate-spin"/>) : (
                            <Icon path="M12 4.5v15m7.5-7.5h-15" className="w-5 h-5 mr-2"/>)}
                        {isOpeningModal ? 'Cargando...' : 'Añadir Agente'}
                    </button>
                </div>
            </div>

            <div className="bg-dark-surface rounded-lg shadow-lg overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full">
                        <thead className="bg-slate-800">
                        <tr>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-dark-text-primary uppercase tracking-wider">Nombre Completo</th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-dark-text-primary uppercase tracking-wider">Email</th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-dark-text-primary uppercase tracking-wider">Teléfono</th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-dark-text-primary uppercase tracking-wider">Documento</th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-dark-text-primary uppercase tracking-wider">Acciones</th>
                        </tr>
                        </thead>
                        <tbody className="divide-y divide-dark-border">
                        {isLoading ? (
                            [...Array(5)].map((_, index) => <AgentSkeletonRow key={index} />)
                        ) : (
                            !error && agents.map((agent) => (
                                <tr key={agent.id} className="hover:bg-slate-700/50 transition-colors duration-150">
                                    <td className="px-6 py-4 text-sm font-medium text-dark-text-primary whitespace-nowrap">{`${agent.person.firstName} ${agent.person.lastName}`}</td>
                                    <td className="px-6 py-4 text-sm text-dark-text-secondary whitespace-nowrap">{agent.person.email}</td>
                                    <td className="px-6 py-4 text-sm text-dark-text-secondary whitespace-nowrap">{agent.person.phone}</td>
                                    <td className="px-6 py-4 text-sm text-dark-text-secondary whitespace-nowrap">
                                        {`${agent.person.documentType.description}: ${agent.person.documentNumber}`}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-dark-text-secondary">
                                        <div className="flex items-center space-x-4">
                                            <button onClick={() => handleViewDetails(agent)}
                                                    className="hover:text-dark-text-primary" title="Ver detalles">
                                                <Icon
                                                    path="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178zM15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                                    className="w-5 h-5"/>
                                            </button>
                                            <button onClick={() => handleEditClick(agent)}
                                                    className="hover:text-dark-text-primary" title="Editar agente">
                                                <Icon
                                                    path="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931z"
                                                    className="w-5 h-5"/>
                                            </button>
                                            <button onClick={() => handleDeleteClick(agent)} className="hover:text-red-500"
                                                    title="Eliminar agente">
                                                <Icon
                                                    path="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.134-2.036-2.134H8.718c-1.126 0-2.037.955-2.037 2.134v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                                                    className="w-5 h-5"/>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                        </tbody>
                    </table>
                    {error && <p className="p-4 text-center text-red-400">{error}</p>}
                    {!isLoading && !error && agents.length === 0 &&
                        <p className="p-4 text-center text-dark-text-secondary">No se encontraron agentes.</p>}
                </div>
                <div className="flex justify-between items-center p-4 text-sm text-dark-text-secondary">
                    <p>Mostrando {agents.length} de {agents.length} agentes</p>
                </div>
            </div>

            {/* ... (resto de los modales no cambian) ... */}
            {isAddModalOpen && (
                <AgentAddModal onClose={() => setIsAddModalOpen(false)} onSave={handleCreateAgent} catalogs={catalogs}/>
            )}
            {isEditModalOpen && (
                <AgentEditModal agent={editingAgent} onClose={() => setIsEditModalOpen(false)}
                                onSave={handleUpdateAgent} catalogs={catalogs}/>
            )}
            {isDetailsModalOpen && (
                <AgentDetailsModal agent={selectedAgent} onClose={() => setIsDetailsModalOpen(false)}/>
            )}
            {isDeleteModalOpen && (
                <ConfirmDeleteModal
                    itemType="al agente"
                    itemName={deletingAgent ? `${deletingAgent.person.firstName} ${deletingAgent.person.lastName}` : ''}
                    onClose={() => setIsDeleteModalOpen(false)}
                    onConfirm={handleConfirmDelete}
                />
            )}
        </div>
    );
};

export default AgentsPage;