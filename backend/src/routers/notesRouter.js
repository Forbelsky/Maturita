// src/routers/notesRouter.js
const express = require('express')
const controller = require('../controllers/notesController.js')

const router = express.Router()

router.get('/', controller.list)
router.get('/:id', controller.getOne)
router.post('/', controller.create)
router.put('/:id', controller.update)
router.delete('/:id', controller.remove)

module.exports = router
