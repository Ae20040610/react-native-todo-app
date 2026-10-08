import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import api, { errMsg } from '../api/client';
import { Filter, NewTask, SortMode, Task } from '../types';
import { logout } from './authSlice';

interface TasksState {
  items: Task[];
  loading: boolean;
  error: string | null;
  filter: Filter;
  sort: SortMode;
}
const initialState: TasksState = { items: [], loading: false, error: null, filter: 'all', sort: 'smart' };

type Cfg = { rejectValue: string };

export const fetchTasks = createAsyncThunk<Task[], void, Cfg>('tasks/fetch', async (_, { rejectWithValue }) => {
  try {
    return (await api.get<Task[]>('/tasks')).data;
  } catch (e) {
    return rejectWithValue(errMsg(e));
  }
});

export const addTask = createAsyncThunk<Task, NewTask, Cfg>('tasks/add', async (task, { rejectWithValue }) => {
  try {
    return (await api.post<Task>('/tasks', task)).data;
  } catch (e) {
    return rejectWithValue(errMsg(e));
  }
});

// Flip the completed flag on the server and return the updated task
export const toggleTask = createAsyncThunk<Task, Task, Cfg>('tasks/toggle', async (task, { rejectWithValue }) => {
  try {
    return (await api.patch<Task>(`/tasks/${task._id}`, { completed: !task.completed })).data;
  } catch (e) {
    return rejectWithValue(errMsg(e));
  }
});

export const removeTask = createAsyncThunk<string, string, Cfg>('tasks/remove', async (id, { rejectWithValue }) => {
  try {
    await api.delete(`/tasks/${id}`);
    return id;
  } catch (e) {
    return rejectWithValue(errMsg(e));
  }
});

const slice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    setFilter: (s, a: PayloadAction<Filter>) => {
      s.filter = a.payload;
    },
    setSort: (s, a: PayloadAction<SortMode>) => {
      s.sort = a.payload;
    },
    clearTasksError: (s) => {
      s.error = null;
    },
  },
  extraReducers: (b) => {
    b.addCase(fetchTasks.pending, (s) => {
      s.loading = true;
      s.error = null;
    });
    b.addCase(fetchTasks.fulfilled, (s, a) => {
      s.loading = false;
      s.items = a.payload;
    });
    b.addCase(fetchTasks.rejected, (s, a) => {
      s.loading = false;
      s.error = a.payload ?? 'Failed to load tasks';
    });
    b.addCase(addTask.fulfilled, (s, a) => {
      s.items.unshift(a.payload);
    });
    b.addCase(toggleTask.fulfilled, (s, a) => {
      const i = s.items.findIndex((t) => t._id === a.payload._id);
      if (i >= 0) s.items[i] = a.payload;
    });
    b.addCase(removeTask.fulfilled, (s, a) => {
      s.items = s.items.filter((t) => t._id !== a.payload);
    });
    // Wipe tasks on logout so the next user never sees them
    b.addCase(logout.fulfilled, () => initialState);
  },
});

export const { setFilter, setSort, clearTasksError } = slice.actions;
export default slice.reducer;
