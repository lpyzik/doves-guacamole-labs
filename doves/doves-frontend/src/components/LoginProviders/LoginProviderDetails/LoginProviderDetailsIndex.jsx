import React from "react";
import { Link, Navigate } from "react-router-dom";
import { ConfirmPopup } from "../../Popups/ConfirmPopup";
import { apiUrl } from "../../../configs/api";
import { Loading } from "../../Loading/Loading";
import { LoadingError } from '../../Error/LoadingError'
import { ContextNotifications } from "../../../utils/ContextNotifiations";

import './LoginProviderDetails.css'

export class LoginProviderDetailsIndex extends React.Component
{
    constructor(props)
    {
        super(props);

        this.state = {
            loaded: false,
            error: false,
            escape: false
        }
    }

    componentDidMount()
    {
        fetch(`${apiUrl}/loginProviders/${this.props.name}`).then((r) => r.json()).then((res) => {
            this.setState({
                type: res.type,
                config: res.config,
                reachable: res.reachable,
                loaded: true
            });
        }).catch((e) => {
            this.setState({error: e});
        })
    }

    deleteLoginProvider = () => {
        this.setState({
            displayedPopup: {
                type: 'confirm',
                title: 'Warning!',
                text: `You are about to delete template ${this.props.name}. This action cannot be undone. Proceed?`,
                onConfirm: () => {
                    this.setState({displayedPopup: null});
                    // Delete
                    let prom = fetch(`${apiUrl}/loginProviders/${this.props.name}`, {method:'DELETE'}).then((v) => {
                        this.setState({escape: true});
                        return v;
                    });
                    this.context.addNotification({
                        title: `${this.props.name}`,
                        promise: new Promise((res, rj) => {prom.then((v) => {if(v.status < 400) res(v); else rj(v);}).catch((e) => rj(e))}),
                        pendingText: `Deleting login provider ${this.props.name}...`,
                        fulfilledText: `Login provider ${this.props.name} deleted.`,
                        rejectedText: `Failed to delete login provider ${this.props.name}`
                    });
                },
                onCancel: () => {
                    this.setState({displayedPopup: null})
                }
            }
        })
    }

    render()
    {
        if(this.state.escape)
        {
            return(
                <Navigate to='/loginProviders'/>
            )
        }
        if(this.state.error)
            return <LoadingError error={this.state.error}/>
        return(
            <div>
                <div style={{display:'flex', paddingTop:'2rem', columnGap:'1rem', alignItems:'center'}}>
                    <h1 style={{paddingTop:'0'}}>{this.props.name}</h1>
                    <button style={{backgroundColor:'inherit', color:'inherit', padding:'0', margin:'0', border:'0', height:'100%'}}>
                        <Link to='edit' className='action-button' style={{textDecoration:'none'}}>
                            <img src='/img/icons/edit.svg' alt=''/>
                            <div style={{fontSize:'1rem', textDecoration:'none'}}>Edit</div>
                        </Link>
                    </button>
                    <button style={{backgroundColor:'inherit', color:'inherit', padding:'0', margin:'0', border:'0', height:'100%'}}
                    onClick={() => {this.deleteLoginProvider()}}>
                        <span className='action-button dangerous' style={{textDecoration:'none'}}>
                            <img src='/img/icons/delete.svg' alt=''/>
                            <div style={{fontSize:'1rem', textDecoration:'none'}}>Delete</div>
                        </span>
                    </button>
                </div>
                <div><Link to='../../' className='a-link'>&lt;&lt;&lt; Back to Login providers</Link></div>
                <hr/>
                {
                    this.state.loaded && !this.state.reachable &&
                    <div className='warning-lp-unreachable'>
                        <img src='/img/icons/icon-notification-warning.svg' alt=''/>
                        <div>
                        This login provider is currently unavailable. You might want to check whether the server it is located on is up, 
                        and whether the credentials you provided are valid.
                        </div>
                    </div>
                }
                {
                    this.state.loaded ?
                    <div className="lab-details-container">
                        <div>
                            <h2>Configuration</h2>
                            <div className='summary-table'>
                                <div className='summary-cell summary-key light'>Name</div>
                                <div className='summary-cell summary-value light'>{this.props.name}</div>
                                <div className='summary-cell summary-key dark'>Type</div>
                                <div className='summary-cell summary-value dark'>{this.state.type}</div>
                                {
                                    this.state.type === 'guacamole' &&
                                    <>
                                        <div className='summary-cell summary-key light'>API URL</div>
                                        <div className='summary-cell summary-value light'><a className="a-link" href={this.state.config.apiUrl}>
                                            {this.state.config.apiUrl}    
                                        </a></div>
                                        <div className='summary-cell summary-key dark'>Admin user</div>
                                        <div className='summary-cell summary-value dark'>{this.state.config.adminUsername}</div>
                                    </>
                                }
                            </div>
                        </div>
                    </div> : <Loading/>
                }
                {
                    this.state.displayedPopup?.type === 'confirm' &&
                    <ConfirmPopup title={this.state.displayedPopup.title} text={this.state.displayedPopup.text}
                    onCancel={this.state.displayedPopup.onCancel} onConfirm={this.state.displayedPopup.onConfirm}/>
                }
            </div>
        );
    }
}

LoginProviderDetailsIndex.contextType = ContextNotifications;