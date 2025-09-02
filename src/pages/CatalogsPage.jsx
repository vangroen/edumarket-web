import React, { useState } from 'react';
import Icon from '../components/ui/Icon';
import CatalogCrud from '../components/catalogs/CatalogCrud'; // Importamos el componente CRUD

const catalogItems = [
  // Catálogos simples con un solo campo
  { key: 'academicRank', title: 'Grado Académico', endpoint: '/academic-rank', fields: [{ name: 'description', label: 'Descripción', type: 'text' }] },
  { key: 'conceptType', title: 'Tipo de Concepto', endpoint: '/concept-type', fields: [{ name: 'description', label: 'Descripción', type: 'text' }] },
  { key: 'courseType', title: 'Tipo de Curso', endpoint: '/course-type', fields: [{ name: 'description', label: 'Descripción', type: 'text' }] },
  { key: 'documentType', title: 'Tipo de Documento', endpoint: '/document-type', fields: [{ name: 'description', label: 'Descripción', type: 'text' }] },
  { key: 'installmentStatus', title: 'Estado de Cuota', endpoint: '/installment-status', fields: [{ name: 'status', label: 'Estado', type: 'text' }] },
  { key: 'modality', title: 'Modalidad', endpoint: '/modality', fields: [{ name: 'description', label: 'Descripción', type: 'text' }] },
  { key: 'paymentType', title: 'Tipo de Pago', endpoint: '/payment-type', fields: [{ name: 'description', label: 'Descripción', type: 'text' }] },
  { key: 'profession', title: 'Profesión', endpoint: '/profession', fields: [{ name: 'name', label: 'Nombre', type: 'text' }] },
  { key: 'institutionType', title: 'Tipo de Institución', endpoint: '/institution-type', fields: [{ name: 'description', label: 'Descripción', type: 'text' }] },

  // --- CATÁLOGO COMPLEJO ---
  { 
    key: 'institution', 
    title: 'Institución', 
    endpoint: '/institution', 
    // Le decimos que tiene dos campos para el formulario
    fields: [
      { name: 'name', label: 'Nombre', type: 'text' },
      // Y un campo de tipo 'select' que necesita cargar datos de otro endpoint
      { name: 'idInstitutionType', label: 'Tipo de Institución', type: 'select', endpoint: '/institution-type' }
    ],
    // También definimos las columnas que queremos ver en la tabla
    displayColumns: [
        { header: 'Nombre', field: 'name' },
        { header: 'Tipo', field: 'institutionType.description' } // Accedemos al campo anidado
    ]
  },
];

const CatalogsPage = () => {
  const [selectedCatalog, setSelectedCatalog] = useState(null);

  if (selectedCatalog) {
    return (
      <CatalogCrud 
        catalogInfo={selectedCatalog} 
        onBack={() => setSelectedCatalog(null)}
      />
    );
  }
  
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-dark-text-primary">Gestión de Catálogos</h1>
        <p className="text-dark-text-secondary mt-1">
          Administra todos tus catálogos desde un solo lugar. Haz clic en un catálogo para ver, crear, editar y eliminar registros.
        </p>
      </div>

      <div className="bg-dark-surface rounded-lg shadow-lg">
        <ul className="divide-y divide-dark-border">
          {catalogItems.map((item) => (
            <li key={item.key}>
              <button
                onClick={() => setSelectedCatalog(item)}
                className="w-full flex justify-between items-center p-4 text-left transition-colors hover:bg-slate-700/50"
              >
                <span className="font-medium text-dark-text-primary">{item.title}</span>
                <Icon path="M8.25 4.5l7.5 7.5-7.5 7.5" className="w-5 h-5 text-dark-text-secondary" />
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default CatalogsPage;