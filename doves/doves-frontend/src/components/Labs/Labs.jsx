import React from "react";
import { Routes, Route } from "react-router-dom";
import { LabIndex } from "./LabIndex/LabIndex";
import { LabDetails } from "./LabDetails/LabDetails";
import { LabCreator } from "./LabCreator/LabCreator";
import { LoadingError } from "../Error/LoadingError";
import { apiUrl } from "../../configs/api";

export class Labs extends React.Component
{
    constructor(props)
    {
        super(props);
        this.state = {
            labs: [],
            loaded: false,
            error: false
        }
    }

    componentDidMount()
    {
        this.fetchLabs();
    }
    
    fetchLabs = () =>
    {
        fetch(`${apiUrl}/labs`).then((r) => r.json()).then((res) => {
            this.setState({labs: res.labs, loaded:true})
        }).catch((e) => {this.setState({error:e})})
    }

    render()
    {
        if(this.state.error) 
            return <div className="main-elem"><LoadingError error={this.state.error}/></div>
        return(
            <div id='labs' className='main-elem'>
                <Routes>
                    <Route path='/' element={<LabIndex labs={this.state.labs} loaded={this.state.loaded}
                        onRefresh={() => {this.fetchLabs()}}/>}/>
                    <Route path='@create' element={<LabCreator/>}/>
                    {this.state.labs.map((v,i) => {
                        return <Route key={i} path={`/${v.name}/*`} element={<LabDetails name={v.name}/>} />
                    })}
                </Routes>
            </div>
        )
    }
}