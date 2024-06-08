import { HttpException, HttpStatus } from '@nestjs/common';

export class EmailConflictException extends HttpException {
  constructor() {
    super('Email already exists.', HttpStatus.CONFLICT);
  }
}