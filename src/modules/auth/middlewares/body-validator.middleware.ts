import {
  BadRequestException,
  NestMiddleware, 
  Injectable, 
  Inject } from '@nestjs/common';
import { Request, Response } from 'express';
import { validate } from 'joi';
import { authUserSchema } from '../../users/joi/auth-user.joi';

import { Model, Types } from 'mongoose';
import { MESSAGES, ARTICLE_MODEL_TOKEN } from '../../../server.constants';

@Injectable()
/**
 *  Article By Id Middleware
 *  We validating if the Id provided is valid, and returning the found article in the variable req.article
 */
export class bodyValidatorMiddleware implements NestMiddleware {
  constructor() {
    console.log('Initializing Body Validator Middleware');
  }
  async use(req, res, next: Function) {
    console.log('HI, IM A MIDDLEWARE BODY VALIDATOR');
    const result = validate(req.body, authUserSchema);

    if (result.error) {
      const errorMessage = result.error.details.shift().message;
      const message: string = errorMessage.replace(/["]/g, '');

      return next(new BadRequestException(`Validation failed: ${message}`));
    }
    next();
  }
}
