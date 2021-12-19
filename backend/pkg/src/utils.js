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
    return async (req)=>{
     
      if (req?.nopages ?? false){
        return getData("")
      }
      let count = await getCountCB()
      let size = Math.trunc(bounds(Number(req.size),1,100))
      let requestedPage = Math.trunc(Number((req?.page ?? 1) - 1))
      let totalPages = Math.ceil(count/size)
      requestedPage = bounds(requestedPage, 0, totalPages-1)
      let paginationString = ` LIMIT ${size} OFFSET ${requestedPage*size}`
      //console.log({count, size, totalPages, requestedPage})
      items = await getData(paginationString)
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
    res.status(e.statuscode ?? 500).json(eo)
}

reqError = function (res, e, msg, detail){
    let eo = {
        type: "REQUEST",
        msg: msg
    }
    if (detail) eo.detail = detail
    res.status(e.statuscode ?? 400).json(eo)
    console.warn(e)
}
filterFromObj = function (obj, keys) {
    let n = {}
    for (let k of Object.keys(obj)){
        if (!keys.contains(k)){
            n[k] = obj[k]
        }
    }
    return n
}

notFound = new Error("Failed to find the specified resource")
notFound.statuscode = 400

filterObj = function (obj, keys) {
    let n = {}
    for (let k of keys){
        if (obj[k]!==undefined){
            n[k] = obj[k]
        }
    }
    return n
}

checkObject = function (o){
    if ([undefined, null].includes(o)){
        throw notFound
    }
}

admin = function (req,res,next){
    if (req.session?.user?.admin){
        next()
    } else {
        res.status(403).json({})
    }
}
user = function (req,res,next){
    console.log(req.session)
    if (req.session?.user?.userid){
        next()
    } else {
        res.status(403).json({})
    }
}

module.exports = {
    superset, getFromBody, systemError, reqError, filterObj, admin, user,paginator, filterFromObj, checkObject, notFound
}