const express = require('express')
const session = require('cookie-session')
const middleWare = require('./middleware')
const initTime = new Date()
const path = require('path')
let app = express()
let API = express.Router()
API.use(express.json())
API.use(session({secret:"foobar"}))
//foobarr
API.use("/**", (req,res,next)=>{
    res.header("Access-Control-Allow-Origin", "http://localhost:3000");res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Cookies"); 
    res.header("Access-Control-Allow-Credentials", "true")
    req.sessionOptions.domain = req.headers.host
    next()
})
API.use(middleWare.addDb)
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

