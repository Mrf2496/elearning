import React from 'react';
import { AdminView } from '../../types';
import AdminHeader from './AdminHeader';
import AdminSidebar from './AdminSidebar';
import AdminDashboard from './AdminDashboard';
import UsersView from './UsersView';
import CompaniesView from './CompaniesView';
import ReportsView from './ReportsView';

interface AdminLayoutProps {
    route: string;
    navigate: (path: string) => void;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ route, navigate }) => {
    
    const getActiveViewFromRoute = (): AdminView => {
        if (route.endsWith('/users')) return AdminView.Users;
        if (route.endsWith('/companies')) return AdminView.Companies;
        if (route.endsWith('/reports')) return AdminView.Reports;
        return AdminView.Dashboard;
    };
    const activeView = getActiveViewFromRoute();

    const renderContent = () => {
        switch (activeView) {
            case AdminView.Dashboard:
                return <AdminDashboard />;
            case AdminView.Users:
                return <UsersView />;
            case AdminView.Companies:
                return <CompaniesView />;
            case AdminView.Reports:
                return <ReportsView />;
            default:
                return <AdminDashboard />;
        }
    };

    return (
        <div className="min-h-screen bg-slate-200 flex">
            <AdminSidebar activeView={activeView} navigate={navigate} />
            <div className="flex-1 flex flex-col">
                <AdminHeader navigate={navigate} />
                <main className="p-6 md:p-8 flex-1 overflow-y-auto">
                    {renderContent()}
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;
