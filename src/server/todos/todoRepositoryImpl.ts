import { Todo, UpdateTodoInput } from "../../types/todo";
import { TodoRepository } from "./todoRepository";

export class TodoRepositoryImpl implements TodoRepository {
  private todos: Todo[] = [];

  async findAll(): Promise<Todo[]> {
    return [...this.todos];
  }

  async findById(id: string): Promise<Todo | null> {
    const todo = this.todos.find((todo) => todo.id === id);
    return todo ? { ...todo } : null;
  }

  async create(todo: Todo): Promise<Todo> {
    this.todos.push(todo);
    return { ...todo };
  }

  async update(id: string, input: UpdateTodoInput): Promise<Todo> {
    const todoIndex = this.todos.findIndex((todo) => todo.id === id);
    if (todoIndex === -1) {
      throw new Error("Todo not found");
    }

    const updatedTodo = {
      ...this.todos[todoIndex],
      ...input,
      updatedAt: new Date().toISOString(),
    };

    this.todos[todoIndex] = updatedTodo;
    return { ...updatedTodo };
  }

  async delete(id: string): Promise<boolean> {
    const todoIndex = this.todos.findIndex((todo) => todo.id === id);
    if (todoIndex === -1) {
      return false;
    }

    this.todos.splice(todoIndex, 1);
    return true;
  }
}
