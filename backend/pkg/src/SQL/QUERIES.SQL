--This file is not run. Many queries are dynamically generated.
--[USER.JS]
--Add a user to system
INSERT INTO Users (username, password, email, phone) VALUES (?, ?, ?, ?)

--Get user info
SELECT username, email, phone, admin FROM Users WHERE userid = ?

--patch a user
--  Get current user
SELECT * from Users where userid = ?
--  Update once current user is patched
UPDATE Users SET username = ?, password = ?, email = ?, phone = ?, admin = ? where userid = ?


--Add an address for a user
--  Add an address
INSERT INTO Address (country, city, province, postal, street_number, street) VALUES (?, ?, ?, ?, ?, ?)
--  for a user
INSERT INTO User_Address (userid, addressid) VALUES (?, ?)

--Update an address
--  Get the current value for an addressid
SELECT * from Address where addressid = ? 
--  Apply the update once the current value is patched with new data
UPDATE Address set country = ?, city = ?, province = ?, postal = ?, street_number =?, street = ? where addressid = ?

--Delete an address (User address cascades from here)
DELETE FROM Address where addressid = ?

--Get all adresses for a user
SELECT * FROM Address natural join User_Address where userid = ?

--Add billing info for a user
INSERT INTO Billing_info (card_number, ccv, exp_month, exp_year, userid) VALUES (?, ?, ?, ?)

--Get billing info for a user
SELECT * FROM Billing_info where userid = ?


--[SESSION.js]
--Get user info from creds
SELECT username, userid, admin FROM Users where username = ? AND password = ? 


--[PUBLISHER.js]
--paginated search (wc = conditions derrived from api call, pg = String like LIMIT x OFFSET Y)
--  data
SELECT * from Publishers ${wc} ORDER BY name ${pg}
--  count
SELECT count(*) as cnt from Publishers ${wc}

--Add a new publisher
INSERT INTO Publishers (name, email, phone, branch_transit, financial_institution, addressid) VALUES (?, ?, ?, ?, ?, ?)

--Patch existing publisher
--  Get current value
SELECT * from Publishers where publisherid = ? 
--  Update after applying changes to current value
UPDATE Publishers set name = ?, email = ?, phone = ?, branch_transit = ?, financial_institution =?, account_number=?, addressid = ? where publisherid = ?

-- delete publisher
DELETE FROM Publishers where publisherid = ?


--[ORDERS.JS]
--Paginated Search
--  data
SELECT * from Orders ${wc} ORDER BY date DESC ${pg}
--  count 
SELECT count(*) as cnt from Orders ${wc}

--Get Order info
--  Get all attributes
SELECT orderid, carrier, tracking_number,date, SUM(price) as price from Orders natural join order_items where orderid = ? and userid = ? group by orderid, userid, tracking_number, date, carrier
--  Attach tracking info (from tracking-api, so no query)

--Create Order
--  Get address from id (to submit to tracking api)
SELECT country, city, province, postal, street_number, street from Address where addressid = ?
-- Create order
INSERT INTO Orders (userid, carrier, tracking_number) VALUES (?, ?, ?)
-- Add items (loop)
INSERT INTO Order_Items (orderid, isbn, quantity, price) SELECT ?, ?, ?, (?*sale_price) from Books where isbn = ? 

--[GENRES.JS]
--paginated Searcg
-- data
SELECT * from Genres ${wc} ORDER BY name ${pg}
-- count
SELECT count(*) as cnt from Genres ${wc}

--add genre to system
INSERT INTO Genres (name) VALUES (?)

--remove genre from system (cascades to book_genres)
DELETE FROM Genres where genreid = ?

--[BOOKS.JS]
--paginated Search (where wc is an array of search params assembled from the request)
--  data
SELECT isbn, title, quantity, sale_price, cover_url, available, group_concat(DISTINCT Authors.name) as authors, group_concat(DISTINCT Genres.name) as genres from Books left natural join book_authors left natural join Authors left natural join book_genres left join Genres on Genres.genreid = book_genres.genreid where ${wc.join(" AND ")}  group by isbn ORDER BY isbn ${pg}
--  count
SELECT count(*) as cnt from Books left natural join book_authors left natural join Authors left natural join book_genres left join Genres on Genres.genreid = book_genres.genreid where ${wc.join(" AND ")}  group by isbn 

--add book (db_keys is a set of optional attributes like cover_url, and db_vals is their value. Things are only in this set if present)
INSERT INTO Books (title, isbn, sale_price, purchase_price, pages, publisherid, royalty ${db_keys?`, ${db_keys.join(", ")}`:""}) VALUES (?, ?, ?, ?, ? ${db_vals?`, ${db_vals.map(e=>`?`).join(", ")}`:""})

--patch an existing book
--  get current book
SELECT * from Books where isbn = ?
--  update to patched version of current book
UPDATE Books SET title = ?, pages = ?, sale_price = ?, purchase_price = ?, cover_url = ?, available = ?, publisherid = ?, royalty = ? WHERE isbn = ?

--Set Genres for a book
--  delete existing genres for book
DELETE FROM book_genres where isbn = ?
--  add new ones (looped)
INSERT INTO book_genres (isbn, genreid) VALUES (?, ?)

--Set Author for a book
--  delete existing authors for book
DELETE FROM book_authors where isbn = ?
--  add new ones (looped)
INSERT INTO book_authors (isbn, authorid) VALUES (?, ?)

--Get genres for a book
SELECT * FROM Genres natural join book_genres where isbn = ?

--Get authors for a book
SELECT * FROM Authors natural join book_authors where isbn = ?

--Get a book, with genres and authors attached. This could not be done in a single join without ugly hacks like concatenating genres, then parsing on the server to convert into a suitable api object, as the result of a join would be many rows with book data duplicated for every other genre and author on the book, which is wasteful
--  Get Book with publisher info
SELECT * FROM Books natural join Publishers where isbn = ?
--  Get genre info
SELECT Genres.* FROM Genres natural join book_genres where isbn = ?
--  Get author info
SELECT Authors.* FROM Authors natural join book_authors where isbn = ?

--[AUTHORS.JS]
--Paginated search of authors
--  get data
SELECT * from Authors ${wc} ORDER BY name ${pg}
-- get count
SELECT count(*) as cnt from Authors ${wc}

--get author
SELECT * FROM Authors where authorid = ?

--add author
INSERT INTO Authors (name) VALUES (?)

--remove author
DELETE FROM Authors where authorid = ?

--[REPORTS.JS]
--Get Sales/Genre
SELECT Genres.name as name, sum(oi.price) as amount from books natural left join book_genres bg natural left join Genres  join Order_Items oi on oi.isbn = Books.isbn natural join Orders where Orders.date >= ? group by genreid ORDER BY amount DESC


--Get Sales/Author
SELECT Authors.name as name, sum(oi.price) as amount from books natural left join book_authors bg natural left join Authors join Order_Items oi on oi.isbn = Books.isbn natural join Orders where Orders.date >= ? group by authorid ORDER BY amount DESC

--Get Expenses/Income
SELECT 	(SELECT SUM(price) from Order_Items natural join Orders  where date >= ?) as sales, 
            (SELECT SUM(royalties) from Orders where date >= ? ) as royalties,
            (SELECT SUM(price) from Publisher_Orders  where order_date  >= ? ) as pub_orders
