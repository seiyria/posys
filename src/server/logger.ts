
import * as _ from 'lodash';

export class Logger {

  static parseDatabaseError(err: any, category: string): string {
    if(_.includes(err.message, 'violates foreign key constraint')) {
      return `Items that depend on that ${category} still exist. Removal aborted.`;
    }

    return 'Unknown error.';
  }

  static browserError(err: string): any {
    return { message: err };
  }

  static error(tag: string, msg: string|Error): string {
    const sentMessage = new Error(`[${tag}] ${msg}`);
    console.error(sentMessage);
    return sentMessage.message;
  }

  static info(tag: string, msg: string): void {
    console.log(`[${tag}] ${msg}`);
  }
}
