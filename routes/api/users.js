const express = require("express")
const router = express.Router()
const controller = require("../../controllers/UsersController")

router.route("/").post(controller.create)
router.route("/login/").post(controller.login)

module.exports = router