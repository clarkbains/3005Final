CREATE TRIGGER IF NOT EXISTS updateOrder
    after insert on Order_Items
    BEGIN
    --SQLite doesn't support vars, so duplicated selects
    UPDATE Orders 
        SET
         royalties=royalties+(NEW.quantity * (SELECT sale_price*royalty from Books where Books.isbn = NEW.isbn)) 
        where orderid = NEW.orderid;
    UPDATE Books 
        SET
         quantity=quantity-(NEW.quantity) 
        where Books.isbn = NEW.isbn;
    END


CREATE TRIGGER IF NOT EXISTS mfcOrders
    after update on Books WHEN NEW.quantity < 10 AND NEW.available != 0
    BEGIN
    INSERT INTO Publisher_Orders (publisherid, isbn, quantity, price) 
    SELECT
        NEW.publisherid,
        NEW.isbn,
        sum(quantity), 
        sum(quantity)*NEW.purchase_price 
    from Order_Items natural join Orders 
    where date >= (strftime('%s', 'now')-3600*24*30) and isbn=NEW.isbn;
    END

CREATE TRIGGER IF NOT EXISTS mfcOrderreceived
    after update on Publisher_Orders WHEN NEW.received != OLD.received
    BEGIN
    UPDATE Books set quantity = quantity + (NEW.received - OLD.received) where isbn = NEW.isbn;
    END    