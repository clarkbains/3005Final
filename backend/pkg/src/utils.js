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
bounds = function(num, lower, upper){
    num = Number(num)
    if ([undefined, null].includes(num) || Number.isNaN(num)){
        return (upper-lower)/2 + lower
    }
    return num < lower ? lower:((num > upper)?upper:num)
}

//Better way to do this?
paginator = function (getData, getCountCB) {
    return (req)=>{
      let count = getCountCB()
      let size = bounds(Number(req.query.size),1,100)
      let pageNum = (Number(req.query.size)) - 1
      let totalPages = Math.ceil(count/size)
      pageNum = bounds(0, totalPages-1)
      let paginationString = ` LIMIT ${size} OFFSET ${pageNum*size}`
      items = getData(paginationString)
      return {
          meta: {
              page: pageNum + 1,
              limit: size,
              total: count,
              count: items.length
          },
          items: items
      }
    }
    
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

admin = function (req,res,next){
    if (req.session.user.admin){
        next()
    } else {
        res.status(403).send({})
    }
}
user = function (req,res,next){
    if (req.session.user.userid){
        next()
    } else {
        res.status(403).send({})
    }
}

module.exports = {
    superset, getFromBody, systemError, reqError, filterObj, admin, user
}