const express = require('express')
const utils = require('./utils')


let router = express.Router()
router.get("/", async (req,res)=>{
    let nameList = (req.query?.name?.split(/,\s?/) ?? [""]).map(e=>`%${e}%`)
    let wc = `where ${nameList.map(e=>`(name like ?)`).join (" OR ")}`
    //
    try {
        let pgntr = await utils.paginator(
            (pg)=>req.db.prepare(`SELECT * from Authors ${wc} ORDER BY name ${pg}`).all(nameList),
            async ()=>req.db.prepare(`SELECT count(*) as cnt from Authors ${wc}`).get(nameList)?.cnt)
        res.json(await pgntr(req.query))
    } catch (e) {
        utils.reqError(res, e, e.message)
    }
})

router.get ("/:id", utils.user, utils.superset(["id"], "params"), (req,res)=>{
    try {
        req.db.prepare("SELECT * FROM Authors where authorid = ?").run(res.locals.checked)
    } catch (e) {
        utils.reqError(res, e, e.message)
    }
})

router.post("/", utils.admin, utils.superset(["name"]),(req,res)=>{
    try {
        let ifo = req.db.prepare("INSERT INTO Authors (name) VALUES (?)").run(res.locals.checked)
        req.body.authorid = ifo.lastInsertRowid
        res.json(req.body)
    } catch (e) {
        utils.reqError(res, e, e.message)
    }
})

router.delete ("/:id", utils.admin, utils.superset(["id"], "params"), (req,res)=>{
    try {
        req.db.prepare("DELETE FROM Authors where authorid = ?").run(res.locals.checked)
    } catch (e) {
        utils.reqError(res, e, e.message)
    }
})



module.exports = router