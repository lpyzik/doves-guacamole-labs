import React from "react";
import { MachineDef } from "./MachineDef/MachineDef";
import { ErrorPopup } from "../../Popups/ErrorPopup";

export class KVMTemplateCreator extends React.Component
{
    constructor(props)
    {
        super(props);
        this.state = {
            machineDefs: this.props.edit.machineDefs ? this.props.edit.machineDefs : [],
        };
    }

    createMachine = () => 
    {
        let name = this.newMachineName.value;

        if(this.state.machineDefs.some((v) => v.name === name))
        {
            this.setState({displayedPopup: {
                type: 'error',
                title: 'Error',
                text: `Lab with name ${name} already exists.`,
                onConfirm: () => {this.setState({displayedPopup:null})}
            }})
            return;
        }

        if(!(/^[a-zA-Z]{1}[a-zA-Z0-9\-_]*$/.test(name)))
        {
            this.setState({displayedPopup: {
                type: 'error',
                title: 'Error',
                text: `Name ${name} is invalid.`,
                onConfirm: () => {this.setState({displayedPopup:null})}
            }})
            return;
        }

        this.setState({
            machineDefs: [
                ...this.state.machineDefs,
                {
                    name: name,
                    ports: [],
                    supplement: {}
                }
            ]
        });

        this.newMachineName.value = '';
    }
    
    deleteMachine = (name) => {
        this.setState({
            machineDefs: this.state.machineDefs.filter((v) => v.name !== name)
        })
    }

    render()
    {
        return(
            <div>
                <h2>KVM properties</h2>
                <div className='lab-creation-form-elem'>
                    <div className='form-value mach-assoc-wide'>
                        <label>Machine definitions: </label>
                        <br/>
                        <div className='pod-container'>
                            {
                                this.state.machineDefs?.map((v,i) => {
                                    return <MachineDef key={v.name} name={v.name} ports={v.ports} supplement={v.supplement} 
                                    fields={['port-redirections', 'image-upload', 'delete']} onDelete={() => {this.deleteMachine(v.name)}}/> 
                                })
                            }
                            {
                                this.state.machineDefs.length === 0 &&
                                <div className='empty'>C'mon, create some machines...</div>
                            }
                        </div>
                    </div>
                    <div className='form-value mach-add-kvm'>
                        <div>
                            <label>New machine:</label>
                            <input type='text' className='text-input' ref={node => {this.newMachineName = node}}/>
                        </div>
                        <button type='button' className='action-button' style={{height:'2rem', fontSize:'inherit'}} onClick={() => {this.createMachine()}}>
                            Add
                        </button>
                    </div>  
                </div>
                {
                    this.state.displayedPopup &&
                        this.state.displayedPopup.type === 'error' ?
                            <ErrorPopup title={this.state.displayedPopup.title} text={this.state.displayedPopup.text}
                            onConfirm={this.state.displayedPopup.onConfirm}/> : null
                }
            </div>
        );
    }
}