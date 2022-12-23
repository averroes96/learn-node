const express = require("express")
const router = express.Router()
const controller = require("../../controllers/UsersController")

router.route("/").post(controller.create)

module.exports = router