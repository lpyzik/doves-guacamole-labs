import React from "react";
import './Dashboard.css'

export class Dashboard extends React.Component
{
    render()
    {
        return(
            <div id='dashboard' className='main-elem'>
                <h1>Dashboard</h1>
                <hr/>
                <h2>Welcome!</h2>
                <div>Well... I am not good at UI/UX design, so I had no idea what to put here. You got the links to subpages on your left.</div>
                <div>Brought to you with 💙 (and hectoliters of ☕) by <a className="a-link" href="https://github.com/DvEyZ/">Szymon Kwiręg</a>.</div>
            </div>
        );
    }
}