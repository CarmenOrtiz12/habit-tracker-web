import { useEffect, useState } from "react";

import {
  getTodayHabits,
  completeHabitToday,
} from "../services/habitService";

type Habit = {
  id: number;
  name: string;
  description: string | null;
  frequency: string;
  completed_today: boolean;
  completed_date: string | null;
  streak: number;
};

export default function DashboardPage() {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadHabits() {
      try {
        const data = await getTodayHabits();
        setHabits(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    loadHabits();
  }, []);

  if (loading) {
    return <p>Cargando hábitos...</p>;
  }

  async function handleCompleteHabit(habitId: number) {
    try {
        await completeHabitToday(habitId);
        const updatedHabits = await getTodayHabits();
        setHabits(updatedHabits);
    } catch (error) {
        console.error(error);
    }
  }

  return (
    <main>
      <h1>Dashboard</h1>

      {habits.length === 0 ? (
        <p>No tienes hábitos registrados.</p>
      ) : (
        <ul>
          {habits.map((habit) => (
            <li key={habit.id}>
              <h3>{habit.name}</h3>

              <p>{habit.description}</p>

              <p>
                Estado:{" "}
                {habit.completed_today
                  ? "✅ Completado"
                  : "❌ Pendiente"}
              </p>

              <p>🔥 Streak: {habit.streak}</p>

              {!habit.completed_today && (
                <button onClick={() => handleCompleteHabit(habit.id)}>
                    Completar hoy
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}