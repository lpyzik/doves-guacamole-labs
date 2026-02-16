import React from "react";
import { LabBrief } from "./LabBrief";
import { Link } from "react-router-dom";
import './LabIndex.css'
import { Loading } from "../../Loading/Loading";

export class LabIndex extends React.Component
{
    componentDidMount()
    {
        this.props.onRefresh();
    }

    render()
    {
        return(
            <div>
                <h1>Labs</h1>
                <hr/>
                <h2>Your labs</h2>
                <div className='pod-container'>
                    {
                        !this.props.loaded &&
                        <Loading/>
                    }
                    {
                        this.props.loaded &&
                        this.props.labs.map((v,i) => {
                            return <LabBrief key={i} name={v.name} type={v.type} up={v.up} onRefresh={() => {this.props.onRefresh()}}/>
                        })
                    }
                    {
                        this.props.loaded &&
                        (this.props.labs.length === 0) &&
                        <div className='empty'>Nothing to see here...</div>
                    }
                </div>
                <div className='create-button-container'>
                    <Link to='@create' className='lab-create-button'>
                        <img src='/img/icons/plus.svg' alt=''/>
                        <div>Create lab</div>
                    </Link>
                </div>
            </div>
        );
    }
}