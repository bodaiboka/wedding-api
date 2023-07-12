const express = require('express')
const router = express.Router()
const Guest = require('../models/guest')

router.get('/', async (req, res) => {
    try {
        const guests = await Guest.find()
        res.json(guests)
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
})

router.get('/:id', getGuest, (req, res) => {
    res.json(res.guest)
})

router.post('/', async (req, res) => {
    const guest = new Guest({
        name: req.body.name,
        vegetarian: req.body.vegetarian,
        age3: req.body.age3,
        attending: req.body.attending,
        group: req.body.group
    })

    try {
        const newGuest = await guest.save()
        res.status(201).json(newGuest)
    } catch (err) {
        res.status(400).json( { message: err.message})
    }
})

router.patch('/:id', getGuest, async (req, res) => {
    if (req.body.name != null) {
        res.guest.name = req.body.name
    }
    if (req.body.vegetarian != null) {
        res.guest.vegetarian = req.body.vegetarian
    }
    if (req.body.age3 != null) {
        res.guest.age3 = req.body.age3
    }
    if (req.body.attending != null) {
        res.guest.attending = req.body.attending
    }
    try {
        const updatedGuest = await res.guest.save()
        res.json(updatedGuest)
    } catch (err) {
        res.status(400).json({ message: err.message })
    }
})

router.put('/', updateGuests, async (req, res) => {

})

router.delete('/:id', getGuest, async (req, res) => {
    try {
        await res.guest.deleteOne()
        res.json({ message: "deleted guest" })
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
})

async function getGuest(req, res, next) {
    let guest
    try {
        guest = await Guest.findById(req.params.id)
        if (guest == null) {
            return res.status(404).json({ message: 'Cannot find guest'})
        }
    }
    catch (err) {
        return res.status(500).json({ message: err.message })
    }

    res.guest = guest
    next()
}

async function updateGuests(req, res, next) {
    const updates = req.body
    const bulkOps = updates.map(update => ({
        updateOne: {
            filter: { _id: update._id },
            update: { $set: update },
            upsert: true
        }
    }))

    try {
        const result = await Guest.bulkWrite(bulkOps);
        if (result.modifiedCount === 0) {
            return res.status(404).json({ message: 'No family members were updated' })
        }
        return res.json({ message: 'Family members updated successfully' })
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'An error occurred' })
    }
}

module.exports = router