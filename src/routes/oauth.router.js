import { Router } from "express";

import passport from "passport";

const router = Router();

router.get(
  "/login/google",
  /*
    #swagger.summary = "Google 소셜 로그인"
    #swagger.responses[302] = {
        $ref: "#/components/responses/SuccessSocialLogin"
    }
    
    #swagger.responses[401] = {
        $ref: "#/components/responses/NotSupportedSocialLoginError"
    }
  */
  passport.authenticate("google")
);

router.get(
    "/callback/google",
    /*
    #swagger.summary = "Google 소셜 로그인 콜백"
    #swagger.responses[200] = {
        $ref: "#/components/responses/Success"
    }
    
    #swagger.responses[401] = {
        $ref: "#/components/responses/NotSupportedSocialLoginError"
    }
  */
    passport.authenticate("google", {
        failureRedirect: "/api/v1/oauth2/login/google",
        failureMessage: true,
    }),
    (req, res) => {
        const { token, user } = req.user;
        res.success({
            token,
            user,
        });
    }
);
router.get("/login/naver", 
    /*
    #swagger.summary = "Naver 소셜 로그인"
    #swagger.responses[302] = {
        $ref: "#/components/responses/SuccessSocialLogin"
    }
    
    #swagger.responses[401] = {
        $ref: "#/components/responses/NotSupportedSocialLoginError"
    }
    */
    passport.authenticate("naver"));
router.get(
    "/callback/naver",
    /*
    #swagger.summary = "Naver 소셜 로그인 콜백"
    #swagger.responses[200] = {
        $ref: "#/components/responses/Success"
    }
    
    #swagger.responses[401] = {
        $ref: "#/components/responses/NotSupportedSocialLoginError"
    }
    */
    passport.authenticate("naver", {
        failureRedirect: "/api/v1/oauth2/login/naver",
        failureMessage: true,
    }),
    (req, res) => {
        const { token, user } = req.user;
        res.success({
            token,
            user,
        });
    }
);
router.get("/login/kakao", 
    /*
    #swagger.summary = "Kakao 소셜 로그인"
    #swagger.responses[302] = {
        $ref: "#/components/responses/SuccessSocialLogin"
    }
    
    #swagger.responses[401] = {
        $ref: "#/components/responses/NotSupportedSocialLoginError"
    }
    */
    passport.authenticate("kakao"));
router.get(
    "/callback/kakao",
    /*
    #swagger.summary = "Kakao 소셜 로그인 콜백"
    #swagger.responses[200] = {
        $ref: "#/components/responses/Success"
    }
    
    #swagger.responses[401] = {
        $ref: "#/components/responses/NotSupportedSocialLoginError"
    }
    */
    passport.authenticate("kakao", {
        failureRedirect: "api/v1/oauth2/login/kakao",
        failureMessage: true,
    }),
    (req, res) => {
        const { token, user } = req.user;
        res.success({
            token,
            user,
        });
    }
);

export default router;
