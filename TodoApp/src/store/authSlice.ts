import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api, { errMsg } from '../api/client';
import { User } from '../types';

interface AuthState {
  token: string | null;
  user: User | null;
  loading: boolean;
  error: string | null;
  bootstrapped: boolean; // true once we've checked AsyncStorage for a saved session
}
const initialState: AuthState = { token: null, user: null, loading: false, error: null, bootstrapped: false };

type Creds = { email: string; password: string };
type AuthResp = { token: string; user: User };

// Save session so the user stays logged in after restarting the app
const persist = async (data: AuthResp) => {
  await AsyncStorage.setItem('token', data.token);
  await AsyncStorage.setItem('user', JSON.stringify(data.user));
};

export const restoreSession = createAsyncThunk('auth/restore', async () => {
  const token = await AsyncStorage.getItem('token');
  const user = await AsyncStorage.getItem('user');
  return token && user ? ({ token, user: JSON.parse(user) } as AuthResp) : null;
});

export const login = createAsyncThunk<AuthResp, Creds, { rejectValue: string }>(
  'auth/login',
  async (creds, { rejectWithValue }) => {
    try {
      const { data } = await api.post<AuthResp>('/auth/login', creds);
      await persist(data);
      return data;
    } catch (e) {
      return rejectWithValue(errMsg(e));
    }
  },
);

export const register = createAsyncThunk<AuthResp, Creds, { rejectValue: string }>(
  'auth/register',
  async (creds, { rejectWithValue }) => {
    try {
      const { data } = await api.post<AuthResp>('/auth/register', creds);
      await persist(data);
      return data;
    } catch (e) {
      return rejectWithValue(errMsg(e));
    }
  },
);

export const logout = createAsyncThunk('auth/logout', async () => {
  await AsyncStorage.removeItem('token');
  await AsyncStorage.removeItem('user');
});

const slice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (s) => {
      s.error = null;
    },
  },
  extraReducers: (b) => {
    b.addCase(restoreSession.fulfilled, (s, a) => {
      s.bootstrapped = true;
      if (a.payload) {
        s.token = a.payload.token;
        s.user = a.payload.user;
      }
    });
    b.addCase(restoreSession.rejected, (s) => {
      s.bootstrapped = true;
    });
    [login, register].forEach((thunk) => {
      b.addCase(thunk.pending, (s) => {
        s.loading = true;
        s.error = null;
      });
      b.addCase(thunk.fulfilled, (s, a) => {
        s.loading = false;
        s.token = a.payload.token;
        s.user = a.payload.user;
      });
      b.addCase(thunk.rejected, (s, a) => {
        s.loading = false;
        s.error = (a.payload as string) ?? 'Failed';
      });
    });
    b.addCase(logout.fulfilled, (s) => {
      s.token = null;
      s.user = null;
    });
  },
});

export const { clearError } = slice.actions;
export default slice.reducer;