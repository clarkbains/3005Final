const { Pool } = require('better-sqlite-pool');
const path = require('path')
const fs = require('fs')
const WIPE_AT_START = false
const SQL_FOLDER = path.join(__dirname, "SQL")

function init() {
    try {
        if (WIPE_AT_START) fs.unlinkSync("/data/mydb")
    } catch (e){}
    
    
    let r = new Pool("/data/mydb")
    

    if (WIPE_AT_START){
        const FILES = ["DDL.SQL", "TRIGGERS.SQL", "SEED.SQL"]
        r.acquire().then(db => {
            for (let f of FILES){
                let d = String(fs.readFileSync(path.join(SQL_FOLDER, f)))
                let statements = d.split(/^[\s\n]*$/gm)
                statements.filter(e=>!!e).forEach(e=>{
                    try{
                        db.prepare(e).run()
                    } catch (er){
                        console.log(er, e)
                    }
            })
            }
            db.release()
        }).catch(e=>console.error(e))
    }
    setInterval(processOrders, 1000*5, r)
    return r
}

async function processOrders(pool){
    let db;
    try {
        db = await pool.acquire()
        //Just for printing to logs
        let res = db.prepare("Select Publisher_Orders.isbn, (Publisher_Orders.quantity-received) as incoming, Publishers.name as pub from Publisher_Orders natural join Publishers  where quantity != received").all()
        res.forEach(e=>console.log(`Got order of ${e.incoming} delivered to warehouse from Publisher ${e.pub} for isbn ${e.isbn}` ))

        db.prepare("UPDATE Publisher_Orders set received = quantity where quantity != received").run()
    }catch(e){
        console.error(e)
    }
    db?.release()

}


module.exports = init()





