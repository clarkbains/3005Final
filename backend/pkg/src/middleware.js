const db = require('./db')
module.exports = {
    addDb: async function (req, res, next) {
        req.db = await db.acquire()
        //console.log("Acquired")
        res.on("finish", function() {
            if (req.db.open){
                //console.log("Destroyed")
                req.db.release()
            }
        });
    
        next()
    },
    cors: (req,res,next)=>{
        let uid = req?.headers?.["auth"]
        try {
            req.session = {}
            req.session.user = req.db.prepare("SELECT username, userid, admin FROM Users where userid = ?").get(uid)
        } catch(e){
        }
    
        res.header("Access-Control-Allow-Origin", req?.headers?.origin ?? "http://localhost:3000");
        
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Cookies, Auth"); 
        res.header("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE");
    
        res.header("Access-Control-Allow-Credentials", "true")
        next()
    }
}