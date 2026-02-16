import React from "react";
import { MachineBrief } from "./MachineBrief";
import { Link, Navigate } from "react-router-dom";
import { ConfirmPopup } from "../../Popups/ConfirmPopup";
import { LoadingError } from "../../Error/LoadingError";
import { Loading } from "../../Loading/Loading";
import { apiUrl } from "../../../configs/api";
import { ContextNotifications } from "../../../utils/ContextNotifiations";

export class LabDetailsIndex extends React.Component
{
    constructor(props)
    {
        super(props);
        
        this.state = {
            displayedPopup: null,
            
            escape: false,
        }
    }

    startLab = () => 
    {
        let prom = fetch(`${apiUrl}/labs/${this.props.state.name}/command`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                action: 'start'
            })
        }).then((r) => { this.props.onRefresh(r.json()); return r;});

        this.context.addNotification({
            title: `${this.props.state.name}`,
            promise: new Promise((res, rj) => {prom.then((v) => {if(v.status < 400) res(v); else rj(v);}).catch((e) => rj(e))}),
            pendingText: `Starting lab ${this.props.state.name}...`,
            fulfilledText: `Lab ${this.props.state.name} started.`,
            rejectedText: `Failed to start lab ${this.props.state.name}`
        });
    }

    stopLab = () =>
    {
        let prom = fetch(`${apiUrl}/labs/${this.props.state.name}/command`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                action: 'stop'
            })
        }).then((r) => { this.props.onRefresh(r.json()); return r;})

        this.context.addNotification({
            title: `${this.props.state.name}`,
            promise: new Promise((res, rj) => {prom.then((v) => {if(v.status < 400) res(v); else rj(v);}).catch((e) => rj(e))}),
            pendingText: `Stopping lab ${this.props.state.name}...`,
            fulfilledText: `Lab ${this.props.state.name} stopped.`,
            rejectedText: `Failed to stop lab ${this.props.state.name}`
        });
    }

    rebuildLab = () =>
    {
        let prom = fetch(`${apiUrl}/labs/${this.props.state.name}/command`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                action: 'restart'
            })
        }).then((r) => { this.props.onRefresh(r.json()); return r;});

        this.context.addNotification({
            title: `${this.props.state.name}`,
            promise: new Promise((res, rj) => {prom.then((v) => {if(v.status < 400) res(v); else rj(v);}).catch((e) => rj(e))}),
            pendingText: `Rebuilding lab ${this.props.state.name}...`,
            fulfilledText: `Lab ${this.props.state.name} rebuilt.`,
            rejectedText: `Failed to rebuild lab ${this.props.state.name}`
        });
    }

    deleteLab = () =>
    {
        let prom = fetch(`${apiUrl}/labs/${this.props.state.name}`, {
            method: 'DELETE'
        }).then((r) => {this.setState({escape: true}); return r;});

        this.context.addNotification({
            title: `${this.props.state.name}`,
            promise: new Promise((res, rj) => {prom.then((v) => {if(v.status < 400) res(v); else rj(v);}).catch((e) => rj(e))}),
            pendingText: `Deleting lab ${this.props.state.name}...`,
            fulfilledText: `Lab ${this.props.state.name} deleted.`,
            rejectedText: `Failed to delete lab ${this.props.state.name}`
        });
    }

    render()
    {
        if(this.state.escape)
            return <Navigate to='/labs'/>
        if(this.props.state.error)
            return <LoadingError error={this.props.state.error}/>
        return(
            <div>
                <h1>{this.props.state.name}</h1>
                <div><Link to='../../' className='a-link'>&lt;&lt;&lt; Back to Labs</Link></div>
                <hr/>
                {
                    !this.props.state.loaded &&
                    <Loading/>
                }
                {
                    this.props.state.loaded &&
                    <div className='lab-details-container'>
                        <div>
                            <h2>Summary</h2>
                            <div className='summary-table'>
                                <div className='summary-cell summary-key light'>Name</div>
                                <div className='summary-cell summary-value light'>{this.props.state.name}</div>
                                <div className='summary-cell summary-key dark'>Type</div>
                                <div className='summary-cell summary-value dark'>{this.props.state.type}</div>
                                <div className='summary-cell summary-key light'>Status</div>
                                <div className={`
                                    summary-cell summary-value light ${this.props.state.up === 100 ? 'full-up' : this.props.state.up > 50 ? 'm2h-up' : 'l2h-up'}                   
                                `}>{this.props.state.up}% up</div>
                                <div className='summary-cell summary-key dark'>Template</div>
                                <div className='summary-cell summary-value dark'>
                                    <Link className='a-link' to={`/templates/${this.props.state.template}`}>{this.props.state.template}</Link>
                                </div>
                                <div className='summary-cell summary-key light'>Port prefix</div>
                                <div className='summary-cell summary-value light'>{this.props.state.portPrefix}</div>
                                <div className='summary-cell summary-key dark'>Login providers</div>
                                <div className='summary-cell summary-value dark' style={{paddingTop:'2px', paddingBottom:'2px'}}>
                                    {this.props.state.loginProviders.map((v,i) => 
                                    <div style={{display:'flex', paddingTop:'2px', paddingBottom:'2px'}} key={i}>
                                        <img style={{width:'1.5rem', height:'1.5rem', paddingRight:'2px'}} 
                                        src={`/img/icons/${v.type}-login-provider.svg`} alt=''/>
                                        <Link className='a-link' to={`/loginProviders/${v.name}`}>{v.name}</Link>
                                    </div>
                                )}</div>
                            </div>
                        </div>
                        <div>
                            <h2>Actions</h2>
                            <div className='actions-container'>
                                <button onClick={() => {
                                    this.startLab();
                                }}>
                                    <div className='action-button'>
                                        <img src='/img/icons/start.svg' alt=''/>
                                        <div>Start</div>
                                    </div>
                                </button>
                                <button onClick={() => {
                                    this.stopLab();
                                }}>
                                    <div className='action-button'>
                                        <img src='/img/icons/stop.svg' alt=''/>
                                        <div>Stop</div>
                                    </div>
                                </button>
                                <button onClick={() => {
                                    this.setState({
                                        displayedPopup: {
                                            type: 'confirm',
                                            title: 'Warning!',
                                            text: `You are about to rebuild the lab "${this.props.state.name}".
                                            This action will result in resetting all machines to their base state, erasing all changes done to them. Proceed?`,
                                            onCancel: () => {this.setState({displayedPopup: null})},
                                            onConfirm: () => {this.setState({displayedPopup: null}); this.rebuildLab();}
                                        }
                                    })
                                }}>
                                    <div className='action-button dangerous'>
                                        <img src='/img/icons/restart.svg' alt=''/>
                                        <div>Rebuild</div>
                                    </div>
                                </button>
                                <button onClick={() => {
                                    this.setState({
                                        displayedPopup: {
                                            type: 'confirm',
                                            title: 'Warning!',
                                            text: `You are about to delete the lab "${this.props.state.name}". This action cannot be undone. Proceed?`,
                                            onCancel: () => {this.setState({displayedPopup: null})},
                                            onConfirm: () => {this.setState({displayedPopup: null}); this.deleteLab();}
                                        }
                                    })
                                }}>
                                    <div className='action-button dangerous'>
                                        <img src='/img/icons/delete.svg' alt=''/>
                                        <div>Delete</div>
                                    </div>
                                </button>
                            </div>
                        </div>
                        <div className='machines-grid-cell'>
                            <h2>Machines</h2>
                            <div className='pod-container'>
                                {this.props.state.machines.length === 0 && <div className='empty'>Nothing to see here...</div>}
                                {
                                    this.props.state.machines.sort((a,b) => a.name > b.name).map((v,i) => {
                                        return <MachineBrief key={i} lab={this.props.state.name} 
                                        name={v.name} status={v.status} onRefresh={(s) => {this.props.onRefresh(s)}}/>
                                    })
                                }
                            </div>
                        </div>
                    </div>
                }
                {
                    this.state.displayedPopup &&
                        this.state.displayedPopup.type === 'confirm' ?
                        <ConfirmPopup title={this.state.displayedPopup.title} text={this.state.displayedPopup.text}
                        onCancel={this.state.displayedPopup.onCancel} onConfirm={this.state.displayedPopup.onConfirm}/> : null
                }
            </div>
        );
    }
}

LabDetailsIndex.contextType = ContextNotifications;