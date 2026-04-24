const express = require("express");
const router = express.Router();
const userController = require("../controllers/users.js");
const passport = require("passport");
const { validateUser } = require("../middleware.js");

router.post("/signup", validateUser, userController.signup);

router.post("/login", passport.authenticate("local", { session: false }), userController.login);

router.get("/logout", userController.logout);

module.exports = router;
