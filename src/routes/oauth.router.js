import { Router } from "express";

import passport from "passport";

const router = Router();



router.get("/login/google", passport.authenticate("google"));
router.get("/callback/google", passport.authenticate("google", {
  failureRedirect: "/api/v1/oauth2/login/google", 
  failureMessage: true,
}), (req, res) => {
  res.redirect("/"); 
});
router.get("/login/naver", passport.authenticate("naver"));
router.get("/callback/naver", passport.authenticate("naver", {
    failureRedirect: "/api/v1/oauth2/login/naver",
    failureMessage: true,
}), (req, res) => {
    res.redirect("/");
});
router.get("/login/kakao", passport.authenticate("kakao"));
router.get("/callback/kakao", passport.authenticate("kakao", {
    failureRedirect: "api/v1/oauth2/login/kakao",
    failureMessage: true,
  }),
  (req, res) => res.redirect("/")
);

export default router;