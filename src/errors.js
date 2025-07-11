export class NotFoundUserEmail extends Error {
  errorCode = "U1301";
  statusCode = 404;

  constructor(reason, data) {
    super(reason);
    this.reason = reason;
    this.data = data;
  }
}