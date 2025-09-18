
import React, { useState, useMemo } from 'react';
import Card from '../common/Card';
import UserGroupIcon from '../icons/UserGroupIcon';
import CubeIcon from '../icons/CubeIcon';
import ShareIcon from '../icons/ShareIcon';
import GlobeAltIcon from '../icons/GlobeAltIcon';
import Button from '../common/Button';

type Category = 'Clientes' | 'Productos' | 'Canales' | 'Jurisdicciones';

interface Scenario {
  id: number;
  text: string;
  category: Category;
}

const initialScenarios: Scenario[] = [
  { id: 1, text: 'Un asociado se niega a proporcionar información sobre el origen de sus fondos.', category: 'Clientes' },
  { id: 2, text: 'Lanzamiento de un nuevo producto de crédito que no requiere verificación de ingresos.', category: 'Productos' },
  { id: 3, text: 'Un asociado realiza múltiples transacciones justo por debajo del umbral de reporte en efectivo a través de la app móvil.', category: 'Canales' },
  { id: 4, text: 'Se recibe una transferencia de fondos de un país considerado paraíso fiscal.', category: 'Jurisdicciones' },
  { id: 5, text: 'Un cliente, que es un funcionario público (PEP), realiza operaciones inusuales que no coinciden con su salario.', category: 'Clientes' },
  { id: 6, text: 'La entidad abre una nueva sucursal en una zona de frontera con alto contrabando.', category: 'Jurisdicciones' },
  { id: 7, text: 'Un servicio de giros internacionales que permite el envío de dinero a múltiples destinatarios anónimos.', category: 'Productos' },
  { id: 8, text: 'Uso de corresponsales no bancarios con débiles controles de conocimiento del cliente.', category: 'Canales' },
];

const shuffleArray = <T,>(array: T[]): T[] => [...array].sort(() => Math.random() - 0.5);

const colorClasses: Record<string, { bg: string, border: string, text: string, textBold: string, bgItem: string, textItem: string }> = {
    blue: { bg: 'bg-blue-50', border: 'border-blue-300', text: 'text-blue-600', textBold: 'text-blue-700', bgItem: 'bg-blue-100', textItem: 'text-blue-900' },
    orange: { bg: 'bg-orange-50', border: 'border-orange-300', text: 'text-orange-600', textBold: 'text-orange-700', bgItem: 'bg-orange-100', textItem: 'text-orange-900' },
    green: { bg: 'bg-green-50', border: 'border-green-300', text: 'text-green-600', textBold: 'text-green-700', bgItem: 'bg-green-100', textItem: 'text-green-900' },
    red: { bg: 'bg-red-50', border: 'border-red-300', text: 'text-red-600', textBold: 'text-red-700', bgItem: 'bg-red-100', textItem: 'text-red-900' },
};

const RiskFactorSorterOAI: React.FC = () => {
  const [unclassified, setUnclassified] = useState<Scenario[]>(() => shuffleArray(initialScenarios));
  const [classified, setClassified] = useState<Record<Category, Scenario[]>>({
    Clientes: [],
    Productos: [],
    Canales: [],
    Jurisdicciones: [],
  });
  const [draggedItemId, setDraggedItemId] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<{ id: number; status: 'correct' | 'incorrect' } | null>(null);

  const categories: { name: Category; icon: React.FC<{className?: string}>; color: string }[] = [
    { name: 'Clientes', icon: UserGroupIcon, color: 'blue' },
    { name: 'Productos', icon: CubeIcon, color: 'orange' },
    { name: 'Canales', icon: ShareIcon, color: 'green' },
    { name: 'Jurisdicciones', icon: GlobeAltIcon, color: 'red' },
  ];

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, id: number) => {
    e.dataTransfer.effectAllowed = 'move';
    setDraggedItemId(id);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDrop = (category: Category) => {
    if (draggedItemId === null) return;
    
    const scenario = unclassified.find(s => s.id === draggedItemId);
    if (!scenario) return;

    if (scenario.category === category) {
      setFeedback({ id: scenario.id, status: 'correct' });
      setUnclassified(prev => prev.filter(s => s.id !== draggedItemId));
      setClassified(prev => ({
        ...prev,
        [category]: [...prev[category], scenario],
      }));
    } else {
      setFeedback({ id: scenario.id, status: 'incorrect' });
    }

    setDraggedItemId(null);
    setTimeout(() => setFeedback(null), 800);
  };
  
  const resetGame = () => {
      setUnclassified(shuffleArray(initialScenarios));
      setClassified({ Clientes: [], Productos: [], Canales: [], Jurisdicciones: [] });
  };
  
  const allCompleted = unclassified.length === 0;

  return (
    <Card>
      <h3 className="text-xl font-semibold mb-2">Juego Serio: Clasificador de Factores de Riesgo</h3>
      <p className="text-gray-600 mb-6">Arrastra cada escenario a su categoría de factor de riesgo correcta para probar tus conocimientos.</p>
        
      {allCompleted ? (
          <div className="text-center p-8 bg-green-50 rounded-lg">
            <h4 className="text-2xl font-bold text-green-700">¡Felicitaciones!</h4>
            <p className="text-green-600 mt-2">Has clasificado correctamente todos los factores de riesgo. ¡Excelente trabajo de análisis!</p>
            <Button onClick={resetGame} variant="secondary" className="mt-4">Jugar de Nuevo</Button>
          </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1 space-y-3">
            <h4 className="font-bold text-center text-gray-700">Casos por Analizar</h4>
            {unclassified.map(scenario => {
                const isIncorrect = feedback?.id === scenario.id && feedback.status === 'incorrect';
                return (
                <div
                    key={scenario.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, scenario.id)}
                    className={`p-3 rounded-lg border-2 cursor-grab active:cursor-grabbing shadow-sm transition-all duration-200 text-gray-800 text-sm
                        ${draggedItemId === scenario.id ? 'opacity-50' : 'bg-white'}
                        ${isIncorrect ? 'border-red-500 animate-shake' : 'border-gray-300'}
                    `}
                >
                    {scenario.text}
                </div>
                );
            })}
            </div>
            <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
            {categories.map(({ name, icon: Icon, color }) => {
                const colors = colorClasses[color];
                return (
                    <div
                        key={name}
                        onDragOver={handleDragOver}
                        onDrop={() => handleDrop(name)}
                        className={`p-4 rounded-lg border-2 border-dashed transition-colors min-h-[150px] ${colors.bg} ${colors.border}`}
                    >
                        <div className="flex items-center mb-2">
                            <Icon className={`w-6 h-6 mr-2 ${colors.text}`} />
                            <h5 className={`font-bold text-lg ${colors.textBold}`}>{name}</h5>
                        </div>
                        <div className="space-y-2">
                            {classified[name].map(s => (
                            <div key={s.id} className={`p-2 rounded text-sm font-semibold ${colors.bgItem} ${colors.textItem}`}>
                                {s.text}
                            </div>
                            ))}
                        </div>
                    </div>
                );
            })}
            </div>
        </div>
      )}
      <style>{`
          @keyframes shake {
              0%, 100% { transform: translateX(0); }
              25% { transform: translateX(-5px); }
              75% { transform: translateX(5px); }
          }
          .animate-shake {
              animation: shake 0.5s ease-in-out;
          }
      `}</style>
    </Card>
  );
};

export default RiskFactorSorterOAI;
