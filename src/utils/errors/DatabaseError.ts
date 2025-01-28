import { StatusCodes } from 'http-status-codes';

export default class DatabaseError extends Error {
  status: number;

  constructor(message: string) {
    super(message);
    this.status = StatusCodes.INTERNAL_SERVER_ERROR;
  }
}
