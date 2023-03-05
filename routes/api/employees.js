const express = require("express")
const router = express.Router()
const controller = require("../../controllers/EmployeesController")
const permissions = require('../../config/permissions')
const verifyPermissions = require('../../middleware/PermissionMiddleware').verify


router.route("/")
    .get(controller.list)
    .post(verifyPermissions(permissions.Admin, permissions.Editor), controller.create)

router.route("/:id")
    .get(controller.retrieve)
    .put(verifyPermissions(permissions.Admin), controller.update)
    .delete(verifyPermissions(permissions.Admin), controller.remove)

module.exports = router