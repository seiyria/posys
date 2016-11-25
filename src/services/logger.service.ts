
import { Injectable } from '@angular/core';

@Injectable()
export class LoggerService {
  error(e: Error) {
    console.error(e);
  }
}
