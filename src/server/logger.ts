
export class Logger {

  static error(tag: string, msg: string): void {
    console.error(new Error(`[${tag}] ${msg}`));
  }

  static info(tag: string, msg: string): void {
    console.log(`[${tag}] ${msg}`);
  }
}
