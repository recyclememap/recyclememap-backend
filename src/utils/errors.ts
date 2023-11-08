import { StatusCodes } from '@root/commons/constants';

export class ApiError extends Error {
  status;
  error;

  constructor(status: number, message: string, error: any = {}) {
    super(message);

    this.status = status;
    this.error = error;
  }

  static BadRequest(message: string, error?: any) {
    return new ApiError(StatusCodes.BadRequest, message, error);
  }

  static NotFound(message: string, error?: any) {
    return new ApiError(StatusCodes.NotFound, message, error);
  }
}
