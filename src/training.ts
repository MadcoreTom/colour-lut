const WEIGFHT_NAMES_SUFFIX = [
    "Offset", "R mult", "G mult", "B mult", "H mult", "S mult", "L mult"
]
export const WEIGHT_NAMES = [
    WEIGFHT_NAMES_SUFFIX.map(s => "Red " + s),
    WEIGFHT_NAMES_SUFFIX.map(s => "Green " + s),
    WEIGFHT_NAMES_SUFFIX.map(s => "Blue " + s)
].flat();

const WEIGHTS = WEIGHT_NAMES.length;

export type RGBHSL = [number, number, number, number, number, number];
export type RGB = [number, number, number];


export function algorithm(rgbhsl: RGBHSL, weights: number[]):RGB{
    // basic (no square or inverse square)
    const out: RGB = [0,0,0];
    let i = 0;
    for (let x = 0; x < 3; x++) {
        out[x] = weights[i++] +
            rgbhsl[0] * weights[i++] +
            rgbhsl[1] * weights[i++] +
            rgbhsl[2] * weights[i++] +
            rgbhsl[3] * weights[i++] +
            rgbhsl[4] * weights[i++] +
            rgbhsl[5] * weights[i++];
    }
    return out.map(v=>Math.max(0,v)) as RGB;
}

export function score(input: RGBHSL, output: RGB, weights: number[]): number {
    // RGB 
    const a = algorithm(input, weights);
    const b = [output[0], output[1], output[2]];
    let dsq = 0;
    for (let i = 0; i < a.length; i++) {
        dsq += (a[i] - b[i]) * (a[i] - b[i]);
    }
    return dsq;
}

function scoreAll(training: [RGBHSL, RGB][], weights: number[]): number {
    let total = 0;
    for (let t of training) {
        total += score(t[0], t[1], weights);
    }
    return total;
}

export function hexToRgbhsl(hex): RGBHSL {
    hex = hex.slice(1, 7);
    const r = parseInt(hex.slice(0, 2), 16) / 255;
    const g = parseInt(hex.slice(2, 4), 16) / 255;
    const b = parseInt(hex.slice(4, 6), 16) / 255;
    let hsl = rgbToHsl([r, g, b]);
    hsl[0] /= 360;
    hsl[1] /= 100;
    hsl[2] /= 100;
    return [r, g, b, ...hsl];
}

export function rgbToHsl(rgb: RGB): [number, number, number] {
    // https://www.30secondsofcode.org/js/s/rgb-to-hsl (modified)
    const [r, g, b] = rgb;
    const l = Math.max(r, g, b);
    const s = l - Math.min(r, g, b);
    const h = s
        ? l === r
            ? (g - b) / s
            : l === g
                ? 2 + (b - r) / s
                : 4 + (r - g) / s
        : 0;
    return [
        60 * h < 0 ? 60 * h + 360 : 60 * h,
        100 * (s ? (l <= 0.5 ? s / (2 * l - s) : s / (2 - (2 * l - s))) : 0),
        (100 * (2 * l - s)) / 2,
    ];
};

export function train(iterations: number, training: [RGBHSL, RGB][]): [number[], number] {
    // start at 0.5
    let weights = WEIGHT_NAMES.map(n => 0.5);
    // initialise
    let bestWeights = [...weights];
    let bestScore = scoreAll(training, weights);
    // loop
    for (let i = 0; i < iterations; i++) {
        // each attempt
        for (let x = 0; x < weights.length; x++) {
            const testWeights = [...bestWeights];
            testWeights[x] += (Math.random() * 0.1 - 0.05);
            const testScore = scoreAll(training, testWeights);
            if (testScore < bestScore) {
                bestScore = testScore;
                bestWeights = testWeights;
            }
        }
        console.log("BEST", bestWeights, bestScore);
    }
    return [bestWeights, bestScore]
}