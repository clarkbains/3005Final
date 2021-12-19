const express = require('express')
const utils = require('./utils')


let router = express.Router()
let reports = require('./reports/reports')

router.get("/", utils.admin, (req,res)=>{
    let r = {}
    for (let k of Object.keys(reports)){
        r[k] = Object.assign({}, reports[k])
        delete r[k].generator
    }
    res.json(r)
})
//curl 'localhost:9756/api/reports/foobar' --cookie cookies -X POST -H 'content-type: application/json'  --data '{"title":"Better Book Title", "book_num": "num"}'
router.post("/:name", utils.admin, utils.superset(["name"], "params"),(req,res, next)=>{
    try {
        if (reports[req.params.name]){
            let r = reports[req.params.name]
            let rp = {}
            for (let p of r.parameters){
                let v = req.body[p.name] ?? p.default
                if (v == undefined){
                    throw new Error("Missing " + p.name + " of type " + p.type)
                }
                rp[p.name] = v
            }
            r.generator(req,res,rp)
        } else {
            throw utils.notFound
        }
    } catch (e) {
        utils.reqError(res, e, e.message)
    }
})


module.exports = router