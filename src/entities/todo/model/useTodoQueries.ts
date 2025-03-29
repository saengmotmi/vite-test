import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { todoApi } from "../api/todoApi";
import { CreateTodoInput, Todo, UpdateTodoInput } from "./types";

// Query Keys
export const TODO_QUERY_KEYS = {
  all: ["todos"] as const,
  lists: () => [...TODO_QUERY_KEYS.all, "list"] as const,
  detail: (id: string) => [...TODO_QUERY_KEYS.all, "detail", id] as const,
};

// Todo 목록 조회 훅
export const useTodos = () => {
  return useQuery({
    queryKey: TODO_QUERY_KEYS.lists(),
    queryFn: () => todoApi.getAll(),
  });
};

// 특정 Todo 조회 훅
export const useTodo = (id: string) => {
  return useQuery({
    queryKey: TODO_QUERY_KEYS.detail(id),
    queryFn: () => todoApi.getById(id),
    enabled: !!id, // id가 있을 때만 쿼리 실행
  });
};

// Todo 생성 훅
export const useCreateTodo = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateTodoInput) => todoApi.create(input),
    onSuccess: (newTodo) => {
      // 캐시 업데이트
      queryClient.setQueryData<Todo[]>(
        TODO_QUERY_KEYS.lists(),
        (oldTodos = []) => [...oldTodos, newTodo]
      );
      // Todo 목록 쿼리 무효화
      queryClient.invalidateQueries({
        queryKey: TODO_QUERY_KEYS.lists(),
      });
    },
  });
};

// Todo 업데이트 훅
export const useUpdateTodo = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateTodoInput }) =>
      todoApi.update(id, input),
    onSuccess: (updatedTodo) => {
      // 개별 Todo 캐시 업데이트
      queryClient.setQueryData(
        TODO_QUERY_KEYS.detail(updatedTodo.id),
        updatedTodo
      );

      // Todo 목록 캐시 업데이트
      queryClient.setQueryData<Todo[]>(
        TODO_QUERY_KEYS.lists(),
        (oldTodos = []) =>
          oldTodos.map((todo) =>
            todo.id === updatedTodo.id ? updatedTodo : todo
          )
      );

      // Todo 목록 쿼리 무효화
      queryClient.invalidateQueries({
        queryKey: TODO_QUERY_KEYS.lists(),
      });
    },
  });
};

// Todo 삭제 훅
export const useDeleteTodo = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => todoApi.delete(id),
    onSuccess: (_, id) => {
      // Todo 목록 캐시 업데이트
      queryClient.setQueryData<Todo[]>(
        TODO_QUERY_KEYS.lists(),
        (oldTodos = []) => oldTodos.filter((todo) => todo.id !== id)
      );

      // 삭제된 Todo 캐시 제거
      queryClient.removeQueries({
        queryKey: TODO_QUERY_KEYS.detail(id),
      });

      // Todo 목록 쿼리 무효화
      queryClient.invalidateQueries({
        queryKey: TODO_QUERY_KEYS.lists(),
      });
    },
  });
};
