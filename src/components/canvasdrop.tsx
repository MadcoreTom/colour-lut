import * as React from "react";
import { useDispatch, useSelector } from "react-redux";
import { rgbToHex } from "../redux/compute.reducer";
import { RootState } from "../redux/state";
import { loadImage } from "../redux/store";
import { algorithm, RGB, RGBHSL, rgbToHsl } from "../training";
import { Button } from "./common";

export function CanvasDrop(props: { width: number, height: number }): any {
    const dispatch = useDispatch();
    const imageLoaded = useSelector((state: RootState) => state.main.imageLoaded);
    const weights = useSelector((state: RootState) => state.main.weights);
    const canvas = React.createRef<HTMLCanvasElement>();

    return <div>
        <canvas
            width={props.width}
            height={props.height}
            ref={canvas}
            onDragOver={e => e.preventDefault()}
            onDrop={e => drop(e, canvas, data => dispatch(loadImage({ loaded: true, dataUrl: data })))} />
        {
            imageLoaded ?
                <div className="buttons">
                    <Button text="Apply to Image" onClick={() => { applyTransform(canvas, weights) }} />
                    <Button text="Reset Image" onClick={() => { drawImage(canvas.current, imageLoaded.data) }} />
                    <Button text="Clear Image" onClick={() => { dispatch(loadImage({ loaded: false })); clearCanvas(canvas) }} />
                </div> :
                <p>Drag an image into the area above to test the palette</p>
        }
    </div>
}

function applyTransform(canvasRef: React.RefObject<HTMLCanvasElement>, weights: number[]) {
    const canvas = canvasRef.current;
    if (canvas) {
        const generator = applyImageAlgorithm(canvas, weights, 8);
        const step = () => {
            const cur = generator.next();
            if (!cur.done) {
                window.requestAnimationFrame(step);
            } else {
                console.log("done");
            }
        }
        step();
    }
}

function drop(e: React.DragEvent<HTMLCanvasElement>, canvas: React.RefObject<HTMLCanvasElement>, onLoad: (data: string) => void) {
    e.preventDefault();
    e.stopPropagation();
    if (!e.dataTransfer || !e.dataTransfer.files) {
        console.warn("No file dropped");
        return;
    }

    const reader = new FileReader();
    const file = e.dataTransfer.files[0];

    reader.onload = () => {
        const canv = canvas.current;
        console.log("loaded");
        if (reader.result && canv) {
            const data = reader.result.toString();
            drawImage(canv, data).then(() => onLoad(data));
        } else {
            console.warn("Error loading");
        }
    }

    reader.readAsDataURL(file);
}

function clearCanvas(canvasRef: React.RefObject<HTMLCanvasElement>) {
    const canvas = canvasRef.current;
    if (canvas) {
        const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
        ctx.fillStyle = "white";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
}

async function drawImage(canvas: HTMLCanvasElement, data: string): Promise<void> {
    return new Promise<void>((resolve, reject) => {
        const image = new Image();
        image.onload = () => {
            const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
            ctx.fillStyle = "white";
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(image, 0, 0, image.width, image.height, 0, 0, canvas.width, canvas.height);
            resolve();
        }
        image.src = data;
    });
}

/**
 * Generator function. Processes each pixel of the canvas, and yeilds every n rows.
 * Applies the algorithm with supplied weights to the current pixel values
 * @param weights 
 */
function* applyImageAlgorithm(canvas: HTMLCanvasElement, weights: number[], rowsPerYeild: number) {
    const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
    const data = ctx.getImageData(0, 0, canvas.width, canvas.height);
    let offset = 0;
    let i = 0;
    for (let y = 0; y < canvas.height; y++) {
        for (let x = 0; x < canvas.width; x++) {
            const rgb = [data.data[offset + 0], data.data[offset + 1], data.data[offset + 2]].map(a => a / 255) as RGB;
            const rgbhsl = [...rgb, ...rgbToHsl(rgb)] as RGBHSL;

            rgbhsl[3] /= 360;
            rgbhsl[4] /= 100;
            rgbhsl[5] /= 100;
            const out = algorithm(rgbhsl, weights) as RGB;
            const hex = rgbToHex(out);
            ctx.fillStyle = hex;
            ctx.fillRect(x, y, 1, 1);
            offset += 4;
        }
        if (i++ >= rowsPerYeild) {
            i = 0;
            yield;
        }
    }
    yield;

    const rgb = [data.data[0], data.data[1], data.data[2]].map(a => a / 255) as RGB;
    const rgbhsl = [...rgb, ...rgbToHsl(rgb)] as RGBHSL;

    rgbhsl[3] /= 360;
    rgbhsl[4] /= 100;
    rgbhsl[5] /= 100;
    const out = algorithm(rgbhsl, weights).map(a => a / 255) as RGB;
    const hex = rgbToHex(out);
    ctx.fillStyle = hex;
    console.log(rgbhsl, out, hex)
}