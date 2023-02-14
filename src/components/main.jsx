import React, { Component } from 'react';
import '../App.css';

class main extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
                <div className="jumbotron">
                    <div id="titles">
                        <h1>btc-timelocked-backup-web</h1>
                    </div>
                    <div id="date">
                    </div>
                </div>
            </div>
        )
    }
}

export default main;
