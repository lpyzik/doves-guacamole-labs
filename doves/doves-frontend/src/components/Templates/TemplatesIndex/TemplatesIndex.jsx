import React from "react";
import { Link } from "react-router-dom";
import { TemplateBrief } from "./TemplateBrief";
import { Loading } from '../../Loading/Loading';

export class TemplatesIndex extends React.Component
{
    componentDidMount()
    {
        this.props.onRefresh();
    }

    render()
    {
        return(
            <div>
                <h1>Templates</h1>
                <hr/>
                <h2>Your templates</h2>
                <div className='pod-container'>
                    {
                        this.props.loaded ?
                        this.props.templates.map((v,i) => {
                            return <TemplateBrief key={i} name={v.name} type={v.type} up={v.up}/>
                        }) : <Loading/>
                    }
                    {
                        this.props.loaded && (this.props.templates.length === 0) &&
                        <div className='empty'>Nothing to see here...</div>
                    }
                </div>
                <div className='create-button-container'>
                    <Link to='@create' className='lab-create-button'>
                        <img src='/img/icons/plus.svg' alt=''/>
                        <div>Create template</div>
                    </Link>
                </div>
            </div>
        );
    }
}