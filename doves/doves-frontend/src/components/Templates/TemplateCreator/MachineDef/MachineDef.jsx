import React from "react";
import { PortRedirections } from "./PortRedirections/PortRedirections";

export class MachineDef extends React.Component
{
    constructor(props)
    {
        super(props);

        this.state = {
            expanded: false,
        }
    }

    render()
    {
        return(
            <div className={`machine-def`}>
                <div className='header'>
                    <h3>{this.props.name}</h3>
                    <div style={{margin:'auto'}}></div>
                    <button type='button' className='pod-element-button' onClick={() => {this.setState({expanded: !this.state.expanded})}}>
                        <img src={`/img/icons/arrow-${this.state.expanded ? 'down' : 'right'}.svg`} alt={`${this.state.expanded ? 'collapse' : 'expand'}`}
                        className='expander'/>
                    </button>
                </div>
                <div className={`body ${!this.state.expanded && 'collapsed'}`}>
                    {
                        this.props.fields.includes('port-redirections') && 
                        <div>
                            <hr/>
                            <PortRedirections machine={this.props.name} ports={this.props.ports? this.props.ports : []}/>
                        </div>
                    }
                    {
                        this.props.fields.includes('image-upload') &&
                        <div>
                            <hr/>
                            <h4>QCOW2 image file</h4>
                            <input className='text-input' type='file' id='qcow2-image' name={`${this.props.name}-qcow2-image`} required/>
                        </div>
                    }
                    {
                        this.props.fields.includes('delete') && 
                        <div>
                            <hr/>
                            <div style={{display:'flex', justifyContent:'center'}}>
                                <button type='button' className='action-button dangerous' style={{height:'2rem', fontSize:'inherit'}} onClick={this.props.onDelete}>
                                    Delete
                                </button>
                            </div>
                        </div>
                    }
                </div>
            </div>
        );
    }
}