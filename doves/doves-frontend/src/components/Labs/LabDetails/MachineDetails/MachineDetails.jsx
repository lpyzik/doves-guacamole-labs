import React from "react";
import { Link } from "react-router-dom";
import { LoadingError } from "../../../Error/LoadingError";
import { Loading } from "../../../Loading/Loading";
import { apiUrl } from "../../../../configs/api";
import { ContextNotifications } from "../../../../utils/ContextNotifiations";

export class MachineDetails extends React.Component
{
    constructor(props)
    {
        super(props);
        
        this.state = {
            name: undefined,
            type: undefined,
            address: undefined,
            status: undefined,
            portRedirections: [],
            supplement: {},

            loaded: false,
            error: false
        }
    }

    componentDidMount()
    {
        this.fetchMachine();
    }

    fetchMachine = async (source = undefined) =>
    {
        if(source === undefined)
            source = fetch(`${apiUrl}/labs/${this.props.lab_name}/machines/${this.props.name}`).then((r) => r.json());

        source.then((res) => {
            this.setState({
                name: res.name,
                type: res.type,
                address: res.address,
                status: res.status,
                portRedirections: res.ports,
                supplement: res.supplement,

                loaded: true
            })
        }).catch((e) => {this.setState({error:e})})
    }

    startMachine = () => {
        let prom = fetch(`${apiUrl}/labs/${this.props.lab_name}/machines/${this.props.name}/command`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                action: 'start'
            })
        }).then((r) => { this.fetchMachine(r.json()); this.props.onRefresh(); return r; });

        this.context.addNotification({
            title: `${this.props.name}`,
            promise: new Promise((res, rj) => {prom.then((v) => {if(v.status < 400) res(v); else rj(v);}).catch((e) => rj(e))}),
            pendingText: `Starting machine ${this.props.lab_name}/${this.props.name}...`,
            fulfilledText: `Machine ${this.props.lab_name}/${this.props.name} started.`,
            rejectedText: `Failed to start machine ${this.props.lab_name}/${this.props.name}`
        });
    }

    stopMachine = () => {
        let prom = fetch(`${apiUrl}/labs/${this.props.lab_name}/machines/${this.props.name}/command`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                action: 'stop'
            })
        }).then((r) => { this.fetchMachine(r.json()); this.props.onRefresh(); return r; });

        this.context.addNotification({
            title: `${this.props.name}`,
            promise: new Promise((res, rj) => {prom.then((v) => {if(v.status < 400) res(v); else rj(v);}).catch((e) => rj(e))}),
            pendingText: `Stopping machine ${this.props.lab_name}/${this.props.name}...`,
            fulfilledText: `Machine ${this.props.lab_name}/${this.props.name} stopped.`,
            rejectedText: `Failed to stop machine ${this.props.lab_name}/${this.props.name}`
        });
    }

    restartMachine = () => {
        let prom = fetch(`${apiUrl}/labs/${this.props.lab_name}/machines/${this.props.name}/command`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                action: 'restart'
            })
        }).then((r) => { this.fetchMachine(r.json()); this.props.onRefresh(); return r; });

        this.context.addNotification({
            title: `${this.props.name}`,
            promise: new Promise((res, rj) => {prom.then((v) => {if(v.status < 400) res(v); else rj(v);}).catch((e) => rj(e))}),
            pendingText: `Resetting machine ${this.props.lab_name}/${this.props.name}...`,
            fulfilledText: `Machine ${this.props.lab_name}/${this.props.name} reset.`,
            rejectedText: `Failed to reset machine ${this.props.lab_name}/${this.props.name}`
        });
    }

    render()
    {
        if(this.state.error)
            return <LoadingError/>

        return(
            <div>
                <h1>{this.props.name}</h1>
                <div><Link to='..' className='a-link'>&lt;&lt;&lt; Back to {this.props.lab_name}</Link></div>
                <hr/>
                {
                    !this.state.loaded &&
                    <Loading/>
                }
                {
                    this.state.loaded &&
                    <div className='lab-details-container'>
                        <div>
                            <h2>Summary</h2>
                                <div className='summary-table'>
                                <div className='summary-cell summary-key light'>Name</div>
                                <div className='summary-cell summary-value light'>{this.props.name}</div>
                                <div className='summary-cell summary-key dark'>Type</div>
                                <div className='summary-cell summary-value dark'>{this.state.type}</div>
                                <div className='summary-cell summary-key light'>Status</div>
                                <div className={`
                                    summary-cell summary-value light ${this.state.status === 'running' ? 'full-up' : this.state.status === 'stopped' ? 'm2h-up' : 'l2h-up'}                   
                                `}>{this.state.status}</div>
                                <div className='summary-cell summary-key dark'>Address</div>
                                <div className='summary-cell summary-value dark'>{this.state.address}</div>
                                {this.state.type === 'docker' && <div className='summary-cell summary-key light'>Ports</div>}
                                {this.state.type === 'docker' && <div className='summary-cell summary-value light'>
                                    {this.state.portRedirections.map((v,i) => {
                                        return <div key={i}>{`${v.inbound} => ${v.outbound}`}</div>
                                    })}
                                </div>}
                            </div>
                        </div>
                        <div>
                            <h2>Actions</h2>
                            <div className='actions-container'>
                                <button onClick={() => {this.startMachine()}}>
                                    <div className='action-button'>
                                        <img src='/img/icons/start.svg' alt=''/>
                                        <div>Start</div>
                                    </div>
                                </button>
                                <button onClick={() => {this.stopMachine()}}>
                                    <div className='action-button'>
                                        <img src='/img/icons/stop.svg' alt=''/>
                                        <div>Stop</div>
                                    </div>
                                </button>
                                <button onClick={() => {this.restartMachine()}}>
                                    <div className='action-button'>
                                        <img src='/img/icons/restart.svg' alt=''/>
                                        <div>Reset</div>
                                    </div>
                                </button>
                            </div>
                        </div>
                    </div>
                }
            </div>
        );
    }
}

MachineDetails.contextType = ContextNotifications;