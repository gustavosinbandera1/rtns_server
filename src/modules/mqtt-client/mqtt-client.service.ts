import { Injectable } from '@nestjs/common';
import { EnvironmentService } from '../../environment.variables';
import { MqttClientObservable } from './mqtt-client.observer';
import { IMqttMessage } from '../../interfaces/mqttMessage.interface';
import * as MQTT from 'mqtt';
import * as fs from 'fs';
import * as path from 'path';
import chalk from 'chalk';
import { RedisCacheService } from 'src/modules/redis-cache/redis-cache.service';


@Injectable()
export class MqttClientService {
    environment = new EnvironmentService('.env');
    nrp: any;
    PORT: any = 8883;
    HOST: any = 'a2ffrpiqgdvw5t.iot.us-west-2.amazonaws.com';
    KEY: any;
    CERT: any;
    TRUSTED_CA_LIST: any;
    options: any = {};
    client: any;
    arrayIds: any = {};
    boardId: any;

    message: IMqttMessage = <IMqttMessage>{};


    constructor(private readonly observer: MqttClientObservable, private cacheManager: RedisCacheService) {
        this.KEY = fs.readFileSync(path.join(__dirname, '/tls-key.pem'));
        this.CERT = fs.readFileSync(path.join(__dirname, '/tls-crt.pem'));
        this.TRUSTED_CA_LIST = fs.readFileSync(path.join(__dirname, '/crt.ca.cg.pem'));
        this.options = {
            port: this.PORT,
            host: this.HOST,
            key: this.KEY,
            cert: this.CERT,
            rejectUnauthorized: true,
            // The CA list will be used to determine if server is authorized
            ca: this.TRUSTED_CA_LIST,
            protocol: 'mqtts',
            clientId: "mqttjs02"
        }

        this.setSomeValue("key", "valueNew").then( ()=>{
            console.log(chalk.blue("ya escribimos el dato en redis >>>>>>>>>>>>>>>>>>>>>>"))
           
        });
        this.setSomeValue("key2", "valueRenew").then( ()=>{
            console.log(chalk.blue("ya escribimos el dato en redis >>>>>>>>>>>>>>>>>>>>>>"))
           
        });

        this.getSomeValue("key").then((data)=>{
            console.log("la data leida en K1 ")
            console.log("--->" + data);
        });
        this.getSomeValue("key2").then((data)=>{
            console.log("la data leida enK2")
            console.log("--->" + data);
        });        

        this.client = MQTT.connect(this.options);
        this.client.on('connect', function () {
            console.log(chalk.green('>>>>>>>>>>>>>>>Connected to MQTT Server<<<<<<<<<<<<<<<<'))
        })
    }

    /* This function is subscribing to redis pub/sub messages fora specific message event */
   async subscribeToMqttMessage(message: string) {
        await this.client.subscribe(message);
        this.client.on('message', async (topic, msg, pkt) => {
            this.boardId = this.getBoardId(topic);
            if (!(this.boardId.toString() in this.arrayIds)) {
                this.arrayIds[this.boardId.toString()] = this.boardId.toString();
            }
            for (var key in this.arrayIds) {
                console.log(`${key}\n`);
            }
            console.log("--------------------------ID--------------------------------------------------------\n");

            if (topic.split('/', 5).includes('online')) {
                let message: IMqttMessage = {
                    topic: topic,
                    message: msg
                };
                this.observer['newStatusMessage'](message);
            }

            if (topic.split('/', 5).includes('rssi')) {
                this.observer['newRssiMessage'](msg);
            }

            if (topic != undefined && msg != undefined) {
                this.message.topic = topic;
                this.message.message = msg;
                this.observer['newMqttMessage'](this.message);
            }
        })
    }

    getBoardId(topic: string): string {
        return topic.split("/", 3)[2];
    }

    async setSomeValue(KEY:string , value:string){
        await this.cacheManager.set(KEY , value);
     }   
     
     async getSomeValue(KEY:string){
        const res = await this.cacheManager.get(KEY);
        return res;
     }

}