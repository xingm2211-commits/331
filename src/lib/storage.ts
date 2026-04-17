import { Workout, UserStats } from '../types';
import { isToday, isYesterday, parseISO, startOfDay } from 'date-fns';

const STAGING_KEY = 'fittrend_workouts';

export const getWorkouts = (): Workout[] => {
  const data = localStorage.getItem(STAGING_KEY);
  if (!data) return [];
  try {
    return JSON.parse(data);
  } catch (e) {
    console.error('Failed to parse workouts', e);
    return [];
  }
};

export const saveWorkout = (workout: Workout) => {
  const workouts = getWorkouts();
  const updated = [workout, ...workouts].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );
  localStorage.setItem(STAGING_KEY, JSON.stringify(updated));
};

export const deleteWorkout = (id: string) => {
  const workouts = getWorkouts();
  const updated = workouts.filter(w => w.id !== id);
  localStorage.setItem(STAGING_KEY, JSON.stringify(updated));
};

export const calculateStats = (workouts: Workout[]): UserStats => {
  if (workouts.length === 0) {
    return {
      totalWorkouts: 0,
      totalDuration: 0,
      streak: 0,
      lastWorkoutDate: null
    };
  }

  const totalWorkouts = workouts.length;
  const totalDuration = workouts.reduce((acc, w) => acc + w.duration, 0);
  
  // Calculate streak
  const sortedDates = Array.from(new Set(
    workouts.map(w => startOfDay(parseISO(w.date)).getTime())
  )).sort((a, b) => b - a);

  let streak = 0;
  let currentDate = startOfDay(new Date());

  if (sortedDates.length > 0) {
    const lastWorkout = new Date(sortedDates[0]);
    if (isToday(lastWorkout) || isYesterday(lastWorkout)) {
      streak = 1;
      let checkDate = lastWorkout;
      for (let i = 1; i < sortedDates.length; i++) {
        const prevWorkout = new Date(sortedDates[i]);
        const dayBefore = new Date(checkDate);
        dayBefore.setDate(dayBefore.getDate() - 1);
        
        if (startOfDay(prevWorkout).getTime() === startOfDay(dayBefore).getTime()) {
          streak++;
          checkDate = prevWorkout;
        } else {
          break;
        }
      }
    }
  }

  return {
    totalWorkouts,
    totalDuration,
    streak,
    lastWorkoutDate: workouts[0]?.date || null
  };
};
