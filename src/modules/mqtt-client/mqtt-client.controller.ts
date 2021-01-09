import { Controller, Get, Req, Res, Logger } from '@nestjs/common';


import { Observable, of } from 'rxjs';
import {map,first} from 'rxjs/operators';


import { MqttClientService } from './mqtt-client.service';
import { MqttClientObservable } from './mqtt-client.observer';
import { HandleMqttMessage } from './handleMqtt.Message';
import { Request, Response } from 'express';
import * as HashMap from 'hashmap';
import chalk from 'chalk';
import { Console } from 'console';
import { nextTick } from 'process';

@Controller('mqtt-client')
export class MqttClientController extends HandleMqttMessage {
    uidToStreamMap: HashMap;
    SSEClientsConnected: number;

    // //just for test code
    // observable = new Observable(subscriber =>{
    //     subscriber.next(1);
    //     subscriber.next(2);
    //     subscriber.next(3);
    //     setTimeout(() => {
    //         subscriber.next(4);
    //         subscriber.complete
    //     },1000);
    // });

    constructor(private readonly realtime: MqttClientService, private readonly observer: MqttClientObservable) {
        super();
        this.uidToStreamMap = new HashMap();
        this.SSEClientsConnected = 0;
        this.subscribeToMessages('prod/origin/#');//prod/origin/#
        this.subscribeToStatus();
        //this.subscribeToRssi();
        // console.log('just before subscribe');
        // this.observable.subscribe({
        //     next(x) { console.log('got value ' + x); },
        //     error(err) { console.error('something wrong occurred: ' + err); },
        //     complete() { console.log('done'); }
        // });
        // console.log('-----------------just after subscribe-----------------');
        // first()(of(1, 2, 3)).subscribe((v) => console.log(`value: ${v}`));

    }

    @Get('sse')
    execute(@Req() request: Request, @Res() response: Response): any {
        let uidList = [];
        Logger.log('Atendiendo request SSE');
        if (request.query.uids) {
            uidList = request.query.uids.split(',');
        } else {
            return response.send({
                error: 'Bad request',
                data: 'you need to send a uids param',
                example: 'http://localhost:1337/api/realtime/sse?uids=QSO901,TEL123',
            });
        }
        request.on('close', () => {
            this.dequeueSSEClient(uidList, response);
        });
        response.set({
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',
            'Connection': 'keep-alive',
        });

        response.write(':ok\n\n');
        this.enqueueSSEClient(uidList, response);
    }

    async subscribeToMessages(messageEvent: string) {
        await this.realtime.subscribeToMqttMessage(messageEvent);
        this.observer.mqttData.subscribe(message => {
            if (message != null) {
                //let temp = this.handleMqttMessages(message);
                console.log(">>>>>>>>>>>>>>>>>>>>master message");
            }
        })
    }

    subscribeToStatus(): void {
        this.observer.status.pipe(
            map(message => {
                message = message;
                console.log("prueba de pipe....");
                return message;
            })
        ).subscribe(message => {
            if (message != null) {
                console.log(chalk.yellow("new status:"));
                console.log(message.message.toString());
            }
        })
    }

    subscribeToRssi() {
        this.observer.rssi.subscribe(message => {
            if (message != null) {
                console.log(chalk.blue("new rssi:"));
                console.log(message.message.toString());
            }
        })
    }

    writeDataToStream(eventTypeMessage, uid, streamMessage) {
        if (this.SSEClientsConnected > 0) {
            this.uidToStreamMap.get(uid).keys().forEach(stream => {
                if (stream.writable === true) {
                    stream.write(`event: ${eventTypeMessage}\ndata: ${JSON.stringify(streamMessage)}\n\n`);
                } else {
                    //delete this stream for supscription
                    Logger.log('deleting the stream');
                    this.uidToStreamMap.get(uid).delete(stream);
                }
            });
        }
    }


    enqueueSSEClient(uidList, responseObject) {
        uidList.forEach(uid => { // On each client connection we need to check if the stream exist or not
            if (!this.uidToStreamMap.has(uid)) { // 1 If not exist
                this.uidToStreamMap.set(uid, new HashMap()); // 2 We need to create it
            }
            this.uidToStreamMap.get(uid).set(responseObject, 0); // 3 And setup for new handle  client
            this.SSEClientsConnected++;
            Logger.log('clients Connected: ' + this.SSEClientsConnected);
        });
    }

    dequeueSSEClient(uidList, response) {
        Logger.log('Stream Client Disconnected');
        uidList.forEach(uid => {
            if (this.uidToStreamMap.has(uid)) {
                this.uidToStreamMap.get(uid).delete(response);
                this.SSEClientsConnected--;
                Logger.log('clients Connected: ' + this.SSEClientsConnected);
            }
        });
    }
}


