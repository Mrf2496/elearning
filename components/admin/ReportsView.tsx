import React from 'react';
import Card from '../common/Card';

const ReportsView: React.FC = () => (
    <Card>
        <h2 className="text-2xl font-bold text-slate-800">Reportes</h2>
        <p className="mt-4 text-slate-600">
            Esta sección permitirá generar y descargar reportes detallados sobre el progreso de los usuarios, finalización de cursos y resultados de evaluaciones, con filtros por empresa o fecha.
        </p>
         <div className="mt-6 p-4 bg-yellow-50 border-l-4 border-yellow-400 text-yellow-800">
            <p><span className="font-bold">En construcción:</span> Esta funcionalidad estará disponible en una futura actualización.</p>
        </div>
    </Card>
);
export default ReportsView;