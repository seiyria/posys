import { Injectable } from '@angular/core';
import { ErrorHandler } from '@angular/core';
import { IonicErrorHandler } from 'ionic-angular';
import { ErrorService } from '../error.service';

import { ErrorMessage } from '../../models/errormessage';

@Injectable()
export class CustomErrorHandler extends IonicErrorHandler implements ErrorHandler {

  constructor(public errorService: ErrorService) { super(); }

  handleError(err: any): void {

    super.handleError(err);

    const messageObject = new ErrorMessage({
      message: err.message,
      stack: err.originalError ? err.originalError.stack : err.stack,
      foundAt: 'Client'
    });

    this.errorService
      .addClientError(messageObject)
      .toPromise();
  }
}
