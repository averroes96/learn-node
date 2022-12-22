const express = require("express")
const router = express.Router()
const controller = require("../../controllers/employeesController")


router.route("/").get(controller.list).post(controller.create)

router.route("/:id").get(controller.retrieve).put(controller.update).delete(controller.remove)

module.exports = router