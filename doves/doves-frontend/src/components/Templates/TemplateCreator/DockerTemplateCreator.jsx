import React from "react";
import YAML from 'yaml';
import { MachineDef } from "./MachineDef/MachineDef";

export const readFile = async (file, type='text', enc='utf-8') =>
{
    return new Promise((resolve, reject) => {
        let fileReader = new FileReader();
        fileReader.onload = () => {
            resolve(fileReader.result)
        }
        fileReader.onerror = reject
        if(type === 'text')
            fileReader.readAsText(file, enc);
        else if(type === 'base64')
            fileReader.readAsDataURL(file);
        else
            reject();
    })
}

export class DockerTemplateCreator extends React.Component
{
    constructor(props)
    {
        super(props);
        this.state = {
            machineDefs: this.props.edit.machineDefs ? this.props.edit.machineDefs : null,
        };
    }

    parseBase = () => 
    {
        readFile(this.file.files[0]).then((file) => {
            try
            {
                let base = YAML.parse(file);
                this.setState({machineDefs: Object.keys(base.services).map((v) => {
                    return {
                        name: v,
                        ports: [],
                        supplement: {}
                    }
                })})
            }
            catch(e)
            {
                alert(e);
            }
        })
    }

    render()
    {
        return(
            <div>
                <h2>Docker properties</h2>
                <div className='lab-creation-form-elem'>
                    <div className='form-value compose-base'>
                        <label htmlFor='compose-base'>docker-compose base: </label>
                        <br/>
                        {
                            this.props.edit.supplement 
                            ?  <div><textarea className='text-input' id='compose-base' 
                            name='compose-base' defaultValue={this.props.edit.supplement.base}
                            rows='breaks' style={{height:'20rem'}} 
                            onKeyDown={(e) => {if (e.key === 'Tab') {
                                e.preventDefault(); e.target.setRangeText('  ',e.target.selectionStart,e.target.selectionStart,'end')
                            }}} spellCheck={false} required/></div>
                            : <input className='text-input' type='file' id='compose-base' 
                            name='compose-base' ref={(node) => {this.file = node}} 
                            onChange={() => {this.parseBase()}} required />
                        }
                    </div>
                    <div className='form-value mach-assoc'>
                        <label>Machine definitions: </label>
                        <br/>
                        <div className='pod-container'>
                            {
                                this.state.machineDefs?.map((v,i) => {
                                    return <MachineDef key={i} name={v.name} ports={v.ports} supplement={v.supplement} 
                                    fields={['port-redirections']}/> 
                                })
                            }
                            {!this.state.machineDefs && 
                                <div className='empty'>Upload a base file to configure machine definitions.</div>
                            }
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}