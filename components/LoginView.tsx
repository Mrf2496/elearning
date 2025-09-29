import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import Card from './common/Card';
import Button from './common/Button';
import HomeIcon from './icons/HomeIcon';

const LoginView: React.FC = () => {
  const [isLoginView, setIsLoginView] = useState(true);
  const [cedula, setCedula] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const { login, register } = useAuth();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFeedback(null);
    let result;
    if (isLoginView) {
      result = await login(cedula, password);
    } else {
      if(!name) {
          setFeedback({ type: 'error', message: 'El nombre es obligatorio.' });
          return;
      }
      result = await register(name, cedula, password);
      if (result.success) {
        setIsLoginView(true); // Switch to login view after successful registration
        setCedula('');
        setPassword('');
        setName('');
      }
    }
    setFeedback({ type: result.success ? 'success' : 'error', message: result.message });
  };
  
  const toggleView = () => {
    setIsLoginView(!isLoginView);
    setFeedback(null);
    setCedula('');
    setPassword('');
    setName('');
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col justify-center items-center p-4">
        <div className="max-w-md w-full mx-auto">
            <div className="flex justify-center items-center mb-6 text-slate-700">
                <HomeIcon className="w-10 h-10 mr-3 text-sky-500" />
                <div>
                    <h1 className="text-2xl font-bold">Curso E-learning SARLAFT</h1>
                    <p className="text-sm">Sector Solidario</p>
                </div>
            </div>
            <Card className="shadow-2xl">
                <h2 className="text-2xl font-bold text-center text-slate-800 mb-6">
                {isLoginView ? 'Iniciar Sesión' : 'Crear Cuenta'}
                </h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                {!isLoginView && (
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nombre Completo</label>
                        <input
                            type="text"
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                            required
                        />
                    </div>
                )}
                <div>
                    <label htmlFor="cedula" className="block text-sm font-medium text-gray-700">Cédula</label>
                    <input
                        type="text"
                        id="cedula"
                        value={cedula}
                        onChange={(e) => setCedula(e.target.value.replace(/\D/g, ''))}
                        className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                        required
                    />
                </div>
                <div>
                    <label htmlFor="password"className="block text-sm font-medium text-gray-700">Contraseña</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                        required
                    />
                </div>
                {feedback && (
                    <div className={`p-3 rounded-md text-sm text-center ${
                        feedback.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                        {feedback.message}
                    </div>
                )}
                <div>
                    <Button type="submit" className="w-full">
                        {isLoginView ? 'Ingresar' : 'Registrarse'}
                    </Button>
                </div>
                </form>
                <div className="mt-4 text-center text-sm">
                <button onClick={toggleView} className="text-sky-600 hover:text-sky-800 hover:underline">
                    {isLoginView ? '¿No tienes cuenta? Regístrate aquí' : '¿Ya tienes cuenta? Inicia sesión'}
                </button>
                </div>
            </Card>
        </div>
    </div>
  );
};

export default LoginView;
