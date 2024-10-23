import api from "./axiosClient";

export const TodoApi = {
    getAllTodos: (status: boolean | null = null) =>
        api.get(`/todo${status !== null ? `?isCompleted=${status}` : ''}`),

    createTodo: (todo: { title: string; description: string }) =>
        api.post('/todo', todo),

    updateTodoStatus: (id: string, isCompleted: boolean) =>
        api.put(`/todo/${id}/status`, isCompleted),

    deleteTodo: (id: string) =>
        api.delete(`/todo/${id}`)
};