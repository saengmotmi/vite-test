import { beforeEach, describe, expect, it, vi } from "vitest";
import { Todo } from "../../../types/todo";
import { TodoRepository } from "../todoRepository";
import { TodoService } from "../todoService";

describe("TodoService", () => {
  let todoService: TodoService;
  let todoRepository: TodoRepository;

  const mockTodo: Todo = {
    id: "1",
    text: "Test todo",
    completed: false,
    createdAt: "2024-01-01T00:00:00.000Z",
    updatedAt: "2024-01-01T00:00:00.000Z",
  };

  beforeEach(() => {
    // 모의 객체 직접 생성
    todoRepository = {
      findAll: vi.fn(),
      findById: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    };

    todoService = new TodoService(todoRepository);
  });

  describe("getAllTodos", () => {
    it("should return all todos", async () => {
      const mockTodos = [mockTodo];
      vi.mocked(todoRepository.findAll).mockResolvedValue(mockTodos);

      const result = await todoService.getAllTodos();
      expect(result).toEqual(mockTodos);
      expect(todoRepository.findAll).toHaveBeenCalled();
    });

    it("should throw error when repository fails", async () => {
      vi.mocked(todoRepository.findAll).mockRejectedValue(
        new Error("Database error")
      );

      await expect(todoService.getAllTodos()).rejects.toThrow("Database error");
    });
  });

  describe("getTodoById", () => {
    it("should return todo by id", async () => {
      vi.mocked(todoRepository.findById).mockResolvedValue(mockTodo);

      const result = await todoService.getTodoById("1");
      expect(result).toEqual(mockTodo);
      expect(todoRepository.findById).toHaveBeenCalledWith("1");
    });

    it("should throw error when todo not found", async () => {
      vi.mocked(todoRepository.findById).mockResolvedValue(null);

      await expect(todoService.getTodoById("1")).rejects.toThrow(
        "Todo not found"
      );
    });

    it("should throw error when repository fails", async () => {
      vi.mocked(todoRepository.findById).mockRejectedValue(
        new Error("Database error")
      );

      await expect(todoService.getTodoById("1")).rejects.toThrow(
        "Database error"
      );
    });
  });

  describe("createTodo", () => {
    it("should create todo with valid input", async () => {
      const input = { text: "New todo" };
      const expectedTodo = {
        id: "123456789",
        text: "New todo",
        completed: false,
        createdAt: "2024-01-01T00:00:00.000Z",
        updatedAt: "2024-01-01T00:00:00.000Z",
      };

      // create 함수가 expectedTodo를 반환하도록 설정
      todoRepository.create = vi.fn().mockResolvedValue(expectedTodo);

      // Date 관련 모킹
      vi.spyOn(Date, "now").mockReturnValue(123456789);
      vi.spyOn(Date.prototype, "toISOString").mockReturnValue(
        "2024-01-01T00:00:00.000Z"
      );

      const result = await todoService.createTodo(input);

      expect(result).toEqual(expectedTodo);
      expect(todoRepository.create).toHaveBeenCalledWith(expectedTodo);
    });

    it("should throw error when text is empty", async () => {
      const input = { text: "" };

      await expect(todoService.createTodo(input)).rejects.toThrow(
        "Todo text cannot be empty"
      );
      expect(todoRepository.create).not.toHaveBeenCalled();
    });

    it("should throw error when repository fails", async () => {
      const input = { text: "New todo" };
      vi.mocked(todoRepository.create).mockRejectedValue(
        new Error("Database error")
      );

      await expect(todoService.createTodo(input)).rejects.toThrow(
        "Database error"
      );
    });
  });

  describe("updateTodo", () => {
    it("should update todo with valid input", async () => {
      const input = { text: "Updated todo", completed: true };
      const updatedTodo = { ...mockTodo, ...input };
      vi.mocked(todoRepository.findById).mockResolvedValue(mockTodo);
      vi.mocked(todoRepository.update).mockResolvedValue(updatedTodo);

      const result = await todoService.updateTodo("1", input);
      expect(result).toEqual(updatedTodo);
      expect(todoRepository.update).toHaveBeenCalledWith("1", input);
    });

    it("should throw error when todo not found", async () => {
      const input = { text: "Updated todo" };
      vi.mocked(todoRepository.findById).mockResolvedValue(null);

      await expect(todoService.updateTodo("1", input)).rejects.toThrow(
        "Todo not found"
      );
      expect(todoRepository.update).not.toHaveBeenCalled();
    });

    it("should throw error when text is empty", async () => {
      const input = { text: "" };
      vi.mocked(todoRepository.findById).mockResolvedValue(mockTodo);

      await expect(todoService.updateTodo("1", input)).rejects.toThrow(
        "Todo text cannot be empty"
      );
      expect(todoRepository.update).not.toHaveBeenCalled();
    });

    it("should throw error when repository fails", async () => {
      const input = { text: "Updated todo" };
      vi.mocked(todoRepository.findById).mockResolvedValue(mockTodo);
      vi.mocked(todoRepository.update).mockRejectedValue(
        new Error("Database error")
      );

      await expect(todoService.updateTodo("1", input)).rejects.toThrow(
        "Database error"
      );
    });
  });

  describe("deleteTodo", () => {
    it("should delete todo", async () => {
      vi.mocked(todoRepository.findById).mockResolvedValue(mockTodo);
      vi.mocked(todoRepository.delete).mockResolvedValue(true);

      await todoService.deleteTodo("1");
      expect(todoRepository.delete).toHaveBeenCalledWith("1");
    });

    it("should throw error when todo not found", async () => {
      vi.mocked(todoRepository.findById).mockResolvedValue(null);

      await expect(todoService.deleteTodo("1")).rejects.toThrow(
        "Todo not found"
      );
      expect(todoRepository.delete).not.toHaveBeenCalled();
    });

    it("should throw error when repository fails", async () => {
      vi.mocked(todoRepository.findById).mockResolvedValue(mockTodo);
      vi.mocked(todoRepository.delete).mockRejectedValue(
        new Error("Database error")
      );

      await expect(todoService.deleteTodo("1")).rejects.toThrow(
        "Database error"
      );
    });
  });
});
