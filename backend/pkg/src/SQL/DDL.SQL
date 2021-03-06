CREATE TABLE IF NOT EXISTS
    Users (
        `userid` INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL UNIQUE,
        `username` TEXT NOT NULL UNIQUE,
        `password` TEXT NOT NULL,
        `email` TEXT NOT NULL,
        `phone` TEXT NOT NULL,
        `admin` INTEGER NOT NULL DEFAULT (0));

CREATE TABLE IF NOT EXISTS
    Billing_info (
        `userid` INTEGER NOT NULL,
        `card_number` INTEGER NOT NULL,
        `ccv` INTEGER   NOT NULL,
        `exp_month` INTEGER NOT NULL,
        `exp_year` INTEGER  NOT NULL,
        CONSTRAINT `user_id_fk` FOREIGN KEY (`userid`) REFERENCES Users(`userid`) ON DELETE CASCADE,
        PRIMARY KEY(`userid`, `card_number`, `ccv`, `exp_month`, `exp_year`));

CREATE TABLE IF NOT EXISTS
    Address (
        `addressid` INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL UNIQUE,
        `country` TEXT NOT NULL,
        `city` TEXT NOT NULL,
        `province` TEXT NOT NULL,
        `postal` TEXT NOT NULL,
        `street_number` NOT NULL,
        `street` TEXT  NOT NULL);

CREATE TABLE IF NOT EXISTS
    User_Address (
        `userid` INTEGER NOT NULL,
        `addressid` INTEGER NOT NULL,
        CONSTRAINT `user_id_fk` FOREIGN KEY (`userid`) REFERENCES Users(`userid`),
        CONSTRAINT `address_id_fk` FOREIGN KEY (`addressid`) REFERENCES Address(`addressid`) ON DELETE CASCADE,
        PRIMARY KEY (`userid`, `addressid`));

CREATE TABLE IF NOT EXISTS
    Books (
        `isbn` INTEGER PRIMARY KEY NOT NULL UNIQUE,
        `title` TEXT  NOT NULL,
        `pages` INTEGER NOT NULL,
        `sale_price` REAL NOT NULL,
        `purchase_price` REAL NOT NULL,
        `cover_url` TEXT,
        `available` INTEGER NOT NULL DEFAULT (1),
        `quantity` INTEGER NOT NULL DEFAULT (0),
        `publisherid` INTEGER NOT NULL,
        `royalty` REAL NOT NULL,
        CONSTRAINT `publisherid` FOREIGN KEY (`publisherid`) REFERENCES Publishers(`publisherid`), 
        CHECK(quantity >= 0)
        );


CREATE TABLE IF NOT EXISTS
    Orders (
        `orderid` INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL UNIQUE,
        `userid` INTEGER NOT NULL,
        `tracking_number` TEXT NOT NULL,
        `carrier` TEXT NOT NULL,
        `date` INTEGER NOT NULL DEFAULT (strftime('%s', 'now')),
        `royalties` REAL NOT NULL DEFAULT (0),
        CONSTRAINT `user_id_fk` FOREIGN KEY (`userid`) REFERENCES Users(`userid`));

CREATE TABLE IF NOT EXISTS
    Order_Items (
        `orderid` INTEGER NOT NULL,
        `isbn` INTEGER NOT NULL,
        `quantity` INTEGER NOT NULL DEFAULT (1),
        `price` REAL NOT NULL,
        CONSTRAINT `isbn_fk` FOREIGN KEY (`isbn`) REFERENCES Books(`isbn`),
        CONSTRAINT `order_id_fk` FOREIGN KEY (`orderid`) REFERENCES Orders(`orderid`),
        PRIMARY KEY (`orderid`, `isbn`));


CREATE TABLE IF NOT EXISTS
    Publishers (
        `publisherid` INTEGER PRIMARY KEY NOT NULL UNIQUE,
        `name` TEXT  NOT NULL,
        `email` TEXT NOT NULL,
        `phone` TEXT NOT NULL,
        `branch_transit` TEXT NOT NULL,
        `financial_institution` TEXT,
        `account_number` INTEGER NOT NULL, 
        `addressid` INTEGER NOT NULL, 
        CONSTRAINT `address_id_fk` FOREIGN KEY (`addressid`) REFERENCES Address(`addressid`));

CREATE TABLE IF NOT EXISTS
    Genres (
        `genreid` INTEGER PRIMARY KEY NOT NULL UNIQUE,
        `name` TEXT NOT NULL UNIQUE);

CREATE TABLE IF NOT EXISTS
    Authors (
        `authorid` INTEGER PRIMARY KEY NOT NULL UNIQUE,
        `name` TEXT NOT NULL);
        
CREATE TABLE IF NOT EXISTS
    book_authors (
        `authorid` INTEGER NOT NULL,
        `isbn` INTEGER NOT NULL,
        CONSTRAINT `isbn_fk` FOREIGN KEY (`isbn`) REFERENCES Books(`isbn`) ON DELETE CASCADE,
        CONSTRAINT `author_id_fk` FOREIGN KEY (`authorid`) REFERENCES Authors(`authorid`),
        PRIMARY KEY (`authorid`, `isbn`));

CREATE TABLE IF NOT EXISTS
    book_genres (
        `genreid` INTEGER NOT NULL,
        `isbn` INTEGER NOT NULL,
        CONSTRAINT `isbn_fk` FOREIGN KEY (`isbn`) REFERENCES Books(`isbn`) ON DELETE CASCADE,
        CONSTRAINT `genre_id_fk` FOREIGN KEY (`genreid`) REFERENCES Genres(`genreid`) ON DELETE CASCADE,
        PRIMARY KEY (`genreid`, `isbn`));
        

CREATE TABLE IF NOT EXISTS
    Publisher_Orders (
        `publisher_orderid` INTEGER PRIMARY KEY NOT NULL UNIQUE,
        `publisherid` INTEGER NOT NULL,
        `isbn` INTEGER NOT NULL,
        `order_date` INTEGER NOT NULL DEFAULT(strftime('%s', 'now')),
        `quantity` INTEGER NOT NULL,
        `received` INTEGER NOT NULL DEFAULT (0),
        `price` REAL NOT NULL,
        CONSTRAINT `isbn_fk` FOREIGN KEY (`isbn`) REFERENCES Books(`isbn`),
        CONSTRAINT `publisherid_fk` FOREIGN KEY (`publisherid`) REFERENCES Publishers(`publisherid`),
        CHECK(received >= 0 AND received <= quantity),
        CHECK(quantity>=0));
  