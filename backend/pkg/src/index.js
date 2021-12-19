const express = require('express')
const session = require('cookie-session')
const middleWare = require('./middleware')
const initTime = new Date()
const path = require('path')
let app = express()
let API = express.Router()
API.use(express.json())
API.options("/**", (req,res)=>{
    res.header("Access-Control-Allow-Origin", "*");res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept"); 
    res.end()})
API.use(middleWare.addDb)
API.use(session({secret:"foobar"}))
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

