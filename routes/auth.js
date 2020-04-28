const express = require("express");
const {body} = require("express-validator");

const User = require("../models/user");
const userController = require("../controllers/user");
const isAuth = require("../middleware/is-auth");

const router = express.Router();

router.put("/signup", [
    body('email').isEmail().withMessage("Invalid email address")
    .custom(
        (value, {req}) => {
            return User.findOne({email: value})
            .then((userDoc) => {
                if(userDoc) Promise.reject("Email address already exists");
            });
        }
    )
    .normalizeEmail(),
    body('password').trim().isLength({min: 5}),
    body('name').trim().not().isEmpty()
], userController.signup);

router.post("/login", userController.postLogin);

router.get("/status", isAuth, userController.getStatus);
router.post("/status", isAuth, userController.postStatus);

module.exports = router;