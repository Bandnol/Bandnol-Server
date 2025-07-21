import { CursorOrAuthError } from "../errors.js";

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
        InvalidTypeError: {
            description: "날짜 또는 추천시간 형식이 잘못되었을 때",
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
                                    code: { type: "string", example: "날짜 형식 오류 : U1000, 시간 형식 오류 : R1000" },
                                    message: { type: "string", example: "날짜 또는 추천 시간 형식이 잘못되었습니다." },
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
        InvalidEmailTypeError: {
            description: "이메일 형식이 잘못되었을 때",
            content: {
                "application/json": {
                    schema:{
                        type: "object",
                        properties: {
                            success: { type: "boolean", example: false },
                            data: {type: "object", nullable: true},
                            error: {
                                type: "object",
                                properties: {
                                    code: { type: "string" , example: "U1001"},
                                    message: { type: "string", example: "올바르지 않은 이메일 형식입니다." }
                                }
                            }
                        }
                    }
                }
            }
        }
    },
};
