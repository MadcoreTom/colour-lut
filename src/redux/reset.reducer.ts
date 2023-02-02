import { initialState, State } from "./state";

export function resetReducer(state: State) {
    const initial = initialState();
    state.trainingColours = initial.trainingColours;
    initial.results = [];
}
