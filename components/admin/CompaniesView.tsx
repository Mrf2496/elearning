import React from 'react';
import Card from '../common/Card';

const CompaniesView: React.FC = () => (
    <Card>
        <h2 className="text-2xl font-bold text-slate-800">Gestión de Empresas</h2>
        <p className="mt-4 text-slate-600">
            Aquí se mostrará la lista de empresas registradas, permitiendo ver qué usuarios pertenecen a cada una y gestionar los datos de la empresa.
        </p>
         <div className="mt-6 p-4 bg-yellow-50 border-l-4 border-yellow-400 text-yellow-800">
            <p><span className="font-bold">En construcción:</span> Esta funcionalidad estará disponible en una futura actualización.</p>
        </div>
    </Card>
);
export default CompaniesView;