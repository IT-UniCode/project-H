import { HttpException, HttpStatus } from '@nestjs/common';

export class ForbiddenException extends HttpException {
  constructor(text?: string) {
    super(text || 'Forbidden', HttpStatus.FORBIDDEN);
  }
}
