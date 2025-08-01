import { StatusCodes } from "http-status-codes";
import { checkOwnId, modifyUserInfo, viewNotification, viewMyPage } from "../services/users.service.js";
import { sendEmail } from "../services/nodemailer.service.js";
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
        const isPossibleOwnId = await checkOwnId(ownId);
        res.status(StatusCodes.OK).success({ isPossibleOwnId: isPossibleOwnId });
    } catch (err) {
        next(err);
    }
};

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

    try {
        const userId = req.user.id;
        console.log(req.body);
        const user = await modifyUserInfo(
            userId,
            userInfoRequestDTO({
                ...req.body,
            })
        );
        res.status(StatusCodes.OK).success(user);
    } catch (err) {
        next(err);
    }
};

export const handleInquiry = async (req, res, next) => {
    /*
    #swagger.summary = '문의하기 API';

    #swagger.requestBody = {
      required: true,
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              name: { type: "string", example: "임지은" },
              email: { type: "string", example: "user@gmail.com" },
              content: { type: "string", example: " ~ 이런 기능을 원해요 !!" },
            },
          }
        }
      }
    };

    #swagger.responses[200] = {
      $ref: "#/components/responses/Success"
    };
     #swagger.responses[400] = {
      $ref: "#/components/responses/InvalidEmailTypeError"
    };
    */
    try {
        const name = req.body.name;
        const email = req.body.email;
        const text = req.body.content;
        console.log(req.body);

        const inquiry = await sendEmail(name, email, text);
        res.status(StatusCodes.OK).success({ inquiry });
    } catch (err) {
        next(err);
    }
};

export const handleViewNotification = async (req, res, next) => {
    /*
    #swagger.summary = '알림 센터 조회 API'

    #swagger.security = [{
        bearerAuth: []
    }]

    #swagger.responses[200] = {
        $ref: "#/components/responses/Success"
    };

    #swagger.responses[400] = {
        $ref: "#/components/responses/CursorError"
    };

    #swagger.responses[401] = {
        $ref: "#/components/responses/TokenError"
    };

    #swagger.responses[403] = {
        $ref: "#/components/responses/AuthError"
    };
    */

    try {
        const notification = await viewNotification(req.user.id, req.query.cursor);
        res.status(StatusCodes.OK).success(notification);
    } catch (err) {
        next(err);
    }
};

export const handleViewMyPage = async (req, res, next) => {
    /*
    #swagger.summary = '마이페이지 조회 API'

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
        const mypage = await viewMyPage(req.user.id, req.params.ownId);
        res.status(StatusCodes.OK).success(mypage);
    } catch (err) {
        next(err);
    }
};