import {
  useCreateTodo,
  useDeleteTodo,
  useTodos,
  useUpdateTodo,
} from "@/entities/todo/model/useTodoQueries";
import { TodoInput } from "@/features/TodoInput/ui/TodoInput";
import { TodoList } from "@/widgets/TodoList/ui/TodoList";

export const Home = () => {
  // React Query 훅 사용
  const todosQuery = useTodos();
  const createTodoMutation = useCreateTodo();
  const updateTodoMutation = useUpdateTodo();
  const deleteTodoMutation = useDeleteTodo();

  // 로딩/에러 상태
  const isLoading = todosQuery.isLoading;
  const error = todosQuery.error
    ? "할 일 목록을 불러오는데 실패했습니다"
    : createTodoMutation.error ||
      updateTodoMutation.error ||
      deleteTodoMutation.error
    ? "작업 처리 중 오류가 발생했습니다"
    : null;

  // 할 일 목록 데이터
  const todos = todosQuery.data || [];

  // 할 일 생성 핸들러
  const handleCreateTodo = async (text: string) => {
    createTodoMutation.mutate({ text });
  };

  // 할 일 토글 핸들러
  const handleToggleTodo = async (id: string) => {
    const todoToUpdate = todos.find((todo) => todo.id === id);
    if (!todoToUpdate) return;

    updateTodoMutation.mutate({
      id,
      input: { completed: !todoToUpdate.completed },
    });
  };

  // 할 일 삭제 핸들러
  const handleDeleteTodo = async (id: string) => {
    deleteTodoMutation.mutate(id);
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

      {(createTodoMutation.isPending ||
        updateTodoMutation.isPending ||
        deleteTodoMutation.isPending) && (
        <div className="fixed bottom-4 right-4 bg-blue-500 text-white px-4 py-2 rounded-full shadow-lg">
          작업 중...
        </div>
      )}
    </div>
  );
};
