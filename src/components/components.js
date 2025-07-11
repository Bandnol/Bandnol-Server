// src/swagger/components.js
export default {
  responses: {
    Success: {
      description: "성공 응답",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              resultType: { type: "string" },
              error: { type: "object" },
              success: { type: "object" },
            },
          },
        },
      },
    },  
  }
}