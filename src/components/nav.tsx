import * as React from "react";
import { Button } from "./common";
import { useDispatch } from "react-redux";
import { compute, reset } from "../redux/store";

export function NavBar() {
    const dispatch = useDispatch();
    return <nav className="navbar is-dark" role="navigation" aria-label="main navigation">
        <div className="navbar-brand">
            <h1 className="app-name">Colour LUT</h1>
        </div>
        <div className="navbar-menu">
            <div className="navbar-end">
                <div className="navbar-item">
                    <div className="buttons">
                        <Button text="Compute" onClick={() => dispatch(compute())} buttonClass="is-primary"/>
                        <Button text="Reset" buttonClass="is-danger" onClick={() => dispatch(reset())} />
                    </div>
                </div>
            </div>
        </div>
    </nav>
}
