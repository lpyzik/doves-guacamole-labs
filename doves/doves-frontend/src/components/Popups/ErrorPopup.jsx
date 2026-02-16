import React from "react";
import { Portal } from "react-portal";

import './Popups.css';

export class ErrorPopup extends React.Component
{
    render()
    {
        return(
            <Portal>
                <div className='popup'>
                    <div className='popup-inner'>
                        <h2>{this.props.title}</h2>
                        <p>{this.props.text}</p>
                        <div style={{display:'flex', columnGap:'0.5rem'}}>
                            <div style={{margin:'auto'}}/>
                            <button className='popup-confirm' onClick={this.props.onConfirm}>Confirm</button>
                        </div>
                    </div>
                </div>
            </Portal>
        );
    }
}