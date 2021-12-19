module.exports = {
    foobar: {
        parameters: [
            {
                name:"date",
                type:"date", 
                label:"Report Start Time", 
            },
            {
                name:"purchase_time",
                type:"date", 
                label:"First day to purchase book", default:""
            },
            {
                name:"book_num",
                type:"number", 
                label:"How many books?",
                default:"0"
            }
        ], 
        info:"Sales Per Genre",
        generator:function (req,res, params) {
            let data = req.db.prepare(`SELECT Genres.name, sum(price) as genre_sales from Genres 
            natural join book_genres 
            natural join Order_Items 
            natural join Orders where Orders.date > ? group by genres.name ORDER BY genre_sales DESC`).all(params.date)
            res.render("genreSales.ejs", {data: data})
        }
    }
}