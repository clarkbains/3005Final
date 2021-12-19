//This is not meant to be a part of the database design, as it just saves its data to a serialized JSON blob. It is just meant to emulate what a 3rd party carrier may have.
const express = require('express')
const SAVE_LOC = "/data/tracking"
const carriers = ["Intellicom", "Canada Post", "Dicom"]
const status = ["Trapped in BC", "Fell off the sled", "Went to the wrong city"]
const _ = require('lodash')
const fs = require('fs')
const crypto = require('crypto')
let app = express()
let trackingInfo = {}

try {
    trackingInfo = JSON.parse(String(fs.readFileSync(SAVE_LOC)))
} catch {
    trackingInfo = {}
    saveTracking()
}

function saveTracking(){
    fs.writeFileSync(SAVE_LOC, JSON.stringify(trackingInfo))
}
app.use(express.json())

app.post("/tracking", (req,res)=>{
    let numItems = req.body.items ?? 1 
    let tracking = crypto.randomBytes(16).toString('hex');
    let carrier = _.sample(carriers)
    let address = req.body.address ?? {"country":"N/I"}

    if (!trackingInfo[carrier]){
        trackingInfo[carrier] = {}
    }
    trackingInfo[carrier][tracking] = address
    console.log("POST Tracking Req", address)
    saveTracking()
    res.json({
        carrier, tracking
    })
})
app.get("/tracking", (req,res)=>{
    console.log("GET Tracking Req", req.query)
    let addr = trackingInfo?.[req.query.carrier]?.[req.query.tracking]
    if (addr){
        let cpy = Object.assign({}, addr)
        cpy.status = _.sample(status)
        res.json(cpy)
    } else {
        res.status(404).json({})
    }
})
process.sin
console.log("Started!")
app.listen(8978)
