import * as React from "react";

export function Button(props: { text: string, onClick: () => any, buttonClass?: string }) {
    return <button className={`button ${props.buttonClass}`} onClick={() => props.onClick()}>
        <span>{props.text}</span>
    </button>
}