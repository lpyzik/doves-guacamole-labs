import React from "react";
import { Route, Routes } from "react-router-dom";

import './LabDetails.css';
import { LabDetailsIndex } from "./LabDetailsIndex";
import { MachineDetails } from "./MachineDetails/MachineDetails";
import { apiUrl } from "../../../configs/api";

export class LabDetails extends React.Component
{
    constructor(props)
    {
        super(props);
        this.state = {
            name: this.props.name,
            type: undefined,
            up: undefined,
            template: undefined,
            portPrefix: undefined,
            machines: undefined,
            loginProviders: undefined,
            
            loaded: false,
            error: false
        }
    }

    componentDidMount()
    {
        this.fetchLabDetails();
    }

    fetchLabDetails = async (source = undefined) =>
    {
        if(source === undefined)
            source = fetch(`${apiUrl}/labs/${this.props.name}`).then((r) => r.json());
            
        source.then((res) => {
            this.setState({
                name: res.name,
                type: res.type,
                up: res.up,
                template: res.template.name,
                portPrefix: res.portPrefix,
                machines: res.machines,
                loginProviders: res.loginProviders,
                loaded: true,
            })
        }).catch((e) => {this.setState({error:e})})
    }

    render()
    {
        return(
            <Routes>
                <Route path='/' element={<LabDetailsIndex state={this.state} onRefresh={(s) => {this.fetchLabDetails(s)}}/>}/>
                {
                    this.state.loaded &&
                    this.state.machines.map((v,i) => {
                        return <Route key={i} path={v.name} element={<MachineDetails name={v.name} lab_name={this.state.name} 
                        onRefresh={(s) => {this.fetchLabDetails(s)}}/>}/>;
                    })
                }
            </Routes>
        )
    }
}