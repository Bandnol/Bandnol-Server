// 도메인 : User
export class InvalidDateTypeError extends Error {
    errorCode = "U1000";
    statusCode = 400;

    constructor(reason, data) {
        super(reason);
        this.reason = reason;
        this.data = data;
    }
}

export class InvalidEmailTypeError extends Error {
    errorCode = "U1001";
    statusCode = 400;

    constructor(reason, data) {
        super(reason);
        this.reason = reason;
        this.data = data;
    }
}

export class NotSupportedSocialLoginError extends Error {
    errorCode = "U1300";
    statusCode = 401;

    constructor(reason, data) {
        super(reason);
        this.reason = reason;
        this.data = data;
    }
}
export class NoUserError extends Error {
    errorCode = "U1301";
    statusCode = 401;

    constructor(reason, data) {
        super(reason);
        this.reason = reason;
        this.data = data;
    }
}

export class AuthorizationCodeError extends Error {
    errorCode = "U1302";
    statusCode = 401;

    constructor(reason, data) {
        super(reason);
        this.reason = reason;
        this.data = data;
    }
}

// 도메인 : Recoms
export class InvalidRecomsTimeError extends Error {
    errorCode = "R1000";
    statusCode = 400;

    constructor(reason, data) {
        super(reason);
        this.reason = reason;
        this.data = data;
    }
}

export class DuplicateRecomsError extends Error {
    errorCode = "R1200";
    statusCode = 409;

    constructor(reason, data) {
        super(reason);
        this.reason = reason;
        this.data = data;
    }
}

export class DuplicateSingError extends Error {
    errorCode = "R1201";
    statusCode = 409;

    constructor(reason, data) {
        super(reason);
        this.reason = reason;
        this.data = data;
    }
}

export class NotFoundKeywordError extends Error {
    errorCode = "R1300";
    statusCode = 404;

    constructor(reason, data) {
        super(reason);
        this.reason = reason;
        this.data = data;
    }
}

export class RecommendationNotFoundError extends Error {
    errorCode = "R1301";
    statusCode = 404;

    constructor(reason, data = null) {
        super(reason);
        this.reason = reason;
        this.data = data;
    }
}

export class RecomsNotFoundOrAuthError extends Error {
    errorCode = "R1302";
    statusCode = 404;

    constructor(reason, data) {
        super(reason);
        this.reason = reason;
        this.data = data;
    }
}

export class NotSendRecomsError extends Error {
    errorCode = "R1303";
    statusCode = 422;

    constructor(reason, data) {
        super(reason);
        this.reason = reason;
        this.data = data;
    }
}

// 도메인 : Artists
export class NotFoundArtistsError extends Error {
    errorCode = "A1300";
    statusCode = 404;

    constructor(reason, data) {
        super(reason);
        this.reason = reason;
        this.data = data;
    }
}

// 도메인 : Token
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

// 다른 사람의 토큰인 경우
export class AuthTokenError extends Error {
    errorCode = "T1202";
    statusCode = 403;

    constructor(reason, data) {
        super(reason);
        this.reason = reason;
        this.data = data;
    }
}

// 도메인 : Spotify
export class NotFoundSongError extends Error {
    errorCode = "S1300";
    statusCode = 400;
    constructor(reason, data) {
        super(reason);
        this.reason = reason;
        this.data = data;
    }
}

export class NotFoundArtistsSpotifyError extends Error {
    errorCode = "S1301";
    statusCode = 400;
    constructor(reason, data) {
        super(reason);
        this.reason = reason;
        this.data = data;
    }
}

// 도메인 : 기타
export class QueryParamError extends Error {
    errorCode = "E1000";
    statusCode = 400;

    constructor(reason, data) {
        super(reason);
        this.reason = reason;
        this.data = data;
    }
}

export class RequestBodyError extends Error {
    errorCode = "E1001";
    statusCode = 400;

    constructor(reason, data) {
        super(reason);
        this.reason = reason;
        this.data = data;
    }
}

export class NoModifyDataError extends Error {
    errorCode = "E1300";
    statusCode = 404;

    constructor(reason, data) {
        super(reason);
        this.reason = reason;
        this.data = data;
    }
}

export class CursorError extends Error {
    errorCode = "E1002";
    statusCode = 400;

    constructor(reason, data) {
        super(reason);
        this.reason = reason;
        this.data = data;
    }
}

export class AuthError extends Error {
    errorCode = "E1200";
    statusCode = 403;

    constructor(reason, data) {
        super(reason);
        this.reason = reason;
        this.data = data;
    }
}

export class SchedulerError extends Error {
    errorCode = "E1301";
    statusCode = 500;

    constructor(reason, data) {
        super(reason);
        this.reason = reason;
        this.data = data;
    }
}
