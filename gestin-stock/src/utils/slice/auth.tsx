import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import supabase from '../api';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

interface DataState {
  isLoggedIn: boolean;
  user: {};
}

const initialState: DataState = {
  isLoggedIn: false,
  user: {},
};

// Créez une action asynchrone avec createAsyncThunk pour gérer la connexion
export const login = createAsyncThunk(
  'auth/login',
  async (queries: { email: string; password: string }, thunkAPI) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: queries?.email,
        password: queries?.password,
      });
      if (!error) {
        return true; // Indique que la connexion a réussi
      } else {
        throw new Error('Login failed'); // Lance une erreur pour indiquer que la connexion a échoué
      }
    } catch (error) {
      throw error; // Rejette avec une valeur pour indiquer une erreur
    }
  }
);

const slice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    
  },
  extraReducers: (builder) => {
    // Gérez les cas de succès et d'échec de l'action asynchrone login
    builder.addCase(login.fulfilled, (state, action) => {
      state.isLoggedIn = true;
   
      // Redirigez l'utilisateur vers une autre page en utilisant useNavigate
    // Utilisez une chaîne pour indiquer la route
      // Affiche un toast pour indiquer la réussite de la connexion
      toast.success('Successfully logged in');
    });
    builder.addCase(login.rejected, (state) => {
      state.isLoggedIn = false;
      // Affiche un toast pour indiquer l'échec de la connexion
      toast.error('Error logging in');
    });
  },
});

export const {  } = slice.actions;

export const reducer = slice.reducer;
export default slice;
