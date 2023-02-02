import * as React from "react";
import { createRoot } from 'react-dom/client';
import { Provider } from "react-redux";
import { NavBar } from "./components/nav";
import { TrainingTable } from "./components/training";
import { store } from "./redux/store";
import { useSelector } from "react-redux";
import { RootState } from "./redux/state";
import { algorithm, RGB, RGBHSL, rgbToHsl } from "./training";
import { rgbToHex } from "./redux/compute.reducer";
import { CanvasDrop } from "./components/canvasdrop";


function App() {
    const results = useSelector((state: RootState) => state.main.results);

    return <div className="main">
        <NavBar />
        <div className="my-columns">
            <div style={{ minWidth: "200px" }}>
                <div style={{width:"300px"}}>
                    <p style={{fontSize:"80%"}}>
                        This toy uses "gradient descent" to convert source-to-target colour mappings to an algorithm. You can apply this to images in the dotted box.
                        <ul>
                            <li>Click the Source and Target colour swatches to change them (try making all reds yellow)</li>
                            <li>Click Compute, and see the calculated & score columns populate, along as some other examples in the Results column</li>
                            <li>Drag and drop an image from your computer into the dotted outline square</li>
                            <li>Press "Apply to Image" to apply your colour mapping algorithm</li>
                        </ul>
                    </p>
                </div>
                <TrainingTable />
            </div>
            <div>
                <h2>Results</h2>
                <div>
                    {results.map(r => <div style={{ width: "50px", height: "50px", backgroundColor: r.to, borderLeft: `50px solid ${r.from}`, boxSizing: "content-box", borderRadius: "25px" }} />)}
                </div>
            </div>
            <div>
                <CanvasDrop width={400} height={400} />

            </div>
        </div>
    </div>
}

createRoot(document.querySelector("#root") as HTMLElement)
    .render(<Provider store={store}><App /></Provider>,);