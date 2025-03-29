import { Hono } from "hono";
import { beforeEach, describe, expect, it } from "vitest";
import { Todo } from "../../../types/todo";
import { todoRoutes } from "../todo";

describe("Todo API", () => {
  let app: Hono;
  let testTodo: Todo;

  beforeEach(() => {
    app = new Hono();
    app.route("/api/todos", todoRoutes);
    testTodo = {
      id: "1",
      text: "Test todo",
      completed: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  });

  describe("GET /api/todos", () => {
    it("should return empty array when no todos exist", async () => {
      const res = await app.request("/api/todos");
      expect(res.status).toBe(200);
      expect(await res.json()).toEqual([]);
    });
  });

  describe("POST /api/todos", () => {
    it("should create a new todo", async () => {
      const res = await app.request("/api/todos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: "Test todo" }),
      });

      expect(res.status).toBe(201);
      const data = await res.json();
      expect(data).toMatchObject({
        text: "Test todo",
        completed: false,
      });
      expect(data.id).toBeDefined();
      expect(data.createdAt).toBeDefined();
      expect(data.updatedAt).toBeDefined();
    });

    it("should return 400 when text is empty", async () => {
      const res = await app.request("/api/todos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: "" }),
      });

      expect(res.status).toBe(400);
      const data = await res.json();
      expect(data.error).toBeDefined();
    });
  });

  describe("PATCH /api/todos/:id", () => {
    it("should update an existing todo", async () => {
      // First create a todo
      const createRes = await app.request("/api/todos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: "Test todo" }),
      });
      const todo = await createRes.json();

      // Wait a bit to ensure different timestamps
      await new Promise((resolve) => setTimeout(resolve, 1));

      // Then update it
      const res = await app.request(`/api/todos/${todo.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ completed: true }),
      });

      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data.completed).toBe(true);
      expect(new Date(data.updatedAt).getTime()).toBeGreaterThan(
        new Date(todo.updatedAt).getTime()
      );
    });

    it("should return 404 when todo does not exist", async () => {
      const res = await app.request("/api/todos/non-existent-id", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ completed: true }),
      });

      expect(res.status).toBe(404);
      const data = await res.json();
      expect(data.error).toBe("Todo not found");
    });
  });

  describe("DELETE /api/todos/:id", () => {
    it("should delete an existing todo", async () => {
      // First create a todo
      const createRes = await app.request("/api/todos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: "Test todo" }),
      });
      const todo = await createRes.json();

      // Then delete it
      const res = await app.request(`/api/todos/${todo.id}`, {
        method: "DELETE",
      });

      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data.message).toBe("Todo deleted successfully");

      // Verify it's deleted
      const getRes = await app.request(`/api/todos/${todo.id}`);
      expect(getRes.status).toBe(404);
    });

    it("should return 404 when todo does not exist", async () => {
      const res = await app.request("/api/todos/non-existent-id", {
        method: "DELETE",
      });

      expect(res.status).toBe(404);
      const data = await res.json();
      expect(data.error).toBe("Todo not found");
    });
  });
});
