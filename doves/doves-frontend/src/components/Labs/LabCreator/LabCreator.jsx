import React from "react";
import { Link } from "react-router-dom";
import { apiUrl } from '../../../configs/api'

import '../../App/Forms.css'
import { LoadingError } from "../../Error/LoadingError";
import { Loading } from "../../Loading/Loading";
import { ContextNotifications } from "../../../utils/ContextNotifiations";

export class LabCreator extends React.Component
{
    constructor(props)
    {
        super(props);

        this.state = {
            types: undefined,
            selectedType: 'docker',
            templates: undefined,
            loginProviders: undefined,

            loaded: false,
            error: false
        }
    }

    componentDidMount()
    {
        fetch(`${apiUrl}/about`).then((r) => r.json()).then((res) => {
            this.setState({
                types: res.labTypes
            })
        }).then(() => {fetch(`${apiUrl}/loginProviders`).then((r) => r.json()).then((res) => {
            this.setState({
                loginProviders: res.loginProviders
            })
        }).then(() => {fetch(`${apiUrl}/templates`).then((r) => r.json()).then((res) => {
            this.setState({
                templates: res.templates,
                loaded: true,
            })
        }).catch((e) => {this.setState({error: e})})}).catch((e) => {this.setState({error: e})})}).catch((e) => {this.setState({error: e})});
    }

    submit = (e) => 
    {
        e.preventDefault();
        
        let f = new FormData(e.target);
        
        let data = {};

        data.name = f.get('name');
        data.type = f.get('type');
        data.machineCount = Number(f.get('machine_count'));
        data.template = f.get('template')
        data.portPrefix = Number(f.get('port_prefix'));
        data.loginProviders = f.getAll('login_provider')
        
        let prom = fetch(`${apiUrl}/labs`, {
            method:'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        this.context.addNotification({
            title: `${data.name}`,
            promise: new Promise((res, rj) => {prom.then((v) => {if(v.status < 400) res(v); else rj(v);}).catch((e) => {rj(e)})}),
            pendingText: `Creating lab ${data.name}...`,
            fulfilledText: `Lab ${data.name} created.`,
            rejectedText: `Failed to create lab ${data.name}`
        });
    }

    render()
    {
        if(this.state.error)
            return <LoadingError error={this.state.error}/>
        return(
            <div>
                <h1>Create lab</h1>
                <div><Link to='../' className='a-link'>&lt;&lt;&lt; Back to Labs</Link></div>
                <hr/>
                {
                    !this.state.loaded &&
                    <Loading/>
                }
                {
                    this.state.loaded &&
                    <div className='form-container'>
                        <form className='lab-creation-form' onSubmit={(e) => {this.submit(e)}}>
                            <h2>Lab properties</h2>
                            <div className='lab-creation-form-elem'>
                                <div className='form-value'>
                                    <label htmlFor='name'>Name: </label>
                                    <br/>
                                    <input className='text-input' type='text' id='name' pattern='[A-Za-z0-9_]+' name='name'
                                    title='Name can consist only of letters, numbers, and floor signs.' required/>
                                </div>
                                <div className='form-value'>
                                    <label htmlFor='type'>Type: </label>
                                    <br/>
                                    <select className='text-input' id='type' name='type'>
                                        {this.state.types.map((v,i) => {
                                            return <option key={i} value={v} onClick={() => {this.setState({selectedType:v})}}>{v}</option>
                                        })}
                                    </select>
                                </div>
                                <div className='form-value'>
                                    <label htmlFor='machine_count'>Machine count: </label>
                                    <br/>
                                    <input className='text-input' type='text' pattern='\d{1,2}' id='machine-count' name='machine_count'
                                    title='Machine count must be a number from 1 to 99.' required/>
                                </div>
                                <div className='form-value'>
                                    <label htmlFor='template'>Template: </label>
                                    <br/>
                                    <select className='text-input' id='template' name='template'>
                                        {this.state.templates.filter((v) => v.type === this.state.selectedType).map((v,i) => {
                                            return <option key={i} value={v.name}>{v.name}</option>
                                        })}
                                    </select>
                                </div>
                                <div className='form-value'>
                                    <label htmlFor='name'>Port prefix: </label>
                                    <br/>
                                    <input className='text-input' type='text' pattern='[1-5]{1}' id='port-prefix' name='port_prefix'
                                    title='Port prefix must be a digit from 1 to 5.' required/>
                                </div>
                                <div className='form-value'>
                                    <label htmlFor='name'>Login providers: </label>
                                    <br/>
                                    <fieldset style={{border:'0', margin:'0', padding:'0', paddingTop:'0.2rem'}}>
                                        {
                                            this.state.loginProviders.map((v,i) => {
                                                return <div style={{display:'flex', marginTop:'2px', marginBottom:'2px'}} key={i}>
                                                    <input type="checkbox" name='login_provider' defaultChecked={v.reachable} disabled={!v.reachable}
                                                    style={{width:'1rem', height:'1rem'}} value={v.name}/>
                                                    <img style={{width:'1.5rem', height:'1.5rem', paddingRight:'2px'}} 
                                                        src={`/img/icons/${v.type}-login-provider.svg`} alt=''/>
                                                    <label style={{fontSize:'inherit', color:'inherit'}}>
                                                        <Link className="a-link" to={`/loginProviders/${v.name}`}>{v.name}</Link>
                                                        {!v.reachable && 
                                                            <><i style={{color: 'rgb(190, 190, 92)'}}> (unavailable)</i></>
                                                        }
                                                    </label>
                                                </div>
                                            })
                                        }
                                    </fieldset>
                                </div>
                            </div>

                            <div className='lab-submit-container'>
                                <input type='submit' className='submit-input' value='Create'/>
                                <input type='reset' className='submit-input' value='Reset'/>
                            </div>
                        </form>
                    </div>
                }
            </div>
        );
    }
}

LabCreator.contextType = ContextNotifications;