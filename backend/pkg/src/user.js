const express = require('express')
const utils = require('./utils')


let router = express.Router()
router.post("/", utils.superset(["username", "password", "email", "phone"]),(req,res)=>{
    try {
        console.log(req.db.prepare("SELECT * from Users;").get())
        let r = req.db.prepare("INSERT INTO Users (username, password, email, phone) VALUES (?, ?, ?, ?)").run(res.locals.checked)
        if (r){
            let uo = req.db.prepare("SELECT * from Users where userid = ?").get(r.lastInsertRowid)
            delete uo.password
            req.session.user = uo
            res.json(uo)
        } 
    } catch (e) {
        utils.reqError(res, e, e.message)
    }
})
router.get("/:id", (req, res, next)=>{
    if (req.params.id == "me"){
        req.params.id = req.session.user.userid
    }
    try {
        if (req.params.id != req.session.user.userid && !req.session.user.admin){
            throw new Error("Only administrators can patch another user.")
        }
        
        let r = req.db.prepare("SELECT username, email, phone, admin FROM Users WHERE userid = ?").get(req.params.id)
        res.json(r)
    } catch (e) {
        utils.reqError(res, e, e.message)
    }
    
})

router.patch("/:id", (req, res, next)=>{
    if (req.params.id == "me"){
        req.params.id = req.session.user.userid
    }
    try {

        let filterParams = ["username", "password", "email", "phone"]
        if (req.session.user.admin){
            filterParams.push("admin")
        }
        let newUserObj = Object.apply(req.session.user, utils.filterObj(req.body, filterParams))
        newUserObj.userid = req.params.id
        if (newUserObj.userid != req.session.user.userid && !req.session.user.admin){
            throw new Error("Only administrators can patch another user.")
        }
        
    
        req.db.prepare("UPDATE Users SET username = ?, password = ?, email = ?, phone = ?, admin = ?) VALUES (?, ?, ?, ?, ?)").run(utils.getFromBody(newUserObj, ["username", "password", "email", "phone", "admin"]))
    
        delete newUserObj.password
    
        req.session.user = newUserObj
        res.json(newUserObj)
    } catch (e) {
        utils.reqError(res, e, e.message)
    }
    
})



module.exports = router