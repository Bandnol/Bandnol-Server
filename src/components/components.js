export default {
    responses: {
        Success: {
            description: "성공 응답",
            content: {
                "application/json": {
                    schema: {
                        type: "object",
                        properties: {
                            success: { type: "boolean", example: true },
                            data: { type: "object" },
                            error: {
                                type: ["object", "null"],
                                example: null,
                            },
                        },
                    },
                },
            },
        },
        SuccessSocialLogin: {
            description: "소셜 로그인 성공 -> redirect url로 콜백될 때",
            content: {
                "application/json": {
                    schema: {
                        type: "object",
                        properties: {
                            success: { type: "boolean", example: true },
                            data: { type: "object", nullable: true },
                            error: {
                                type: ["object", "null"],
                                example: null,
                            },
                        },
                    },
                },
            },
        },
        RecommendationNotFoundError: {
            description: "추천 곡 및 추천 기록이 없을 때 ",
            content: {
                "application/json": {
                    schema: {
                        type: "object",
                        properties: {
                            success: { type: "boolean", example: false },
                            data: { type: "object", nullable: true },
                            error: {
                                type: "object",
                                properties: {
                                    code: { type: "string", example: "R1301" },
                                    message: { type: "string", example: "추천 곡 및 추천 기록이 없습니다." },
                                },
                            },
                        },
                    },
                },
            },
        },
        NotFoundKeywordError: {
            description: "검색어가 없을 때",
            content: {
                "application/json": {
                    schema: {
                        type: "object",
                        properties: {
                            success: { type: "boolean", example: false },
                            data: { type: "object", nullable: true },
                            error: {
                                type: "object",
                                properties: {
                                    code: { type: "string", example: "R1300" },
                                    message: { type: "string", example: "검색어를 입력하세요." },
                                },
                            },
                        },
                    },
                },
            },
        },
        UnauthorizedError: {
            description: "인증 정보가 잘못되었을 때",
            content: {
                "application/json": {
                    schema: {
                        type: "object",
                        properties: {
                            success: { type: "boolean", example: false },
                            data: { type: "object", nullable: true },
                            error: {
                                type: "object",
                                properties: {
                                    code: { type: "string", example: "T1200" },
                                    message: { type: "string", example: "Authorization이 제공되지 않았습니다." },
                                },
                            },
                        },
                    },
                },
            },
        },
        TokenError: {
            description: "만료된 토큰, 올바르지 않은 토큰, 유효하지 않은 토큰 등 토큰에 문제가 발생했을 때",
            content: {
                "application/json": {
                    schema: {
                        type: "object",
                        properties: {
                            success: { type: "boolean", example: false },
                            data: { type: "object", nullable: true },
                            error: {
                                type: "object",
                                properties: {
                                    code: { type: "string", example: "T1201" },
                                    message: {
                                        type: "string",
                                        example:
                                            "토큰을 확인해주세요. (만료된 토큰, 올바르지 않은 토큰, 유효하지 않은 토큰 등)",
                                    },
                                },
                            },
                        },
                    },
                },
            },
        },
        NotSupportedSocialLoginError: {
            description: "지원하지 않는 소셜 로그인을 사용하려 할 때",
            content: {
                "application/json": {
                    schema: {
                        type: "object",
                        properties: {
                            success: { type: "boolean", example: false },
                            data: { type: "object", nullable: true },
                            error: {
                                type: "object",
                                properties: {
                                    code: { type: "string", example: "U1300" },
                                    message: {
                                        type: "string",
                                        example: "소셜 로그인 실패했습니다. 인증 정보를 확인해주세요.",
                                    },
                                },
                            },
                        },
                    },
                },
            },
        },
        QueryParamError: {
            description: "쿼리 파라미터가 올바르지 않을 때",
            content: {
                "application/json": {
                    schema: {
                        type: "object",
                        properties: {
                            success: { type: "boolean", example: false },
                            data: { type: "object", nullable: true },
                            error: {
                                type: "object",
                                properties: {
                                    code: { type: "string", example: "E1000" },
                                    message: { type: "string", example: "쿼리 파라미터가 올바르지 않습니다." },
                                },
                            },
                        },
                    },
                },
            },
        },
        RequestBodyError: {
            description: "Request Body가 올바르지 않을 때",
            content: {
                "application/json": {
                    schema: {
                        type: "object",
                        properties: {
                            success: { type: "boolean", example: false },
                            data: { type: "object", nullable: true },
                            error: {
                                type: "object",
                                properties: {
                                    code: { type: "string", example: "E1001" },
                                    message: { type: "string", example: "Request Body가 올바르지 않습니다." },
                                },
                            },
                        },
                    },
                },
            },
        },
        NoUserError: {
            description: "DB에 해당 유저가 없을 때",
            content: {
                "application/json": {
                    schema: {
                        type: "object",
                        properties: {
                            success: { type: "boolean", example: false },
                            data: { type: "object", nullable: true },
                            error: {
                                type: "object",
                                properties: {
                                    code: { type: "string", example: "U1301" },
                                    message: {
                                        type: "string",
                                        example: "사용자를 찾을 수 없습니다. 로그인 후 이용부탁드립니다.",
                                    },
                                },
                            },
                        },
                    },
                },
            },
        },
        DupliacteUserError: {
            description: "이미 가입된 사용자일 때",
            content: {
                "application/json": {
                    schema: {
                        type: "object",
                        properties: {
                            success: { type: "boolean", example: false },
                            data: { type: "object", nullable: true },
                            error: {
                                type: "object",
                                properties: {
                                    code: { type: "string", example: "U1201" },
                                    message: {
                                        type: "string",
                                        example: "이미 존재하는 사용자입니다. 로그인 후 이용해주세요.",
                                    },
                                },
                            },
                        },
                    },
                },
            },
        },
        DuplicateRecomsError: {
            description: "노래를 하루에 2번 이상 추천하려고 할 때",
            content: {
                "application/json": {
                    schema: {
                        type: "object",
                        properties: {
                            success: { type: "boolean", example: false },
                            data: { type: "object", nullable: true },
                            error: {
                                type: "object",
                                properties: {
                                    code: { type: "string", example: "R1200" },
                                    message: { type: "string", example: "오늘은 이미 노래를 추천하셨습니다." },
                                },
                            },
                        },
                    },
                },
            },
        },
        NotFoundSongError: {
            description: "트랙 ID가 존재하지 않을 때",
            content: {
                "application/json": {
                    schema: {
                        type: "object",
                        properties: {
                            success: { type: "boolean", example: false },
                            data: { type: "object", nullable: true },
                            error: {
                                type: "object",
                                properties: {
                                    code: { type: "string", example: "S1300" },
                                    message: { type: "string", example: "트랙 ID가 존재하지 않습니다." },
                                },
                            },
                        },
                    },
                },
            },
        },
        RecomsNotFoundOrAuthError: {
            description: "추천 곡이 없거나 추천 곡에 대한 접근 권한이 없을 때",
            content: {
                "application/json": {
                    schema: {
                        type: "object",
                        properties: {
                            success: { type: "boolean", example: false },
                            data: { type: "object", nullable: true },
                            error: {
                                type: "object",
                                properties: {
                                    code: { type: "string", example: "R1302" },
                                    message: { type: "string", example: "추천 곡이 없거나 접근 권한이 없습니다." },
                                },
                            },
                        },
                    },
                },
            },
        },
        DuplicateReplyError: {
            description: "답장을 두 번 이상 보내려고 할 때",
            content: {
                "application/json": {
                    schema: {
                        type: "object",
                        properties: {
                            success: { type: "boolean", example: false },
                            data: { type: "object", nullable: true },
                            error: {
                                type: "object",
                                properties: {
                                    code: { type: "string", example: "R1200" },
                                    message: { type: "string", example: "이미 해당 추천곡에 대한 답장이 존재합니다." },
                                },
                            },
                        },
                    },
                },
            },
        },
        NoModifyDataError: {
            description: "수정할 데이터 없을 때",
            content: {
                "application/json": {
                    schema: {
                        type: "object",
                        properties: {
                            success: { type: "boolean", example: false },
                            data: { type: "object", nullable: true },
                            error: {
                                type: "object",
                                properties: {
                                    code: { type: "string", example: "E1300" },
                                    message: { type: "string", example: "수정할 데이터가 없습니다." },
                                },
                            },
                        },
                    },
                },
            },
        },
        InvalidTimeTypeError: {
            type: "object",
            properties: {
                success: { type: "boolean", example: false },
                data: { type: "object", nullable: true },
                error: {
                    type: "object",
                    properties: {
                        code: { type: "string", example: "R1000" },
                        message: { type: "string", example: "추천 시간 형식이 잘못되었습니다." },
                    },
                },
            },
        },
        InvalidDateTypeError: {
            type: "object",
            properties: {
                success: { type: "boolean", example: false },
                data: { type: "object", nullable: true },
                error: {
                    type: "object",
                    properties: {
                        code: { type: "string", example: "U1000" },
                        message: { type: "string", example: "날짜 형식이 잘못되었습니다." },
                    },
                },
            },
        },
        CursorError: {
            description: "커서 형식이 올바르지 않을 때",
            content: {
                "application/json": {
                    schema: {
                        type: "object",
                        properties: {
                            success: { type: "boolean", example: false },
                            data: { type: "object", nullable: true },
                            error: {
                                type: "object",
                                properties: {
                                    code: { type: "string", example: "E1002" },
                                    message: { type: "string", example: "커서가 잘못되었습니다." },
                                },
                            },
                        },
                    },
                },
            },
        },
        AuthError: {
            description: "권한이 없을 때",
            content: {
                "application/json": {
                    schema: {
                        type: "object",
                        properties: {
                            success: { type: "boolean", example: false },
                            data: { type: "object", nullable: true },
                            error: {
                                type: "object",
                                properties: {
                                    code: { type: "string", example: "E1200" },
                                    message: {
                                        type: "string",
                                        example: "접근 권한이 없습니다. 본인의 토큰이 아닙니다.",
                                    },
                                },
                            },
                        },
                    },
                },
            },
        },
        InvalidEmailTypeError: {
            description: "이메일 형식이 잘못되었을 때",
            content: {
                "application/json": {
                    schema: {
                        type: "object",
                        properties: {
                            success: { type: "boolean", example: false },
                            data: { type: "object", nullable: true },
                            error: {
                                type: "object",
                                properties: {
                                    code: { type: "string", example: "U1001" },
                                    message: { type: "string", example: "올바르지 않은 이메일 형식입니다." },
                                },
                            },
                        },
                    },
                },
            },
        },
        InvalidPasswordError: {
            description: "패스워드가 잘못되었을 때",
            content: {
                "application/json": {
                    schema: {
                        type: "object",
                        properties: {
                            success: { type: "boolean", example: false },
                            data: { type: "object", nullable: true },
                            error: {
                                type: "object",
                                properties: {
                                    code: { type: "string", example: "E1200" },
                                    message: {
                                        type: "string",
                                        example: "잘못된 비밀번호입니다.",
                                    },
                                },
                            },
                        },
                    },
                },
            },
        },
        CursorOrAuthError: {
            description: "커서 형식이 올바르지 않거나 권한이 없을 때",
            content: {
                "application/json": {
                    schema: {
                        type: "object",
                        properties: {
                            success: { type: "boolean", example: false },
                            data: { type: "object", nullable: true },
                            error: {
                                type: "object",
                                properties: {
                                    code: { type: "string", example: "U1302" },
                                    message: { type: "string", example: "커서가 잘못되었거나 접근 권한이 없습니다." },
                                },
                            },
                        },
                    },
                },
            },
        },
        NotFoundArtistsError: {
            description: "아티스트를 불러오지 못했을 때",
            content: {
                "application/json": {
                    schema: {
                        type: "object",
                        properties: {
                            success: { type: "boolean", example: false },
                            data: { type: "object", nullable: true },
                            error: {
                                type: "object",
                                properties: {
                                    code: { type: "string", example: "A1300" },
                                    message: { type: "string", example: "아티스트를 불러오지 못했습니다." },
                                },
                            },
                        },
                    },
                },
            },
        },
        NoReplyError: {
            description: "답장이 없을 때",
            content: {
                "application/json": {
                    schema: {
                        type: "object",
                        properties: {
                            success: { type: "boolean", example: false },
                            data: { type: "object", nullable: true },
                            error: {
                                type: "object",
                                properties: {
                                    code: { type: "string", example: "R1304" },
                                    message: { type: "string", example: "답장이 없습니다." },
                                },
                            },
                        },
                    },
                },
            },
        },
        AlreadyInactiveError: {
            description: "이미 비활성화인 상태의 유저를 회원탈퇴 시킬 때",
            content: {
                "application/json": {
                    schema: {
                        type: "object",
                        properties: {
                            success: { type: "boolean", example: false },
                            data: { type: "object", nullable: true },
                            error: {
                                type: "object",
                                properties: {
                                    code: { type: "string", example: "R200" },
                                    message: { type: "string", example: "이미 비활성화 상태인 사용자입니다." },
                                },
                            },
                        },
                    },
                },
            },
        },
        InvalidHeaderError: {
            description: "요청의 헤더가 올바르지 않을 때",
            content: {
                "application/json": {
                    schema: {
                        type: "object",
                        properties: {
                            success: { type: "boolean", example: false },
                            data: { type: "object", nullable: true },
                            error: {
                                type: "object",
                                properties: {
                                    code: { type: "string", example: "E1003" },
                                    message: { type: "string", example: "헤더가 올바르지 않습니다." },
                                },
                            },
                        },
                    },
                },
            },
        },
        InvalidSignatureError: {
            description: "서명이 올바르지 않을 때",
            content: {
                "application/json": {
                    schema: {
                        type: "object",
                        properties: {
                            success: { type: "boolean", example: false },
                            data: { type: "object", nullable: true },
                            error: {
                                type: "object",
                                properties: {
                                    code: { type: "string", example: "E1004" },
                                    message: { type: "string", example: "유효하지 않은 서명입니다." },
                                },
                            },
                        },
                    },
                },
            },
        },
        NotFoundNotificationError: {
            description: "알림 ID가 잘못되었거나 이미 읽음 처리된 알림일 때",
            content: {
                "application/json": {
                    schema: {
                        type: "object",
                        properties: {
                            success: { type: "boolean", example: false },
                            data: { type: "object", nullable: true },
                            error: {
                                type: "object",
                                properties: {
                                    code: { type: "string", example: "U1304" },
                                    message: {
                                        type: "string",
                                        example: "알림 ID가 잘못되었거나 이미 읽음 처리된 알림입니다.",
                                    },
                                },
                            },
                        },
                    },
                },
            },
        },
    },
};
