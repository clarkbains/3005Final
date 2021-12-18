const express = require('express')
const session = require('cookie-session')
const utils = require('./utils')
const pool = require('./db')


let router = express.Router()
router.post("/", utils.superset(["username", "password"]),(req,res)=>{
    let db = pool.acquire()
    let r = db.prepare("SELECT * FROM Users where username = ? AND password = ? ").get(req.body.username, req.body.password)
    if (r){
        req.session.user = r
    } 
    req.session.user
    res.send("ok")
})

router.delete ("/", (req,res)=>{
    req.session.user = undefined
    res.end()
})

module.exports = router