import React, { useState, useEffect, useCallback } from 'react';
import { Company, User } from '../types';
import * as companyManagement from '../lib/companyManagement';
import { uploadLogo } from '../lib/storage';
import Card from './common/Card';
import Button from './common/Button';
import PencilIcon from './icons/PencilIcon';
import TrashIcon from './icons/TrashIcon';
import BuildingOfficeIcon from './icons/BuildingOfficeIcon';
import UserGroupIcon from './icons/UserGroupIcon';

const Modal: React.FC<{ isOpen: boolean; onClose: () => void; title: string; children: React.ReactNode; }> = ({ isOpen, onClose, title, children }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4" onClick={onClose}>
            <div className="bg-white rounded-lg shadow-xl w-full max-w-lg" onClick={e => e.stopPropagation()}>
                 <div className="p-6">
                    <h3 className="text-lg font-bold mb-4">{title}</h3>
                    {children}
                 </div>
            </div>
        </div>
    );
};

const CompanyManagement: React.FC = () => {
    const [companies, setCompanies] = useState<Company[]>([]);
    const [admins, setAdmins] = useState<Record<string, User | null>>({});
    const [userCounts, setUserCounts] = useState<Record<string, number>>({});
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCompany, setEditingCompany] = useState<Company | null>(null);
    const [logoFile, setLogoFile] = useState<File | null>(null);

    const fetchCompanies = useCallback(async () => {
        setLoading(true);
        const companyList = await companyManagement.getCompaniesList();
        setCompanies(companyList);
        
        const adminPromises = companyList.map(c => companyManagement.getAdminForCompany(c.administradorId || ''));
        const adminResults = await Promise.all(adminPromises);
        const adminMap: Record<string, User | null> = {};
        companyList.forEach((c, index) => {
            adminMap[c.id] = adminResults[index];
        });
        setAdmins(adminMap);
        
        const userCountPromises = companyList.map(c => companyManagement.countUsersInCompany(c.id));
        const userCountResults = await Promise.all(userCountPromises);
        const userCountMap: Record<string, number> = {};
        companyList.forEach((c, index) => {
            userCountMap[c.id] = userCountResults[index];
        });
        setUserCounts(userCountMap);

        setLoading(false);
    }, []);

    useEffect(() => {
        fetchCompanies();
    }, [fetchCompanies]);
    
    const openModal = (company: Company | null = null) => {
        setEditingCompany(company);
        setLogoFile(null);
        setIsModalOpen(true);
    };
    
    const closeModal = () => {
        setIsModalOpen(false);
        setEditingCompany(null);
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const data = Object.fromEntries(formData.entries()) as any;

        if (editingCompany) { // Editing existing company
            let logoUrl = editingCompany.logo;
            if (logoFile) {
                logoUrl = await uploadLogo(logoFile, editingCompany.id);
            }
            await companyManagement.editCompany(editingCompany.id, { ...data, logo: logoUrl });
        } else { // Creating new company
            const companyId = await companyManagement.createCompany(data);
            if (companyId && logoFile) {
                const logoUrl = await uploadLogo(logoFile, companyId);
                await companyManagement.editCompany(companyId, { logo: logoUrl });
            }
        }
        
        closeModal();
        fetchCompanies();
    };
    
    const handleToggleStatus = async (company: Company) => {
        if (userCounts[company.id] > 0 && company.activa) {
            alert("No se puede desactivar una empresa que tiene usuarios activos.");
            return;
        }
        await companyManagement.toggleCompanyStatus(company.id, company.activa);
        fetchCompanies();
    };

    if (loading) return <Card><p>Cargando empresas...</p></Card>;

    return (
        <Card>
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold">Gestión de Empresas</h3>
                <Button onClick={() => openModal()}>
                    <BuildingOfficeIcon className="w-5 h-5 mr-2 inline-block"/>
                    Crear Empresa
                </Button>
            </div>
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">NIT</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Administrador</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Usuarios</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {companies.map(company => (
                            <tr key={company.id}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{company.nombre}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{company.nit}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{admins[company.id]?.name || <span className="text-xs italic text-gray-400">Sin asignar</span>}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{userCounts[company.id] || 0}</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <button onClick={() => handleToggleStatus(company)} title={`Cambiar a ${company.activa ? 'Inactiva' : 'Activa'}`} className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${company.activa ? 'bg-green-100 text-green-800 hover:bg-green-200' : 'bg-red-100 text-red-800 hover:bg-red-200'}`}>
                                        {company.activa ? 'Activa' : 'Inactiva'}
                                    </button>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                                    <button onClick={() => openModal(company)} title="Editar" className="text-sky-600 hover:text-sky-900 p-1 rounded-full hover:bg-sky-100"><PencilIcon className="w-5 h-5"/></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <Modal isOpen={isModalOpen} onClose={closeModal} title={editingCompany ? 'Editar Empresa' : 'Crear Empresa'}>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                         <div>
                            <label htmlFor="nombre" className="block text-sm font-medium text-gray-700">Nombre de la Empresa</label>
                            <input id="nombre" name="nombre" type="text" defaultValue={editingCompany?.nombre} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md" required/>
                        </div>
                         <div>
                            <label htmlFor="nit" className="block text-sm font-medium text-gray-700">NIT</label>
                            <input id="nit" name="nit" type="text" defaultValue={editingCompany?.nit} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md" required/>
                        </div>
                    </div>
                    <div>
                        <label htmlFor="direccion" className="block text-sm font-medium text-gray-700">Dirección</label>
                        <input id="direccion" name="direccion" type="text" defaultValue={editingCompany?.direccion} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md" required/>
                    </div>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="telefono" className="block text-sm font-medium text-gray-700">Teléfono</label>
                            <input id="telefono" name="telefono" type="text" defaultValue={editingCompany?.telefono} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md" required/>
                        </div>
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                            <input id="email" name="email" type="email" defaultValue={editingCompany?.email} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md" required/>
                        </div>
                    </div>
                     <div>
                        <label htmlFor="logo" className="block text-sm font-medium text-gray-700">Logo de la Empresa</label>
                        <input id="logo" name="logo" type="file" onChange={e => setLogoFile(e.target.files ? e.target.files[0] : null)} accept="image/*" className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100"/>
                        {editingCompany?.logo && !logoFile && <img src={editingCompany.logo} alt="Logo actual" className="mt-2 h-16 w-auto object-contain rounded"/>}
                        {logoFile && <p className="text-xs text-gray-500 mt-1">Nuevo logo seleccionado: {logoFile.name}</p>}
                    </div>

                    <div className="mt-6 flex justify-end space-x-2">
                        <Button type="button" variant="secondary" onClick={closeModal}>Cancelar</Button>
                        <Button type="submit">{editingCompany ? 'Guardar Cambios' : 'Crear Empresa'}</Button>
                    </div>
                </form>
            </Modal>
        </Card>
    );
};

export default CompanyManagement;
