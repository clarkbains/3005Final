const express = require('express')
const session = require('cookie-session')
const middleWare = require('./middleware')
const initTime = new Date()
const path = require('path')
let app = express()
let API = express.Router()
API.use(express.json())


API.use(middleWare.addDb)

//CORS wasn't behaving, replace req.session with data from
API.use("/**", (req,res,next)=>{
    let uid = req?.headers?.["auth"]
    try {
        req.session = {}
        req.session.user = req.db.prepare("SELECT username, userid, admin FROM Users where userid = ?").get(uid)
    } catch(e){
    }

    res.header("Access-Control-Allow-Origin", "http://localhost:3000");res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Cookies, Auth"); 
    res.header("Access-Control-Allow-Credentials", "true")
    next()
})

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

