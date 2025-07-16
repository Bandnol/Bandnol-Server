export class MissingSearchQueryError extends Error {
    errorCode = "RS1300";

    constructor(reason = "검색어를 입력하세요.", data = null) {
        super(reason);
        this.reason = reason;
        this.data = data;
    }
}

export class RecommendationNotFoundError extends Error {
    errorCode = "RS1301";

    constructor(reason = "추천 기록이 존재하지 않습니다.", data = null) {
        super(reason);
        this.reason = reason;
        this.data = data;
    }
}

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
    errorCode = "R1300";
    statusCode = 404;

    constructor(reason, data) {
        super(reason);
        this.reason = reason;
        this.data = data;
    }
}

export class RecomsSongNotFoundError extends Error {
    errorCode = "R1301";
    statusCode = 404;

    constructor(reason, data) {
        super(reason);
        this.reason = reason;
        this.data = data;
    }
}

export class UserMismatchError extends Error {
    errorCode = "R1302";
    statusCode = 403;

    constructor(reason, data) {
        super(reason);
        this.reason = reason;
        this.data = data;
    }
}

// 인증 정보가 제공되어 있지 않은 경우
export class UnauthorizedError extends Error {
    errorCode = "T1200";
    statusCode = 401;

    constructor(reason, data) {
        super(reason);
        this.reason = reason;
        this.data = data;
    }
}

// JWT 토큰에 문제가 있는 경우
export class TokenError extends Error {
    errorCode = "T1201";
    statusCode = 401;

    constructor(reason, data) {
        super(reason);
        this.reason = reason;
        this.data = data;
    }
}
