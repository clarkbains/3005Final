const express = require('express')
const session = require('cookie-session')
const middleWare = require('./middleware')
const initTime = new Date()
let app = express()
let API = express.Router()
API.use(express.json())
API.use(middleWare.addDb)
API.use(session({secret:"foobar"}))
API.options("/**", (req,res)=>{res.header("Access-Control-Allow-Origin", "*");})
API.use("/session", require('./session'))
API.use("/user", require('./user'))
API.use("/genres", require('./genres'))
API.use("/authors", require('./authors'))
API.use("/books", require('./books'))

app.use("/api", API)

app.get("/",(req,res)=>{
    res.send(`Server running since ${initTime}`)
})



app.listen(80)
console.log("Init")

