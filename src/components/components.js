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
        NoUserError: {
            description: "사용자를 찾을 수 없습니다. 로그인 후 이용부탁드립니다.",
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
        DuplicateRecomsError: {
            description: "오늘은 이미 노래를 추천하셨습니다.",
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
        NotFoundSongError: {
            description: "트랙 ID가 존재하지 않습니다.",
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
        RecomsSongNotFoundError: {
            description: "트랙 ID가 존재하지 않습니다.",
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
        RecomsNotFoundOrAuthError: {
            description: "추천 곡이 없거나 접근 권한이 없습니다.",
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
        NoModifyDataError: {
            description: "수정할 데이터가 없습니다.",
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
                                    errorCode: { type: "string" },
                                    reason: { type: "string" },
                                    data: { type: "object", nullable: true },
                                }
                            }
                        }
                    }
                }
            }
        },
        InvalidTypeError: {
            description: "날짜 또는 추천시간 형식이 잘못되었을 때",
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
                                    code: { type: "string" , example: "날짜 형식 오류 : U1000, 시간 형식 오류 : R1000"},
                                    message: { type: "string", example: "날짜 또는 추천 시간 형식이 잘못되었습니다." }
                                }
                            }
                        }
                    }
                }
            }
        }
    },
};
