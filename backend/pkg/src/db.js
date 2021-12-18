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
            DDLs.forEach(e=>db.prepare(e).run())
            db.close().release()
        })
    }
    return r
}

module.exports = init()





