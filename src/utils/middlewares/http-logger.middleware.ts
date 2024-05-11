import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class HttpLoggerMiddleware implements NestMiddleware {
  private readonly logger = new Logger('HTTP');

  use(request: Request, response: Response, next: NextFunction): void {
    const { ip, method, originalUrl: path } = request;
    const startAt = process.hrtime();

    response.on('finish', () => {
      const { statusCode } = response;
      const diff = process.hrtime(startAt);
      const responseTime = diff[0] * 1e3 + diff[1] * 1e-6;
      const log = `${method} ${path} ${statusCode} ${responseTime} - ${ip}`;

      if (statusCode >= 400) {
        this.logger.error(log);
        return;
      }

      this.logger.log(log);
    });

    next();
  }
}
