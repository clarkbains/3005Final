const express = require('express')
const session = require('cookie-session')
const utils = require('./utils')
const fetch = require('node-fetch')

let router = express.Router()
router.post("/", utils.user, utils.superset(["billing","addressid", "items"]),async (req,res)=>{
    let itemCount = req.body?.items?.length ?? 0
   
  

    try {
        let address = req.db.prepare("SELECT country, city, province, postal, street_number, street, from Address where addressid = ?").get(req.body.addressid)

        let re = await fetch('http://localhost:8978/tracking', {
            method: "POST",
            body: JSON.stringify({
                address, 
                items:itemCount
            }),
            headers: { 'Content-Type': 'application/json' }
        })
        let j = await re.json() 
        utils.checkObject(j)
        let ifo = req.db.prepare("INSERT INTO Orders (userid, carrier, tracking_number) VALUES (?, ?, ?)").run(req.session.user.userid, j.carrier, j.tracking)

        
        for (let item of req.body?.items){
            req.db.prepare("INSERT INTO Order_Items (orderid, isbn, quantity) VALUES (?, ?, ?) ").run(ifo.lastInsertRowid, item.isbn, item.quantity ?? 1)
        }
        
        let total = req.db.prepare("SELECT price from Orders where orderid = ?").get(ifo.lastInsertRowid).price
        res.json({
            total,
            orderid:ifo.lastInsertRowid,
            tracking:j
        })
    } catch (e) {
        utils.reqError(res, e, e.message)
    }
})

router.get("/:id", utils.user, async (req,res)=>{
   
    try {
        let ord = req.db.prepare("SELECT carrier, tracking_number,price,date from Orders where orderid = ?").get(req.params.id)

        let re = await fetch('http://localhost:8978/tracking?' + 
        new URLSearchParams({
            carrier:ord.carrier,
            tracking:ord.tracking_number
        }))
        let j = await re.json()
        utils.checkObject(j)

        res.json({
            tracking: j,
            price: ord.price, 
            date: ord.date,
            orderid: req.params.id
        })
    } catch (e) {
        utils.reqError(res, e, e.message)
    }
})

module.exports = router