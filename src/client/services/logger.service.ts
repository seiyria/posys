
import { Injectable } from '@angular/core';
import { Response } from '@angular/http';
import { Observable } from 'rxjs/Rx';

@Injectable()
export class LoggerService {
  error(e: Error|Response): void {

    let errMsg: string;

    if (e instanceof Response) {
      const body = e.json() || '';
      const err = body.error || JSON.stringify(body);
      errMsg = `${e.status} - ${e.statusText || ''} ${err}`;
    } else {
      errMsg = e.message ? e.message : e.toString();
    }

    console.error(errMsg);
  }

  observableError(e: Error|Response) {
    this.error(e);
    return Observable.throw(e);
  }
}
