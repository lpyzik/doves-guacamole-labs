import React from "react";
import { Link } from "react-router-dom";
import { DockerTemplateCreator, readFile } from "./DockerTemplateCreator";
import { KVMTemplateCreator } from "./KVMTemplateCreator";
import { ConfirmPopup } from "../../Popups/ConfirmPopup";
import { apiUrl } from '../../../configs/api'

import './TemplateCreator.css'
import { ErrorPopup } from "../../Popups/ErrorPopup";
import { Loading } from "../../Loading/Loading";
import { LoadingError } from "../../Error/LoadingError";
import { ContextNotifications } from "../../../utils/ContextNotifiations";

export class TemplateCreator extends React.Component
{
    constructor(props)
    {
        super(props);

        this.state = {
            types: undefined,
            selectedType: 'docker',
            editTemplate: undefined,
            loaded: false,
            error: false,
        }
    }

    componentDidMount()
    {
        fetch(`${apiUrl}/about`).then((r) => r.json()).then((res) => {
            this.setState({
                types: res.labTypes
            })
        }).then(() => {
            if(this.props.edit)
            {
                fetch(`${apiUrl}/templates/${this.props.edit}`).then((r) => r.json()).then((res) => {
                    this.setState({
                        editTemplate: {
                            name: res.name,
                            type: res.type,
                            machineDefs: res.machineDefs,
                            supplement: res.supplement
                        },
                        loaded: true,
                    })
                })
            }
            else this.setState({loaded:true})
        }).catch((e) => {this.setState({error: e})})
    }

    submit = async (e) => 
    {
        e.preventDefault();

        let fd = new FormData(e.target);
        let form = Object.fromEntries(fd);

        let data = {};

        data.name = form.name;
        data.type = form.type;

        var src = undefined;
        if(data.type === 'docker') 
            src = this.docker;
        else if(data.type === 'kvm')
            src = this.kvm;

        data.machineDefs = src.state.machineDefs?.map((machine) => {
            return { 
                name: machine.name,
                ports: form[`${machine.name}-static-mach`] !== 'on' ? 
                    Array.apply(null, {length: Object.keys(form).filter((v) => {return v.match(`${machine.name}-port-.*`)}).length / 2}).map(Number.call, Number)
                    .map((ord) => {return {
                        inbound: form[`${machine.name}-port-inbound-${ord}`],
                        outbound: form[`${machine.name}-port-outbound-${ord}`]
                    }}) : null,
            }
        })

        if(data.type === 'docker')
        {
            data.supplement = {
                base: !this.props.edit ? await readFile(form['compose-base']) : form['compose-base']
            }
        }

        if(data.type === 'kvm')
        {
            if(data.machineDefs.length === 0)
            {
                this.setState({
                    displayedPopup: {
                        type: 'error',
                        title: 'Error',
                        text: 'There are no machine definitions. You should create some in order to create a template.',
                        onConfirm: () => {this.setState({displayedPopup:null})}
                    }
                });
                return;
            }
            data.machineDefs = await Promise.all(data.machineDefs.map(async (v) => {
                return {
                    name: v.name,
                    ports: v.ports,
                    supplement: {
                        image: await readFile(form[`${v.name}-qcow2-image`], 'base64')
                    }
                }
            }))
        }

        let prom;

        if(!this.props.edit)    // new template
        {
            prom = fetch(`${apiUrl}/templates`, {method:'POST',headers:{'Content-Type':'application/json'}, body: JSON.stringify(data)})
        }
        else
        {
            prom = fetch(`${apiUrl}/templates/${this.state.editTemplate.name}`, {method:'PUT',headers:{'Content-Type':'application/json'}, 
            body: JSON.stringify(data)})
        }

        this.context.addNotification({
            title: `${data.name}`,
            promise: new Promise((res, rj) => {prom.then((v) => {if(v.status < 400) res(v); else rj(v);}).catch((e) => rj(e))}),
            pendingText: `Creating template ${data.name}...`,
            fulfilledText: `Template ${data.name} ${!!this.props.edit ? 'updated' : 'created'}.`,
            rejectedText: `Failed to ${!!this.props.edit ? 'update' : 'create'} template ${data.name}`
        });
    }

    render()
    {
        if(this.state.error)
            return <LoadingError error={this.state.error}/>
        return(
            <div>
                <h1>{ !!this.state.editTemplate ? 'Edit' : 'Create'} template</h1>
                <div><Link to={`../${this.state.editTemplate ? '../' : ''}`} className='a-link'>&lt;&lt;&lt; Back to Templates</Link></div>
                <hr/>
                {
                    this.state.loaded ?
                    <div className='form-container'>
                        <form className='lab-creation-form' onSubmit={(e) => {
                            if(!this.state.editTemplate) 
                            {
                                this.submit(e)
                            }
                            else
                            {
                                e.preventDefault()
                                this.setState({
                                    displayedPopup: {
                                        type: 'confirm',
                                        title: 'Warning!',
                                        text: `You are about to update the template "${this.state.editTemplate.name}".
                                        Labs based on this template will NOT be rebuilt to match the new template, but they will still link to this page.
                                        Proceed?`,
                                        onCancel: () => {this.setState({displayedPopup:null})},
                                        onConfirm: () => {this.submit(e);this.setState({displayedPopup:null})}
                                    }
                                });
                            }
                        }}>
                            <h2>Template properties</h2>
                            <div className='lab-creation-form-elem'>
                                <div className='form-value'>
                                    <label htmlFor='name'>Name: </label>
                                    <br/>
                                    <input className='text-input' type='text' id='name' pattern='[A-Za-z0-9_-]+' name='name'
                                    title='Name can consist only of letters, numbers, dashes, and floor signs.' readOnly={!!this.state.editTemplate}
                                    defaultValue={this.state.editTemplate?.name} required/>
                                </div>
                                <div className='form-value'>
                                    <label htmlFor='type'>Type: </label>
                                    <br/>
                                    <select className='text-input' id='type' name='type' selected={this.state.editTemplate?.type}>
                                        {this.state.types.map((v,i) => {
                                            return <option key={i} value={v} onClick={() => {this.setState({selectedType:v})}}
                                            disabled={(this.state.editTemplate?.type !== v) && !!this.state.editTemplate?.type}>{v}</option>
                                        })}
                                    </select>
                                </div>
                            </div>
                            {this.state.selectedType === 'docker' && <DockerTemplateCreator ref={node => {this.docker = node}} 
                            edit={{machineDefs: this.state.editTemplate?.machineDefs, supplement: this.state.editTemplate?.supplement}}/>}

                            {this.state.selectedType === 'kvm' && <KVMTemplateCreator ref={node => {this.kvm = node}} 
                            edit={{machineDefs: this.state.editTemplate?.machineDefs, supplement: this.state.editTemplate?.supplement}}/>}

                            <div className='lab-submit-container'>
                                <input type='submit' className='submit-input' value={this.props.edit ? 'Save' : 'Create'}/>
                                <input type='reset' className='submit-input' value='Reset'/>
                            </div>
                        </form>
                    </div> : <Loading/>
                }
                {
                        this.state.displayedPopup?.type === 'confirm' &&
                        <ConfirmPopup title={this.state.displayedPopup.title} text={this.state.displayedPopup.text}
                        onCancel={this.state.displayedPopup.onCancel} onConfirm={this.state.displayedPopup.onConfirm}/>
                }
                {
                        this.state.displayedPopup?.type === 'error' &&
                        <ErrorPopup title={this.state.displayedPopup.title} text={this.state.displayedPopup.text}
                        onConfirm={this.state.displayedPopup.onConfirm}/>
                }
            </div>
        );
    }
}

TemplateCreator.contextType = ContextNotifications;