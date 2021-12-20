const express = require('express')
const utils = require('./utils')


let router = express.Router()
router.get("/", async (req,res)=>{
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
    } if (!req.query.unavailable){
        wc.push("(Books.available != 0)")
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
            orc.push(`( Genres.genreid = ? )`)
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
*/  
    let wcStr = `from Books left natural join book_authors left natural join Authors left natural join book_genres left join Genres on Genres.genreid = book_genres.genreid where ${wc.join(" AND ")}  group by isbn, title, sale_price, cover_url, available`
    
    try {
        let pgntr = utils.paginator(
            (pg)=>req.db.prepare(`SELECT isbn, title, sale_price, cover_url, available, group_concat(Authors.name, ', ') as authors, group_concat(Genres.name, ', ') as genres ${wcStr} ORDER BY isbn ${pg}`).all(wv),
            ()=>req.db.prepare(`SELECT count(*) as cnt ${wcStr}`).get(wv)?.cnt)
            
        res.json(await pgntr(req.query))
    } catch (e) {
        utils.reqError(res, e, e.message)
    }
})

router.post("/", utils.admin, utils.superset(["title", "isbn", "sale_price", "purchase_price", "pages", "publisherid", "royalty"]),(req,res)=>{
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
        req.db.prepare(`INSERT INTO Books (title, isbn, sale_price, purchase_price, pages, publisherid, royalty ${db_keys.length>0?`, ${db_keys.join(", ")}`:""}) VALUES (?, ?, ?, ?, ?, ?, ? ${db_vals.length>0?`, ${db_vals.map(e=>`?`).join(", ")}`:""})`).run([...res.locals.checked, ...db_vals])
        res.json(req.body)
    } catch (e) {
        utils.reqError(res, e, e.message)
    }
})
router.patch("/:id", utils.admin, utils.superset(["id"], "params"),(req, res, next)=>{
    try {
        let currentBook = req.db.prepare("SELECT * from Books where isbn = ?").get(res.locals.checked)

        //ISBN should never be changed, quantity should be changed some other way so we can use a stored proc.
        let newBookObj = Object.assign(currentBook, 
            req.body)

        utils.checkObject(newBookObj)
    
        req.db.prepare("UPDATE Books SET title = ?, pages = ?, sale_price = ?, purchase_price = ?, cover_url = ?, available = ?, publisherid = ?, royalty = ? WHERE isbn = ?").run([...utils.getFromBody(newBookObj, ["title", "pages", "sale_price", "purchase_price", "cover_url", "available", "publisherid", "royalty"]), currentBook.isbn])

        res.json(newBookObj)
    } catch (e) {
        utils.reqError(res, e, e.message)
    }
    
})

router.post ("/:id/genres", utils.admin, utils.superset(["genres"]), (req,res)=>{
    try {
        req.db.prepare("DELETE FROM book_genres where isbn = ?").run(req.params.id)

        let prepared = req.db.prepare("INSERT INTO book_genres (isbn, genreid) VALUES (?, ?)")
        for (let genre of res.locals.checked[0]){
            prepared.run(req.params.id, genre)
        }
    } catch (e) {
        utils.reqError(res, e, e.message)
    }
})
router.get ("/:id/genres", utils.user, (req,res)=>{
    try {
        res.json(req.db.prepare("SELECT * FROM Genres natural join book_genres where isbn = ?").all(req.params.id))
    } catch (e) {
        utils.reqError(res, e, e.message)
    }
})

router.get ("/:id", utils.user, (req,res)=>{
    try {
        //Can't join here as I want the multi attributes nested, like genre. Doing a join would be pointless and waste response data from all the duplicated elements in the joined table

        let bo = req.db.prepare("SELECT * FROM Books natural join Publishers where isbn = ?").get(res.locals.checked)
        let genres = req.db.prepare("SELECT Genres.* FROM Genres natural join book_genres where isbn = ?").get(res.locals.checked)
        let authors = req.db.prepare("SELECT Authors.* FROM Authors natural join book_authors where isbn = ?").get(res.locals.checked)
        
        res.json(Object.assign({authors, genres}, bo))
    } catch (e) {
        utils.reqError(res, e, e.message)
    }
})

router.post ("/:id/authors", utils.admin, utils.superset(["authors"]), (req,res)=>{
    try {
        req.db.prepare("DELETE FROM book_authors where isbn = ?").run(req.params.id)

        let prepared = req.db.prepare("INSERT INTO book_authors (isbn, authorid) VALUES (?, ?)")
        for (let author of res.locals.checked[0]){
            prepared.run(req.params.id, author)
        }
    } catch (e) {
        utils.reqError(res, e, e.message)
    }
})
router.get ("/:id/authors", utils.user, (req,res)=>{
    try {
        res.json(req.db.prepare("SELECT * FROM Authors natural join book_authors where isbn = ?").all(req.params.id))
    } catch (e) {
        utils.reqError(res, e, e.message)
    }
})

module.exports = router