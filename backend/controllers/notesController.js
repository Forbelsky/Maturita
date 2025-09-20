const notesService = require('../models/services/notesService')

exports.getAllNotes = (req, res) => {
    const notes = notesService.getNotes()
    res.json(notes)
}

exports.getNote = (req, res) => {
    try {
        const note = notesService.getNote(parseInt(req.params.id))
        res.json(note)
    } catch (err) {
        res.status(404).json({ error: err.message })
    }
}

exports.createNote = (req, res) => {
    try {
        const { title, content } = req.body
        const note = notesService.createNote(title, content)
        res.status(201).json(note)
    } catch (err) {
        res.status(400).json({ error: err.message })
    }
}
