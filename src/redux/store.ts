import { configureStore, createSlice } from '@reduxjs/toolkit'
import { computeReducer } from './compute.reducer';
import { loadImageReducer } from './loadImage.reducer';
import { resetReducer } from './reset.reducer';
import { initialState } from "./state";
import { addTrainingReducer, updateTrainingReducer } from "./training.reducer";

const mainSlice = createSlice({
    name: "main",
    initialState: initialState(),
    reducers: {
        addTraining: addTrainingReducer,
        updateTraining: updateTrainingReducer,
        reset: resetReducer,
        compute: computeReducer,
        loadImage: loadImageReducer
    }
});

export const store = configureStore({
    reducer: {
        main: mainSlice.reducer
    }
});

export const {
    addTraining,
    updateTraining,
    reset,
    compute,
    loadImage
} = mainSlice.actions;