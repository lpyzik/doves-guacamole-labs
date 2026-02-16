import React from 'react';

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Menu } from '../Menu/Menu';
import { Footer } from '../Footer/Footer';
import { Dashboard } from '../Dashboard/Dashboard';
import { Labs } from '../Labs/Labs';
import { Templates } from '../Templates/Templates';

import './App.css';
import { LoginProviders } from '../LoginProviders/LoginProviders';
import { Info } from '../Info/Info';
import { ProgressTracker } from '../Notifications/ProgressTracker';
import { ContextNotifications } from '../../utils/ContextNotifiations';

export class App extends React.Component
{
    constructor(props)
    {
        super(props);

        this.notificationIdCounter = 0;
        this.state = {
            notifications: [],
        }
    }

    addNotification = (newNotification) =>
    {
        let not = {
            id: this.notificationIdCounter++,
            ...newNotification,
        };

        this.setState({
            notifications: [
                ...this.state.notifications,
                not
            ]
        })
    }

    removeNotification = (id) =>
    {
        this.setState({
            notifications: this.state.notifications.filter((v) => v.id !== id)
        })
    }

    render()
    {
        return(
            <div id='app'>
                <div id='main'>
                    <ContextNotifications.Provider value={{
                        addNotification: (n) => {this.addNotification(n)},
                    }}>
                        <BrowserRouter>
                            <Menu/>
                            <Routes>
                                <Route path='/' element={<Dashboard/>}/>
                                <Route path='/labs/*' element={<Labs/>}/>
                                <Route path='/templates/*' element={<Templates/>}/>
                                <Route path='/loginProviders/*' element={<LoginProviders/>}/>
                                <Route path='/about' element={<Info/>}/>
                                <Route path='*' element={<div className='main-elem'>
                                    <h1>Oops!</h1>
                                    <hr/>
                                    <div>The page you requested was not found.</div>
                                </div>}/>
                            </Routes>
                        </BrowserRouter>
                    </ContextNotifications.Provider>
                </div>
                <Footer/>
                <div id='notification-container'>
                    {
                        this.state.notifications.map((v) => {
                            return <ProgressTracker key={v.id} title={v.title} promise={v.promise} pendingMessage={v.pendingText}
                            fulfilledMessage={v.fulfilledText} rejectedMessage={v.rejectedText} onClose={() => {this.removeNotification(v.id)}}/>
                        }) 
                    }
                </div>
            </div>
        );
    }
}