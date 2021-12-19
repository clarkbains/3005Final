const express = require('express')
const utils = require('./utils')


let router = express.Router()
router.get("/", (req,res)=>{
    let nameList = (req.query?.name?.split(/,\s?/) ?? [""]).map(e=>`%${e}%`)

    let wc = `where ${nameList.map(e=>`(name like ?)`).join (" OR ")}`
    
    try {
        let pgntr = utils.paginator(
            (pg)=>req.db.prepare(`SELECT * from Publishers ${wc} ORDER BY name ${pg}`).all(nameList),
            ()=>req.db.prepare(`SELECT count(*) as cnt from Publishers ${wc}`).get(nameList)?.cnt)
            
        res.json(pgntr(req.query))
    } catch (e) {
        utils.reqError(res, e, e.message)
    }
})
router.post("/", utils.admin, utils.superset(["name", "email", "phone", "branch_transit", "financial_institution", "account_number", "addressid"]), (req,res)=>{
    
    try {
        req.db.prepare("INSERT INTO Publishers (name, email, phone, branch_transit, financial_institution, addressid) VALUES (?, ?, ?, ?, ?, ?)").run(res.locals.checked)
        res.json(req.body)
    } catch (e) {
        utils.reqError(res, e, e.message)
    }
})

router.patch ("/:id", utils.admin, utils.superset(["id"], "params"), (req,res)=>{
    try {
        let currentPub = req.db.prepare("SELECT * from Publishers where publisherid = ? ").get(res.locals.checked)

        let newPub = Object.assign(currentPub, req.body)
        req.db.prepare("UPDATE Publishers set name = ?, email = ?, phone = ?, branch_transit = ?, financial_institution =?, account_number=?, addressid = ? where publisherid = ?").run(...utils.getFromBody(newPub, ["name", "email", "phone", "branch_transit", "financial_institution", "account_number", "addressid"]), ...res.locals.checked)
        res.json(newPub)
        
    } catch (e) {
        utils.reqError(res, e, e.message)
    }
})

router.delete ("/:id", utils.admin, utils.superset(["id"], "params"), (req,res)=>{
    try {
        req.db.prepare("DELETE FROM Publishers where publisherid = ? ").run(res.locals.checked)
        res.json({})
        
    } catch (e) {
        utils.reqError(res, e, e.message)
    }
})

module.exports = router