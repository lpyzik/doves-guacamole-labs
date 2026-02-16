import React from "react";
import { Link } from "react-router-dom";
import { apiUrl } from "../../../configs/api";

import { ContextNotifications } from '../../../utils/ContextNotifiations'

export class LabBrief extends React.Component
{
    startLab = () =>
    {
        let prom = fetch(`${apiUrl}/labs/${this.props.name}/command`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                action: 'start'
            })
        }).then((r) => { this.props.onRefresh(r.json()); return r; })

        this.context.addNotification({
            title: `${this.props.name}`,
            promise: new Promise((res, rj) => {prom.then((v) => {if(v.status < 400) res(v); else rj(v);}).catch((e) => rj(e))}),
            pendingText: `Starting lab ${this.props.name}...`,
            fulfilledText: `Lab ${this.props.name} started.`,
            rejectedText: `Failed to start lab ${this.props.name}`
        });
    }

    stopLab = () =>
    {
        let prom = fetch(`${apiUrl}/labs/${this.props.name}/command`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                action: 'stop'
            })
        }).then((r) => { this.props.onRefresh(r.json()); return r; })

        this.context.addNotification({
            title: `${this.props.name}`,
            promise: new Promise((res, rj) => {prom.then((v) => {if(v.status < 400) res(v); else rj(v);}).catch((e) => rj(e))}),
            pendingText: `Stopping lab ${this.props.name}...`,
            fulfilledText: `Lab ${this.props.name} stopped.`,
            rejectedText: `Failed to stop lab ${this.props.name}`
        });
    }

    render()
    {
        return(
            <div className='lab-brief'>
                <img src={`/img/icons/lab-${this.props.type}.svg`} alt={this.props.type} style={{width:'3rem',height:'auto'}}/>
                <div>{this.props.name}</div>
                <div className={`
                    up ${this.props.up === 100 ? 'full-up' : this.props.up > 50 ? 'm2h-up' : 'l2h-up'}                   
                `}>{this.props.up}% up</div>
                <div style={{display:'inline', margin:'auto'}}></div>
                <button className='pod-element-button'>
                    <div className='link' onClick={() => {this.startLab()}}><img src='/img/icons/start.svg' title='Start' alt='start'/></div>
                </button>
                <button className='pod-element-button'>
                    <div className='link' onClick={() => {this.stopLab()}}><img src='/img/icons/stop.svg' title='Stop' alt='stop'/></div>
                </button>
                <Link className='link' to={this.props.name}><img src='/img/icons/go.svg' title='Open' alt='go'/></Link>
            </div>
        )
    }
}

LabBrief.contextType = ContextNotifications;