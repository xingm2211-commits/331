import React from 'react';
import { UserStats, Workout } from '../types';
import { Trophy, Clock, Flame, Calendar, Activity } from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  Cell 
} from 'recharts';
import { format, subDays, startOfDay, isSameDay } from 'date-fns';
import { zhCN } from 'date-fns/locale';

interface DashboardProps {
  stats: UserStats;
  workouts: Workout[];
}

export const Dashboard: React.FC<DashboardProps> = ({ stats, workouts }) => {
  const getChartData = () => {
    const data = [];
    for (let i = 6; i >= 0; i--) {
      const date = subDays(new Date(), i);
      const dayWorkouts = workouts.filter(w => isSameDay(parseISO(w.date), date));
      const totalMins = dayWorkouts.reduce((acc, w) => acc + w.duration, 0);
      data.push({
        name: format(date, 'eee', { locale: zhCN }),
        minutes: totalMins,
        fullDate: format(date, 'yyyy-MM-dd')
      });
    }
    return data;
  };

  const parseISO = (s: string) => startOfDay(new Date(s));

  const chartData = getChartData();

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* Hero Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard 
          icon={<Flame className="text-orange-500" />} 
          label="当前连续打卡" 
          value={`${stats.streak} 天`} 
          subValue="保持住！"
          color="bg-orange-50"
        />
        <StatCard 
          icon={<Clock className="text-blue-500" />} 
          label="累计运动时长" 
          value={`${stats.totalDuration} 分钟`} 
          subValue="运动使人快乐"
          color="bg-blue-50"
        />
        <StatCard 
          icon={<Trophy className="text-yellow-500" />} 
          label="总运动次数" 
          value={`${stats.totalWorkouts} 次`} 
          subValue="步数即力量"
          color="bg-yellow-50"
        />
      </div>

      {/* Weekly Progress Chart */}
      <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Activity className="text-emerald-500" />
            近 7 天运动时长 (分钟)
          </h2>
        </div>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <XAxis 
                dataKey="name" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 12, fill: '#94a3b8' }}
              />
              <Tooltip 
                cursor={{ fill: '#f8fafc' }}
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              />
              <Bar dataKey="minutes" radius={[6, 6, 0, 0]}>
                {chartData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={entry.minutes > 0 ? '#10b981' : '#e2e8f0'} 
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ icon, label, value, subValue, color }: { icon: React.ReactNode, label: string, value: string, subValue: string, color: string }) => (
  <div className={`p-6 rounded-3xl border border-gray-100 shadow-sm ${color} transition-transform hover:scale-[1.02]`}>
    <div className="flex justify-between items-start">
      <div className="p-3 bg-white rounded-2xl shadow-sm">
        {icon}
      </div>
    </div>
    <div className="mt-4">
      <p className="text-sm font-medium text-gray-500">{label}</p>
      <h3 className="text-2xl font-bold text-gray-900 mt-1">{value}</h3>
      <p className="text-xs text-gray-400 mt-1 italic">{subValue}</p>
    </div>
  </div>
);
