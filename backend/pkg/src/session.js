const express = require('express')
const session = require('cookie-session')
const utils = require('./utils')


let router = express.Router()
router.post("/", utils.superset(["username", "password"]),(req,res)=>{
    let r = req.db.prepare("SELECT username, userid, admin FROM Users where username = ? AND password = ? ").get(req.body.username, req.body.password)
    if (r){
        req.session.user = r
        res.json(r)
    } else {
        res.status(401).json({})
    }
})

router.delete ("/", (req,res)=>{
    req.session.user = undefined
    res.end()
})

module.exports = router