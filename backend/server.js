const express = require('express')
const path = require('path')
const notesRoutes = require('./routes/notesRoutes')

const app = express()
const PORT = process.env.PORT || 5000

app.use(express.json())

// API
app.use('/api/notes', notesRoutes)

// React build (fallback)
app.use(express.static(path.join(__dirname, '../frontend/dist')))
app.get(/.*/, (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/dist/index.html'))
})

app.listen(PORT, () => {
    console.log(`Server běží na http://localhost:${PORT}`)
})
