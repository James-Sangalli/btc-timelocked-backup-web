import React, { Component } from 'react';
import '../App.css';
import Helper from '../util/helper.js';

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
                </div>
            </div>
        )
    }
}

export default main;
