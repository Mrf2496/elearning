import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import Card from './common/Card';
import Button from './common/Button';
import HomeIcon from './icons/HomeIcon';
import { User } from '../types';

const LoginView: React.FC = () => {
  const [isLoginView, setIsLoginView] = useState(true);
  const [email, setEmail] = useState(''); // Used for registration
  const [cedulaLogin, setCedulaLogin] = useState(''); // Used for login
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [cedula, setCedula] = useState(''); // Used for registration
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const { login, publicRegister } = useAuth();

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFeedback(null);
    if (!cedulaLogin || !password) {
        setFeedback({ type: 'error', message: 'Todos los campos son obligatorios.'});
        return;
    }
    const result = await login(cedulaLogin, password);
    if (result && !result.success) {
      setFeedback({ type: 'error', message: result.message });
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFeedback(null);
    if (!name || !email || !cedula || !password) {
        setFeedback({ type: 'error', message: 'Todos los campos son obligatorios.'});
        return;
    }
    if (!publicRegister) {
      setFeedback({ type: 'error', message: 'La función de registro no está disponible.' });
      return;
    }
    const result = await publicRegister(name, cedula, email, password);
    if (result.success) {
      setFeedback({ type: 'success', message: result.message });
      setIsLoginView(true);
      // Clear fields after successful registration
      setName('');
      setCedula('');
      setEmail('');
      setPassword('');
    } else {
      setFeedback({ type: 'error', message: result.message });
    }
  };
  
  const toggleView = (view: 'login' | 'register') => {
    setIsLoginView(view === 'login');
    setFeedback(null);
    // Reset fields when switching views
    setEmail('');
    setCedulaLogin('');
    setPassword('');
    setName('');
    setCedula('');
  }

  const commonInputStyle = "mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm text-gray-900";

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
          <h2 className="text-center text-2xl font-bold text-gray-800 mb-6">
            {isLoginView ? 'Iniciar Sesión' : 'Crear Cuenta'}
          </h2>
          {isLoginView ? (
            <form onSubmit={handleLoginSubmit} className="space-y-4 animate-fade-in">
              <div>
                <label htmlFor="cedula-login" className="block text-sm font-medium text-gray-700">
                  Cédula
                </label>
                <input
                  type="text" id="cedula-login" value={cedulaLogin} onChange={(e) => setCedulaLogin(e.target.value.replace(/\D/g, ''))}
                  className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                  placeholder="Número de cédula"
                  required
                />
              </div>
              <div>
                <label htmlFor="password-login" className="block text-sm font-medium text-gray-700">
                  Contraseña
                </label>
                <input
                  type="password" id="password-login" value={password} onChange={(e) => setPassword(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                  required
                />
              </div>
              {feedback && (
                <div className={`p-3 rounded-md text-sm text-center ${feedback.type === 'error' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                  {feedback.message}
                </div>
              )}
              <div>
                <Button type="submit" className="w-full">Ingresar</Button>
              </div>
               <p className="text-center text-sm pt-4">
                  ¿No tienes cuenta?{' '}
                  <button type="button" onClick={() => toggleView('register')} className="font-medium text-orange-600 hover:text-orange-500">
                      Regístrate
                  </button>
              </p>
            </form>
          ) : (
            <form onSubmit={handleRegisterSubmit} className="space-y-4 animate-fade-in">
               <div>
                  <label htmlFor="name-register" className="block text-sm font-medium text-gray-700">Nombre Completo</label>
                  <input type="text" id="name-register" value={name} onChange={(e) => setName(e.target.value)} className={commonInputStyle} placeholder="Tu nombre completo" required/>
               </div>
               <div>
                  <label htmlFor="email-register" className="block text-sm font-medium text-gray-700">Correo Electrónico</label>
                  <input type="email" id="email-register" value={email} onChange={(e) => setEmail(e.target.value)} className={commonInputStyle} placeholder="tu@correo.com" required/>
               </div>
               <div>
                  <label htmlFor="cedula-register" className="block text-sm font-medium text-gray-700">Cédula</label>
                  <input type="text" id="cedula-register" value={cedula} onChange={(e) => setCedula(e.target.value.replace(/\D/g, ''))} className={commonInputStyle} placeholder="Número de cédula" required/>
               </div>
               <div>
                  <label htmlFor="password-register" className="block text-sm font-medium text-gray-700">Contraseña</label>
                  <input type="password" id="password-register" value={password} onChange={(e) => setPassword(e.target.value)} className={commonInputStyle} placeholder="Mínimo 6 caracteres" required/>
               </div>
              {feedback && (
                <div className={`p-3 rounded-md text-sm text-center ${feedback.type === 'error' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                  {feedback.message}
                </div>
              )}
               <div>
                  <Button type="submit" className="w-full">Registrarse</Button>
               </div>
               <p className="text-center text-sm pt-4">
                  ¿Ya tienes cuenta?{' '}
                  <button type="button" onClick={() => toggleView('login')} className="font-medium text-orange-600 hover:text-orange-500">
                      Inicia sesión
                  </button>
              </p>
            </form>
          )}
        </Card>
      </div>
    </div>
  );
};

export default LoginView;