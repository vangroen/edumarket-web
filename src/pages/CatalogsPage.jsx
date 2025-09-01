import React from 'react';
import Icon from '../components/ui/Icon';

// Lista de catálogos disponibles. En el futuro, podríamos hacer esto más dinámico.
const catalogItems = [
  { key: 'academicRank', title: 'Grado Académico' },
  { key: 'conceptType', title: 'Tipo de Concepto' },
  { key: 'courseType', title: 'Tipo de Curso' },
  { key: 'documentType', title: 'Tipo de Documento' },
  { key: 'installmentStatus', title: 'Estado de Cuota' },
  { key: 'institutionType', title: 'Tipo de Institución' },
  { key: 'modality', title: 'Modalidad' },
  { key: 'paymentType', title: 'Tipo de Pago' },
  { key: 'profession', title: 'Profesión' },
];

const CatalogsPage = () => {
  // Por ahora, el clic en un catálogo no hará nada, pero preparamos la función.
  const handleCatalogClick = (catalogKey) => {
    console.log(`Navegando al CRUD para: ${catalogKey}`);
    // Aquí irá la lógica para mostrar la tabla del catálogo seleccionado.
  };

  return (
    <div>
      {/* Encabezado de la página */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-dark-text-primary">Gestión de Catálogos</h1>
        <p className="text-dark-text-secondary mt-1">
          Administra todos tus catálogos desde un solo lugar. Haz clic en un catálogo para ver, crear, editar y eliminar registros.
        </p>
      </div>

      {/* Lista de Catálogos */}
      <div className="bg-dark-surface rounded-lg shadow-lg">
        <ul className="divide-y divide-dark-border">
          {catalogItems.map((item) => (
            <li key={item.key}>
              <button
                onClick={() => handleCatalogClick(item.key)}
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