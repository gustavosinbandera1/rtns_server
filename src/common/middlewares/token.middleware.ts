import { Injectable, NestMiddleware, Logger, Inject } from '@nestjs/common';
import { Request, Response } from 'express';

import * as chalk from 'chalk';
import { Model } from 'mongoose';
import { verify } from 'jsonwebtoken';

import { USER_MODEL_TOKEN, SERVER_CONFIG } from '../../server.constants';
import { IUser } from '../../modules/users/interfaces/user.interface';

@Injectable()
export class TokenMiddleware implements NestMiddleware {
	constructor() { }
	use(req, res, next) {
		const log = chalk.default;
		req.user = {};
		let parsedToken = {};
		Logger.log('please wait checking the token!!');
		console.log(log.yellow("Token middleware"));
		console.log(log.yellow(`Database: ${req.database}`));
		const token: any = req.headers.accessToken || req.headers.Authorization;
		if (token) {
			try {
				
				//	parsedToken = verify(token, SERVER_CONFIG.jwtSecret);
				//	req.user =  await this.userModel.findById(parsedToken['_id']).select('-local.salt -local.hashedPassword');
			} catch (ex) {
				return res.status(500).send(ex);
			}
		}
		next();
	}
}