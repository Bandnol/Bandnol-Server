import { StatusCodes } from "http-status-codes";
import { adminSendNotifications } from "../services/admin.service.js";

export const handleAdminSendNotifications = async (req, res, next) => {
    /*
    #swagger.summary = '관리자용 알림 발송 API';
    
    #swagger.responses[200] = {
      $ref: "#/components/responses/Success"
    };

    #swagger.responses[401] = {
      $ref: "#/components/responses/InvalidHeaderError"
    };
  */
    try {
        const data = await adminSendNotifications(req.body);
        res.status(StatusCodes.OK).success(data);
    } catch (err) {
        next(err);
    }
};
