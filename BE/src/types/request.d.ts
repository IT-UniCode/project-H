import { Request as NestReq } from '@nestjs/common';

declare module 'express-serve-static-core' {
  interface Request extends NestReq {
    user?: JwtPayload;
  }
}
