import React from "react";
import { Link } from "react-router-dom";

import './Notification.css';

export class Notification extends React.Component
{
    constructor(props)
    {
        super(props);
        this.state = {
            expanded: true
        }
    }

    render()
    {
        return(
            <div className={`notification notification-${this.props.type}`}>
                <div className='notification-icon-container'>
                    {
                        this.props.type !== 'progress' &&
                        <img src={`/img/icons/icon-notification-${this.props.type}.svg`} alt='' style={{width:'80%'}}/>
                    }
                    {
                        this.props.type === 'progress' &&
                        <div className="ripple-loading"></div>
                    }        
                </div>
                <div className='notification-container'>
                    <h3>{`${
                        this.props.type === 'warning' ? 'Warning' : 
                        this.props.type === 'error' ? 'Error' : 
                        this.props.type === 'info' ? 'Info' :
                        this.props.type === 'progress' ? 'Pending' : ''}: `}
                    {this.props.title}</h3>
                    
                    <code className='datetime'>
                        {this.props.datetime.toLocaleString()}
                    </code>

                    <span className='desc' style={{...(this.state.expanded ? {} : { display:'none' }) }}>
                        {this.props.description}
                    </span>
                    {
                        this.props.activator &&
                        <div>Notification issued by <Link className='a-link' 
                        to={`/${this.props.activator.type}/${this.props.activator.name}`}>{this.props.activator.name}</Link>.
                        </div>
                    }
                </div>
                <div className='notification-icon-container notification-icon-container-close' onClick={() => {this.props.onClose()}}>
                    <img src='/img/icons/close.svg' alt='close'/>
                </div>
            </div>
        );
    }
}