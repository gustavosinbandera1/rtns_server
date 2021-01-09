import { Injectable, NestMiddleware, Inject } from '@nestjs/common';
import * as isIp from 'is-ip';
import * as chalk from 'chalk';
import { USER_MODEL_TOKEN, SERVER_CONFIG } from '../../server.constants';
import * as session from 'express-session';

import { MongoDb } from '../../database/mongo.db';

@Injectable()
export class TenantMiddleware implements NestMiddleware {
    constructor() { }
    async use(req, res, next) {
        const log = chalk.default;
        console.log('ID_SESSION: ' + req.sessionID);
         if(req.session.page_views) {
             console.log(log.green('you are visited this page'));
             console.log(req.session.page_views);
             req.session.page_views++;
         }else{ 
             req.session.page_views = 1;
         }

        console.log(log.yellow('*****************Running multitenant Selector!!***************'));
        //console.log(req.session);
        let refererUrl = req.headers.referer;
        console.log('el refer es : ');
        console.log(req.headers);
        //let subdomain = req.subdomains[0];
        //console.log(subdomains);
        let subdomain = this.getSubDomain(refererUrl, req);
        req.database = (subdomain !== '') ? `${subdomain}_etd` : 'etd';


        /* if (typeof req.subdomains[0] === 'undefined' || req.session.Client && req.session.Client.name === req.subdomains[0]) {
            console.log(log.yellow('did not search database for: '));
            console.log(req.database);
            next();
        } */
        if(req.session.Client && req.session.Client.database === req.database){
            console.log(log.yellow('did not search database for: '));
            console.log(req.database);
        } else {
        const mongo = new MongoDb();
        console.log('vamos a conectarnos');
        await mongo.connect();
        const db = mongo.getDb('my-db');
        db.collection('datasources', (error, collection) => {
            if (error) {
                return res.send(403, 'sorry! you cant see that');
            }
            collection.findOne({database: req.database}, (err, client) => {
                if (err) {
                    if (!client) {
                    console.log('the database doesnt exist');
                    return ;
                    }
                } else {
                    console.log('searched database for ' + req.database);
                    req.session.Client = client;
                    console.log('el cliente');
                    console.log(log.green(client));
                    return next();
                }
            });
            /*   collection
                .find()
                .toArray((arrayError, result) => {
                    if (arrayError) {
                        res.json(result);
                    }
                    console.log(result);
                    next();
                }); */
        });

        }

    }

    getSubDomain(refererUrl, req) {
        let hostname = '';
        if (refererUrl) {
            hostname = this.extractHostname(refererUrl);
        } else {
            hostname = req.headers.host;
        }
        let isDevUrl = this.isAppInDevEnv(hostname);
        if (isIp(hostname)) {
            isDevUrl = true;
        }
        let subdomain = '';
        if (isDevUrl) {
            console.log("env is dev");
        } else {
            console.log("env is prod");
            subdomain = hostname.split('.')[0];
        }
        return subdomain;
    }

    extractHostname(url) {
        let hostname;
        if (url.indexOf('://') > -1) {
            hostname = url.split('/')[2];
        } else {
            hostname = url.split('/')[0];
        }
        hostname = hostname.split('?')[0];
        return hostname;
    }

    isAppInDevEnv(hostname) {
        let result = true;
        if (hostname.indexOf(':') <= -1) {
            if (hostname.split('.').length > 2) {
                result = false;
            }
        }
        return result;
    }
}