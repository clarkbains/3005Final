const express = require('express')
const utils = require('./utils')


let router = express.Router()
router.get("/"),(req,res)=>{
    let name = req.query.name
    if (name)
})
router.post("/", utils.admin, utils.superset(["name"]),(req,res)=>{
    try {
        req.db.prepare("INSERT INTO Genres (name) VALUES (?)").run(res.locals.checked)
    } catch (e) {
        utils.reqError(res, e, e.message)
    }
})

router.delete ("/", (req,res)=>{
    req.session.user = undefined
    res.end()
})

module.exports = router