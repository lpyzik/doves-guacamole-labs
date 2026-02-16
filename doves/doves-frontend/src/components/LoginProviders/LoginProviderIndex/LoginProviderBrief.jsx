import React from "react";
import { Link } from "react-router-dom";

export class LoginProviderBrief extends React.Component
{
    render()
    {
        return(
            <div className='lab-brief'>
                <img src={`/img/icons/${this.props.type}-login-provider.svg`} alt={this.props.type} style={{width:'2.5rem',height:'auto'}}/>
                <div>{this.props.name}</div>
                {
                    !this.props.reachable &&
                    <div className="m2h-up"><i>(unavailable)</i></div>
                }
                <div style={{display:'inline', margin:'auto'}}></div>
                <Link className='link' to={`${this.props.name}/edit`}><img src='/img/icons/edit.svg' title='Edit' alt='edit'/></Link>
                <Link className='link' to={this.props.name}><img src='/img/icons/go.svg' title='Open' alt='go'/></Link>
            </div>
        );
    }
}