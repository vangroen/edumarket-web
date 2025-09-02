import React from 'react';
import Icon from '../ui/Icon';

const navItems = [
  { key: 'dashboard', title: 'Dashboard', icon: "M3.75 3v11.25A2.25 2.25 0 006 16.5h12M3.75 3h16.5M3.75 3A2.25 2.25 0 001.5 5.25v13.5A2.25 2.25 0 003.75 21h16.5a2.25 2.25 0 002.25-2.25V5.25A2.25 2.25 0 0018.75 3h-1.5m-13.5 0v11.25c0 .621.504 1.125 1.125 1.125h11.25c.621 0 1.125-.504 1.125-1.125V3" },
  { key: 'sales', title: 'Ventas', icon: "M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.75A.75.75 0 013 4.5h.75m0 0a.75.75 0 01.75.75v.75m0 0h.75a.75.75 0 010 1.5h-.75m0 0v.75a.75.75 0 01-.75.75h-.75m0 0a.75.75 0 01-.75-.75v-.75m0 0h-.75a.75.75 0 010-1.5h.75M15 4.5v.75A.75.75 0 0114.25 6h-.75m0 0v-.75a.75.75 0 01.75-.75h.75m0 0a.75.75 0 01.75.75v.75m0 0h.75a.75.75 0 010 1.5h-.75m0 0v.75a.75.75 0 01-.75.75h-.75m0 0a.75.75 0 01-.75-.75v-.75M7.5 12h-.75a.75.75 0 000 1.5h.75a.75.75 0 000-1.5z" },
  { key: 'courses', title: 'Cursos', icon: "M12 6.25278C12 6.25278 10.8333 5 8.5 5C6.16667 5 5 6.25278 5 6.25278V19.5C5 19.5 6.16667 18.2472 8.5 18.2472C10.8333 18.2472 12 19.5 12 19.5M12 6.25278C12 6.25278 13.1667 5 15.5 5C17.8333 5 19 6.25278 19 6.25278V19.5C19 19.5 17.8333 18.2472 15.5 18.2472C13.1667 18.2472 12 19.5 12 19.5" },
  { key: 'students', title: 'Estudiantes', icon: "M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" },
  { key: 'agents', title: 'Agentes', icon: "M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" },
  { key: 'catalogs', title: 'Catálogos', icon: "M2.25 12.75V12A2.25 2.25 0 014.5 9.75h15A2.25 2.25 0 0121.75 12v.75m-8.69-6.44l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z" },
];

const Sidebar = ({ activeView, setActiveView }) => {
  return (
    <aside className="w-64 bg-dark-surface flex-shrink-0 flex flex-col">
      <div className="flex items-center p-4 border-b border-dark-border h-16">
        <Icon path="M21 7.5l-9-5.25L3 7.5m18 0l-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9" className="w-8 h-8 text-dark-text-primary mr-2" />
        <h1 className="text-xl font-bold text-dark-text-primary">CTCSE</h1>
      </div>
      <nav className="p-4 flex-1">
        <ul>
          {navItems.map((item) => {
            const isActive = activeView === item.key;
            return (
              <li key={item.key}>
                <button
                  onClick={() => setActiveView(item.key)}
                  className={`w-full flex items-center p-3 my-1 rounded-lg text-left transition-colors
                    ${isActive
                      ? 'bg-brand-accent text-white shadow-lg'
                      : 'text-dark-text-secondary hover:bg-slate-700 hover:text-dark-text-primary'
                    }`}
                >
                  <Icon path={item.icon} className="w-5 h-5 mr-3" />
                  <span className="font-medium">{item.title}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;