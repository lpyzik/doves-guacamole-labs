import React from "react";
import { Link } from "react-router-dom";
import { apiUrl } from "../../../configs/api";
import { ContextNotifications } from "../../../utils/ContextNotifiations";

export class MachineBrief extends React.Component
{
    startMachine = () => 
    {
        let prom = fetch(`${apiUrl}/labs/${this.props.lab}/machines/${this.props.name}/command`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                action: 'start'
            })
        }).then((r) => { this.props.onRefresh(); return r; });

        this.context.addNotification({
            title: `${this.props.name}`,
            promise: new Promise((res, rj) => {prom.then((v) => {if(v.status < 400) res(v); else rj(v);}).catch((e) => rj(e))}),
            pendingText: `Starting machine ${this.props.lab}/${this.props.name}...`,
            fulfilledText: `Machine ${this.props.lab}/${this.props.name} started.`,
            rejectedText: `Failed to start machine ${this.props.lab}/${this.props.name}`
        });
    }

    stopMachine = () =>
    {
        let prom = fetch(`${apiUrl}/labs/${this.props.lab}/machines/${this.props.name}/command`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                action: 'stop'
            })
        }).then((r) => { this.props.onRefresh(); return r});

        this.context.addNotification({
            title: `${this.props.name}`,
            promise: new Promise((res, rj) => {prom.then((v) => {if(v.status < 400) res(v); else rj(v);}).catch((e) => rj(e))}),
            pendingText: `Stopping machine ${this.props.lab}/${this.props.name}...`,
            fulfilledText: `Machine ${this.props.lab}/${this.props.name} stopped.`,
            rejectedText: `Failed to stop machine ${this.props.lab}/${this.props.name}`
        });
    }

    render()
    {
        return(
            <div className='lab-brief'>
                <div className='name'>{this.props.name}</div>
                <div className={`
                    up ${this.props.status === 'running' ? 'machine-running' : 
                    this.props.status === 'stopped' ? 'machine-stopped' :
                    'machine-error'}                   
                `}>{this.props.status}</div>
                <div style={{display:'inline', margin:'auto'}}></div>
                <button className='pod-element-button'>
                    <div className='link' onClick={() => {this.startMachine()}}><img src='/img/icons/start.svg' title='Start' alt='start'/></div>
                </button>
                <button className='pod-element-button'>
                    <div className='link' onClick={() => {this.stopMachine()}}><img src='/img/icons/stop.svg' title='Stop' alt='stop'/></div>
                </button>
                <Link className='link' to={this.props.name}><img src='/img/icons/go.svg' title='Open' alt='go'/></Link>
            </div>
        );
    }
}

MachineBrief.contextType = ContextNotifications;