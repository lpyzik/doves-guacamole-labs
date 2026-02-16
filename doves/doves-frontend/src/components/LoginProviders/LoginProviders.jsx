import React from "react";
import { Route, Routes } from "react-router-dom";
import { LoginProviderIndex } from "./LoginProviderIndex/LoginProviderIndex";
import { LoginProviderDetails } from "./LoginProviderDetails/LoginProviderDetails";
import { LoginProviderCreator } from "./LoginProviderCreator/LoginProviderCreator";
import { apiUrl } from "../../configs/api";
import { LoadingError } from "../Error/LoadingError";

export class LoginProviders extends React.Component
{
    constructor(props)
    {
        super(props);

        this.state = {
            loginProviders: [],
            loaded: false,
            error: false
        }
    }

    componentDidMount()
    {
        this.fetchLoginProviders();
    }

    fetchLoginProviders = () => {
        fetch(`${apiUrl}/loginProviders`).then((r) => r.json()).then((res) => {
            this.setState({loginProviders: res.loginProviders, loaded: true})
        }).catch((e) => {
            this.setState({error: e})
        });
    }

    render()
    {
        if(this.state.error) 
            return <div className="main-elem"><LoadingError error={this.state.error}/></div>
        return(
            <div id='login-providers' className='main-elem'>
                <Routes>
                    <Route path='/' element={<LoginProviderIndex loginProviders={this.state.loginProviders} loaded={this.state.loaded}
                        onRefresh={() => {this.fetchLoginProviders()}}/>}/>
                    <Route path='/@create' element={<LoginProviderCreator/>}/>
                    {
                        this.state.loginProviders.map((v,i) =>
                            <Route key={i} path={`${v.name}/*`} element={<LoginProviderDetails name={v.name}/>}/>
                        )
                    }
                </Routes>
            </div>
        );
    }
}