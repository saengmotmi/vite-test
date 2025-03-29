import { Todo } from "@/entities/todo/model/types";
import { TodoItem } from "@/entities/todo/ui/TodoItem";

interface TodoListProps {
  todos: Todo[];
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

export const TodoList = ({ todos, onToggle, onDelete }: TodoListProps) => {
  if (todos.length === 0) {
    return (
      <div className="flex min-h-[200px] flex-col items-center justify-center rounded-md border border-dashed">
        <p className="text-sm text-muted-foreground">할 일이 없습니다.</p>
      </div>
    );
  }

  return (
    <ul className="space-y-2">
      {todos.map((todo) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onToggle={onToggle}
          onDelete={onDelete}
        />
      ))}
    </ul>
  );
};
