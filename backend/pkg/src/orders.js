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
        let address = req.db.prepare("SELECT country, city, province, postal, street_number, street from Address where addressid = ?").get(req.body.addressid)
        utils.checkObject(address)
        
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
            req.db.prepare("INSERT INTO Order_Items (orderid, isbn, quantity, price) SELECT ?, ?, ?, (?*sale_price) from Books where isbn = ? ").run(ifo.lastInsertRowid, item.isbn, item.quantity ?? 1, item.quantity ?? 1, item.isbn)
        }
        
        let total = req.db.prepare("SELECT SUM(price) as price from Orders natural join order_items where orderid = ?").get(ifo.lastInsertRowid).price
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
            (pg)=>Promise.all(req.db.prepare(`SELECT * from Orders ${wc} ORDER BY date DESC ${pg}`).all(wv).map((e) => getOrder(req.db, e))),
            ()=>req.db.prepare(`SELECT count(*) as cnt from Orders ${wc}`).get(wv)?.cnt)

            res.json(await pgntr(req.query))
    } catch (e) {
        console.log(e)
        utils.reqError(res, e, e.message)
    }
})


///api/orders/userid/orderid
router.get("/:id/:oid", utils.user, meMiddleware, async (req,res)=>{
   res.json(await getOrder(req.db, {userid:req.params.id, orderid:req.params.oid}))
})


async function getOrder(db, order){

    try{ 
        if (!order.price || !order.date || !order.tracking_number || !order.carrier){
            order = db.prepare("SELECT orderid, carrier, tracking_number,date, SUM(price) as price from Orders natural join order_items where orderid = ? and userid = ? group by orderid, userid, tracking_number, date, carrier").get(order.orderid, order.userid)
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
        console.log(e)
        return {
            date: order.date ?? "Unavailabe",
            orderid: order.orderid ?? "Unavailable"
        }
    }
}

module.exports = router