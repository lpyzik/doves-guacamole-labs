import React from "react";
import { Link } from "react-router-dom";

import './Error.css'

export class LoadingError extends React.Component
{
    render()
    {
        return(
            <div>
                <h1>Error</h1>
                <Link className='a-link' to='/'>Go to Dashboard</Link>
                <hr/>
                <h2>An error occured.</h2>
                <div className='error-explanation'>{this.props.error.message}</div>
            </div>
        );
    }
}