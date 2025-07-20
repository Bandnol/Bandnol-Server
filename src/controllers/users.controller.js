import { StatusCodes } from "http-status-codes";
import {
    checkOwnId,
    modifyUserInfo,
} from "../services/users.service.js"
import { userInfoRequestDTO } from "../dtos/users.dto.js";

export const handleCheckOwnId = async (req, res, next) => {
    /*
    #swagger.summary = '유저 아이디 중복 확인하기 API';

    #swagger.security = [{
        bearerAuth: []
    }]
    
    #swagger.responses[200] = {
      $ref: "#/components/responses/Success"
    };

    #swagger.responses[401] = {
      $ref: "#/components/responses/TokenError"
    };
    */

    try {
        const ownId = req.query.ownId;
        const isPossibleOwnId = await checkOwnId (ownId);
        res.status(StatusCodes.OK).success({ "isPossibleOwnId": isPossibleOwnId });
    }catch(err){
        next(err);
    }
}

export const handleModifyUserInfo = async (req, res, next) => {
    /*
    #swagger.summary = '회원 정보 수정 API';

    #swagger.security = [{
        bearerAuth: []
    }]

    #swagger.requestBody = {
      required: true,
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              nickname: { type: "string" },
              ownId: { type: "string" },
              gender: { type: "string" },
              birth: { type: "string", format: "date" },
              recomsTime: { type: "string" },
              bio: { type: "string" },
            },
          }
        }
      }
    };
    #swagger.responses[200] = {
      $ref: "#/components/responses/Success"
    };
    #swagger.responses[400] = {
      $ref: "#/components/responses/InvalidTypeError"
    };
    #swagger.responses[401] = {
      $ref: "#/components/responses/TokenError"
    };
    #swagger.responses[404] = {
      $ref: "#/components/responses/NoModifyDataError"
    };
          
  */
  
  const userId = req.user.id;
  console.log(req.body)
  const user = await modifyUserInfo(userId, userInfoRequestDTO({
    ...req.body,
  }));
  res.status(StatusCodes.OK).success(user);
}