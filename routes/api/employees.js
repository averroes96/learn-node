const express = require("express")
const router = express.Router()
const controller = require("../../controllers/EmployeesController")
const jwtMiddleware = require("../../middleware/JWTMiddleware")


router.route("/").get(jwtMiddleware.verify, controller.list).post(controller.create)

router.route("/:id").get(controller.retrieve).put(controller.update).delete(controller.remove)

module.exports = router