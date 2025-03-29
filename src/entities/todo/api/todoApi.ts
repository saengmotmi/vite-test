import { CreateTodoInput, Todo, UpdateTodoInput } from "../model/types";

const API_BASE_URL = "/api/todos";

export const todoApi = {
  getAll: async (): Promise<Todo[]> => {
    const response = await fetch(API_BASE_URL);
    if (!response.ok) throw new Error("Failed to fetch todos");
    return response.json();
  },

  getById: async (id: string): Promise<Todo> => {
    const response = await fetch(`${API_BASE_URL}/${id}`);
    if (!response.ok) throw new Error("Failed to fetch todo");
    return response.json();
  },

  create: async (input: CreateTodoInput): Promise<Todo> => {
    const response = await fetch(API_BASE_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    });
    if (!response.ok) throw new Error("Failed to create todo");
    return response.json();
  },

  update: async (id: string, input: UpdateTodoInput): Promise<Todo> => {
    const response = await fetch(`${API_BASE_URL}/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    });
    if (!response.ok) throw new Error("Failed to update todo");
    return response.json();
  },

  delete: async (id: string): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) throw new Error("Failed to delete todo");
  },
};
