import React from 'react';
import Icon from '../ui/Icon';

const Header = () => {
  return (
    <header className="flex items-center justify-between p-4 bg-dark-bg border-b border-dark-border h-16">
      {/* Barra de Búsqueda */}
      <div className="relative w-full max-w-xs">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <Icon path="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" className="w-5 h-5 text-dark-text-secondary" />
        </div>
        <input
          type="text"
          placeholder="Search..."
          className="w-full bg-dark-surface border border-dark-border rounded-lg py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-brand-accent text-dark-text-primary"
        />
      </div>

      {/* Iconos de la Derecha */}
      <div className="flex items-center space-x-4">
        <button className="text-dark-text-secondary hover:text-dark-text-primary">
          <Icon path="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" className="w-6 h-6" />
        </button>
        <div className="w-8 h-8 bg-brand-accent rounded-full flex items-center justify-center text-white font-bold">
          C
        </div>
      </div>
    </header>
  );
};

export default Header;
