import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { TodoApi } from '../../services/todoApi';

export interface Todo {
    id: string;
    title: string;
    description: string;
    isCompleted: boolean;
    createdAt: string;
    updatedAt?: string;
}

interface TodosState {
    items: Todo[];
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}

const initialState: TodosState = {
    items: [],
    status: 'idle',
    error: null
};

export const fetchTodos = createAsyncThunk(
    'todos/fetchTodos',
    async (status: boolean | null = null) => {
        const response = await TodoApi.getAllTodos(status);
        return response.data;
    }
);

export const addTodo = createAsyncThunk(
    'todos/addTodo',
    async (todo: { title: string; description: string }) => {
        const response = await TodoApi.createTodo(todo);
        return response.data;
    }
);

export const updateTodoStatus = createAsyncThunk(
    'todos/updateTodoStatus',
    async ({ id, isCompleted }: { id: string; isCompleted: boolean }) => {
        const response = await TodoApi.updateTodoStatus(id, isCompleted);
        return response.data;
    }
);

export const deleteTodo = createAsyncThunk(
    'todos/deleteTodo',
    async (id: string) => {
        await TodoApi.deleteTodo(id);
        return id;
    }
);

const todosSlice = createSlice({
    name: 'todos',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchTodos.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchTodos.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.items = action.payload;
            })
            .addCase(fetchTodos.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message || null;
            })
        // Add other cases for addTodo, updateTodoStatus, and deleteTodo
    }
});

export default todosSlice.reducer;