import { Logger } from '@nestjs/common';
import * as chalk from 'chalk';
import { IMqttMessage } from "../../interfaces/mqttMessage.interface";
export class HandleMqttMessage {
    log = chalk.default;
    constructor() {
        this.display();
    }

    display(): void {
        console.log('displaying Handle message class in constructor', this);
    }

    handleMqttMessages(message: IMqttMessage): IMqttMessage {
        if (message != null && message != undefined) {
            return message;
        }else {
            return null;
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