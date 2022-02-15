


import React from 'react'



export default class Credentials extends React.Component{

    constructor(props){
        super(props)

        
    }

    render(){
        return(
            <div className="credentials">
                <div className="one">
                    <span className="">usr:</span>
                    <input className="inp textInp" type="text"/>
                </div>

                <div className="one">
                    <span>pass:</span>
                    <input className="inp passInp" type="text"/>
                </div>

            </div>
        )
    }
}