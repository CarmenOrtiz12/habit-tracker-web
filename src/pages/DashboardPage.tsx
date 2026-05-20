import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  getTodayHabits,
  completeHabitToday,
  createHabit,
  getHabitStats
} from "../services/habitService";

import { getCurrentUser } from "../services/userService";
import "../App.css";


type User = {
  id: number;
  name: string;
  email: string;
};

type Habit = {
  id: number;
  name: string;
  description: string | null;
  frequency: string;
  completed_today: boolean;
  completed_date: string | null;
  streak: number;
};

type HabitStats = {
  total_habits: number;
  completed_today: number;
  pending_today: number;
};

export default function DashboardPage() {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [stats, setStats] = useState<HabitStats | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    async function loadHabits() {
      try {
        const currentUser = await getCurrentUser();
        setUser(currentUser);
        const data = await getTodayHabits();
        setHabits(data);
        const habitStats = await getHabitStats();
        setStats(habitStats);
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
        const updatedStats = await getHabitStats();
        setStats(updatedStats);
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

  function handleLogout() {
    localStorage.removeItem("token");
    navigate("/");
  }

  return (
    <main className="app-page">
      <section className="dashboard-container">
        <div className="dashboard-header">
          <h1 className="page-title">Hola, {user?.name ?? "usuario"} 👋</h1>

          <button className="secondary-button" onClick={handleLogout}>
            Cerrar sesión
          </button>
        </div>

        {stats && (
          <section className="stats-grid">
            <article className="stat-card">
              <span>Total</span>
              <strong>{stats.total_habits}</strong>
            </article>

            <article className="stat-card">
              <span>Completados hoy</span>
              <strong>{stats.completed_today}</strong>
            </article>

            <article className="stat-card">
              <span>Pendientes</span>
              <strong>{stats.pending_today}</strong>
            </article>
          </section>
        )}

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