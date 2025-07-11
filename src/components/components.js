export default {
  responses: {
    Success: {
      description: "성공 응답",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              success: { type: "boolean"},
              data: { type: "object" },
              error: {
                type: ["object", "null"],
                example: null
              }
            }
          },
        },
      },
    },  
  }
}