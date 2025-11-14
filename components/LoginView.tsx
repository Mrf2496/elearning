import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import Card from './common/Card';
import Button from './common/Button';
import HomeIcon from './icons/HomeIcon';

const LoginView: React.FC = () => {
  const [view, setView] = useState<'login' | 'register' | 'reset'>('login');
  
  // States for login
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');

  // States for register
  const [name, setName] = useState('');
  const [cedula, setCedula] = useState('');
  const [email, setEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState<'user' | 'admin'>('user');

  // State for reset
  const [resetEmail, setResetEmail] = useState('');

  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const { login, register, resetPassword } = useAuth();
  
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFeedback(null);
    const result = await login(identifier, password);
    if (!result.success) {
      setFeedback({ type: 'error', message: result.message });
    }
    // On success, the useAuth hook will handle the user state change and redirect
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFeedback(null);
     if(!name || !email || !cedula || !registerPassword || !confirmPassword) {
          setFeedback({ type: 'error', message: 'Todos los campos son obligatorios.' });
          return;
      }
      if (registerPassword !== confirmPassword) {
        setFeedback({ type: 'error', message: 'Las contraseñas no coinciden.' });
        return;
      }
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        setFeedback({ type: 'error', message: 'Por favor, ingresa un correo electrónico válido.' });
        return;
      }
      const result = await register(name, cedula, email, registerPassword, role);
      if (result.success) {
        setView('login');
        clearForm();
      }
      setFeedback({ type: result.success ? 'success' : 'error', message: result.message });
  }
  
  const handleResetSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFeedback(null);
    if (!resetEmail) {
        setFeedback({ type: 'error', message: 'Por favor, ingresa tu correo electrónico.' });
        return;
    }
    const result = await resetPassword(resetEmail);
    setFeedback({ type: result.success ? 'success' : 'error', message: result.message });
    if (result.success) {
        setView('login');
    }
  };

  const clearForm = () => {
    setIdentifier('');
    setPassword('');
    setName('');
    setCedula('');
    setEmail('');
    setRegisterPassword('');
    setConfirmPassword('');
    setRole('user');
    setResetEmail('');
    setFeedback(null);
  }

  const switchView = (targetView: 'login' | 'register' | 'reset') => {
      setView(targetView);
      clearForm();
  }

  const renderForm = () => {
    if (view === 'reset') {
        return (
            <form onSubmit={handleResetSubmit} className="space-y-4">
                <div>
                    <label htmlFor="reset-email" className="block text-sm font-medium text-gray-700">Correo Electrónico</label>
                    <input
                        type="email"
                        id="reset-email"
                        value={resetEmail}
                        onChange={(e) => setResetEmail(e.target.value)}
                        className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                        placeholder="tu@correo.com"
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
                        Enviar Enlace de Restablecimiento
                    </Button>
                </div>
            </form>
        );
    }
    if (view === 'register') {
      return (
        <form onSubmit={handleRegisterSubmit} className="space-y-4">
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
          <div>
            <label htmlFor="cedula-register" className="block text-sm font-medium text-gray-700">Cédula</label>
            <input
                type="text"
                id="cedula-register"
                value={cedula}
                onChange={(e) => setCedula(e.target.value.replace(/\D/g, ''))}
                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                required
            />
          </div>
          <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">Correo Electrónico</label>
              <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                  required
              />
          </div>
          <div>
              <label htmlFor="register-password"className="block text-sm font-medium text-gray-700">Contraseña</label>
              <input
                  type="password"
                  id="register-password"
                  value={registerPassword}
                  onChange={(e) => setRegisterPassword(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                  required
              />
          </div>
           <div>
              <label htmlFor="confirm-password"className="block text-sm font-medium text-gray-700">Confirmar Contraseña</label>
              <input
                  type="password"
                  id="confirm-password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                  required
              />
          </div>
           <div>
              <label htmlFor="role-select" className="block text-sm font-medium text-gray-700">Rol</label>
              <select
                  id="role-select"
                  value={role}
                  onChange={(e) => setRole(e.target.value as 'user' | 'admin')}
                  className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
              >
                  <option value="user">Usuario</option>
                  <option value="admin">Administrador</option>
              </select>
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
                  Registrarse
              </Button>
          </div>
        </form>
      );
    }
    return (
      <form onSubmit={handleLoginSubmit} className="space-y-4">
        <div>
            <label htmlFor="identifier" className="block text-sm font-medium text-gray-700">Cédula o Correo Electrónico</label>
            <input
                type="text"
                id="identifier"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
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
                Ingresar
            </Button>
        </div>
      </form>
    );
  }

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
                    {view === 'login' && 'Iniciar Sesión'}
                    {view === 'register' && 'Crear Cuenta'}
                    {view === 'reset' && 'Restablecer Contraseña'}
                </h2>
                {renderForm()}
                <div className="mt-4 text-center text-sm">
                    {view === 'login' && (
                        <button onClick={() => switchView('register')} className="text-sky-600 hover:text-sky-800 hover:underline">
                            ¿No tienes cuenta? Regístrate aquí
                        </button>
                    )}
                    {view === 'register' && (
                         <button onClick={() => switchView('login')} className="text-sky-600 hover:text-sky-800 hover:underline">
                            ¿Ya tienes cuenta? Inicia sesión
                        </button>
                    )}
                     {view === 'reset' && (
                         <button onClick={() => switchView('login')} className="text-sky-600 hover:text-sky-800 hover:underline">
                            Volver a Iniciar Sesión
                        </button>
                    )}
                </div>
                {view === 'login' && (
                    <div className="mt-2 text-center text-sm">
                        <button onClick={() => switchView('reset')} className="text-slate-500 hover:text-slate-700 hover:underline">
                            ¿Olvidaste tu contraseña?
                        </button>
                    </div>
                )}
            </Card>
        </div>
    </div>
  );
};

export default LoginView;