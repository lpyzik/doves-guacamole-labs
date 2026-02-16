import React from "react";
import { Notification } from "./Notification";

export class ProgressTracker extends React.Component
{
    constructor(props)
    {
        super(props);
        
        this.datetime = new Date();

        this.state = {
            status: 'progress',
            content: this.props.pendingMessage,
            timeouts: [],
            fading: false
        };
    }

    componentDidMount()
    {
        this.waitForPromise();
    }
    
    disappear = () =>
    {
        this.setState({
            fading: true,
            timeouts: [
                ...this.state.timeouts,
                setTimeout(() => {
                    if(this.state.fading)
                        this.props.onClose();
                }, 2000)
            ]
        });
    }

    waitForPromise = async () =>
    {
        this.props.promise.then((v) => {
            this.setState({
                status: 'info',
                content: this.props.fulfilledMessage,
                timeouts: [
                    ...this.state.timeouts,
                    setTimeout(() => {this.disappear()}, 0)
                ]
            });
        }).catch((e) => {
            if(e instanceof Response)
            {
                e.json().then((r) => {
                    this.setState({
                        status: 'error',
                        content: `${this.props.rejectedMessage}: ${r.message}`,
                        timeouts: [
                            ...this.state.timeouts,
                            setTimeout(() => {this.disappear()}, 12000)
                        ]
                    });
                }).catch((e) => {
                    this.setState({
                        status: 'error',
                        content: `${this.props.rejectedMessage}: ${e.message}`,
                        timeouts: [
                            ...this.state.timeouts,
                            setTimeout(() => {this.disappear()}, 12000)
                        ]
                    });
                });
            }
            else
            {
                this.setState({
                    status: 'error',
                    content: `${this.props.rejectedMessage}: ${e.message}`,
                    timeouts: [
                        ...this.state.timeouts,
                        setTimeout(() => {this.disappear()}, 12000)
                    ]
                });
            }
        });
    }

    clearTimeouts = () =>
    {
        this.setState({fading: false})
        this.state.timeouts.forEach((v) => {
            clearTimeout(v);
        })
    }

    render()
    {
        return(
            <div className={this.state.fading ? 'nt-fading' : ''} onMouseEnter={() => {this.clearTimeouts()}}>
                <Notification
                    type={this.state.status}
                    title={this.props.title}
                    datetime={this.datetime}
                    description={this.state.content}
                    onClose={this.props.onClose}
                />
            </div>
        );
    }
}