import { Todo } from "@/entities/todo/model/types";
import { TodoInput } from "@/features/TodoInput/ui/TodoInput";
import { TodoList } from "@/widgets/TodoList/ui/TodoList";
import { useState } from "react";

export const Home = () => {
  const [todos, setTodos] = useState<Todo[]>([]);

  const handleCreateTodo = (text: string) => {
    const newTodo: Todo = {
      id: Date.now().toString(),
      text,
      completed: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setTodos([...todos, newTodo]);
  };

  const handleToggleTodo = (id: string) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const handleDeleteTodo = (id: string) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  return (
    <div className="mx-auto max-w-2xl">
      <TodoInput onSubmit={handleCreateTodo} />
      <TodoList
        todos={todos}
        onToggle={handleToggleTodo}
        onDelete={handleDeleteTodo}
      />
    </div>
  );
};
