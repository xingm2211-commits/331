import React, { useState, useEffect } from 'react';
import { Dashboard } from './components/Dashboard';
import { WorkoutForm } from './components/WorkoutForm';
import { WorkoutList } from './components/WorkoutList';
import { Workout, UserStats } from './types';
import { getWorkouts, saveWorkout, deleteWorkout, calculateStats } from './lib/storage';
import { Dumbbell, LayoutDashboard, History, Settings } from 'lucide-react';

export default function App() {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [stats, setStats] = useState<UserStats>({
    totalWorkouts: 0,
    totalDuration: 0,
    streak: 0,
    lastWorkoutDate: null
  });
  const [activeTab, setActiveTab] = useState<'dashboard' | 'history'>('dashboard');

  useEffect(() => {
    const loaded = getWorkouts();
    setWorkouts(loaded);
    setStats(calculateStats(loaded));
  }, []);

  const handleAddWorkout = (workout: Workout) => {
    saveWorkout(workout);
    const updated = getWorkouts();
    setWorkouts(updated);
    setStats(calculateStats(updated));
    setActiveTab('dashboard'); // Switch to dashboard to see progress
  };

  const handleDeleteWorkout = (id: string) => {
    deleteWorkout(id);
    const updated = getWorkouts();
    setWorkouts(updated);
    setStats(calculateStats(updated));
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-gray-900 font-sans selection:bg-emerald-100 selection:text-emerald-900 pb-24">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md border-b border-gray-100 z-40">
        <div className="max-w-4xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center text-white rotate-3 shadow-lg">
              <Dumbbell size={20} className="-rotate-3" />
            </div>
            <h1 className="text-2xl font-black tracking-tight italic">FitTrend</h1>
          </div>
          <div className="flex items-center gap-4">
             <div className="text-right hidden sm:block">
                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">当前状态</p>
                <p className="text-xs font-bold text-emerald-600">正在蜕变中 🔥</p>
             </div>
             <div className="w-10 h-10 rounded-full bg-gray-100 border-2 border-white shadow-sm overflow-hidden">
                <img 
                  src="https://picsum.photos/seed/fitness/100/100" 
                  alt="avatar" 
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
             </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-6 pt-32 animate-in slide-in-from-bottom-4 duration-1000">
        {activeTab === 'dashboard' ? (
          <Dashboard stats={stats} workouts={workouts} />
        ) : (
          <WorkoutList workouts={workouts} onDelete={handleDeleteWorkout} />
        )}
      </main>

      {/* Floating Action Button */}
      <WorkoutForm onAdd={handleAddWorkout} />

      {/* Bottom Navigation */}
      <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur-xl border border-gray-200 shadow-2xl rounded-[2.5rem] p-2 flex items-center gap-2 z-40 transition-all hover:scale-105">
        <NavButton 
          active={activeTab === 'dashboard'} 
          onClick={() => setActiveTab('dashboard')} 
          icon={<LayoutDashboard size={20} />}
          label="概览"
        />
        <NavButton 
          active={activeTab === 'history'} 
          onClick={() => setActiveTab('history')} 
          icon={<History size={20} />}
          label="记录"
        />
        <div className="w-[1px] h-6 bg-gray-200 mx-1" />
        <button className="p-3 text-gray-400 hover:text-gray-900 transition-colors">
          <Settings size={20} />
        </button>
      </nav>
    </div>
  );
}

const NavButton = ({ active, onClick, icon, label }: { active: boolean, onClick: () => void, icon: React.ReactNode, label: string }) => (
  <button 
    onClick={onClick}
    className={`flex items-center gap-2 px-6 py-3 rounded-[2rem] transition-all duration-300 ${
      active 
        ? 'bg-black text-white shadow-lg' 
        : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50'
    }`}
  >
    {icon}
    <span className="text-sm font-bold tracking-tight">{label}</span>
  </button>
);

