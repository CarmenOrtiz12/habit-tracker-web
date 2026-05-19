import { useEffect, useState } from "react";

import {
  getTodayHabits,
  completeHabitToday,
  createHabit,
} from "../services/habitService";

import "../App.css";

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
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

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

  async function handleCreateHabit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      await createHabit(name, description, "daily");

      const updatedHabits = await getTodayHabits();

      setHabits(updatedHabits);
      setName("");
      setDescription("");

    } catch (error) {
      console.error(error);
    }
  }

  return (
    <main className="app-page">
      <section className="dashboard-container">
        <h1 className="page-title">Dashboard</h1>

        <form className="habit-form" onSubmit={handleCreateHabit}>
          <div>
            <input
              type="text"
              placeholder="Nombre del hábito"
              value={name}
              onChange={(event) => setName(event.target.value)}
            />
          </div>

          <div>
            <input
              type="text"
              placeholder="Descripción"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
            />
          </div>

          <button type="submit" className="primary-button">
            Crear hábito
          </button>
        </form>

        {habits.length === 0 ? (
          <p>No tienes hábitos registrados.</p>
        ) : (
          <ul className="habit-list">
            {habits.map((habit) => (
              <li key={habit.id} className="habit-card">
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
                  <button className="primary-button" onClick={() => handleCompleteHabit(habit.id)}>
                      Completar hoy
                  </button>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}