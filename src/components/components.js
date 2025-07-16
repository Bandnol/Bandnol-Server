export const responses = {
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
    Failed: {
        description: "실패 응답",
        content: {
            "application/json": {
                schema: {
                    type: "object",
                    properties: {
                        success: { type: "boolean", example: false },
                        data: { type: "object" },
                        error: {
                            type: ["object", "null"],
                            example: {
                                code: "R1301",
                                message: "에러 메시지",
                            },
                        },
                    },
                },
            },
        },
    },
};
