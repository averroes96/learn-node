const express = require("express")
const router = express.Router()
const controller = require("../../controllers/UsersController")

router.route("/").post(controller.create)
router.route("/login/").post(controller.login)
router.route("/token/refresh").get(controller.refreshToken)
router.route("/logout/").get(controller.logout)

module.exports = router