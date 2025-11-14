
import React, { useState, useEffect, useMemo } from 'react';
import { db } from '../../lib/firebase.config';
import { collection, onSnapshot, query, doc, updateDoc, orderBy } from 'firebase/firestore';
import { User } from '../../types';
import Card from '../common/Card';
import { useAuth } from '../../hooks/useAuth';
import PencilIcon from '../icons/PencilIcon';
import Button from '../common/Button';

const UsersView: React.FC = () => {
    const { currentUser } = useAuth();
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    
    // Modal state
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<User | null>(null);
    const [formData, setFormData] = useState({ name: '', email: '' });
    
    useEffect(() => {
        const q = query(collection(db, 'users'), orderBy('name', 'asc'));
        const unsubscribe = onSnapshot(q, 
            (querySnapshot) => {
                const usersData = querySnapshot.docs.map(doc => ({ ...doc.data(), uid: doc.id })) as User[];
                setUsers(usersData);
                setLoading(false);
            }, 
            (err) => {
                console.error(err);
                setError("No se pudo cargar la lista de usuarios. Por favor, intente de nuevo más tarde.");
                setLoading(false);
            }
        );
        return () => unsubscribe();
    }, []);

    const handleToggleActive = async (user: User) => {
        if (user.role === 'superadmin') return;
        try {
            const userDocRef = doc(db, 'users', user.uid);
            await updateDoc(userDocRef, { active: !user.active });
        } catch (err) {
            console.error("Error toggling user status:", err);
            alert("No se pudo actualizar el estado del usuario.");
        }
    };
    
    const handleEditClick = (user: User) => {
        setEditingUser(user);
        setFormData({ name: user.name, email: user.email });
        setIsModalOpen(true);
    };

    const handleModalClose = () => {
        setIsModalOpen(false);
        setEditingUser(null);
    };
    
    const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSaveChanges = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingUser) return;
        try {
            const userDocRef = doc(db, 'users', editingUser.uid);
            await updateDoc(userDocRef, {
                name: formData.name,
                email: formData.email,
            });
            handleModalClose();
        } catch (err) {
            console.error("Error updating user:", err);
            alert("No se pudo guardar los cambios del usuario.");
        }
    };

    const isSuperAdmin = (user: User) => user.role === 'superadmin';

    const filteredUsers = useMemo(() => {
        return users.filter(user =>
            user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.cedula.includes(searchTerm)
        );
    }, [users, searchTerm]);

    return (
        <Card>
            <style>{`
                .switch { position: relative; display: inline-block; width: 44px; height: 24px; }
                .switch input { opacity: 0; width: 0; height: 0; }
                .slider { position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0; background-color: #ccc; transition: .4s; }
                .slider:before { position: absolute; content: ""; height: 16px; width: 16px; left: 4px; bottom: 4px; background-color: white; transition: .4s; }
                input:checked + .slider { background-color: #22c55e; }
                input:focus + .slider { box-shadow: 0 0 1px #22c55e; }
                input:checked + .slider:before { transform: translateX(20px); }
                .slider.round { border-radius: 24px; }
                .slider.round:before { border-radius: 50%; }
                .disabled-switch .slider { background-color: #e5e7eb; cursor: not-allowed; }
            `}</style>
            
            <h2 className="text-2xl font-bold text-slate-800 mb-4">Gestión de Usuarios</h2>
            <input
                type="text"
                placeholder="Buscar por nombre, cédula o email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full max-w-sm p-2 border border-gray-300 rounded-md mb-6"
            />
            
            {loading && <p>Cargando usuarios...</p>}
            {error && <p className="text-red-500">{error}</p>}
            
            {!loading && !error && (
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white">
                        <thead className="bg-slate-50">
                            <tr>
                                <th className="py-3 px-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Nombre</th>
                                <th className="py-3 px-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Cédula</th>
                                <th className="py-3 px-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Email</th>
                                <th className="py-3 px-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Rol</th>
                                <th className="py-3 px-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Estado</th>
                                <th className="py-3 px-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200">
                            {filteredUsers.map(user => (
                                <tr key={user.uid} className="hover:bg-slate-50">
                                    <td className="py-4 px-4 whitespace-nowrap text-sm font-medium text-slate-900">{user.name}</td>
                                    <td className="py-4 px-4 whitespace-nowrap text-sm text-slate-500">{user.cedula}</td>
                                    <td className="py-4 px-4 whitespace-nowrap text-sm text-slate-500">{user.email}</td>
                                    <td className="py-4 px-4 whitespace-nowrap text-sm text-slate-500 capitalize">{user.role}</td>
                                    <td className="py-4 px-4 whitespace-nowrap">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${user.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                            {user.active ? 'Activo' : 'Inactivo'}
                                        </span>
                                    </td>
                                    <td className="py-4 px-4 whitespace-nowrap text-sm font-medium">
                                        <div className="flex items-center space-x-3">
                                            <button 
                                                onClick={() => handleEditClick(user)} 
                                                disabled={isSuperAdmin(user)}
                                                className="text-sky-600 hover:text-sky-900 disabled:text-slate-300 disabled:cursor-not-allowed"
                                                title="Editar Usuario"
                                            >
                                                <PencilIcon className="w-5 h-5" />
                                            </button>
                                            <label className={`switch ${isSuperAdmin(user) ? 'disabled-switch' : ''}`} title={user.active ? "Desactivar Usuario" : "Activar Usuario"}>
                                                <input 
                                                    type="checkbox"
                                                    checked={!!user.active}
                                                    onChange={() => handleToggleActive(user)}
                                                    disabled={isSuperAdmin(user)}
                                                />
                                                <span className="slider round"></span>
                                            </label>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {isModalOpen && editingUser && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-md" onClick={(e) => e.stopPropagation()}>
                        <form onSubmit={handleSaveChanges}>
                            <div className="p-6">
                                <h3 className="text-xl font-bold text-slate-800 mb-4">Editar Usuario</h3>
                                <div className="space-y-4">
                                    <div>
                                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nombre Completo</label>
                                        <input type="text" name="name" id="name" value={formData.name} onChange={handleFormChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500"/>
                                    </div>
                                    <div>
                                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">Correo Electrónico</label>
                                        <input type="email" name="email" id="email" value={formData.email} onChange={handleFormChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500"/>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Cédula</label>
                                        <p className="mt-1 block w-full px-3 py-2 bg-slate-100 text-slate-500 border border-gray-300 rounded-md">{editingUser.cedula}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-slate-50 px-6 py-3 flex justify-end space-x-3 rounded-b-lg">
                                <Button type="button" variant="secondary" onClick={handleModalClose}>Cancelar</Button>
                                <Button type="submit">Guardar Cambios</Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </Card>
    );
};

export default UsersView;
