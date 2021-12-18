const express = require('express')
const utils = require('./utils')


let router = express.Router()
router.post ("/genres", utils.admin, utils.superset(["isbn", "genres"]), (req,res)=>{
    try {
        req.db.prepare("DELETE FROM book_genres where isbn = ?").run(res.locals.checked)

        let prepared = req.db.prepare("INSET INTO book_genres (isbn, genreid) VALUES (?, ?)")
        for (let genre of res.locals.checked[1]){
            prepared.run(res.locals.checked[0], genre)
        }
    } catch (e) {
        utils.reqError(res, e, e.message)
    }
})
router.get ("/genres", utils.user, (req,res)=>{
    try {
        res.json(req.db.prepare("SELECT * FROM Genres natural join book_genres where isbn = ?").all(res.locals.checked))
    } catch (e) {
        utils.reqError(res, e, e.message)
    }
})

router.post ("/publisher", utils.admin, utils.superset(["isbn", "publisherid", "royalty"]), (req,res)=>{
    try {
        req.db.prepare("DELETE FROM book_publisher where isbn = ?").run(res.locals.checked)

        let prepared = req.db.prepare("INSET INTO book_publisher (isbn, publisherid, royalty) VALUES (?, ?)").run(...res.locals.checked)
    } catch (e) {
        utils.reqError(res, e, e.message)
    }
})

router.post ("/authors", utils.admin, utils.superset(["isbn", "authors"]), (req,res)=>{
    try {
        req.db.prepare("DELETE FROM book_authors where isbn = ?").run(res.locals.checked)

        let prepared = req.db.prepare("INSET INTO book_authors (isbn, authorid) VALUES (?, ?)")
        for (let author of res.locals.checked[1]){
            prepared.run(res.locals.checked[0], author)
        }
    } catch (e) {
        utils.reqError(res, e, e.message)
    }
})
router.get ("/authors", utils.user, (req,res)=>{
    try {
        res.json(req.db.prepare("SELECT * FROM Authors natural join book_authors where isbn = ?").all(res.locals.checked))
    } catch (e) {
        utils.reqError(res, e, e.message)
    }
})


module.exports = router