superset = function (keys, place) {
    return (req, res, next)=>{
        let d = req[place ?? "body"]
        let l = keys.filter(e=>d[e]===undefined)
        if (l.length > 0){
            return next("Missing keys in req body: " + l.join(", "))
        }
        res.locals.checked = keys.map(e=>d[e])
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
      let size = Math.trunc(bounds(Number(req.size),1,100))
      let requestedPage = Math.trunc(Number((req?.page ?? 1) - 1))
      let totalPages = Math.ceil(count/size)
      requestedPage = bounds(requestedPage, 0, totalPages-1)
      let paginationString = ` LIMIT ${size} OFFSET ${requestedPage*size}`
      console.log({count, size, totalPages, requestedPage})
      items = getData(paginationString)
      return {
          meta: {
              pageNumber: requestedPage+1,
              pageSizeLimit: size,
              totalItemsCount: count,
              pageSizeCurrent: items.length
          },
          items: items
      }
    }
    
    

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
    superset, getFromBody, systemError, reqError, filterObj, admin, user,paginator
}