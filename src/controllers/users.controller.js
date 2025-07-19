import { StatusCodes } from "http-status-codes";
import {
    checkOwnId,
} from "../services/users.service.js"

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