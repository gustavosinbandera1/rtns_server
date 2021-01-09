import { Injectable } from '@nestjs/common';
import { BehaviorSubject } from 'rxjs';
import { IMqttMessage } from '../../interfaces/mqttMessage.interface'
import chalk from 'chalk';
import { map, first } from 'rxjs/operators';
/**
*  Function for local Observable Variables
*/
@Injectable()
export class MqttClientObservable {
    constructor() { }

    private statusDevice = new BehaviorSubject<IMqttMessage>(null);
    private messageMqtt = new BehaviorSubject<IMqttMessage>(null);
    private rssiDevice = new BehaviorSubject<IMqttMessage>(null);

    mqttData = this.messageMqtt.asObservable()
    rssi = this.rssiDevice.asObservable();
    status = this.statusDevice.asObservable();

    newMqttMessage(msg: IMqttMessage) {
        try {
            this.messageMqtt.next(msg);
        } catch (err) {
            this.messageMqtt.error(err);
        }
    }

    newStatusMessage(msg: IMqttMessage) {
        try {
            this.statusDevice.next(msg);
        } catch (err) {
            this.statusDevice.error(err);
        }
    }

    newRssiMessage(msg: IMqttMessage) {
        try {
            this.rssiDevice.next(msg);
        } catch (err) {
            this.rssiDevice.error(err);
        }
    }
}