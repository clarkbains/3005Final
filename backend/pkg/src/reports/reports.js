module.exports = {
    foobar: {
        parameters: [
            {
                name:"cust_name",
                type:"string", 
                label:"cust name", default:""
            },
            {
                name:"purchase_time",
                type:"date", 
                label:"First day to purchase book", default:""
            },
            {
                name:"book_num",
                type:"number", 
                label:"How many books?"
            }
        ], 
        info:"Report to get x",
        generator:function (req,res, params) {
            console.log("Report called! Generating from", params)
            res.render("test.ejs", {params: params})
        }
    }
}