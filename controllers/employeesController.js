let employees = require("../models/employees.json")

const list = (req, res) => {
    res.json(employees)
}

const create = (req, res) => {
    const employee = {
        id: employees[employees.length - 1].id + 1 || 1,
        first_name: req.body.first_name,
        last_name: req.body.last_name
    }

    if (!employee.first_name || !employee.last_name) {
        return res.status(400).json({
            "detail": "first and last name must be set"
        })
    }

    employees.push(employee)
    res.status(201).json(employees.at(position - 1))
}

const update = (req, res) => {
    const employee = employees.find((employee) => employee.id == parseInt(req.params.id))

    if (!employee) {
        return res.status(404).json({
            "detail": "employee not found."
        })
    }
    employee.first_name = req.body.first_name
    employee.last_name = req.body.last_name

    res.json(employees.at(req.params.id - 1))
}

const remove = (req, res) => {
    const employee = employees.find((employee) => employee.id == parseInt(req.params.id))
    if (!employee) {
        return res.status(404).json({
            "detail": "employee not found."
        })
    }

    const filteredArray = employees.filter((employee) => employee.id != parseInt(req.params.id))
    employees = filteredArray
    res.json(employees)
}

const retrieve = (req, res) => {
    const employee = employees.find((employee) => employee.id == parseInt(req.params.id))
    if (!employee) {
        return res.status(404).json({
            "detail": "employee not found."
        })
    }
    res.json(empoyee)
}

module.exports = {list, retrieve, create, update, remove}