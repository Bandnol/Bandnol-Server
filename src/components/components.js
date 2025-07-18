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
            description: "소셜 로그인 페이지로 리다이렉트합니다.",
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
            description: "추천 기록이 없습니다.",
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
                                    errorCode: { type: "string" },
                                    reason: { type: "string" },
                                    data: { type: "object", nullable: true },
                                },
                            },
                        },
                    },
                },
            },
        },
        NotFoundUserEmailError: {
            description: "해당 이메일을 찾을 수 없습니다.",
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
                                    errorCode: { type: "string" },
                                    reason: { type: "string" },
                                    data: { type: "object", nullable: true },
                                },
                            },
                        },
                    },
                },
            },
        },
        NotFoundKeywordError: {
            description: "검색어를 입력하세요.",
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
                                    errorCode: { type: "string" },
                                    reason: { type: "string" },
                                    data: { type: "object" },
                                },
                            },
                        },
                    },
                },
            },
        },
        UserMismatchError: {
            description: "본인이 발신한 추천 곡이 아닙니다. 조회 권한이 없습니다.",
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
                                    errorCode: { type: "string" },
                                    reason: { type: "string" },
                                    data: { type: "object" },
                                },
                            },
                        },
                    },
                },
            },
        },
        UnauthorizedError: {
            description: "Authorization이 제공되지 않았습니다.",
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
                                    errorCode: { type: "string" },
                                    reason: { type: "string" },
                                    data: { type: "object", nullable: true },
                                },
                            },
                        },
                    },
                },
            },
        },
        TokenError: {
            description: "토큰을 확인해주세요. (만료된 토큰, 올바르지 않은 토큰, 유효하지 않은 토큰 등)",
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
                                    errorCode: { type: "string" },
                                    reason: { type: "string" },
                                    data: { type: "object", nullable: true },
                                },
                            },
                        },
                    },
                },
            },
        },
        NotSupportedSocialLoginError: {
            description: "소셜 로그인 실패했습니다. 인증 정보를 확인해주세요.",
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
                                    errorCode: { type: "string" },
                                    reason: { type: "string" },
                                    data: { type: "object", nullable: true },
                                },
                            },
                        },
                    },
                },
            },
        },
        QueryParamError: {
            description: "쿼리 파라미터가 올바르지 않습니다.",
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
                                    errorCode: { type: "string" },
                                    reason: { type: "string" },
                                    data: { type: "object", nullable: true },
                                },
                            },
                        },
                    },
                },
            },
        },
        RequestBodyError: {
            description: "Request Body가 올바르지 않습니다.",
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
                                    errorCode: { type: "string" },
                                    reason: { type: "string" },
                                    data: { type: "object", nullable: true },
                                },
                            },
                        },
                    },
                },
            },
        },
    },
};
