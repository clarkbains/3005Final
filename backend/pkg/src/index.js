const express = require('express')
const session = require('cookie-session')
const middleWare = require('./middleware')
const initTime = new Date()
const path = require('path')
let app = express()
let API = express.Router()
API.use(express.json())

//Insert a db from pool into req
API.use(middleWare.addDb)

//Add CORS Headers
API.use("/**", middleWare.cors)

app.set('views', path.join(__dirname, "templates"));
app.set('view-engine', 'ejs');


API.use("/session", require('./session'))
API.use("/user", require('./user'))
API.use("/genres", require('./genres'))
API.use("/authors", require('./authors'))
API.use("/books", require('./books'))
API.use("/publishers", require('./publisher'))
API.use("/reports", require('./reports'))
API.use("/orders", require('./orders'))
app.use("/api", API)

app.get("/",(req,res)=>{
    res.send(`Server running since ${initTime}`)
})



app.listen(80)
require('./tracking-api')
console.log("Init")

