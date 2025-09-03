import React, { useState, useEffect } from 'react';
import Icon from '../ui/Icon'; // Corregido para subir un nivel
import CatalogItemModal from '../catalogs/CatalogItemModal'; // Esta estaba bien si está en la misma carpeta
import ConfirmDeleteModal from '../ConfirmDeleteModal';
import { fetchData, createData, updateData, deleteData } from '../../services/api'; // Corregido para subir dos niveles

const CatalogCrud = ({ catalogInfo, onBack }) => {
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Estados para modales
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletingItem, setDeletingItem] = useState(null);
  const [selectOptions, setSelectOptions] = useState({});

  const { title, endpoint, fields, displayColumns } = catalogInfo;
  const mainDisplayField = displayColumns ? displayColumns[0].field : fields[0].name;

  const loadData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchData(endpoint);
      setItems(data);

      for (const field of fields) {
        if (field.type === 'select') {
          const options = await fetchData(field.endpoint);
          setSelectOptions(prev => ({ ...prev, [field.name]: options }));
        }
      }
    } catch (err) {
      setError(`No se pudieron cargar los datos para ${title}.`);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [endpoint]);

  const handleOpenModal = (item = null) => {
    setEditingItem(item);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingItem(null);
  };

  const handleSave = async (itemToSave) => {
    try {
      const payload = {};
      fields.forEach(field => {
        payload[field.name] = field.type === 'select' ? parseInt(itemToSave[field.name], 10) : itemToSave[field.name];
      });

      if (itemToSave.id) {
        await updateData(`${endpoint}/${itemToSave.id}`, payload);
      } else {
        await createData(endpoint, payload);
      }
      handleCloseModal();
      loadData();
    } catch (err) {
      setError(`No se pudo guardar el registro.`);
    }
  };
  
  const handleDeleteClick = (item) => {
    setDeletingItem(item);
    setIsDeleteModalOpen(true);
  };

  const handleCloseDeleteModal = () => {
      setIsDeleteModalOpen(false);
      setDeletingItem(null);
  };

  const handleConfirmDelete = async () => {
      if (!deletingItem) return;
      try {
          await deleteData(`${endpoint}/${deletingItem.id}`);
          handleCloseDeleteModal();
          loadData();
      } catch (err) {
          setError("No se pudo eliminar el registro.");
      }
  };

  const getNestedValue = (obj, path) => path.split('.').reduce((acc, part) => acc && acc[part], obj);

  return (
    <div>
      <div className="flex items-center mb-8">
        <button onClick={onBack} className="flex items-center text-dark-text-secondary hover:text-dark-text-primary mr-4 p-2 rounded-full hover:bg-dark-surface">
          <Icon path="M15.75 19.5L8.25 12l7.5-7.5" className="w-6 h-6" />
        </button>
        <div>
            <h1 className="text-3xl font-bold text-dark-text-primary">{title}</h1>
            <p className="text-dark-text-secondary mt-1">
                Añade, edita o elimina registros de este catálogo.
            </p>
        </div>
      </div>
      
      <div className="flex justify-end mb-4">
        <button onClick={() => handleOpenModal()} className="flex items-center justify-center px-4 py-2 bg-brand-accent text-white rounded-lg hover:bg-blue-600 font-semibold shadow transition-colors">
            <Icon path="M12 4.5v15m7.5-7.5h-15" className="w-5 h-5 mr-2" />
            Añadir Nuevo
        </button>
      </div>

      <div className="bg-dark-surface rounded-lg shadow-lg overflow-hidden">
          <table className="min-w-full">
            <thead className="bg-slate-800">
                <tr>
                    {(displayColumns || [{ header: 'Descripción', field: fields[0].name }]).map(col => (
                        <th key={col.header} className="px-6 py-4 text-left text-sm font-semibold text-dark-text-primary uppercase tracking-wider">{col.header}</th>
                    ))}
                    <th className="px-6 py-4 text-right text-sm font-semibold text-dark-text-primary uppercase tracking-wider">Acciones</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-dark-border">
                {!isLoading && !error && items.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-700/50 transition-colors duration-150">
                        {(displayColumns || [{ field: fields[0].name }]).map(col => (
                            <td key={col.field} className="px-6 py-4 text-sm font-medium text-dark-text-primary whitespace-nowrap">
                                {getNestedValue(item, col.field)}
                            </td>
                        ))}
                        <td className="px-6 py-4 text-sm text-dark-text-secondary">
                            <div className="flex items-center justify-end space-x-4">
                                <button onClick={() => handleOpenModal(item)} className="hover:text-dark-text-primary" title="Editar"><Icon path="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931z" className="w-5 h-5" /></button>
                                <button onClick={() => handleDeleteClick(item)} className="hover:text-red-500" title="Eliminar"><Icon path="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.134-2.036-2.134H8.718c-1.126 0-2.037.955-2.037 2.134v.916m7.5 0a48.667 48.667 0 00-7.5 0" className="w-5 h-5" /></button>
                            </div>
                        </td>
                    </tr>
                ))}
            </tbody>
          </table>
        {isLoading && <p className="p-4 text-center text-dark-text-secondary">Cargando...</p>}
        {error && <p className="p-4 text-center text-red-400">{error}</p>}
        {!isLoading && !error && items.length === 0 && <p className="p-4 text-center text-dark-text-secondary">No se encontraron registros.</p>}
      </div>

      {isModalOpen && (
        <CatalogItemModal
          item={editingItem}
          onClose={handleCloseModal}
          onSave={handleSave}
          catalogInfo={catalogInfo}
          selectOptions={selectOptions}
        />
      )}
      {isDeleteModalOpen && (
        <ConfirmDeleteModal
            itemType="el registro"
            itemName={deletingItem ? getNestedValue(deletingItem, mainDisplayField) : ''}
            onClose={handleCloseDeleteModal}
            onConfirm={handleConfirmDelete}
        />
      )}
    </div>
  );
};

export default CatalogCrud;