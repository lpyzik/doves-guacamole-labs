import React from "react";
import { MenuButton } from "./MenuButton";
import './Menu.css';
import { Link } from "react-router-dom";


export class Menu extends React.Component
{
    render()
    {
        return(
            <div id='menu'>
                <div id='home-button'>
                    <Link to='/'>DoVEs</Link>
                </div>
                <div id='button-container'>
                    <MenuButton url='/' text='Dashboard' icon='/img/icons/grid.svg'/>
                    <MenuButton url='labs' text='Labs' icon='/img/icons/lab.svg'/>
                    <MenuButton url='templates' text='Templates' icon='/img/icons/script.svg'/>
                    <MenuButton url='loginProviders' text='Login providers' icon='/img/icons/key.svg'/>
                    <MenuButton url='about' text='Info' icon='/img/icons/icon-notification-info.svg'/>
                </div>
            </div>
        );
    }
}