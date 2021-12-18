const express = require('express')
const utils = require('./utils')


let router = express.Router()
router.post ("/address", utils.superset(["country", "city", "province", "postal", "street_number", "street"]), (req,res)=>{
    try {
        let ifo = req.db.prepare("INSERT INTO Address (country, city, province, postal, street_number, street) VALUES (?, ?, ?, ?, ?, ?)").run(res.locals.checked)

        req.db.prepare("INSET INTO User_Address (userid, addressid) VALUES (?, ?)").run(req.params.id, ifo.lastInsertRowid)

        res.json(req.body)
        
    } catch (e) {
        utils.reqError(res, e, e.message)
    }
})

router.patch ("/address/:aid", utils.superset(["aid"], "params"), (req,res)=>{
    try {
        let currentAddr = req.db.prepare("SELECT * from Address where addressid = ? ").get(res.locals.checked)

        let newAddr = Object.apply(currentAddr, req.body)

        req.db.prepare("UPDATE Address set country = ?, city = ?, province = ?, postal = ?, street_number =?, street = ? where addressid = ?").run(...utils.getFromBody(req.body, ["country", "city", "province", "postal", "street_number", "street"]), ...res.locals.checked)

        res.json(newAddr)
        
    } catch (e) {
        utils.reqError(res, e, e.message)
    }
})

router.get ("/address", utils.user, (req,res)=>{
    try {
        res.json(req.db.prepare("SELECT * FROM Address natural join User_Address where userid = ?").all(req.params.id))
    } catch (e) {
        utils.reqError(res, e, e.message)
    }
})

router.post ("/billing", utils.superset(["card_number", "ccv", "exp_month", "exp_year"]), (req,res)=>{
    try {
        let ifo = req.db.prepare("INSERT INTO Billing_info (card_number, ccv, exp_month, exp_year, userid) VALUES (?, ?, ?, ?)").run(...res.locals.checked, req.params.id)

        res.json(req.body)
        
    } catch (e) {
        utils.reqError(res, e, e.message)
    }
})


router.get ("/billing", utils.user, (req,res)=>{
    try {
        res.json(req.db.prepare("SELECT * FROM Billing_info where userid = ?").all(req.params.id))
    } catch (e) {
        utils.reqError(res, e, e.message)
    }
})


module.exports = router