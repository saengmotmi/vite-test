import { TodoRepositoryImpl } from "./todoRepositoryImpl";
import { TodoService } from "./todoService";

// 의존성 주입을 위한 싱글톤 인스턴스 생성
const todoRepository = new TodoRepositoryImpl();
const todoService = new TodoService(todoRepository);

export { todoService };
