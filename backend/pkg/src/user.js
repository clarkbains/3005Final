const express = require('express')
const utils = require('./utils')


let router = express.Router()
const meMiddleware = (req,res,next)=>{
    if (req.params.id == "me"){
        req.params.id = req.session.user.userid
    }
    next()
}


router.post("/", utils.superset(["username", "password", "email", "phone"]),(req,res)=>{
    try {
        let r = req.db.prepare("INSERT INTO Users (username, password, email, phone) VALUES (?, ?, ?, ?)").run(res.locals.checked)
        if (r){
            let uo = utils.filterObj(req.body, ["username", "email", "phone"])
            uo.userid = r.lastInsertRowid

            req.session.user = uo
            res.json(uo)
        } 
    } catch (e) {
        utils.reqError(res, e, e.message)
    }
})




router.post ("/:id/address", utils.user, meMiddleware, utils.superset(["id"], "params"), utils.superset(["country", "city", "province", "postal", "street_number", "street"]), (req,res)=>{
    try {
        let ifo = req.db.prepare("INSERT INTO Address (country, city, province, postal, street_number, street) VALUES (?, ?, ?, ?, ?, ?)").run(res.locals.checked)
        console.log(req.params, ifo)

        req.db.prepare("INSERT INTO User_Address (userid, addressid) VALUES (?, ?)").run(req.params.id, ifo.lastInsertRowid)

        res.json(req.body)
        
    } catch (e) {
        utils.reqError(res, e, e.message)
    }
})

router.patch ("/:id/address/:aid", utils.superset(["id"], "params"), utils.superset(["aid"], "params"), (req,res)=>{
    try {
        let currentAddr = req.db.prepare("SELECT * from Address where addressid = ? ").get(res.locals.checked)

        let newAddr = Object.assign(currentAddr, req.body)
        req.db.prepare("UPDATE Address set country = ?, city = ?, province = ?, postal = ?, street_number =?, street = ? where addressid = ?").run(...utils.getFromBody(newAddr, ["country", "city", "province", "postal", "street_number", "street"]), ...res.locals.checked)

        res.json(newAddr)
        
    } catch (e) {
        utils.reqError(res, e, e.message)
    }
})

router.delete ("/:id?/address/:aid", utils.user, utils.superset(["aid"], "params"), (req,res)=>{
    try {
        req.db.prepare("DELETE FROM Address where addressid = ?").run(...res.locals.checked)
        res.json({})
        
    } catch (e) {
        utils.reqError(res, e, e.message)
    }
})

router.get ("/:id/address", utils.user, meMiddleware, utils.superset(["id"], "params"), (req,res)=>{
    try {
        res.json(req.db.prepare("SELECT * FROM Address natural join User_Address where userid = ?").all(req.params.id))
    } catch (e) {
        utils.reqError(res, e, e.message)
    }
})

router.post ("/:id/billing", utils.user, meMiddleware, utils.superset(["card_number", "ccv", "exp_month", "exp_year"]), (req,res)=>{
    try {
        let ifo = req.db.prepare("INSERT INTO Billing_info (card_number, ccv, exp_month, exp_year, userid) VALUES (?, ?, ?, ?)").run(...res.locals.checked, req.params.id)
        res.json(req.body)
    } catch (e) {
        utils.reqError(res, e, e.message)
    }
})


router.get ("/:id/billing", utils.user, meMiddleware, (req,res)=>{
    try {
        res.json(req.db.prepare("SELECT * FROM Billing_info where userid = ?").all(req.params.id))
    } catch (e) {
        utils.reqError(res, e, e.message)
    }
})




router.get("/:id", utils.user, meMiddleware, (req, res, next)=>{
    try {
        if (req.params.id != req.session.user.userid && !req.session.user.admin){
            throw new Error("Only administrators can get for another user.")
        }

        let r = req.db.prepare("SELECT username, email, phone, admin FROM Users WHERE userid = ?").get(req.params.id)
        res.json(r)
    } catch (e) {
        utils.reqError(res, e, e.message)
    }
    
})

router.patch("/:id", utils.user, meMiddleware, (req, res, next)=>{
    try {

        let filterParams = ["username", "password", "email", "phone"]
        if (req.session.user.admin){
            filterParams.push("admin")
        }

        let currentObj = req.db.prepare("SELECT * from Users where userid = ?").get(req.params.id)
        
        let newUserObj = Object.assign(currentObj, utils.filterObj(req.body, filterParams))
        newUserObj.userid = req.params.id
        if (newUserObj.userid != req.session.user.userid && !req.session.user.admin){
            throw new Error("Only administrators can patch another user.")
        }
        
    
        req.db.prepare("UPDATE Users SET username = ?, password = ?, email = ?, phone = ?, admin = ? where userid = ?").run(...utils.getFromBody(newUserObj, ["username", "password", "email", "phone", "admin"]), req.params.id)
    
        delete newUserObj.password
    
        req.session.user = newUserObj
        res.json(newUserObj)
    } catch (e) {
        utils.reqError(res, e, e.message)
    }
    
})



module.exports = router