import React from 'react';

interface MetricCardProps {
    title: string;
    value: string;
    icon: React.FC<{ className?: string }>;
    color: 'blue' | 'green' | 'orange' | 'purple';
}

const colorClasses = {
    blue: { bg: 'bg-blue-100', text: 'text-blue-600' },
    green: { bg: 'bg-green-100', text: 'text-green-600' },
    orange: { bg: 'bg-orange-100', text: 'text-orange-600' },
    purple: { bg: 'bg-purple-100', text: 'text-purple-600' },
};

const MetricCard: React.FC<MetricCardProps> = ({ title, value, icon: Icon, color }) => {
    const { bg, text } = colorClasses[color];

    return (
        <div className="bg-white rounded-lg shadow p-6 flex items-center space-x-4">
            <div className={`p-3 rounded-full ${bg}`}>
                <Icon className={`w-8 h-8 ${text}`} />
            </div>
            <div>
                <p className="text-sm text-slate-500 font-medium">{title}</p>
                <p className="text-3xl font-bold text-slate-800">{value}</p>
            </div>
        </div>
    );
};

export default MetricCard;