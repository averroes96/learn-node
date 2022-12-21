const express = require("express")
const router = express.Router()

const employees = require("../../data/employees.json")

router.route("/").get((req, res) => {
    res.json(employees)
}).post((req, res) => {
    res.json({
        "first_name": req.body.first_name,
        "last_name": req.body.last_name,
    })
}).put((req, res) => {
    res.json({
        "first_name": req.body.first_name,
        "last_name": req.body.last_name,
    })
}).delete((req, res) => {
    res.json({
        "id": req.body.id
    })
})

router.route("/:id").get((req, res) => {
    res.json(req.params.id)
})

module.exports = router