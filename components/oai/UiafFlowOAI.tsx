import React, { useState } from 'react';
import Card from '../common/Card';
import BuildingOfficeIcon from '../icons/BuildingOfficeIcon';
import DocumentTextIcon from '../icons/DocumentTextIcon';
import CpuChipIcon from '../icons/CpuChipIcon';
import LightBulbIcon from '../icons/LightBulbIcon';
import ScaleIcon from '../icons/ScaleIcon';
import ArrowRightIcon from '../icons/ArrowRightIcon';

const flowSteps = [
  {
    id: 1,
    title: 'Entidades Reportantes',
    description: 'Cooperativas, fondos de empleados, bancos y otras entidades del sector real y financiero están obligadas a vigilar las operaciones de sus clientes y reportar actividades inusuales o sospechosas.',
    icon: BuildingOfficeIcon,
    color: 'text-blue-600',
    bgColor: 'bg-blue-100',
  },
  {
    id: 2,
    title: 'Reportes (ROS, Efectivo, etc.)',
    description: 'Las entidades envían principalmente el Reporte de Operación Sospechosa (ROS) cuando detectan una actividad sin justificación económica o legal. También envían reportes objetivos, como los de transacciones en efectivo que superan ciertos montos.',
    icon: DocumentTextIcon,
    color: 'text-orange-600',
    bgColor: 'bg-orange-100',
  },
  {
    id: 3,
    title: 'UIAF: Análisis y Sistematización',
    description: 'La UIAF recibe miles de reportes. Su labor es centralizar, organizar y analizar esta información utilizando tecnología y analistas expertos para encontrar patrones, conexiones y posibles redes de lavado de activos o financiación del terrorismo.',
    icon: CpuChipIcon,
    color: 'text-red-600',
    bgColor: 'bg-red-100',
  },
  {
    id: 4,
    title: 'Inteligencia Financiera',
    description: 'Producto del análisis, la UIAF genera informes de inteligencia financiera. Estos informes no son pruebas, sino insumos estratégicos que detallan las actividades y presuntos vínculos de personas u organizaciones con el LA/FT.',
    icon: LightBulbIcon,
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-100',
  },
  {
    id: 5,
    title: 'Autoridades Competentes',
    description: 'La UIAF traslada de forma segura y confidencial los informes de inteligencia a las autoridades encargadas de investigar y judicializar, principalmente a la Fiscalía General de la Nación, para que inicien las investigaciones penales correspondientes.',
    icon: ScaleIcon,
    color: 'text-green-600',
    bgColor: 'bg-green-100',
  },
];

const UiafFlowOAI: React.FC = () => {
  const [activeStep, setActiveStep] = useState<number | null>(null);

  const selectedStepData = flowSteps.find(step => step.id === activeStep);

  return (
    <Card>
      <h3 className="text-xl font-semibold mb-2">OAI: El Flujo de Información de la UIAF</h3>
      <p className="text-gray-600 mb-6">Haz clic en cada etapa del proceso para conocer más sobre el rol de la UIAF y cómo contribuyes a la lucha contra el LA/FT.</p>

      <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0 sm:space-x-2 overflow-x-auto p-4">
        {flowSteps.map((step, index) => (
          <React.Fragment key={step.id}>
            <button
              onClick={() => setActiveStep(step.id)}
              className={`flex flex-col items-center text-center p-3 rounded-lg border-2 transition-all w-32 h-32 justify-center
                ${activeStep === step.id ? `${step.bgColor} border-current ${step.color} ring-2 ring-current` : 'bg-gray-50 hover:bg-gray-100 border-gray-200'}`}
            >
              <step.icon className={`w-8 h-8 mb-1 ${step.color}`} />
              <span className="text-xs font-semibold text-gray-700">{step.title}</span>
            </button>
            {index < flowSteps.length - 1 && (
                <ArrowRightIcon className="w-6 h-6 text-gray-300 hidden sm:block" />
            )}
          </React.Fragment>
        ))}
      </div>
      
      {selectedStepData && (
        <div className="mt-6 p-4 rounded-lg transition-all duration-300 animate-fade-in" style={{ backgroundColor: `rgba(var(--${selectedStepData.color.replace('text-', '').replace('-600', '')}-rgb, 239, 246, 255), 0.5)`}}>
          <div className={`p-4 rounded-lg border-l-4 ${selectedStepData.bgColor.replace('bg-', 'border-')}-400`}>
              <h4 className={`text-lg font-bold ${selectedStepData.color}`}>{selectedStepData.title}</h4>
              <p className="mt-2 text-gray-700">{selectedStepData.description}</p>
          </div>
        </div>
      )}
    </Card>
  );
};

export default UiafFlowOAI;

// Puedes agregar esta animación básica de fundido en una etiqueta de estilo en index.html, o manejarla con la configuración de Tailwind
// @keyframes fade-in { 0% { opacity: 0; transform: translateY(10px); } 100% { opacity: 1; transform: translateY(0); } }
// .animate-fade-in { animation: fade-in 0.5s ease-out forwards; }
// Por simplicidad, esto funcionará directamente sin CSS adicional. Las clases de transición proporcionan un efecto decente.