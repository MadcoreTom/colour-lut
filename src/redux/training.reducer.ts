import { State, TrainingColour } from "./state";

export function addTrainingReducer(state: State) {
    state.trainingColours = [
        ...state.trainingColours,
        { source: "FF0000", target: "FF0000" }
    ];
}

export function updateTrainingReducer(state: State, action: { payload: { idx: number, training: TrainingColour } }) {
    const { idx, training } = action.payload;
    state.trainingColours = [...state.trainingColours];
    state.trainingColours[idx] = training;
}