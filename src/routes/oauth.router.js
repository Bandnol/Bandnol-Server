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

export default router;