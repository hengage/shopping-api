const express = require('express')
const app = express()

const mongoose = require('mongoose')
const morgan  = require('morgan')

const routes = require('./api/routes/index')

app.use(morgan('dev'))

mongoose.connect(
    'mongodb://localhost:27017/shopping_api',
    { useNewURLParser: true }
)

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error: "));
db.once('open', () => {
    console.log('Succesfully connected to mongodb using mongoose');
})

// Body parsing
app.use(express.urlencoded({ extended:false }))
.use(express.json())

// Cors 
// app.use((req, res, next) => {
//     res.header('Access-Control-Allow-Origin', '*')
//     res.header(
//         'Access-Control-Allow-Headers',
//         'Origin, X-Requested-With, Content-Type, Accept, Authorization'
//     );
//     if (req.method === 'OPTIONS') {
//         res.header('Access-Control-Allow-Headers', 'PUT, PATCH, POST, DELETE, GET')
//         return res.status(200).json({})
//     }
// })

app.use('/', routes)

app.use((req, rex, next) => {
    const error = new Error('Not found')
    error.status = 404
    next(error)
})

app.use((error, req, res, next) => {
    res.status(error.status || 500)
        .json({
        error:{message: error.message}
    })
})

module.exports = app;