import React from "react";
import { PortRedirection } from "./PortRedirection";

export class PortRedirections extends React.Component
{
    constructor(props)
    {
        super(props);
        this.state = {
            ports: this.props.ports ? this.props.ports.map((v,i) => {
                return {
                    id: i,
                    inbound: v.inbound,
                    outbound: v.outbound
                }
            }) : [],
            portIterator: this.props.ports.length,
        }
    }

    onDelete = (i) =>
    {
        this.setState({ports: this.state.ports.filter((v) => {
            return i !== v.id;
        })})
    }

    render()
    {
        return(
            <div>
                <div className='hc'>
                    <h4>Port redirections</h4>
                    <div style={{margin:'auto'}}></div>
                    <button type='button' className='pod-element-button h-button' onClick={() => {
                            this.setState({ports: [...this.state.ports, {id: this.state.portIterator, inbound:null,outbound:null}], portIterator: this.state.portIterator+1});
                        }}>
                        <img src='/img/icons/plus.svg' alt='create'/>
                    </button>
                </div>
                <div className='port-redirections'>
                    {
                        this.state.ports.map((v,i) => {
                            return <PortRedirection key={v.id} id={v.id} ord={i} machine={this.props.machine} 
                            inbound={v.inbound ? v.inbound : null} outbound={v.outbound ? v.outbound : null}
                            onDelete={() => {this.onDelete(v.id)}}/>
                        })
                    }
                </div>
            </div>
        );
    }
}