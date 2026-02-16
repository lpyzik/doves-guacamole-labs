import React from "react";
import { Link } from "react-router-dom";

export class MenuButton extends React.Component
{
    render()
    {
        return(
            <Link to={this.props.url} className='menu-button'>
                <img src={this.props.icon} alt=''/>
                <p>{this.props.text}</p>
            </Link>
        );
    }
}