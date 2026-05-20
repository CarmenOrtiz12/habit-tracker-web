import api from "../api/client";

export async function getTodayHabits() {
  const response = await api.get("/habits/today");
  return response.data;
}

export async function completeHabitToday(habitId: number) {
  const response = await api.post(`/habits/${habitId}/complete-today`);
  return response.data;
}

export async function createHabit(name: string, description: string, frequency: string) {
  const response = await api.post("/habits", {
    name,
    description,
    frequency,
  });

  return response.data;
}

export async function getHabitStats() {
  const response = await api.get("/habits/stats");
  return response.data;
}