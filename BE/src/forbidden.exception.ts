import { HttpException, HttpStatus } from '@nestjs/common';

export class ForbiddenException extends HttpException {
  constructor(text: string = 'Forbidden') {
    super(text, HttpStatus.FORBIDDEN);
  }
}
