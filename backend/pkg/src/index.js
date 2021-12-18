const express = require('express')
const session = require('cookie-session')
const middleWare = require('./middleware')
let app = express()
const db = require('./db')
app.use(express.json())
app.use(middleWare.addDb)
app.use(session({secret:"foobar"}))
app.options("/**", (req,res)=>{res.header("Access-Control-Allow-Origin", "*");})
app.use("/session", require('./session'))
app.use("/user", require('./user'))
console.log("Started!")



app.listen(80)

