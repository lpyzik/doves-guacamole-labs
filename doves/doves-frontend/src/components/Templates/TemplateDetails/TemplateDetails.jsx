import React from "react";
import { Routes, Route } from "react-router-dom";
import { TemplateDetailsIndex } from './TemplateDetailsIndex';
import { TemplateCreator } from '../TemplateCreator/TemplateCreator'

export class TemplateDetails extends React.Component
{
    render()
    {
        return(
            <Routes>
                <Route path='/' element={<TemplateDetailsIndex name={this.props.name}/>}/>
                <Route path='/edit' element={<TemplateCreator edit={this.props.name}/>}/>
            </Routes>
        );
    }
}