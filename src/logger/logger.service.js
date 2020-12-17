import { Injectable } from '@nestjs/common';
import { Logger } from '@nestjs/common';

@Injectable()
export class LoggerService extends Logger {
  log(message) {
    /* your implementation */
    super.log(message);
  }
  error(message, trace) {
    /* your implementation */
    super.error(message, trace);
  }
  warn(message) {
    /* your implementation */
    super.warn(message);
  }
  debug(message) {
    /* your implementation */
    super.debug(message);
  }
  verbose(message) {
    /* your implementation */
    super.verbose(message);
  }
}
