import React from 'react';
import HomeIcon from '../icons/HomeIcon';
import UserIcon from '../icons/UserIcon';
import LogoutIcon from '../icons/LogoutIcon';
import { useAuth } from '../../hooks/useAuth';
import MenuIcon from '../icons/MenuIcon';
import CogIcon from '../icons/CogIcon';

interface HeaderProps {
  onToggleSidebar: () => void;
  navigate: (path: string) => void;
}

const Header: React.FC<HeaderProps> = ({ onToggleSidebar, navigate }) => {
  const { currentUser, logout } = useAuth();
  
  return (
    <header className="bg-sky-500 shadow-md z-10 text-white no-print">
      <div className="mx-auto px-6 py-3 flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <button className="md:hidden p-1 -ml-2" onClick={onToggleSidebar}>
              <MenuIcon className="w-6 h-6" />
          </button>
          <div className="flex items-center space-x-2">
            <HomeIcon className="w-6 h-6" />
            <span className="text-lg font-semibold hidden sm:block">Inicio</span>
          </div>
          <div>
            <h1 className="text-lg sm:text-xl font-bold">
              Curso E-learning SARLAFT
            </h1>
            <div className="text-xs sm:text-sm text-sky-200">Sector Solidario</div>
          </div>
        </div>
        <div className="flex items-center space-x-2 text-sm">
          {currentUser && (
            <>
              <div className="flex items-center space-x-2">
                <UserIcon className="w-5 h-5" />
                <span className="font-semibold">{currentUser.name}</span>
              </div>
              {currentUser.role === 'superadmin' && (
                <button onClick={() => navigate('/admin')} title="Panel de Administración" className="p-2 rounded-full hover:bg-sky-600 transition-colors">
                  <CogIcon className="w-5 h-5" />
                </button>
              )}
              <button onClick={logout} title="Cerrar Sesión" className="p-2 rounded-full hover:bg-sky-600 transition-colors">
                  <LogoutIcon className="w-5 h-5" />
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
