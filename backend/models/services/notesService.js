const notesRepository = require('../repositories/notesRepository')

class NotesService {
    getNotes() {
        return notesRepository.findAll()
    }

    getNote(id) {
        const note = notesRepository.findById(id)
        if (!note) throw new Error('Note not found')
        return note
    }

    createNote(title, content) {
        if (!title) throw new Error('Title is required')
        return notesRepository.save(title, content)
    }
}

module.exports = new NotesService()
