/*Only returned on error*/
res = {
    type:"SYSTEM|REQUEST", //System errors like DBMS errors, where I've done something that isn't handled well and express throws an exception (Hopefully there won't be a lot of these). Request errors for bad requests. 
    msg:"Bad thing",
    detail:"More info about bad thing."
}