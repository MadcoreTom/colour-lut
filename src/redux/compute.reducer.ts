import { hexToRgbhsl, RGB, RGBHSL, train, score, algorithm } from "../training";
import { State } from "./state";

export function computeReducer(state: State) {

    const trainingData = state.trainingColours.map(t => [hexToRgbhsl(t.source), hexToRgbhsl(t.target).slice(0, 3)] as [RGBHSL, RGB]);
    const [weights, finalScore] = train(100, trainingData);
    state.trainingColours = state.trainingColours.map(tc => {
        console.log("T",algorithm(hexToRgbhsl(tc.source),weights))
        return { 
            ...tc, 
            score: score(hexToRgbhsl(tc.source), hexToRgbhsl(tc.target).slice(0, 3) as RGB, weights),
            calculated: rgbToHex(algorithm(hexToRgbhsl(tc.source),weights))
        };
    });


    const inp = "000000,555555,aaaaaa,ffffff,550000,aa5555,ffaaaa, 555500,aaaa55,ffffaa,005500,55aa55,aaffaa, 005555,55aaaa,aaffff,000055,5555aa,aaaaff, 550055,aa55aa,ffaaff".split(/\s*,\s*/).map(v=>"#"+v);

    state.results = inp.map(i=>{
        return {from:i, to: rgbToHex(algorithm(hexToRgbhsl(i),weights))}
    })

    state.weights = weights;
}

// TODO move
export function rgbToHex(rgb:RGB):string{
    return "#"+
    ("00" + Math.floor(Math.min(1,rgb[0])*255).toString(16)).slice(-2) +
    ("00" + Math.floor(Math.min(1,rgb[1])*255).toString(16)).slice(-2) +
    ("00" + Math.floor(Math.min(1,rgb[2])*255).toString(16)).slice(-2);
}

console.log(rgbToHex([0,0,0]))
console.log(rgbToHex([1,1,1]))
console.log(rgbToHex([0.5,0.1,0.9]))