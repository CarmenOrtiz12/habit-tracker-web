import api from "../api/client";

export async function getTodayHabits() {
  const response = await api.get("/habits/today");
  return response.data;
}

export async function completeHabitToday(habitId: number) {
  const response = await api.post(`/habits/${habitId}/complete-today`);
  return response.data;
}