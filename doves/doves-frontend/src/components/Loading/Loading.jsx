import React from "react";
import './Loading.css'

export class Loading extends React.Component
{
    render()
    {
        return(
            <div className="loading-container">
                <div className="ripple-loading" aria-label="loading"></div>
            </div>
        );
    }
}