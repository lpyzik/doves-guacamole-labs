import React from "react";
import { LoginProviderDetailsIndex } from "./LoginProviderDetailsIndex";
import { Route,Routes } from "react-router-dom";
import { LoginProviderCreator } from "../LoginProviderCreator/LoginProviderCreator";

export class LoginProviderDetails extends React.Component
{
    render()
    {
        return(
            <Routes>
                <Route path='/' element={<LoginProviderDetailsIndex name={this.props.name}/>}/>
                <Route path='/edit' element={<LoginProviderCreator edit={this.props.name}/>} />
            </Routes>
        )
    }
}