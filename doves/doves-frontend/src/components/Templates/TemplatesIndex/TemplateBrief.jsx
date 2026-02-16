import React from "react";
import { Link } from "react-router-dom";

export class TemplateBrief extends React.Component
{
    render()
    {
        return(
            <div className='lab-brief'>
                <img src={`/img/icons/lab-${this.props.type}.svg`} alt={this.props.type} style={{width:'3rem', height:'auto'}}/>
                <div>{this.props.name}</div>
                <div style={{display:'inline', margin:'auto'}}></div>
                <Link className='link' to={`${this.props.name}/edit`}><img src='/img/icons/edit.svg' title='Edit' alt='edit'/></Link>
                <Link className='link' to={this.props.name}><img src='/img/icons/go.svg' title='Open' alt='go'/></Link>
            </div>
        )
    }
}