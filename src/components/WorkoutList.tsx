import React from 'react';
import { Workout } from '../types';
import { format, parseISO } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import { Trash2, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface WorkoutListProps {
  workouts: Workout[];
  onDelete: (id: string) => void;
}

export const WorkoutList: React.FC<WorkoutListProps> = ({ workouts, onDelete }) => {
  const getIntensityIcon = (intensity: string) => {
    switch (intensity) {
      case 'High': return <TrendingUp className="text-red-500" size={16} />;
      case 'Medium': return <Minus className="text-yellow-500" size={16} />;
      case 'Low': return <TrendingDown className="text-blue-500" size={16} />;
      default: return null;
    }
  };

  const getIntensityLabel = (intensity: string) => {
    switch (intensity) {
      case 'High': return '高强度';
      case 'Medium': return '中强度';
      case 'Low': return '低强度';
      default: return intensity;
    }
  };

  if (workouts.length === 0) {
    return (
      <div className="text-center py-20 bg-gray-50 rounded-[3rem] border-2 border-dashed border-gray-200">
        <p className="text-gray-400 font-medium">还没有运动记录，快去开始第一次运动吧！</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-gray-900 pb-2 border-b border-gray-100 flex items-center justify-between">
        历史记录
        <span className="text-xs font-normal text-gray-400 bg-gray-100 px-3 py-1 rounded-full">
          共 {workouts.length} 条
        </span>
      </h2>
      
      <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
        <AnimatePresence mode="popLayout">
          {workouts.map((workout) => (
            <motion.div
              key={workout.id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-all group relative"
            >
              <div className="flex justify-between items-start">
                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 font-bold text-lg">
                    {workout.type.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 text-lg">{workout.type}</h3>
                    <p className="text-sm text-gray-400 font-medium">
                      {format(parseISO(workout.date), 'M月d日 HH:mm', { locale: zhCN })}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-2">
                  <div className="flex items-center gap-1 bg-gray-50 px-3 py-1 rounded-full text-xs font-bold text-gray-600">
                    {getIntensityIcon(workout.intensity)}
                    {getIntensityLabel(workout.intensity)}
                  </div>
                  <div className="text-lg font-black text-gray-900">
                    {workout.duration} <span className="text-xs font-medium text-gray-400">分钟</span>
                  </div>
                </div>
              </div>

              {workout.notes && (
                <div className="mt-4 p-3 bg-gray-50 rounded-2xl text-sm text-gray-600 italic border-l-4 border-emerald-500">
                  {workout.notes}
                </div>
              )}

              <button
                onClick={() => onDelete(workout.id)}
                className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 p-2 text-gray-300 hover:text-red-500 transition-all bg-white rounded-xl shadow-sm border border-gray-50"
                aria-label="Delete"
              >
                <Trash2 size={16} />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};
