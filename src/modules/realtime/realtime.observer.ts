import { Injectable } from '@nestjs/common';
import { BehaviorSubject } from 'rxjs';
/**
*  Function for local Observable Variables
*/
@Injectable()
export class RealtimeObservable {
    constructor() {}

    private messageComlink = new BehaviorSubject<any>(null);
    comlinkData = this.messageComlink.asObservable();

    private messageEtd = new BehaviorSubject<any>(null);
    etdData = this.messageEtd.asObservable();

    /* We need to have just a function for each server  we'll want to listen 
    this function is updating the data on controller by Observable mechanism*/
    newComlinkMessage(dat: any, chann: any) {
        const message = {
            data: dat,
            channel: chann,
            uid: dat.uid,
        };
        this.messageComlink.next(message);
    }

    newEtdMessage(dat: any, chann: any) {
        const message = {
            data: dat,
            channel: chann,
            uid: dat.uid,
        }
        this.messageEtd.next(message);
    }
}