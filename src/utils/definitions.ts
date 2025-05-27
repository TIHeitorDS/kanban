export interface Task {
  id: string;
  status: "todos" | "doing" | "done";
  title: string;
  createdAt: string;
}
