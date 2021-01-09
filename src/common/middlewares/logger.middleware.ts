import { Injectable, NestMiddleware } from '@nestjs/common';
import * as chalk from 'chalk';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
	use(req, res, next: Function) {
    let logMessage;
    const log = chalk.default;
    console.log(log.blue("Logger midleware"));
    logMessage = `Url: ${req.baseUrl}`;
    console.log(log.blue(logMessage));
    next();
	}
}