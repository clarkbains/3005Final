const express = require('express')
const session = require('cookie-session')
const utils = require('./utils')
const fetch = require('node-fetch')

let router = express.Router()
const meMiddleware = (req,res,next)=>{
    if (req.params.id == "me"){
        req.params.id = req.session.user.userid
    }
    next()
}

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
// /api/order/userid
// Gets all orders for a user. Userid can be "me"
router.get("/:id", utils.user, meMiddleware, async (req,res)=>{
    try {
        let wc = `where userid = ?`
        let wv = [req.params.id]

        let pgntr = utils.paginator(
            (pg)=>Promise.all(req.db.prepare(`SELECT * from Orders ${wc} ORDER BY date DESC ${pg}`).all(wv).map((e) => getOrder(e))),
            ()=>req.db.prepare(`SELECT count(*) as cnt from Orders ${wc}`).get(wv)?.cnt)
            
        res.json(await pgntr(req.query))
    } catch (e) {
        utils.reqError(res, e, e.message)
    }
})


///api/orders/userid/orderid
router.get("/:id/:oid", utils.user, meMiddleware, async (req,res)=>{
   res.json(getOrder({userid:req.params.id, orderid:req.params.oid}))
})


async function getOrder(order){
    try{ 
        if (!order.price || !order.date || !order.tracking_number || !order.carrier){
            order = req.db.prepare("SELECT carrier, tracking_number,price,date from Orders where orderid = ? and userid = ?").get(order.orderid, order.userid)
        }
        let re = await fetch('http://localhost:8978/tracking?' + 
        new URLSearchParams({
            carrier:order.carrier,
            tracking:order.tracking_number
        }))
        let j = await re.json()
        utils.checkObject(j)

        return {
            tracking: j,
            price: order.price, 
            date: order.date,
            orderid: order.orderid
        }
    } catch (e) {
        return {
            date: order.date ?? "Unavailabe",
            orderid: order.orderid ?? "Unavailable"
        }
    }
}

module.exports = router