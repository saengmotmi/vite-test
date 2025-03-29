import { Hono } from "hono";
import { z } from "zod";
import { Todo } from "../../types/todo";

const todoRoutes = new Hono();

// In-memory storage (temporary)
let todos: Todo[] = [];

// Validation schemas
const createTodoSchema = z.object({
  text: z.string().min(1, "Text is required"),
});

const updateTodoSchema = z.object({
  text: z.string().min(1, "Text is required").optional(),
  completed: z.boolean().optional(),
});

// Get all todos
todoRoutes.get("/", (c) => {
  return c.json(todos);
});

// Get a single todo
todoRoutes.get("/:id", (c) => {
  const id = c.req.param("id");
  const todo = todos.find((t) => t.id === id);

  if (!todo) {
    return c.json({ error: "Todo not found" }, 404);
  }

  return c.json(todo);
});

// Create a todo
todoRoutes.post("/", async (c) => {
  try {
    const body = await c.req.json();
    const validatedData = createTodoSchema.parse(body);

    const newTodo: Todo = {
      id: crypto.randomUUID(),
      text: validatedData.text,
      completed: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    todos.push(newTodo);
    return c.json(newTodo, 201);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return c.json({ error: error.errors }, 400);
    }
    throw error;
  }
});

// Update a todo
todoRoutes.patch("/:id", async (c) => {
  try {
    const id = c.req.param("id");
    const body = await c.req.json();
    const validatedData = updateTodoSchema.parse(body);

    const todoIndex = todos.findIndex((t) => t.id === id);
    if (todoIndex === -1) {
      return c.json({ error: "Todo not found" }, 404);
    }

    todos[todoIndex] = {
      ...todos[todoIndex],
      ...validatedData,
      updatedAt: new Date().toISOString(),
    };

    return c.json(todos[todoIndex]);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return c.json({ error: error.errors }, 400);
    }
    throw error;
  }
});

// Delete a todo
todoRoutes.delete("/:id", (c) => {
  const id = c.req.param("id");
  const todoIndex = todos.findIndex((t) => t.id === id);

  if (todoIndex === -1) {
    return c.json({ error: "Todo not found" }, 404);
  }

  todos = todos.filter((t) => t.id !== id);
  return c.json({ message: "Todo deleted successfully" });
});

export { todoRoutes };
