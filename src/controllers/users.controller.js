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
              nickname: { type: "string", example: "징니" },
              ownId: { type: "string", example: "jingni" },
              gender: { type: "string", example: "WOMAN" },
              birth: { type: "string", format: "date", example: "2004-03-08" },
              recomsTime: { type: "string", example: "09:00" },
              bio: { type: "string", example: "안뇽하세용 ~ 징니에요 ~ " },
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