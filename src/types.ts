export type Intensity = 'Low' | 'Medium' | 'High';

export interface Workout {
  id: string;
  type: string;
  duration: number; // in minutes
  calories?: number;
  date: string; // ISO string
  intensity: Intensity;
  notes?: string;
}

export interface UserStats {
  totalWorkouts: number;
  totalDuration: number;
  streak: number;
  lastWorkoutDate: string | null;
}
