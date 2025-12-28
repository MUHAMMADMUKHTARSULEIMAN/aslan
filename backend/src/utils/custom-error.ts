interface ErrorDetail {
  field: string;
  message: string;
  value: any;
}

export interface ErrorDetails extends Array<ErrorDetail> {}

export default class CustomError extends Error {
  status: string;
  statusCode: number;
  isOperational: boolean;
  value: any;
  path: string;
  errors: Record<string, any>;

  constructor(statusCode: number, message: string) {
    super(message);
    this.statusCode = statusCode;
    switch (this.statusCode) {
      case 400:
        this.status = "Bad Request";
        break;
      case 403:
        this.status = "Forbidden";
        break;
      case 404:
        this.status = "Not Found";
        break;
      case 409:
        this.status = "Conflict";
        break;
      case 410:
        this.status = "Gone";
        break;

      default:
        this.status = "Internal Server Error";
    }
    this.isOperational = true;
    this.path = "";
    this.errors = {};
    Error.captureStackTrace(this, this.constructor);
  }
}
