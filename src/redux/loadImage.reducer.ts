import { State } from "./state";

export function loadImageReducer(state: State, action: { payload: { loaded: boolean, dataUrl?: string } }) {
    if (action.payload.loaded && action.payload.dataUrl) {
        state.imageLoaded = { data: action.payload.dataUrl };
    } else {
        state.imageLoaded = false;
    }
}