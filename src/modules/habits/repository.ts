import { Habit, CreateHabitInput, UpdateHabitInput } from './types';

export interface IHabitsRepository {
  fetchHabits(): Promise<Habit[]>;
  getById(id: string): Promise<Habit | null>;
  createHabit(habit: CreateHabitInput): Promise<Habit>;
  updateHabit(id: string, updates: UpdateHabitInput): Promise<Habit>;
  deleteHabit(id: string): Promise<void>;
  toggleCompletion(id: string, date: string): Promise<Habit>;
}
