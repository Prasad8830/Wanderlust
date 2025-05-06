const express = require('express');
const router = express.Router({mergeParams: true});
const wrapAsync = require('../utils/wrapAsync')
const ExpressError = require('../utils/ExpressError');
const passport = require('passport');
const { saveRedirectUrl } = require('../middleware');
//controllers
const userController = require('../controllers/users');

//signup routes
router.route("/signup")
.get(userController.renderSignupForm)
.post(wrapAsync(userController.signup));

//get req
// router.get("/signup", userController.renderSignupForm);
//post req
// router.post("/signup", wrapAsync(userController.signup));

//login routes
router.route("/login")
.get(userController.renderLoginForm)
.post(saveRedirectUrl, passport.authenticate("local", {failureRedirect: "/login", failureFlash: true}), userController.login);

//get req
// router.get("/login", userController.renderLoginForm);
//post req
// router.post("/login", saveRedirectUrl, passport.authenticate("local", {failureRedirect: "/login", failureFlash: true}), userController.login);

//logout routes
router.get("/logout", userController.logout);

module.exports = router;