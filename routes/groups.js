const express = require('express')
const router = express.Router()
const Group = require('../models/group')
const Guest = require('../models/guest')
const ObjectId = require('mongodb').ObjectId;

router.get('/', async (req, res) => {
    try {
        const groups = await Group.find()
        res.json(groups)
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
})

router.get('/:id', getGroup, (req, res) => {
    res.json(res.group)
})

router.get('/:id/guests', getGroupMembers, (req, res) => {
    res.json(res.members)
})

router.post('/', async (req, res) => {
    const group = new Group({
        name: req.body.name,
        address: req.body.address,
        lang: req.body.lang,
    })

    try {
        const newGroup = await group.save()
        res.status(201).json(newGroup)
    } catch (err) {
        res.status(400).json( { message: err.message})
    }
})

router.patch('/:id', getGroup, async (req, res) => {
    if (req.body.name != null) {
        res.group.name = req.body.name
    }
    if (req.body.address != null) {
        res.group.address = req.body.address
    }
    if (req.body.lang != null) {
        res.group.lang = req.body.lang
    }
    if (req.body.respond != null) {
        res.group.respond = req.body.respond
    }
    try {
        const updateGroup = await res.group.save()
        res.json(updateGroup)
    } catch (err) {
        res.status(400).json({ message: err.message })
    }
})

router.delete('/:id', getGroup, async (req, res) => {
    try {
        await res.group.deleteOne()
        res.json({ message: "deleted group" })
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
})

async function getGroup(req, res, next) {
    let group
    try {
        group = await Group.findById(req.params.id)
        if (group == null) {
            return res.status(404).json({ message: 'Cannot find guest'})
        }
    }
    catch (err) {
        return res.status(500).json({ message: err.message })
    }

    res.group = group
    next()
}

async function getGroupMembers(req, res, next) {
    let members
    try {
        members = await Guest.find({group: new ObjectId(req.params.id)})
        if (members == null) {
            return res.status(404).json({ message: 'Cannot find guests'})
        }
    }
    catch (err) {
        return res.status(500).json({ message: err.message })
    }

    res.members = members
    next()
}

module.exports = router