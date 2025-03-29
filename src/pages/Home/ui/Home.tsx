import { todoApi } from "@/entities/todo/api/todoApi";
import { Todo } from "@/entities/todo/model/types";
import { TodoInput } from "@/features/TodoInput/ui/TodoInput";
import { TodoList } from "@/widgets/TodoList/ui/TodoList";
import { useEffect, useState } from "react";

export const Home = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 초기 데이터 로딩
  const fetchTodos = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await todoApi.getAll();
      setTodos(data);
    } catch (err) {
      setError("할 일 목록을 불러오는데 실패했습니다");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // 컴포넌트 마운트 시 데이터 로딩
  useEffect(() => {
    fetchTodos();
  }, []);

  const handleCreateTodo = async (text: string) => {
    try {
      const newTodo = await todoApi.create({ text });
      setTodos((prevTodos) => [...prevTodos, newTodo]);
    } catch (err) {
      setError("할 일 생성에 실패했습니다");
      console.error(err);
    }
  };

  const handleToggleTodo = async (id: string) => {
    try {
      const todoToUpdate = todos.find((todo) => todo.id === id);
      if (!todoToUpdate) return;

      const updatedTodo = await todoApi.update(id, {
        completed: !todoToUpdate.completed,
      });

      setTodos((prevTodos) =>
        prevTodos.map((todo) => (todo.id === id ? updatedTodo : todo))
      );
    } catch (err) {
      setError("할 일 상태 변경에 실패했습니다");
      console.error(err);
    }
  };

  const handleDeleteTodo = async (id: string) => {
    try {
      await todoApi.delete(id);
      setTodos((prevTodos) => prevTodos.filter((todo) => todo.id !== id));
    } catch (err) {
      setError("할 일 삭제에 실패했습니다");
      console.error(err);
    }
  };

  return (
    <div className="mx-auto max-w-2xl p-4">
      <h1 className="text-2xl font-bold mb-4">할 일 목록</h1>
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      <TodoInput onSubmit={handleCreateTodo} />
      {isLoading ? (
        <div className="text-center py-4">로딩 중...</div>
      ) : (
        <TodoList
          todos={todos}
          onToggle={handleToggleTodo}
          onDelete={handleDeleteTodo}
        />
      )}
    </div>
  );
};
