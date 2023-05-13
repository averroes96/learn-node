const Employee = require('../models/Employee')

const list = async (req, res) => {
    const employees = await Employee.find()

    if (!employees) return res.status(204).json({
        'detail': 'no employee was found!'
    })

    res.json(employees)
}

const create = async (req, res) => {
    /*const employee = {
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
    */

    if (!req?.body?.firstName || !req?.body?.lastName) {
        return res.status(400).json({
            "detail": "first and last name must be set"
        })
    }

    try {
        const employee = await Employee.create({
            firstName: req.body.firstName,
            lastName: req.body.lastName
        })

        res.status(201).json(employee)
    } catch (err){
        console.error(err)
    }

}

const update = async (req, res) => {
    if(!req?.params?.id) return res.status(400).json({
        'detail': 'id must be set.'
    })

    const employee = await Employee.findOne({ _id : req.params.id }).exec()

    if (!employee) {
        return res.status(204).json({
            "detail": "employee not found."
        })
    }
    if (req.body?.firstName) employee.firstName = req.body.firstName
    if (req.body?.lastName) employee.lastName = req.body.lastName

    const result = await employee.save()

    res.json(result)
}

const remove = async (req, res) => {
    if(!req?.params?.id) return res.status(400).json({
        'detail': 'id must be set.'
    })

    const employee = await Employee.findOne({ _id : req.params.id }).exec()

    if (!employee) {
        return res.status(404).json({
            "detail": "employee not found."
        })
    }

    const result = await employee.deleteOne({ _id : req.params.id})

    res.json(result)
}

const retrieve = async (req, res) => {
    if(!req?.params?.id) return res.status(400).json({
        'detail': 'id must be set.'
    })
    const employee = await Employee.findOne({ _id :  req.params.id }).exec()
    
    if (!employee) {
        return res.status(404).json({
            "detail": "employee not found."
        })
    }

    res.json(employee)
}

module.exports = {list, retrieve, create, update, remove}