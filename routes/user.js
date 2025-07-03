const express = require("express");
const router = express.Router({mergeParams:true});
const User=require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync");
const passport=require("passport");
const { saveRedirectUrl } = require("../middleware.js");
const userController=require("../controllers/user.js")

//56.10: post request 

router.route("/signup")
    .get(userController.renderSignupForm)
    .post(wrapAsync(userController.signup));
//56.11: creating login page 
router.route("/login")
    .get(userController.renderLoginForm)
    .post(saveRedirectUrl,passport.authenticate('local', { failureRedirect: '/login',failureFlash:true}),userController.login)
//57.2 : logout router :
router.get("/logout",userController.logout);


module.exports=router;