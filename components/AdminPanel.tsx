import React, { useState, useEffect, useCallback } from 'react';
import { User, Company } from '../types';
import * as userManagement from '../lib/userManagement';
import * as companyManagement from '../lib/companyManagement';
import Card from './common/Card';
import Button from './common/Button';
import PencilIcon from './icons/PencilIcon';
import TrashIcon from './icons/TrashIcon';
import KeyIcon from './icons/KeyIcon';
import RefreshIcon from './icons/RefreshIcon';
import ShieldCheckIcon from './icons/ShieldCheckIcon';
import UserPlusIcon from './icons/UserPlusIcon';
import { useAuth } from '../hooks/useAuth';
import CompanyManagement from './CompanyManagement';


// Modal component
const Modal: React.FC<{ isOpen: boolean; onClose: () => void; title: string; children: React.ReactNode; }> = ({ isOpen, onClose, title, children }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4" onClick={onClose}>
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md" onClick={e => e.stopPropagation()}>
                 <div className="p-6">
                    <h3 className="text-lg font-bold mb-4">{title}</h3>
                    {children}
                 </div>
            </div>
        </div>
    );
};

const UserManagementPanel: React.FC = () => {
    const { register, logout } = useAuth();
    const [users, setUsers] = useState<User[]>([]);
    const [companies, setCompanies] = useState<Company[]>([]);
    const [loading, setLoading] = useState(true);
    const [editingUser, setEditingUser] = useState<User | null>(null);
    const [userToDelete, setUserToDelete] = useState<User | null>(null);
    const [userToResetPass, setUserToResetPass] = useState<User | null>(null);
    const [userToRestore, setUserToRestore] = useState<User | null>(null);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [newUser, setNewUser] = useState({ name: '', cedula: '', email: '', password: '', empresaId: '' });
    const [feedback, setFeedback] = useState<{ type: 'success' | 'error', message: string } | null>(null);
    
    const fetchUsers = useCallback(async () => {
        setLoading(true);
        const userList = await userManagement.getUsersList();
        setUsers(userList);
        setLoading(false);
    }, []);

    useEffect(() => {
        fetchUsers();
        companyManagement.getCompaniesList().then(setCompanies);
    }, [fetchUsers]);

    const handleEditSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!editingUser) return;
        await userManagement.editUser(editingUser.uid, { name: editingUser.name, empresaId: editingUser.empresaId });
        setEditingUser(null);
        fetchUsers();
    };
    
    const handleToggleStatus = async (uid: string, currentStatus: boolean) => {
        await userManagement.toggleUserStatus(uid, currentStatus);
        fetchUsers();
    };

    const handleDelete = async () => {
        if (!userToDelete) return;
        await userManagement.deleteUser(userToDelete.uid);
        setUserToDelete(null);
        fetchUsers();
        alert(`Usuario ${userToDelete.name} eliminado. Recuerde eliminar el usuario de Firebase Authentication manualmente si es necesario.`);
    };
    
    const handleResetPassword = async () => {
        if(!userToResetPass) return;
        const result = await userManagement.resetUserPassword(userToResetPass.email);
        alert(result.message);
        setUserToResetPass(null);
    };
    
    const handleRestoreData = async () => {
        if(!userToRestore) return;
        await userManagement.restoreUserData(userToRestore.uid);
        alert(`Se ha restablecido el progreso del curso para ${userToRestore.name}.`);
        setUserToRestore(null);
    };

    const handleCreateUserSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setFeedback(null);
        const result = await register(newUser.name, newUser.cedula, newUser.email, newUser.password, newUser.empresaId);
        if (result.success) {
            alert('Usuario creado exitosamente. Por razones de seguridad, serás desconectado. Por favor, inicia sesión de nuevo.');
            logout();
        } else {
            setFeedback({ type: 'error', message: result.message });
        }
    };
    
    const openCreateModal = () => {
        setNewUser({ name: '', cedula: '', email: '', password: '', empresaId: '' });
        setFeedback(null);
        setIsCreateModalOpen(true);
    };

    if (loading) return <Card><p>Cargando usuarios...</p></Card>;

    return (
        <Card>
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold">Gestión de Usuarios</h3>
                <Button onClick={openCreateModal}>
                    <UserPlusIcon className="w-5 h-5 mr-2 inline-block"/>
                    Crear Usuario
                </Button>
            </div>
            <div className="overflow-x-auto">
                {/* User table JSX from original component */}
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cédula</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Empresa</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {users.map(user => (
                            <tr key={user.uid}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{user.name}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.cedula}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{companies.find(c => c.id === user.empresaId)?.nombre || 'N/A'}</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <button onClick={() => handleToggleStatus(user.uid, user.isActive)} title={`Cambiar a ${user.isActive ? 'Inactivo' : 'Activo'}`} className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${user.isActive ? 'bg-green-100 text-green-800 hover:bg-green-200' : 'bg-red-100 text-red-800 hover:bg-red-200'}`}>
                                        {user.isActive ? 'Activo' : 'Inactivo'}
                                    </button>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                                    <button onClick={() => setEditingUser(user)} title="Editar" className="text-sky-600 hover:text-sky-900 p-1 rounded-full hover:bg-sky-100"><PencilIcon className="w-5 h-5"/></button>
                                    <button onClick={() => setUserToResetPass(user)} title="Resetear Contraseña" className="text-yellow-600 hover:text-yellow-900 p-1 rounded-full hover:bg-yellow-100"><KeyIcon className="w-5 h-5"/></button>
                                    <button onClick={() => setUserToRestore(user)} title="Resetear Progreso" className="text-blue-600 hover:text-blue-900 p-1 rounded-full hover:bg-blue-100"><RefreshIcon className="w-5 h-5"/></button>
                                    <button onClick={() => setUserToDelete(user)} title="Eliminar" className="text-red-600 hover:text-red-900 p-1 rounded-full hover:bg-red-100"><TrashIcon className="w-5 h-5"/></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
             {/* Modals go here */}
             <Modal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} title="Crear Nuevo Usuario">
                <form onSubmit={handleCreateUserSubmit}>
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="new-name" className="block text-sm font-medium text-gray-700">Nombre Completo</label>
                            <input id="new-name" type="text" value={newUser.name} onChange={e => setNewUser({...newUser, name: e.target.value})} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md" required/>
                        </div>
                        <div>
                            <label htmlFor="new-cedula" className="block text-sm font-medium text-gray-700">Cédula</label>
                            <input id="new-cedula" type="text" value={newUser.cedula} onChange={e => setNewUser({...newUser, cedula: e.target.value.replace(/\D/g, '')})} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md" required/>
                        </div>
                        <div>
                            <label htmlFor="new-email" className="block text-sm font-medium text-gray-700">Email</label>
                            <input id="new-email" type="email" value={newUser.email} onChange={e => setNewUser({...newUser, email: e.target.value})} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md" required/>
                        </div>
                        <div>
                            <label htmlFor="new-password"className="block text-sm font-medium text-gray-700">Contraseña Temporal</label>
                            <input id="new-password" type="password" value={newUser.password} onChange={e => setNewUser({...newUser, password: e.target.value})} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md" required/>
                        </div>
                         <div>
                            <label htmlFor="new-empresa" className="block text-sm font-medium text-gray-700">Empresa</label>
                            <select id="new-empresa" value={newUser.empresaId} onChange={e => setNewUser({...newUser, empresaId: e.target.value})} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md" required>
                                <option value="">Seleccione una empresa</option>
                                {companies.map(c => <option key={c.id} value={c.id}>{c.nombre}</option>)}
                            </select>
                        </div>
                        {feedback && (
                            <div className={`p-3 rounded-md text-sm text-center ${ feedback.type === 'error' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800' }`}>
                                {feedback.message}
                            </div>
                        )}
                    </div>
                    <div className="mt-6 flex justify-end space-x-2">
                        <Button type="button" variant="secondary" onClick={() => setIsCreateModalOpen(false)}>Cancelar</Button>
                        <Button type="submit">Crear Usuario</Button>
                    </div>
                </form>
            </Modal>


            <Modal isOpen={!!editingUser} onClose={() => setEditingUser(null)} title="Editar Usuario">
                {editingUser && (
                    <form onSubmit={handleEditSubmit}>
                        <div className="space-y-4">
                            <div>
                                <label htmlFor="edit-name" className="block text-sm font-medium text-gray-700">Nombre Completo</label>
                                <input id="edit-name" type="text" value={editingUser.name} onChange={e => setEditingUser({ ...editingUser, name: e.target.value })} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md" required/>
                            </div>
                            <div>
                                <label htmlFor="edit-empresa" className="block text-sm font-medium text-gray-700">Empresa</label>
                                <select id="edit-empresa" value={editingUser.empresaId} onChange={e => setEditingUser({ ...editingUser, empresaId: e.target.value })} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md" required>
                                    <option value="">Seleccione una empresa</option>
                                    {companies.map(c => <option key={c.id} value={c.id}>{c.nombre}</option>)}
                                </select>
                            </div>
                        </div>
                        <div className="mt-6 flex justify-end space-x-2">
                            <Button type="button" variant="secondary" onClick={() => setEditingUser(null)}>Cancelar</Button>
                            <Button type="submit">Guardar Cambios</Button>
                        </div>
                    </form>
                )}
            </Modal>

            <Modal isOpen={!!userToDelete} onClose={() => setUserToDelete(null)} title="Confirmar Eliminación">
                {userToDelete && (
                    <div>
                        <p>¿Estás seguro de que quieres eliminar al usuario <strong>{userToDelete.name}</strong>?</p>
                        <p className="text-sm text-red-600 mt-2">Esta acción no se puede deshacer y también eliminará su progreso en el curso.</p>
                        <div className="mt-6 flex justify-end space-x-2">
                            <Button type="button" variant="secondary" onClick={() => setUserToDelete(null)}>Cancelar</Button>
                            <Button onClick={handleDelete} className="bg-red-600 hover:bg-red-700 focus:ring-red-500 text-white">Eliminar</Button>
                        </div>
                    </div>
                )}
            </Modal>
            
            <Modal isOpen={!!userToResetPass} onClose={() => setUserToResetPass(null)} title="Confirmar Reseteo de Contraseña">
                {userToResetPass && (
                    <div>
                        <p>¿Estás seguro de que quieres enviar un correo para restablecer la contraseña del usuario <strong>{userToResetPass.name}</strong> (Email: {userToResetPass.email})?</p>
                        <div className="mt-6 flex justify-end space-x-2">
                            <Button type="button" variant="secondary" onClick={() => setUserToResetPass(null)}>Cancelar</Button>
                            <Button onClick={handleResetPassword}>Sí, Enviar Correo</Button>
                        </div>
                    </div>
                )}
            </Modal>

             <Modal isOpen={!!userToRestore} onClose={() => setUserToRestore(null)} title="Confirmar Reseteo de Progreso">
                {userToRestore && (
                    <div>
                        <p>¿Estás seguro de que quieres borrar todo el progreso del curso para el usuario <strong>{userToRestore.name}</strong>?</p>
                        <p className="text-sm text-red-600 mt-2">Esta acción es irreversible.</p>
                        <div className="mt-6 flex justify-end space-x-2">
                            <Button type="button" variant="secondary" onClick={() => setUserToRestore(null)}>Cancelar</Button>
                            <Button onClick={handleRestoreData} className="bg-red-600 hover:bg-red-700 focus:ring-red-500 text-white">Sí, Resetear Progreso</Button>
                        </div>
                    </div>
                )}
            </Modal>
        </Card>
    );
};


const AdminPanel: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'users' | 'companies'>('users');

    return (
         <div className="space-y-6">
            <Card className="border-l-4 border-slate-700">
                <div className="flex items-center space-x-3">
                    <ShieldCheckIcon className="w-8 h-8 text-slate-700"/>
                    <div>
                        <h2 className="text-3xl font-bold text-slate-800">Panel de Administración</h2>
                        <p className="mt-1 text-slate-600">Gestión de usuarios y empresas del sistema.</p>
                    </div>
                </div>
            </Card>

            <div className="border-b border-gray-200">
                <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                    <button
                        onClick={() => setActiveTab('users')}
                        className={`${activeTab === 'users' ? 'border-orange-500 text-orange-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                    >
                        Gestión de Usuarios
                    </button>
                    <button
                        onClick={() => setActiveTab('companies')}
                        className={`${activeTab === 'companies' ? 'border-orange-500 text-orange-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                    >
                        Gestión de Empresas
                    </button>
                </nav>
            </div>
            
            <div>
                {activeTab === 'users' && <UserManagementPanel />}
                {activeTab === 'companies' && <CompanyManagement />}
            </div>
        </div>
    )
};

export default AdminPanel;