export type TrainingColour = {
    source: string,
    target: string,
    calculated?: string,
    score?: number
}

export type State = {
    trainingColours: TrainingColour[]
    results: { from: string, to: string }[],
    weights?: number[],
    imageLoaded: false | { data: string }
}

export type RootState = { main: State }

export function initialState(): State {
    return {
        trainingColours: [
            { source: "#FF0000", target: "#FF2200" },
            { source: "#00FF00", target: "#00FF22" },
            { source: "#0000FF", target: "#2200FF" },
            { source: "#000000", target: "#220000" },
            { source: "#555555", target: "#776666" },
            { source: "#ffffff", target: "#eeeeee" },
        ],
        results: [],
        imageLoaded: false
    }
}