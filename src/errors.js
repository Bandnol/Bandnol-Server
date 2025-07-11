export class RecomsSongNotFoundError extends Error {
    errorCode = "R1301";

    constructor(reason, data) {
        super(reason);
        this.reason = reason;
        this.data = data;
    }
}
