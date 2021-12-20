module.exports = {
    genre_sales: {
        parameters: [
            {
                name:"date",
                type:"date", 
                label:"Report Start Time", 
            }
        ], 
        info:"Sales Per Genre",
        generator:function (req,res, params) {
            let data = req.db.prepare(`SELECT Genres.name as name, sum(oi.price) as amount from books natural left join book_genres bg natural left join Genres  join Order_Items oi on oi.isbn = Books.isbn natural join Orders where Orders.date >= ? group by genreid ORDER BY amount DESC`).all(params.date)
            res.render("topSales.ejs", {data: data})
        }
    },
    author_sales: {
        parameters: [
            {
                name:"date",
                type:"date", 
                label:"Report Start Time", 
            }
        ], 
        info:"Sales Per Author",
        generator:function (req,res, params) {
            let data = req.db.prepare(`SELECT Authors.name as name, sum(oi.price) as amount from books natural left join book_authors bg natural left join Authors join Order_Items oi on oi.isbn = Books.isbn natural join Orders where Orders.date >= ? group by authorid ORDER BY amount DESC
            `).all(params.date)
            res.render("topSales.ejs", {data: data})
        }
    },earnings: {
        parameters: [
            {
                name:"date",
                type:"date", 
                label:"Report Start Time", 
            }
        ], 
        info:"Income and Expenses",
        generator:function (req,res, params) {
            let data = req.db.prepare(`SELECT 	(SELECT SUM(price) from Order_Items natural join Orders  where date >= ?) as sales, 
            (SELECT SUM(royalties) from Orders where date >= ? ) as royalties,
            (SELECT SUM(price) from Publisher_Orders  where order_date  >= ? ) as pub_orders
            `).get(params.date,params.date,params.date)
            res.render("totalSales.ejs", {data: data})
        }
    }
}