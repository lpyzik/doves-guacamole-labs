import React from "react";
import { LoginProviderBrief } from "./LoginProviderBrief";
import { Link } from "react-router-dom";
import { Loading } from "../../Loading/Loading";

export class LoginProviderIndex extends React.Component
{
    componentDidMount()
    {
        this.props.onRefresh();
    }

    render()
    {
        return(
            <div>
                <h1>Login providers</h1>
                <hr/>
                <h2>Registered login providers</h2>
                <div className='pod-container'>
                    {
                        this.props.loaded ?
                        this.props.loginProviders.map((v,i) => 
                            <LoginProviderBrief key={i} name={v.name} type={v.type} reachable={v.reachable}/>
                        )
                        : <Loading/>
                    }
                    {
                        this.props.loaded && this.props.loginProviders.length === 0 &&
                        <div className='empty'>No login providers registered.</div>
                    }
                </div>
                <div className='create-button-container'>
                    <Link to='@create' className='lab-create-button'>
                        <img src='/img/icons/plus.svg' alt=''/>
                        <div>Register provider</div>
                    </Link>
                </div>
            </div>
        );
    }
}