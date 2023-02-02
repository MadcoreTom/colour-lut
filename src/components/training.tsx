import * as React from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, TrainingColour } from "../redux/state";
import { addTraining, updateTraining } from "../redux/store";
import { Button } from "./common";


export function TrainingTable() {
    const dispatch = useDispatch();
    const colours = useSelector((state: RootState) => state.main.trainingColours);

    return <div className="table-container">
        <table className="table" style={{ width: "100%" }}>
            <thead>
                <tr>
                    <th>Source</th>
                    <th>Target</th>
                    <th>Calculated</th>
                    <th>Score</th>
                </tr>
            </thead>
            <tbody>
                {colours.map((c, i) => <TrainingTableRow colour={c} idx={i} />)}
                <tr>
                    <td colSpan={4}>
                        <Button text="Add Colour" onClick={() => dispatch(addTraining())} buttonClass="is-fullwidth is-small" />
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
}

function TrainingTableRow(props: { colour: TrainingColour, idx: number }) {
    const dispatch = useDispatch();
    return <tr key={props.idx}>
        <td>
            <input type="color" value={props.colour.source} onChange={evt => dispatch(updateTraining({ idx: props.idx, training: { ...props.colour, source: evt.target.value } }))} />
        </td>
        <td>
            <input type="color" value={props.colour.target} onChange={evt => dispatch(updateTraining({ idx: props.idx, training: { ...props.colour, target: evt.target.value } }))} />
        </td>
        <td>
            {props.colour.score ? props.colour.score.toFixed(4) : null}
        </td>
        <td>
           {props.colour.calculated ? <div style={{width:"50px",height:"50px",backgroundColor:props.colour.calculated}} /> : null}
        </td>
    </tr>
}