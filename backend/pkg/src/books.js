const express = require('express')
const utils = require('./utils')


let router = express.Router()
router.get("/", (req,res)=>{
    let wc = []
    let wv = []
    if (req.query.isbn){
        wc.push(`isbn = ?`)
        wv.push(req.query.isbn)
    } if (req.query.ltprice){
        wc.push(`price <= ?`)
        wv.push(req.query.ltprice)
    } if (req.query.gtprice){
        wc.push(`price >= ?`)
        wv.push(req.query.gtprice)
    }
    if (req.query.title){
        let titleParts = req.query.title.split(/,\s?/g)
        titleParts.forEach(e=>{
            wc.push(`title like ?`)
            wv.push(`%${e}%`)
        })
    } if (req.query.genre){
        let genreParts = req.query.genre.split(/,\s?/g)
        let orc = []
        genreParts.forEach(e=>{
            orc.push(`( genreid = ? )`)
            wv.push(`${e}`)
        })
        wc.push(`(${orc.join(" OR ")})`)
    } if (req.query.author){
        let authorParts = req.query.author.split(/,\s?/g)
        let orc = []
        authorParts.forEach(e=>{
            orc.push(`( authorid = ? )`)
            wv.push(`${e}`)
        })
        wc.push(`(${orc.join(" OR ")})`)
    }
    /*let nameList = (req.query?.name?.split(/,\s?/) ?? [""]).map(e=>`%${e}%`)

    let wc = `where ${nameList.map(e=>`(name like ?)`).join (" OR ")}`
    
    try {
        let pgntr = utils.paginator(
            (pg)=>req.db.prepare(`SELECT * from Genres ${wc} ORDER BY name ${pg}`).all(nameList),
            ()=>req.db.prepare(`SELECT count(*) as cnt from Genres ${wc}`).get(nameList)?.cnt)
            
        res.json(pgntr(req.query))
    } catch (e) {
        utils.reqError(res, e, e.message)
    }*/
})

router.post("/", utils.admin, utils.superset(["title", "isbn", "sale_price", "purchase_price", "pages"]),(req,res)=>{
    let db_keys = []
    let db_vals = []
    //Add in optional values
    for (let key of ["cover_url", "available", "quantity"]){
        if (req.body[key]){
            db_keys.push(key)
            db_vals.push(req.body[key])
        }
    }
    try {
        req.db.prepare(`INSERT INTO Books (title, isbn, pages, sale_price, purchase_price ${db_keys?`, ${db_keys.join(", ")}`:""}) VALUES (?, ?, ?, ?, ? ${db_vals?`, ${db_vals.map(e=>`?`).join(", ")}`:""})`).run([...res.locals.checked, ...db_vals])
    } catch (e) {
        utils.reqError(res, e, e.message)
    }
})
router.patch("/:id", utils.admin, (req, res, next)=>{
    try {
        let currentBook = req.db.prepare("SELECT * from Books where id = ?").get(res.locals.checked)

        //ISBN should never be changed, quantity should be changed some other way so we can use a stored proc.
        let newBookObj = Object.apply(currentBook, 
        utils.filterFromObj(req.body, ["quantity", "isbn"]))
    

        req.db.prepare("UPDATE Books SET title = ?, pages = ?, sale_price = ?, purchase_price = ?, cover_url = ?, available = ?) WHERE isbn = ?").run([...utils.getFromBody(newBookObj, ["title", "pages", "sale_price", "purchase_price", "cover_url", "available"]), currentBook.isbn])

        res.json(newBookObj)
    } catch (e) {
        utils.reqError(res, e, e.message)
    }
    
})

router.use ("/:id", utils.superset(["id"], "params"), require('./individualBook'))

module.exports = router