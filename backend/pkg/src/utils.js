superset = function (keys) {
    return (req, res, next)=>{
        let l = keys.filter(e=>req.body[e]===undefined)
        if (l.length > 0){
            return next("Missing keys in req body: " + l.join(", "))
        }
        res.locals.checked = keys.map(e=>req.body[e])
        next()
    }
}

paginator = function (options) {
    pagesize

}
getFromBody = function (req, params){
    return params.map(p=> req[p])
}

systemError = function (res, e, msg, detail){
    let eo = {
        type: "SYSTEM",
        msg: msg
    }
    if (detail) eo.detail = detail
    res.status(500).json(eo)
}

reqError = function (res, e, msg, detail){
    let eo = {
        type: "REQUEST",
        msg: msg
    }
    if (detail) eo.detail = detail
    res.status(400).json(eo)
    console.warn(e)
}

filterObj = function (obj, keys) {
    let n = {}
    for (let k of keys){
        if (obj[k]!==undefined){
            n[k] = obj[k]
        }
    }
    return n
}



module.exports = {
    superset, getFromBody, systemError, reqError, filterObj
}