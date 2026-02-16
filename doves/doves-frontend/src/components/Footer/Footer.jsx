import React from "react";
import packageJson from '../../../package.json';

import './Footer.css';

export class Footer extends React.Component
{
    render()
    {
        return(
            <div id='footer'>
                <div>Made with 💙 by <a className='a-link' href='https://github.com/DvEyZ'>Szymon Kwiręg</a></div>
                <div>Version {packageJson.version}</div>
            </div>
        )
    }
}