import { CreateTodoInput, Todo, UpdateTodoInput } from "../../types/todo";
import { TodoRepository } from "./todoRepository";

export class TodoService {
  constructor(private readonly todoRepository: TodoRepository) {}

  async getAllTodos(): Promise<Todo[]> {
    try {
      return await this.todoRepository.findAll();
    } catch (error) {
      throw new Error("Database error");
    }
  }

  async getTodoById(id: string): Promise<Todo> {
    try {
      const todo = await this.todoRepository.findById(id);
      if (!todo) {
        throw new Error("Todo not found");
      }
      return todo;
    } catch (error) {
      if (error instanceof Error && error.message === "Todo not found") {
        throw error;
      }
      throw new Error("Database error");
    }
  }

  async createTodo(input: CreateTodoInput): Promise<Todo> {
    if (!input.text.trim()) {
      throw new Error("Todo text cannot be empty");
    }

    try {
      const todo: Todo = {
        id: Date.now().toString(),
        text: input.text,
        completed: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      return await this.todoRepository.create(todo);
    } catch (error) {
      throw new Error("Database error");
    }
  }

  async updateTodo(id: string, input: UpdateTodoInput): Promise<Todo> {
    if (input.text !== undefined && !input.text.trim()) {
      throw new Error("Todo text cannot be empty");
    }

    try {
      const todo = await this.todoRepository.findById(id);
      if (!todo) {
        throw new Error("Todo not found");
      }

      return await this.todoRepository.update(id, {
        ...input,
      });
    } catch (error) {
      if (error instanceof Error && error.message === "Todo not found") {
        throw error;
      }
      throw new Error("Database error");
    }
  }

  async deleteTodo(id: string): Promise<void> {
    try {
      const todo = await this.todoRepository.findById(id);
      if (!todo) {
        throw new Error("Todo not found");
      }

      await this.todoRepository.delete(id);
    } catch (error) {
      if (error instanceof Error && error.message === "Todo not found") {
        throw error;
      }
      throw new Error("Database error");
    }
  }
}
