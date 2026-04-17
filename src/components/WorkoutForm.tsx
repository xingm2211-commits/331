import React, { useState } from 'react';
import { Intensity, Workout } from '../types';
import { Plus, Clock, Target, AlignLeft, Send } from 'lucide-react';

interface WorkoutFormProps {
  onAdd: (workout: Workout) => void;
}

const ACTIVITIES = [
  '跑步', '步行', '骑行', '游泳', 
  '瑜伽', '力量训练', '跳绳', '篮球',
  '足球', '羽毛球', 'HIIT', '爬山'
];

export const WorkoutForm: React.FC<WorkoutFormProps> = ({ onAdd }) => {
  const [type, setType] = useState('跑步');
  const [duration, setDuration] = useState(30);
  const [intensity, setIntensity] = useState<Intensity>('Medium');
  const [notes, setNotes] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newWorkout: Workout = {
      id: crypto.randomUUID(),
      type,
      duration: Number(duration),
      intensity,
      notes,
      date: new Date().toISOString(),
    };
    onAdd(newWorkout);
    setIsOpen(false);
    resetForm();
  };

  const resetForm = () => {
    setType('跑步');
    setDuration(30);
    setIntensity('Medium');
    setNotes('');
  };

  if (!isOpen) {
    return (
      <button 
        onClick={() => setIsOpen(true)}
        className="fixed bottom-8 right-8 w-16 h-16 bg-emerald-600 text-white rounded-full shadow-xl flex items-center justify-center hover:bg-emerald-700 transition-all hover:scale-110 active:scale-95 group z-50"
      >
        <Plus className="w-8 h-8 group-hover:rotate-90 transition-transform" />
      </button>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-md rounded-[2.5rem] p-8 shadow-2xl animate-in zoom-in duration-300">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">记录一次运动</h2>
          <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-gray-600 text-sm font-medium">关闭</button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-gray-400 flex items-center gap-2">
              <Target size={14} /> 运动项目
            </label>
            <div className="flex flex-wrap gap-2">
              {ACTIVITIES.map(act => (
                <button
                  key={act}
                  type="button"
                  onClick={() => setType(act)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    type === act 
                      ? 'bg-emerald-600 text-white shadow-md' 
                      : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                  }`}
                >
                  {act}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-gray-400 flex items-center gap-2">
                <Clock size={14} /> 时长 (分钟)
              </label>
              <input
                type="number"
                value={duration}
                onChange={(e) => setDuration(Number(e.target.value))}
                min="1"
                className="w-full bg-gray-50 border-none rounded-2xl px-4 py-3 focus:ring-2 focus:ring-emerald-500 text-gray-900 font-medium"
              />
            </div>
            <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-gray-400 flex items-center gap-2">
                强度
              </label>
              <select
                value={intensity}
                onChange={(e) => setIntensity(e.target.value as Intensity)}
                className="w-full bg-gray-50 border-none rounded-2xl px-4 py-3 focus:ring-2 focus:ring-emerald-500 text-gray-900 font-medium appearance-none"
              >
                <option value="Low">低强度</option>
                <option value="Medium">中强度</option>
                <option value="High">高强度</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-gray-400 flex items-center gap-2">
              <AlignLeft size={14} /> 备注 (可选)
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="今天的运动感觉如何？"
              className="w-full bg-gray-50 border-none rounded-2xl px-4 py-3 focus:ring-2 focus:ring-emerald-500 text-gray-900 font-medium h-24 resize-none placeholder:text-gray-300"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-black text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-gray-800 transition-all active:scale-[0.98]"
          >
            <Send size={18} /> 完成打卡
          </button>
        </form>
      </div>
    </div>
  );
};
