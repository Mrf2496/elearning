import React, { useState, useContext, useEffect } from 'react';
import Card from './common/Card';
import Button from './common/Button';
import { CourseProgressContext } from '../context/CourseProgressContext';
import { useAuth } from '../hooks/useAuth';

// Declarar las librerías globales que se cargan desde el CDN
declare global {
  interface Window {
    jspdf: any;
    html2canvas: any;
  }
}

const Certificate: React.FC = () => {
  const { currentUser } = useAuth();
  const [name, setName] = useState('');
  const [idNumber, setIdNumber] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [complianceOfficerName, setComplianceOfficerName] = useState('');
  const [isGenerated, setIsGenerated] = useState(false);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const progressContext = useContext(CourseProgressContext);

  useEffect(() => {
    if (currentUser) {
      setName(currentUser.name);
      setIdNumber(currentUser.cedula);
    }
  }, [currentUser]);
  
  const completionDate = new Date().toLocaleDateString('es-CO', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const handleGenerate = () => {
    if (name.trim() && idNumber.trim() && companyName.trim() && complianceOfficerName.trim()) {
      setIsGenerated(true);
    } else {
      alert('Por favor, ingresa todos los datos: nombre completo, identificación, nombre de la empresa y nombre del oficial de cumplimiento.');
    }
  };

  const handleGeneratePDF = () => {
    const certificateElement = document.getElementById('certificate-print-area');
    if (!certificateElement) {
      console.error("No se encontró el elemento del certificado para generar el PDF.");
      alert("Error: No se pudo encontrar el área del certificado.");
      return;
    }

    setIsGeneratingPDF(true);

    window.html2canvas(certificateElement, {
      scale: 2, // Aumenta la escala para una mejor resolución del PDF
      useCORS: true,
      logging: false,
    }).then(canvas => {
      const imgData = canvas.toDataURL('image/png');
      const { jsPDF } = window.jspdf;
      
      // Dimensiones de A4 en orientación apaisada (landscape): 297mm de ancho x 210mm de alto
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4',
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();

      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`Certificado-SARLAFT-${name.trim().replace(/\s+/g, '_')}.pdf`);
    }).catch(err => {
      console.error("Error al generar el PDF:", err);
      alert("Ocurrió un error inesperado al generar el PDF. Por favor, inténtelo de nuevo.");
    }).finally(() => {
      setIsGeneratingPDF(false);
    });
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
              <p className="text-4xl sm:text-5xl font-bold text-blue-800 tracking-widest">{companyName.toUpperCase()}</p>
              <h1 className="text-2xl font-bold text-slate-700 mt-6">Certificado de Finalización</h1>
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
                    <p className="text-lg font-medium">{complianceOfficerName}</p>
                    <p className="text-sm font-semibold">Oficial de Cumplimiento</p>
                  </div>
                </div>
              </div>
            </div>
        </div>
        <div className="mt-6 text-center space-x-4 no-print">
            <Button onClick={() => setIsGenerated(false)} variant="secondary" disabled={isGeneratingPDF}>Editar Datos</Button>
            <Button onClick={handleGeneratePDF} disabled={isGeneratingPDF}>
                {isGeneratingPDF ? 'Generando PDF...' : 'Descargar Certificado en PDF'}
            </Button>
        </div>
      </div>
    );
  }

  return (
    <Card>
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Generar Certificado</h2>
      <div className="bg-sky-50 border-l-4 border-sky-500 text-sky-800 p-4 mb-6 rounded-r-lg" role="alert">
        <p className="font-bold">¡Importante!</p>
        <p>Para descargar el certificado en PDF, primero completa todos los campos y haz clic en "Generar mi Certificado". La opción para descargar aparecerá junto con la vista previa del certificado.</p>
      </div>
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
        <div>
          <label htmlFor="complianceOfficerName" className="block text-sm font-medium text-gray-700">Nombre del Oficial de Cumplimiento</label>
          <input
            type="text"
            id="complianceOfficerName"
            value={complianceOfficerName}
            onChange={(e) => setComplianceOfficerName(e.target.value)}
            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
            placeholder="Ej: Carlos Rodriguez"
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
