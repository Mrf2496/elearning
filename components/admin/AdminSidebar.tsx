import React from 'react';
import { AdminView } from '../../types';
import HomeIcon from '../icons/HomeIcon';
import UsersIcon from '../icons/UsersIcon';
import BuildingSimpleIcon from '../icons/BuildingSimpleIcon';
import BarChartIcon from '../icons/BarChartIcon';

interface AdminSidebarProps {
    activeView: AdminView;
    navigate: (path: string) => void;
}

const NavButton: React.FC<{
    onClick: () => void;
    label: string;
    icon: React.FC<{ className?: string }>;
    isActive: boolean;
}> = ({ onClick, label, icon: Icon, isActive }) => (
    <button
        onClick={onClick}
        className={`w-full text-left p-3 rounded-md transition-colors duration-200 group flex items-center space-x-3
      ${
        isActive
          ? 'bg-sky-500 text-white font-semibold shadow'
          : 'text-slate-600 hover:bg-slate-100'
      }
    `}
    >
        <Icon className="w-6 h-6" />
        <span className="text-sm font-medium">{label}</span>
    </button>
);

const AdminSidebar: React.FC<AdminSidebarProps> = ({ activeView, navigate }) => {
    return (
        <aside className="w-64 bg-white shadow-md flex-shrink-0 flex flex-col p-4">
            <div className="text-center py-4 border-b mb-4">
                <h2 className="text-lg font-bold text-slate-800">SARLAFT Admin</h2>
            </div>
            <nav className="flex-grow">
                <ul className="space-y-2">
                    <li>
                        <NavButton
                            onClick={() => navigate('/admin')}
                            label="Dashboard"
                            icon={HomeIcon}
                            isActive={activeView === AdminView.Dashboard}
                        />
                    </li>
                    <li>
                        <NavButton
                            onClick={() => navigate('/admin/users')}
                            label="Usuarios"
                            icon={UsersIcon}
                            isActive={activeView === AdminView.Users}
                        />
                    </li>
                    <li>
                        <NavButton
                            onClick={() => navigate('/admin/companies')}
                            label="Empresas"
                            icon={BuildingSimpleIcon}
                            isActive={activeView === AdminView.Companies}
                        />
                    </li>
                    <li>
                        <NavButton
                            onClick={() => navigate('/admin/reports')}
                            label="Reportes"
                            icon={BarChartIcon}
                            isActive={activeView === AdminView.Reports}
                        />
                    </li>
                </ul>
            </nav>
        </aside>
    );
};

export default AdminSidebar;
