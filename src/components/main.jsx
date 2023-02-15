import React, { Component } from 'react';
import '../App.css';
import { Helper } from "../util/helper";
import * as download from "downloadjs";

class main extends Component {

    state = {
        backup: {},
        helper: undefined,
        date: new Date()
    }

    async downloadBackup() {
        const recipient = document.getElementById("recipient").value;
        const date = document.getElementById("timelockDate").value;
        const helper = new Helper(recipient, date, false);
        const backup = await helper.getBackup();
        this.setState({ backup: backup, helper: helper, date: date });
        download(backup, `btc-timelocked-backup.json`, "text/plain");
    }

    saveToCalendar() {
        this.state.helper.createCalendarReminder();
    }

    render() {
        return (
            <div>
                <div className="jumbotron">
                    <div id="titles">
                        <h1>Bitcoin timelock backup generator</h1>
                    </div>
                </div>
                <p id="description">This tool allows you to backup your cold storage funds by signing a transaction that is valid in the future and can send funds to a new address in the event that you lose access to your keys. These backups can be revoked anytime by either spending the funds referenced in the backup or by publishing the revoke transaction that is created with the backup. This tool is completely non custodial and you are free to set the recipient address to anyone. If no recipient is set, this website will generate a new wallet for you and add it to the backup so that you can recover your funds completely from the backup once the time you set has been reached.</p>
                <br/>
                <form id="userInfo">
                    <div className="form-group">
                        <label htmlFor="recipient">Recipient address</label>
                        <input type="text" className="form-control" id="recipient" aria-describedby="recipient" placeholder="Enter the recipient's bitcoin address"/>
                            <small id="recipientHelp" className="form-text text-muted">Please enter the recipient address, if blank we will generate a new one and add the key to the backup.</small>
                    </div>
                    <br/>
                    <label htmlFor="timelockDate">Valid from</label>
                    <br/>
                    <input type="date" id="timelockDate" name="timelockDate"/>
                    <br/>
                    <br/>
                    <button type="submit" className="btn btn-primary" onClick={this.downloadBackup}>Download backup</button>
                    <br/>
                    <br/>
                    <button type="submit" id="saveToCalendar" onClick={this.saveToCalendar} className="btn btn-danger">Save to calendar</button>
                </form>
                <footer>
                    <div id="gh">
                        <a href="https://github.com/James-Sangalli/btc-timelocked-backup-web" target="_blank">
                            <img alt="GitHub" src="https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/Octicons-mark-github.svg/2048px-Octicons-mark-github.svg.png" width="40" height="40"/>
                        </a>
                    </div>
                </footer>
            </div>
        )
    }
}

export default main;
