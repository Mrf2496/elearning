import React, { useState, useEffect, useMemo } from 'react';
import { db } from '../../lib/firebase.config';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { User } from '../../types';
import { courseData } from '../../constants/courseData';
import MetricCard from './MetricCard';
import UsersIcon from '../icons/UsersIcon';
import BuildingSimpleIcon from '../icons/BuildingSimpleIcon';
import CheckCircleIcon from '../icons/CheckCircleIcon';
import BarChartIcon from '../icons/BarChartIcon';

const AdminDashboard: React.FC = () => {
    const [stats, setStats] = useState({
        totalUsers: 0,
        activeUsers: 0,
        totalCompanies: 0,
        averageProgress: 0,
    });
    const [loading, setLoading] = useState(true);

    const allCourseItemsCount = useMemo(() => {
        const SUBMODULES_WITH_VIDEO = [
            '1-1', '1-2', '1-3', '2-1', '2-2', '2-3', '3-1', '4-1', '5-1', '6-1', '7-1', '8-1', '9-1', '10-1'
        ];
        let count = 0;
        courseData.modules.forEach(module => {
            module.submodules.forEach(sm => {
                count++; // for sm.id
                count++; // for audio
                if (SUBMODULES_WITH_VIDEO.includes(sm.id)) {
                    count++; // for video
                }
            });
            if (module.slides && module.slides.length > 0) {
                count++;
            }
            if (module.interactiveGameIdeas && module.interactiveGameIdeas.length > 0) {
                count += module.interactiveGameIdeas.length;
            }
            if (module.oai) {
                count++;
            }
        });
        count += courseData.caseStudies.length;
        return count;
    }, []);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                // Fetch Users
                const usersCollection = collection(db, 'users');
                const usersSnapshot = await getDocs(usersCollection);
                const usersData = usersSnapshot.docs.map(doc => doc.data() as User);
                const totalUsers = usersData.length;
                const activeUsers = usersData.filter(user => user.active).length;

                // Fetch Companies
                const companiesCollection = collection(db, 'companies');
                const companiesSnapshot = await getDocs(companiesCollection);
                const totalCompanies = companiesSnapshot.size;
                
                // Calculate Average Progress
                let totalProgressSum = 0;
                let usersWithProgress = 0;
                usersData.forEach(user => {
                    if (user.progress && user.progress.completedSubmodules) {
                        const userProgress = (user.progress.completedSubmodules.length / allCourseItemsCount) * 100;
                        totalProgressSum += userProgress;
                        usersWithProgress++;
                    }
                });
                const averageProgress = usersWithProgress > 0 ? totalProgressSum / usersWithProgress : 0;
                
                setStats({
                    totalUsers,
                    activeUsers,
                    totalCompanies,
                    averageProgress: Math.round(averageProgress),
                });
            } catch (error) {
                console.error("Error fetching admin stats:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, [allCourseItemsCount]);

    return (
        <div>
            <h1 className="text-3xl font-bold text-slate-800 mb-6">Dashboard</h1>
            {loading ? (
                <div>Cargando métricas...</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <MetricCard
                        title="Total de Usuarios"
                        value={stats.totalUsers.toString()}
                        icon={UsersIcon}
                        color="blue"
                    />
                    <MetricCard
                        title="Usuarios Activos"
                        value={stats.activeUsers.toString()}
                        icon={CheckCircleIcon}
                        color="green"
                    />
                    <MetricCard
                        title="Total de Empresas"
                        value={stats.totalCompanies.toString()}
                        icon={BuildingSimpleIcon}
                        color="orange"
                    />
                    <MetricCard
                        title="Progreso Promedio"
                        value={`${stats.averageProgress}%`}
                        icon={BarChartIcon}
                        color="purple"
                    />
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;