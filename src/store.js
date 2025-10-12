import { configureStore, createSlice } from '@reduxjs/toolkit';

// Slice
const employeesSlice = createSlice({
  name: 'employees',
  initialState: JSON.parse(localStorage.getItem('employees') || '[]'),
  reducers: {
    addEmployee: (state, action) => {
      state.push(action.payload);
      localStorage.setItem('employees', JSON.stringify(state));
    },
    updateEmployee: (state, action) => {
      const { index, data } = action.payload;
      state[index] = data;
      localStorage.setItem('employees', JSON.stringify(state));
    },
    deleteEmployee: (state, action) => {
      const index = action.payload;
      state.splice(index, 1);
      localStorage.setItem('employees', JSON.stringify(state));
    }
  }
});

export const { addEmployee, updateEmployee, deleteEmployee } = employeesSlice.actions;

// Store
export const store = configureStore({
  reducer: {
    employees: employeesSlice.reducer
  }
});
