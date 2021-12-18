const db = require('./db')
module.exports = {
    addDb: async function (req, res, next) {
        req.db = await db.acquire()
        console.log("Acquired")
        res.on("finish", function() {
            if (req.db.open){
                console.log("Destroyed")
                req.db.release()
            }
        });
    
        next()
    }
}