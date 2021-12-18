const express = require('express')
const utils = require('./utils')


let router = express.Router()
router.get("/", (req,res)=>{
    let nameList = (req.query?.name?.split(/,\s?/) ?? [""]).map(e=>`%${e}%`)

    let wc = `where ${nameList.map(e=>`(name like ?)`).join (" OR ")}`
    
    try {
        let pgntr = utils.paginator(
            (pg)=>req.db.prepare(`SELECT * from Genres ${wc} ORDER BY name ${pg}`).all(nameList),
            ()=>req.db.prepare(`SELECT count(*) as cnt from Genres ${wc}`).get(nameList)?.cnt)
            
        res.json(pgntr(req.query))
    } catch (e) {
        utils.reqError(res, e, e.message)
    }
})
router.post("/", utils.admin, utils.superset(["name"]),(req,res)=>{
    try {
        req.db.prepare("INSERT INTO Genres (name) VALUES (?)").run(res.locals.checked)
    } catch (e) {
        utils.reqError(res, e, e.message)
    }
})

router.delete ("/:id", utils.admin, utils.superset(["id"], "params"), (req,res)=>{
    try {
        req.db.prepare("DELETE FROM Genres where genreid = ?").run(res.locals.checked)
    } catch (e) {
        utils.reqError(res, e, e.message)
    }
})

module.exports = router