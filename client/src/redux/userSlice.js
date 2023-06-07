import {createSlice} from '@reduxjs/toolkit';

const initialState = {
    currentUser: null,
    loading: false,
    error: false
}

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        loginStart: (state) => {
            state.loading = true;
        },
        loginSuccess: (state,action) => {
            state.loading = false;
            state.currentUser = action.payload;
        },
        loginError: (state) => {
            state.loading = false;
            state.error = true;
        },
        logout: (state)=>{
            state.currentUser = null;
        },
    }
})

export const {loginStart, loginSuccess, loginError, logout} = userSlice.actions;

export default userSlice.reducer;