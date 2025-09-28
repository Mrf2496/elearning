import React, { useState, useContext } from 'react';
import Card from './common/Card';
import Button from './common/Button';
import { CourseProgressContext } from '../context/CourseProgressContext';

const Certificate: React.FC = () => {
  const [name, setName] = useState('');
  const [idNumber, setIdNumber] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [isGenerated, setIsGenerated] = useState(false);
  const progressContext = useContext(CourseProgressContext);
  
  const completionDate = new Date().toLocaleDateString('es-CO', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const handleGenerate = () => {
    if (name.trim() && idNumber.trim() && companyName.trim()) {
      setIsGenerated(true);
    } else {
      alert('Por favor, ingresa tu nombre completo, número de identificación y el nombre de la empresa.');
    }
  };

  const handlePrint = () => {
    window.print();
  };
  
  if (!progressContext?.quizPassed) {
      return (
          <Card className="text-center border-t-8 border-red-600">
              <h2 className="text-2xl font-bold text-red-700">Acceso Denegado</h2>
              <p className="mt-4 text-gray-700">Debes aprobar la evaluación final con un puntaje de 80% o más para poder generar tu certificado.</p>
          </Card>
      );
  }

  if (isGenerated) {
    return (
      <div>
        <div id="certificate-print-area" className="p-4 sm:p-8 bg-white border-8 border-blue-800 rounded-lg shadow-2xl relative w-full aspect-[1.414]">
            <div className="absolute inset-0 bg-gray-50 opacity-10" style={{backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23a0aec0\' fill-opacity=\'0.1\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")'}}></div>
            <div className="text-center relative">
              <p className="text-2xl font-bold text-slate-700 tracking-widest">{companyName.toUpperCase()}</p>
              <h1 className="text-4xl sm:text-5xl font-bold text-blue-800 mt-6">Certificado de Finalización</h1>
              <p className="mt-8 text-xl text-gray-700">Se certifica a:</p>
              <p className="text-3xl font-serif text-blue-900 mt-4 underline underline-offset-8 decoration-orange-400 decoration-4">{name}</p>
              <p className="mt-2 text-lg text-gray-700">con cédula de ciudadanía No. {idNumber}</p>
              <p className="mt-8 text-xl text-gray-700">
                por haber completado y aprobado la capacitación de
              </p>
              <p className="text-2xl font-bold text-gray-800 mt-2">
                "Sistema de Administración del Riesgo de Lavado de Activos y de la Financiación del Terrorismo - SARLAFT"
              </p>
              <p className="mt-4 text-lg text-gray-700">
                con una intensidad certificada de <strong>ocho (8) horas</strong>.
              </p>
              <p className="mt-8 text-lg text-gray-700">
                Finalizado el {completionDate}.
              </p>
              <div className="mt-12 flex justify-center items-end">
                <div>
                  <div className="border-t-2 border-gray-600 w-64 mx-auto pt-2">
                    <p className="text-sm font-semibold">Oficial de Cumplimiento</p>
                  </div>
                </div>
              </div>
            </div>
        </div>
        <div className="mt-6 text-center">
            <Button onClick={handlePrint}>Imprimir o Guardar como PDF</Button>
        </div>
      </div>
    );
  }

  return (
    <Card>
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Generar Certificado</h2>
      <p className="text-gray-600 mb-6">
        Ingresa tus datos como aparecerán en el certificado. Asegúrate de que sean correctos.
      </p>
      <div className="space-y-4 max-w-md mx-auto">
        <div>
          <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">Nombre Completo</label>
          <input
            type="text"
            id="fullName"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
            placeholder="Ej: Ana María Pérez"
          />
        </div>
        <div>
          <label htmlFor="idNumber" className="block text-sm font-medium text-gray-700">Número de Identificación</label>
          <input
            type="text"
            id="idNumber"
            value={idNumber}
            onChange={(e) => setIdNumber(e.target.value)}
            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
            placeholder="Ej: 1234567890"
          />
        </div>
        <div>
          <label htmlFor="companyName" className="block text-sm font-medium text-gray-700">Nombre de la Empresa</label>
          <input
            type="text"
            id="companyName"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
            placeholder="Ej: Mi Cooperativa SAS"
          />
        </div>
        <div className="pt-2">
          <Button onClick={handleGenerate} className="w-full">
            Generar mi Certificado
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default Certificate;