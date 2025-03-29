import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { z } from "zod";
import { CreateTodoInput, UpdateTodoInput } from "../../types/todo";
import { todoService } from "../todos";

// 검증 스키마 정의
const createTodoSchema = z.object({
  text: z.string().min(1, { message: "할 일은 최소 1자 이상이어야 합니다." }),
});

const updateTodoSchema = z.object({
  text: z
    .string()
    .min(1, { message: "할 일은 최소 1자 이상이어야 합니다." })
    .optional(),
  completed: z.boolean().optional(),
});

const todosRouter = new Hono();

// 모든 Todo 가져오기
todosRouter.get("/", async (c) => {
  try {
    const todos = await todoService.getAllTodos();
    return c.json(todos);
  } catch (error) {
    console.error("Failed to get todos:", error);
    return c.json({ error: "Failed to get todos" }, 500);
  }
});

// 특정 Todo 가져오기
todosRouter.get("/:id", async (c) => {
  const id = c.req.param("id");
  try {
    const todo = await todoService.getTodoById(id);
    return c.json(todo);
  } catch (error) {
    if (error instanceof Error && error.message === "Todo not found") {
      return c.json({ error: "Todo not found" }, 404);
    }
    console.error(`Failed to get todo ${id}:`, error);
    return c.json({ error: "Failed to get todo" }, 500);
  }
});

// Todo 생성
todosRouter.post("/", zValidator("json", createTodoSchema), async (c) => {
  const input = c.req.valid("json") as CreateTodoInput;
  try {
    const todo = await todoService.createTodo(input);
    return c.json(todo, 201);
  } catch (error) {
    console.error("Failed to create todo:", error);
    return c.json({ error: "Failed to create todo" }, 500);
  }
});

// Todo 업데이트
todosRouter.patch("/:id", zValidator("json", updateTodoSchema), async (c) => {
  const id = c.req.param("id");
  const input = c.req.valid("json") as UpdateTodoInput;
  try {
    const todo = await todoService.updateTodo(id, input);
    return c.json(todo);
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === "Todo not found") {
        return c.json({ error: "Todo not found" }, 404);
      }
      if (error.message === "Todo text cannot be empty") {
        return c.json({ error: "Todo text cannot be empty" }, 400);
      }
    }
    console.error(`Failed to update todo ${id}:`, error);
    return c.json({ error: "Failed to update todo" }, 500);
  }
});

// Todo 삭제
todosRouter.delete("/:id", async (c) => {
  const id = c.req.param("id");
  try {
    await todoService.deleteTodo(id);
    return c.json({ success: true });
  } catch (error) {
    if (error instanceof Error && error.message === "Todo not found") {
      return c.json({ error: "Todo not found" }, 404);
    }
    console.error(`Failed to delete todo ${id}:`, error);
    return c.json({ error: "Failed to delete todo" }, 500);
  }
});

export default todosRouter;
