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
SELECT carrier, tracking_number,price,date from Orders where orderid = ? and userid = 
--  Attach tracking info (from tracking-api, so no query)

--[GENRES.JS]
