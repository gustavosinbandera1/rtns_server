import { Controller, Get, Req, Res, Logger } from '@nestjs/common';
import { RealTimeService } from './realtime.service';
import { RealtimeObservable } from './realtime.observer';
import { HandleMessage } from './handle.Message';
import { Request, Response } from 'express';
import * as HashMap from 'hashmap';

@Controller('realtime')
export class RealtimeController extends HandleMessage {

    uidToStreamMap: HashMap;
    SSEClientsConnected: number;

    constructor(private readonly realtime: RealTimeService, private readonly observer: RealtimeObservable) {
        super();
        this.uidToStreamMap = new HashMap();
        this.SSEClientsConnected = 0;
        this.subscribeToComlinkMessages('comlink*');
        this.subscribeToEtdMessages('etd*');
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

    /* this function is subscribing and listen for any event message from comlink or for all events messages
      we can pass 'comlink*' in order to listen all comlink mesaages
    */
    subscribeToComlinkMessages(messageEvent: string) {
        this.realtime.subscribeToRedisMessage(messageEvent);
        this.observer.comlinkData.subscribe(message => {
            let temp = this.handleComlinkMessages(message);
            this.writeDataToStream(temp.channel, temp.uid, temp.data);
            Logger.log("Data: " + JSON.stringify(temp.data) + " channelEvent: " + temp.channel + " uid: " + temp.uid);
        });
    }

    /* this function is subscribing and listen for any event message from comlink or for all events
     messages we can pass 'comlink*' in order to listen all comlink mesaages
    */
    subscribeToEtdMessages(messageEvent: string) {
        this.realtime.subscribeToRedisMessage(messageEvent);
        this.observer.etdData.subscribe(message => {
            let temp = this.handleEtdMessages(message);
            this.writeDataToStream(temp.channel, temp.uid, temp.data);
            Logger.log("Data: " + JSON.stringify(temp.data) + " channelEvent: " + temp.channel + " uid: " + temp.uid);
        });
    }

    /* This function is reading the hashMap object to bring all the subscribed client to the Stream in
     order to send the available message
    */
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
        uidList.forEach(uid =>  { // On each client connection we need to check if the stream exist or not
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
