const { Pool } = require('better-sqlite-pool');
const path = require('path')
const fs = require('fs')
const WIPE_AT_START = true
const SQL_FOLDER = path.join(__dirname, "SQL")

function init() {
    try {
        if (WIPE_AT_START) fs.unlinkSync("/data/mydb")
    } catch (e){}
    
    
    let r = new Pool("/data/mydb")
    

    if (WIPE_AT_START){
        let d = String(fs.readFileSync(path.join(SQL_FOLDER, "DDL")))
        let DDLs = d.split(/^[\s\n]*$/gm)
        r.acquire().then(db => {
            DDLs.filter(e=>!!e).forEach(e=>db.prepare(e).run())
            return db
        }).then(db=>{
            let seeds = String(fs.readFileSync(path.join(SQL_FOLDER, "SEED"))).split(/^[\s\n]*$/gm).map(e=>e.replace(/^[\s\n]*/g, "").replace(/[\s\n]*$/g, "")).filter(e=>!!e)
            //console.log(seeds)
            seeds.forEach(e=>{
                try {
                    db.prepare(e).run()
                } catch (er){
                    console.log(er, e)
                }})
            db.release()
        })
    }
    return r
}

module.exports = init()





