import { Logger } from '@nestjs/common';
import * as chalk from 'chalk';
export class HandleMessage {
    log = chalk.default;
    constructor() {
        this.display();
    }

    display(): void {
        console.log('displaying Handle message class in constructor' , this);
    }

    handleComlinkMessages(message: any): any {
        console.log(this.log.yellow('Message from Comlink: '));
        if(this.checkMessageProperties(message)) {
            console.log(message);
            return message;
        } else {
            console.log(this.log.red('Missing fields on JSON'));
            return {
                channel: '',
                data: '',
                uid: '',
            };
        }
    }

    handleEtdMessages(message: any) {
        if (this.checkMessageProperties(message)) {
            console.log(this.log.yellow('Message from ETD: '));
            console.log(message);
            return message;
        } else {
            console.log(this.log.red('Missing fields on JSON'));
            return {
                channel: '',
                data: '',
                uid: '',
            };
        }
    }

    checkMessageProperties(message: any) {
        if (message && message.hasOwnProperty('uid') && message.hasOwnProperty('data') && message.hasOwnProperty('channel')) {
            return true;
        } else {
            return false;
        }
    }
}