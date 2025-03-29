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
  console.log("[SERVER] GET /api/todos - Fetching all todos");
  try {
    const todos = await todoService.getAllTodos();
    console.log("[SERVER] GET /api/todos - Found todos:", todos);
    return c.json(todos);
  } catch (error) {
    console.error("[SERVER] GET /api/todos - Error:", error);
    return c.json({ error: "Failed to get todos" }, 500);
  }
});

// 특정 Todo 가져오기
todosRouter.get("/:id", async (c) => {
  const id = c.req.param("id");
  console.log(`[SERVER] GET /api/todos/${id} - Fetching todo`);
  try {
    const todo = await todoService.getTodoById(id);
    console.log(`[SERVER] GET /api/todos/${id} - Found todo:`, todo);
    return c.json(todo);
  } catch (error) {
    console.error(`[SERVER] GET /api/todos/${id} - Error:`, error);
    if (error instanceof Error && error.message === "Todo not found") {
      return c.json({ error: "Todo not found" }, 404);
    }
    return c.json({ error: "Failed to get todo" }, 500);
  }
});

// Todo 생성
todosRouter.post("/", zValidator("json", createTodoSchema), async (c) => {
  const input = c.req.valid("json") as CreateTodoInput;
  console.log("[SERVER] POST /api/todos - Creating todo:", input);
  try {
    const todo = await todoService.createTodo(input);
    console.log("[SERVER] POST /api/todos - Created todo:", todo);
    return c.json(todo, 201);
  } catch (error) {
    console.error("[SERVER] POST /api/todos - Error:", error);
    return c.json({ error: "Failed to create todo" }, 500);
  }
});

// Todo 업데이트
todosRouter.patch("/:id", zValidator("json", updateTodoSchema), async (c) => {
  const id = c.req.param("id");
  const input = c.req.valid("json") as UpdateTodoInput;
  console.log(`[SERVER] PATCH /api/todos/${id} - Updating todo:`, input);
  try {
    const todo = await todoService.updateTodo(id, input);
    console.log(`[SERVER] PATCH /api/todos/${id} - Updated todo:`, todo);
    return c.json(todo);
  } catch (error) {
    console.error(`[SERVER] PATCH /api/todos/${id} - Error:`, error);
    if (error instanceof Error) {
      if (error.message === "Todo not found") {
        return c.json({ error: "Todo not found" }, 404);
      }
      if (error.message === "Todo text cannot be empty") {
        return c.json({ error: "Todo text cannot be empty" }, 400);
      }
    }
    return c.json({ error: "Failed to update todo" }, 500);
  }
});

// Todo 삭제
todosRouter.delete("/:id", async (c) => {
  const id = c.req.param("id");
  console.log(`[SERVER] DELETE /api/todos/${id} - Deleting todo`);
  try {
    await todoService.deleteTodo(id);
    console.log(`[SERVER] DELETE /api/todos/${id} - Deleted todo successfully`);
    return c.json({ success: true });
  } catch (error) {
    console.error(`[SERVER] DELETE /api/todos/${id} - Error:`, error);
    if (error instanceof Error && error.message === "Todo not found") {
      return c.json({ error: "Todo not found" }, 404);
    }
    return c.json({ error: "Failed to delete todo" }, 500);
  }
});

export default todosRouter;
