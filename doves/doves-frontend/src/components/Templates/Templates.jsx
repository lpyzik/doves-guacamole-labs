import React from "react";
import { Route, Routes } from "react-router-dom";
import { TemplatesIndex } from "./TemplatesIndex/TemplatesIndex";
import { TemplateCreator } from "./TemplateCreator/TemplateCreator";
import { TemplateDetails } from "./TemplateDetails/TemplateDetails";
import { apiUrl } from '../../configs/api';
import { LoadingError } from "../Error/LoadingError";

export class Templates extends React.Component
{
    constructor(props)
    {
        super(props);
        
        this.state = {
            templates: [],
            loaded: false,
            error: false
        }
    }

    componentDidMount()
    {
        this.fetchTemplates()
    }

    fetchTemplates = () => 
    {
        fetch(`${apiUrl}/templates`).then((r) => r.json()).then((res) => {
            this.setState({
                templates: res.templates,
                loaded: true,
            })
        }).catch((e) => {
            this.setState({error: e})
        })
    }

    render()
    {
        if(this.state.error) 
            return <div className="main-elem"><LoadingError error={this.state.error}/></div>
        return(
            <div id='templates' className='main-elem'>
                <Routes>
                    <Route path='/' element={<TemplatesIndex templates={this.state.templates} loaded={this.state.loaded} 
                        onRefresh={() => {this.fetchTemplates()}}/>}/>
                    <Route path='@create' element={<TemplateCreator/>}/>
                    {
                        this.state.loaded &&
                        this.state.templates.map((v,i) => {
                            return <Route key={i} path={`${v.name}/*`} element={<TemplateDetails name={v.name}/>}/>
                        })
                    }
                </Routes>
            </div>
        );
    }
}