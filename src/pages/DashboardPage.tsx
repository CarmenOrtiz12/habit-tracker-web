import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import {
  getTodayHabits,
  completeHabitToday,
  createHabit,
  getHabitStats,
  updateHabit,
  deleteHabit
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

type Props = {
  theme: string;
  toggleTheme: () => void;
};

export default function DashboardPage({ theme, toggleTheme }: Props) {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [stats, setStats] = useState<HabitStats | null>(null);
  const chartData = stats
    ? [
        {
          name: "Completados",
          total: stats.completed_today,
        },
        {
          name: "Pendientes",
          total: stats.pending_today,
        },
      ]
    : [];
  const [editingHabitId, setEditingHabitId] = useState<number | null>(null);
  const [editName, setEditName] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [message, setMessage] = useState("");
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

  useEffect(() => {
    if (!message) return;

    const timer = setTimeout(() => {
      setMessage("");
    }, 3000);

    return () => clearTimeout(timer);
  }, [message]);

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
        setMessage("Hábito completado correctamente");
    } catch (error) {
        console.error(error);
    }
  }

  async function handleDeleteHabit(habitId: number) {
    try {
      await deleteHabit(habitId);

      const updatedHabits = await getTodayHabits();
      setHabits(updatedHabits);

      const updatedStats = await getHabitStats();
      setStats(updatedStats);

      setMessage("Hábito eliminado correctamente");

    } catch (error) {
        console.error(error);
    }
  }

  async function handleCreateHabit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      await createHabit(name, description, "daily");

      const updatedHabits = await getTodayHabits();
      const updatedStats = await getHabitStats();

      setHabits(updatedHabits);
      setStats(updatedStats);
      setName("");
      setDescription("");
      setMessage("Hábito creado correctamente");

    } catch (error) {
      console.error(error);
    }
  }

  function startEditingHabit(habit: Habit) {
    setEditingHabitId(habit.id);
    setEditName(habit.name);
    setEditDescription(habit.description ?? "");
  }

  function cancelEditingHabit() {
    setEditingHabitId(null);
    setEditName("");
    setEditDescription("");
  }

  async function handleUpdateHabit(habitId: number) {
    try {
      await updateHabit(habitId, editName, editDescription, "daily");

      const updatedHabits = await getTodayHabits();
      setHabits(updatedHabits);
      setMessage("Hábito actualizado correctamente");

      cancelEditingHabit();
    } catch (error) {
        console.error(error);
    }
  }

  function handleLogout() {
    localStorage.removeItem("access_token");
    navigate("/");
  }

  return (
    <main className="app-page">
      <section className="dashboard-container">
        <div className="dashboard-header">
          <h1 className="page-title">Hola, {user?.name ?? "usuario"} 👋</h1>

          <button className="secondary-button" onClick={toggleTheme}>
            {theme === "light" ? "🌙 Dark mode" : "☀️ Light mode"}
          </button>
          
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

        <section className="chart-container">
          <h2>Progreso de hoy</h2>

          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="total" fill="#2563eb" />
            </BarChart>
          </ResponsiveContainer>
        </section>

        {message && <p className="feedback-message">{message}</p>}

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
                {editingHabitId === habit.id ? (
                  <>
                    <input
                      type="text"
                      value={editName}
                      onChange={(event) => setEditName(event.target.value)}
                    />

                    <input
                      type="text"
                      value={editDescription}
                      onChange={(event) => setEditDescription(event.target.value)}
                    />

                    <button
                      className="primary-button"
                      onClick={() => handleUpdateHabit(habit.id)}
                    >
                      Guardar
                    </button>

                    <button className="secondary-button" onClick={cancelEditingHabit}>
                      Cancelar
                    </button>
                  </>
                ) : (
                  <>
                    <div className="habit-top">
                      <div>
                        <h3>{habit.name}</h3>

                        <p className="habit-description">
                          {habit.description}
                        </p>
                      </div>

                      <div
                        className={
                          habit.completed_today
                            ? "habit-status completed"
                            : "habit-status pending"
                        }
                      >
                        {habit.completed_today
                          ? "Completado"
                          : "Pendiente"}
                      </div>
                    </div>

                    <div className="habit-footer">
                      <p className="streak">
                        🔥 Streak: {habit.streak}
                      </p>

                      <div className="habit-actions">
                        {!habit.completed_today && (
                          <button
                            className="primary-button"
                            onClick={() => handleCompleteHabit(habit.id)}
                          >
                            Completar
                          </button>
                        )}

                        <button
                          className="secondary-button"
                          onClick={() => startEditingHabit(habit)}
                        >
                          Editar
                        </button>

                        <button
                          className="danger-button"
                          onClick={() => handleDeleteHabit(habit.id)}
                        >
                          Eliminar
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}