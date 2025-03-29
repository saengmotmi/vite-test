import { CreateTodoInput, Todo, UpdateTodoInput } from "../model/types";

// 개발 환경에서 직접 백엔드 서버를 가리키도록 변경
const API_BASE_URL = "http://localhost:3000/api/todos";

export const todoApi = {
  getAll: async (): Promise<Todo[]> => {
    console.log("🔍 Fetching all todos from API");
    const response = await fetch(API_BASE_URL);
    if (!response.ok) {
      console.error(
        "❌ Failed to fetch todos:",
        response.status,
        response.statusText
      );
      throw new Error("Failed to fetch todos");
    }
    const data = await response.json();
    console.log("✅ Todos fetched successfully:", data);
    return data;
  },

  getById: async (id: string): Promise<Todo> => {
    console.log(`🔍 Fetching todo with id: ${id}`);
    const response = await fetch(`${API_BASE_URL}/${id}`);
    if (!response.ok) {
      console.error(
        "❌ Failed to fetch todo:",
        response.status,
        response.statusText
      );
      throw new Error("Failed to fetch todo");
    }
    const data = await response.json();
    console.log("✅ Todo fetched successfully:", data);
    return data;
  },

  create: async (input: CreateTodoInput): Promise<Todo> => {
    console.log("🔍 Creating new todo:", input);
    const response = await fetch(API_BASE_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    });
    if (!response.ok) {
      console.error(
        "❌ Failed to create todo:",
        response.status,
        response.statusText
      );
      throw new Error("Failed to create todo");
    }
    const data = await response.json();
    console.log("✅ Todo created successfully:", data);
    return data;
  },

  update: async (id: string, input: UpdateTodoInput): Promise<Todo> => {
    console.log(`🔍 Updating todo with id: ${id}`, input);
    const response = await fetch(`${API_BASE_URL}/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    });
    if (!response.ok) {
      console.error(
        "❌ Failed to update todo:",
        response.status,
        response.statusText
      );
      throw new Error("Failed to update todo");
    }
    const data = await response.json();
    console.log("✅ Todo updated successfully:", data);
    return data;
  },

  delete: async (id: string): Promise<void> => {
    console.log(`🔍 Deleting todo with id: ${id}`);
    const response = await fetch(`${API_BASE_URL}/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) {
      console.error(
        "❌ Failed to delete todo:",
        response.status,
        response.statusText
      );
      throw new Error("Failed to delete todo");
    }
    console.log("✅ Todo deleted successfully");
  },
};
