export class NotFoundUserEmail extends Error {
  errorCode = "U1301";
  statusCode = 404;

  constructor(reason, data) {
    super(reason);
    this.reason = reason;
    this.data = data;
  }
}

export class NotFoundKeyword extends Error {
  errorCode = "R1300"
  statusCode = 404;

  constructor(reason, data){
    super(reason);
    this.reason = reason;
    this.data = data;
  }
}

export class RecomsSongNotFoundError extends Error {
    errorCode = "R1301";

    constructor(reason, data) {
        super(reason);
        this.reason = reason;
        this.data = data;
    }
}