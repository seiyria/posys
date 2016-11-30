
export class Logger {

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
