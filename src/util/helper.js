import TrezorConnect from 'trezor-connect';
import * as bitcore from "bitcore-lib";
import * as ics from "ics-browser-gen";

export class Helper {

    constructor(recipient, date, localhost) {
        this.recipient = recipient;
        this.date = date;
        this.privateKey = "The recipient's private key is stored elsewhere."
        if(localhost) {
            TrezorConnect.init({
                connectSrc: 'https://localhost:8088/',
                lazyLoad: true, // this param will prevent iframe injection until TrezorConnect.method will be called
                manifest: {
                    email: 'j.l.sangalli@gmail.com',
                    appUrl: 'https://james-sangalli.github.io/btc-timelocked-backup-web'
                }
            })
        } else {
            TrezorConnect.manifest({
                email: 'j.l.sangalli@gmail.com',
                appUrl: 'https://james-sangalli.github.io/btc-timelocked-backup-web'
            });
        }
    }

    async getTimeLockedTransaction() {
        const { availableBalance } = await TrezorConnect.getAccountInfo({
            coin: "btc",
        });
        return TrezorConnect.composeTransaction({
            outputs: [
                { amount: availableBalance, address: this.getAndCreateRecipient(), lockTime: this.date.getTime() }
            ],
            coin: "btc",
            push: false
        });
    }

    async getRevokeTx() {
        const { availableBalance, addresses } = await TrezorConnect.getAccountInfo({
            coin: "btc",
        });

        return TrezorConnect.composeTransaction({
            outputs: [
                { amount: availableBalance, address: addresses[0] }
            ],
            coin: "btc",
            push: false
        });
    }

    async getBackup() {
        const tx = await this.getTimeLockedTransaction();
        const revokeTx = await this.getRevokeTx();
        return {
            tx: tx,
            recipient: this.recipient,
            validFrom: this.date,
            recipientPrivateKey: this.privateKey,
            revokeTx: revokeTx,
            instructions: "This backup allows you to recover your funds to the recipient address above at and beyond the validFrom date. " +
                "To recover the funds or revoke this backup you can broadcast the transaction via https://www.blockchain.com/explorer/assets/btc/broadcast-transaction. " +
                "Note that the revoke transaction can be broadcast at anytime and will invalidate this backup, as will spending any of the inputs included in the transaction."
        }
    }

    createCalendarReminder() {
        const cal = ics();
        const oneWeek = 604800;
        const beginning = this.date.getTime() - oneWeek;
        cal.addEvent("Bitcoin timelock backup", "Your backup is one week away from being valid", "", new Date(beginning), this.date);
        cal.download("Bitcoin timelock backup reminder");
    }

    getAndCreateRecipient() {
        if(this.recipient === "") {
            this.privateKey = new bitcore.PrivateKey();
            this.recipient = this.privateKey.toAddress().toString();
        }
        return this.recipient;
    }

}