import React from "react";
import { apiUrl } from "../../configs/api";
import { Loading } from "../Loading/Loading";
import { LoadingError } from '../Error/LoadingError'

import packageJson from '../../../package.json'

export class Info extends React.Component
{
    constructor(props)
    {
        super(props);

        this.state = {
            backendInfo: undefined,
            loaded: false,
            error: false
        }
    }

    componentDidMount()
    {
        fetch(`${apiUrl}/about`).then((r) => r.json()).then((res) => {
            this.setState({
                backendInfo: res,
                loaded: true
            })
        }).catch((e) => {this.setState({error: e})})
    }

    render()
    {
        if(this.state.error) 
            return <div className="main-elem"><LoadingError error={this.state.error}/></div>
        return(
            <div className="main-elem">
                <h1>Info</h1>
                <hr/>
                {
                    this.state.loaded ? 
                    <div className='lab-details-container'>
                        <div>
                            <h2>Frontend</h2>
                            <div className='summary-table'>
                                <div className='summary-cell summary-key light'>Name</div>
                                <div className='summary-cell summary-value light'>{packageJson.name}</div>
                                <div className='summary-cell summary-key dark'>Version</div>
                                <div className='summary-cell summary-value dark'>{packageJson.version}</div>
                            </div>
                        </div>
                        <div>
                            <h2>Backend</h2>
                            <div className='summary-table'>
                                <div className='summary-cell summary-key light'>Name</div>
                                <div className='summary-cell summary-value light'>{this.state.backendInfo.running}</div>
                                <div className='summary-cell summary-key dark'>Version</div>
                                <div className='summary-cell summary-value dark'>{this.state.backendInfo.version}</div>
                                <div className='summary-cell summary-key light'>URL</div>
                                <div className='summary-cell summary-value light'><a className='a-link' href={apiUrl}>{apiUrl}</a></div>
                                <div className='summary-cell summary-key dark'>Supported lab types</div>
                                <div className='summary-cell summary-value dark'>
                                    {this.state.backendInfo.labTypes.map((v,i) => 
                                        <div key={i}>{v}</div>
                                    )}
                                </div>
                                <div className='summary-cell summary-key light'>Supported login providers</div>
                                <div className='summary-cell summary-value light'>
                                    {this.state.backendInfo.loginProviderTypes.map((v,i) => 
                                        <div key={i}>{v}</div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div> : <Loading/>
                }
            </div>
        )
    }
}