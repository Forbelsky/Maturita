const Note = require('../entities/Notes');

class NotesRepository {
    constructor() {
        this.notes = []
        this.currentId = 1
    }

    findAll() {
        return this.notes
    }

    findById(id) {
        return this.notes.find(n => n.id === id)
    }

    save(title, content) {
        const note = new Note(this.currentId++, title, content)
        this.notes.push(note)
        return note
    }
}

module.exports = new NotesRepository()
