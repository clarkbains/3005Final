INSERT INTO Users (username, password, email, phone) VALUES ('foo', 'test', 'test@email.com', '737111');

INSERT INTO Users (username, password, email, phone, admin) VALUES ('root', 'toor', 'root@localhost', '010119070', 1);

INSERT INTO Genres (name) VALUES ('YA')

INSERT INTO Genres (name) VALUES ('non-fiction')

INSERT INTO Genres (name) VALUES ('fiction')

INSERT INTO Genres (name) VALUES ('graphic')

INSERT INTO Genres (name) VALUES ('self help')

INSERT INTO Authors (name) VALUES ('Ronald Mcdonald')

INSERT INTO Authors (name) VALUES ('Canadian Author')

INSERT INTO Authors (name) VALUES ('Dean Craig Pelton')

INSERT INTO Authors (name) VALUES ('Another name that also includes Craig')

INSERT INTO Authors (name) VALUES ('Billie')

INSERT INTO Authors (name) VALUES ('Brent')

INSERT INTO Address (country, city, province, postal, street_number, street) VALUES ('Canada', 'ott', 'ON', 'k2c0j7', '2873', 'Birt st.')

INSERT INTO Address (country, city, province, postal, street_number, street) VALUES ('USA', 'ott', 'FL', '01923', '3242', 'Penguin st.')

INSERT INTO Publishers (name, email, phone, branch_transit, financial_institution,account_number, addressid) VALUES ('Penguin', 'p@email', '7384972', '01', '02', '03' , 02)

INSERT INTO Publishers (name, email, phone, branch_transit, financial_institution,account_number, addressid) VALUES ('Bird', 'b@email', '12342', '18', '24', '03' , 01)


INSERT INTO Books (isbn, title, pages, sale_price, purchase_price, royalty, cover_url, available, publisherid, quantity) VALUES ('11101', 'Title1', 881, 17.05, 1, .05, 'http://images/11101', 1, 2, 10)

INSERT INTO Books (isbn, title, pages, sale_price, purchase_price, royalty, cover_url, available, publisherid, quantity) VALUES ('11102', 'Title2', 801, 13.05, 2, .15, 'http://images/11105', 0, 2, 10)

INSERT INTO Books (isbn, title, pages, sale_price, purchase_price, royalty, cover_url, available, publisherid, quantity) VALUES ('11103', 'Title3', 801, 14.45, 3, .2, 'http://images/11105', 1, 2, 90)

INSERT INTO Books (isbn, title, pages, sale_price, purchase_price, royalty, cover_url, available, publisherid, quantity) VALUES ('11109', 'The great canadian cookbook', 40, 30.05, 4, .3, 'http://images/11102', 1, 2, 15)

INSERT INTO Books (isbn, title, pages, sale_price, purchase_price, royalty, cover_url, available, publisherid, quantity) VALUES ('11112', 'The great american cookbook', 90, 20.05, 5, .2, 'http://images/food', 1, 1, 15)

INSERT INTO Books (isbn, title, pages, sale_price, purchase_price, royalty, cover_url, available, publisherid, quantity) VALUES ('111145', 'NatGeo natural edition', 23, 6, 6, .1, 'http://images/nature', 1, 2, 20)

INSERT INTO book_genres (genreid, isbn) VALUES ('3', '11112')

INSERT INTO book_genres (genreid, isbn) VALUES ('2', '11112')

INSERT INTO book_genres (genreid, isbn) VALUES ('2', '11103')

INSERT INTO book_genres (genreid, isbn) VALUES ('5', '11101')

INSERT INTO book_authors (authorid, isbn) VALUES ('3', '11112')

INSERT INTO book_authors (authorid, isbn) VALUES ('2', '11109')

INSERT INTO book_authors (authorid, isbn) VALUES ('4', '111145')

INSERT INTO orders (tracking_number, carrier, userid) VALUES ('1111111', 'Canada Post', 2)

INSERT INTO Order_Items (isbn, orderid, price) VALUES (111145, 1, 1*23)

INSERT INTO Order_Items (isbn, orderid, quantity, price) VALUES (11112, 1, 8, 20.05*8)

INSERT INTO book_authors (authorid, isbn) VALUES ('5', '111145')


