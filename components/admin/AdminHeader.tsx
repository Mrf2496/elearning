import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import LogoutIcon from '../icons/LogoutIcon';
import UserIcon from '../icons/UserIcon';

interface AdminHeaderProps {
    navigate: (path: string) => void;
}

const AdminHeader: React.FC<AdminHeaderProps> = ({ navigate }) => {
    const { currentUser, logout } = useAuth();

    return (
        <header className="bg-white shadow-sm z-10">
            <div className="px-6 py-4 flex justify-between items-center">
                <h1 className="text-xl font-bold text-slate-800">Panel de Administración</h1>
                <div className="flex items-center space-x-4 text-sm">
                    {currentUser && (
                        <>
                            <div className="flex items-center space-x-2">
                                <UserIcon className="w-5 h-5 text-slate-600" />
                                <span className="font-semibold text-slate-700">{currentUser.name}</span>
                            </div>
                            <button onClick={() => navigate('/')} className="text-sky-600 hover:text-sky-800 font-semibold">
                                Ver Curso
                            </button>
                            <button onClick={logout} title="Cerrar Sesión" className="p-2 rounded-full text-slate-600 hover:bg-slate-100 transition-colors">
                                <LogoutIcon className="w-5 h-5" />
                            </button>
                        </>
                    )}
                </div>
            </div>
        </header>
    );
};

export default AdminHeader;
