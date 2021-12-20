import { useState, useEffect } from "react";
import {
  Box,
  Button,
  Divider,
  Heading,
  Input,
  Radio,
  RadioGroup,
  Select,
  Stack,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  useToast,
} from "@chakra-ui/react";
import Book from "./Book";
import API_ADDR from "../Config";

const initBooks = [
  {
    isbn: "100",
    title: "Test Book 1",
    sale_price: 100,
    cover_url: "",
    quantity: 10,
    genre: "YA",
    author: "Emma Chadwick",
  },
];

const initAddress = [
  {
    city: "Ottawa",
    country: "Canada",
    postal: "K2L2N9",
    status: "Lost",
    street: "McIntosh Way",
    street_number: "33",
    addressid: "12",
  },
];
export type IBook = {
  isbn: string;
  title: string;
  sale_price: number;
  cover_url: string;
  quantity: number;
  genre: string;
  author: string;
};

type ICartItem = {
  isbn: string;
  title: string;
  sale_price: number;
  amount: number;
};

type IGenre = {
  genreid: string;
  name: string;
};

type ITrackedOrder = {
  orderid: number;
  price: number;
  date: number;
  tracking: {
    city: string;
    country: string;
    postal: string;
    status: string;
    street: string;
    street_number: string;
  };
};

type IShippingAddress = {
  city: string;
  country: string;
  postal: string;
  status: string;
  street: string;
  street_number: string;
  addressid: string;
};

const User = () => {
  const [books, setBooks] = useState<IBook[]>(initBooks);
  const [genres, setGenres] = useState<IGenre[]>([]);

  const [filterByTitle, setFilterByTitle] = useState("");
  const [filterByISBN, setFilterByISBN] = useState("");
  const [filterByAuthor, setFilterByAuthor] = useState("");
  const [filterByGenre, setFilterByGenre] = useState("");
  const [filterByLTPrice, setFilterByLTPrice] = useState("");
  const [filterByGTPrice, setFilterByGTPrice] = useState("");

  const [cart, setCart] = useState<ICartItem[]>([]);
  const [purchaseTotal, setPurchaseTotal] = useState(0);
  const [shippingAddresses, setShippingAddresses] =
    useState<IShippingAddress[]>(initAddress);

  const [address, setAddress] = useState("");
  const [streetNumber, setStreetNumber] = useState("");
  const [streetName, setStreetName] = useState("");
  const [country, setCountry] = useState("");
  const [province, setProvince] = useState("");
  const [city, setCity] = useState("");
  const [postalCode, setPostalCode] = useState("");

  const [cardNumber, setCardNumber] = useState("");
  const [CCVNumber, setCCVNumber] = useState("");
  const [expiryMonth, setExpiryMonth] = useState("");
  const [expiryYear, setExpiryYear] = useState("");

  const [trackedOrders, setTrackedOrders] = useState<ITrackedOrder[]>([]);

  const [author, setAuthor] = useState("");

  const toast = useToast();

  const logout = () => {
    localStorage.removeItem("userID");
    window.location.href = "/";
  };

  const getBooks = async () => {
    const res = await fetch(
      `${API_ADDR}/api/books?isbn=${filterByISBN}&title=${filterByTitle}&genre=${filterByGenre}&author=${filterByAuthor}&ltprice=${filterByLTPrice}&gtprice=${filterByGTPrice}&nopages=true`,
      {
        method: "GET",
        credentials: "include",
        headers: { Auth: `${localStorage.getItem("userID")}` },
      }
    );

    const books = await res.json();
    setBooks(books);
  };

  const getGenres = async () => {
    const res = await fetch(`${API_ADDR}/api/genres`, {
      method: "GET",
      credentials: "include",
      headers: { Auth: `${localStorage.getItem("userID")}` },
    });

    const genres = await res.json();
    setGenres(genres.items);
  };

  const getShippingAddresses = async () => {
    const res = await fetch(`${API_ADDR}/api/me/address`, {
      method: "GET",
      credentials: "include",
      headers: { Auth: `${localStorage.getItem("userID")}` },
    });

    const shippingAddresses = await res.json();
    setShippingAddresses(shippingAddresses.items);
  };

  const getTrackedOrders = async () => {
    const res = await fetch(`${API_ADDR}/api/orders/me`, {
      method: "GET",
      credentials: "include",
      headers: { Auth: `${localStorage.getItem("userID")}` },
    });

    const trackedOrders = await res.json();
    setTrackedOrders(trackedOrders.items);
  };

  useEffect(() => {
    getBooks();
    getGenres();
    getTrackedOrders();
    getShippingAddresses();

    const initCart = localStorage.getItem("cart");
    initCart && setCart(JSON.parse(initCart));

    initCart && setPurchaseTotal(calculateTotal(JSON.parse(initCart)));
  }, []);

  useEffect(() => {
    getBooks();
  }, [
    filterByTitle,
    filterByISBN,
    filterByGenre,
    filterByAuthor,
    filterByLTPrice,
    filterByGTPrice,
  ]);

  const calculateTotal = (cart: ICartItem[]) => {
    let totalCost = 0;

    cart.forEach((item) => {
      totalCost += item.sale_price * item.amount;
    });

    return totalCost;
  };

  const handleAuthorFilter = async (author: string) => {
    setAuthor(author);
    const res = await fetch(`${API_ADDR}/api/authors?name=${author}`, {
      method: "GET",
      credentials: "include",
      headers: { Auth: `${localStorage.getItem("userID")}` },
    });

    const authors = await res.json();

    const authorIDs: string[] = [];

    authors.items.forEach((author: any) => {
      authorIDs.push(author.authorid);
    });

    setFilterByAuthor(authorIDs.join(","));
  };

  const addToCart = (isbn: string) => {
    const book = books.find((book) => book.isbn === isbn);
    if (book) {
      setPurchaseTotal(purchaseTotal + book.sale_price);
      const cartItem = {
        isbn: book.isbn,
        title: book.title,
        sale_price: book.sale_price,
        amount: 1,
      };
      setCart([...cart, cartItem]);
      localStorage.setItem("cart", JSON.stringify(cart));
    }
  };

  const decrementQuantity = (idx: number) => {
    const itemToDecrement = cart[idx];
    const filteredCart = cart.filter(
      (item) => item.isbn !== itemToDecrement.isbn
    );

    itemToDecrement.amount--;

    if (itemToDecrement.amount === 0) {
      setCart(filteredCart);
    } else {
      setCart([...filteredCart, itemToDecrement]);
    }

    setPurchaseTotal(purchaseTotal - itemToDecrement.sale_price);
    localStorage.setItem("cart", JSON.stringify(cart));
  };

  const incrementQuantity = (idx: number) => {
    const itemToIncrement = cart[idx];
    const filteredCart = cart.filter(
      (item) => item.isbn !== itemToIncrement.isbn
    );

    itemToIncrement.amount++;

    setPurchaseTotal(purchaseTotal + itemToIncrement.sale_price);
    setCart([...filteredCart, itemToIncrement]);
    localStorage.setItem("cart", JSON.stringify(cart));
  };

  const removeFromCart = (idx: number) => {
    const itemToRemove = cart[idx];
    const filteredCart = cart.filter((item) => item.isbn !== itemToRemove.isbn);

    setPurchaseTotal(
      purchaseTotal - itemToRemove.amount * itemToRemove.sale_price
    );
    setCart(filteredCart);
    localStorage.setItem("cart", JSON.stringify(cart));
  };

  const createShippingAddress = async () => {
    const res = await fetch(`${API_ADDR}/api/user/me/address`, {
      method: "POST",
      body: JSON.stringify({
        street_number: streetNumber,
        street: streetName,
        country,
        city,
        province,
        postal: postalCode,
      }),
      headers: {
        "Content-Type": "application/json",
        Auth: `${localStorage.getItem("userID")}`,
      },
    });

    const addressReturn = await res.json();
    return addressReturn.addressid;
  };

  const createBillingInformation = async () => {
    await fetch(`${API_ADDR}/api/user/me/billing`, {
      method: "POST",
      body: JSON.stringify({
        card_number: cardNumber,
        ccv: CCVNumber,
        exp_month: expiryMonth,
        exp_year: expiryYear,
      }),
      headers: {
        "Content-Type": "application/json",
        Auth: `${localStorage.getItem("userID")}`,
      },
    });
  };

  const cartToItems = () => {
    const itemsToBuy: any[] = [];

    cart.forEach((item) => {
      itemsToBuy.push({
        isbn: item.isbn,
        quantity: item.amount,
      });
    });

    return itemsToBuy;
  };

  const completeOrder = async () => {
    const addressid = address
      ? address
      : parseInt(await createShippingAddress());
    const items = cartToItems();
    createBillingInformation();

    const res = await fetch(`${API_ADDR}/api/orders`, {
      method: "POST",
      body: JSON.stringify({
        items,
        billing: {
          card_number: cardNumber,
          ccv: CCVNumber,
          exp_month: expiryMonth,
          exp_year: expiryYear,
        },
        addressid,
      }),
      headers: {
        "Content-Type": "application/json",
        Auth: `${localStorage.getItem("userID")}`,
      },
    });

    if (res.status === 200) {
      toast({
        title: "Order Successfully Made",
        description: "Your order went through!",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <Tabs>
      <TabList>
        <Tab>Purchase Books</Tab>
        <Tab>Cart</Tab>
        <Tab>Track Orders</Tab>
        <Tab>Logout</Tab>
      </TabList>

      <TabPanels>
        <TabPanel>
          <Box margin={6}>
            <Input
              marginBottom={4}
              placeholder="Filter by title"
              value={filterByTitle}
              onChange={(e) => setFilterByTitle(e.target.value)}
            />
            <Input
              marginBottom={4}
              placeholder="Filter by ISBN"
              value={filterByISBN}
              onChange={(e) => setFilterByISBN(e.target.value)}
            />
            <Input
              marginBottom={4}
              placeholder="Filter by author"
              value={author}
              onChange={(e) => handleAuthorFilter(e.target.value)}
            />
            <Box display="flex" justifyContent="space-between">
              <Input
                marginRight={4}
                width="50%"
                marginBottom={4}
                placeholder="Filter by price less than"
                value={filterByLTPrice}
                onChange={(e) => setFilterByLTPrice(e.target.value)}
              />
              <Input
                width="50%"
                marginBottom={4}
                placeholder="Filter by price greater than"
                value={filterByGTPrice}
                onChange={(e) => setFilterByGTPrice(e.target.value)}
              />
            </Box>
            <Select
              variant="filled"
              marginBottom={4}
              placeholder="Select a genre"
              value={filterByGenre}
              onChange={(e) => setFilterByGenre(e.target.value)}
            >
              {genres.map((genre) => {
                return <option value={genre.genreid}>{genre.name}</option>;
              })}
            </Select>
          </Box>
          <Box
            margin={6}
            display="flex"
            alignItems={"center"}
            justifyContent={"space-between"}
          >
            <Heading width="10%" textAlign={"center"}>
              ISBN
            </Heading>
            <Heading width="20%" textAlign={"center"}>
              Title
            </Heading>
            <Heading width="20%" textAlign={"center"}>
              Authors
            </Heading>
            <Heading width="20%" textAlign="center">
              Genres
            </Heading>
            <Heading width="10%" textAlign={"center"}>
              Price
            </Heading>

            <Heading width="10%" textAlign={"center"}>
              Quantity Available
            </Heading>
            <Heading width="10%"></Heading>
          </Box>
          {books.map((book: IBook) => {
            return (
              <>
                <Book
                  title={book.title}
                  sale_price={book.sale_price}
                  cover_url={book.cover_url}
                  genre={book.genre}
                  isbn={book.isbn}
                  author={book.author}
                  quantity={book.quantity}
                  actionText="Add to Cart"
                  action={addToCart}
                />
                <Divider />
              </>
            );
          })}
        </TabPanel>
        <TabPanel>
          <Box
            margin={6}
            display="flex"
            alignItems={"center"}
            justifyContent={"space-between"}
          >
            <Heading width="5%" textAlign={"center"}>
              #
            </Heading>
            <Heading width="10%" textAlign={"center"}>
              ISBN
            </Heading>
            <Heading width="20%" textAlign={"center"}>
              Title
            </Heading>
            <Heading width="10%" textAlign={"center"}>
              Price
            </Heading>
            <Heading width="10%" textAlign={"center"}>
              Quantity
            </Heading>
            <Heading width="10%"></Heading>
          </Box>
          {cart.map((item: ICartItem, idx) => {
            return (
              <>
                <Box
                  margin={6}
                  display="flex"
                  alignItems={"center"}
                  justifyContent={"space-between"}
                >
                  <Text width="5%">{idx}</Text>
                  <Text width="10%" textAlign="center">
                    {item.isbn}
                  </Text>
                  <Text width="20%" textAlign="center">
                    {item.title}
                  </Text>
                  <Text width="10%" textAlign="center">
                    {item.sale_price}
                  </Text>
                  <Box display="flex" width="10%" justifyContent="center">
                    <Text marginRight={4} textAlign="center">
                      {item.amount}
                    </Text>
                    <Button
                      marginRight={4}
                      size="sm"
                      onClick={(_) => incrementQuantity(idx)}
                    >
                      +
                    </Button>
                    <Button size="sm" onClick={(_) => decrementQuantity(idx)}>
                      -
                    </Button>
                  </Box>
                  <Button
                    width="10%"
                    textAlign="center"
                    onClick={(_) => removeFromCart(idx)}
                  >
                    Remove from Cart
                  </Button>
                </Box>
                <Divider />
              </>
            );
          })}
          <Heading textAlign={"end"} margin={6}>
            Total: ${purchaseTotal}
          </Heading>
          <Box margin={6} display="flex" justifyContent={"space-around"}>
            <Box display="flex" flexDirection="column">
              <Heading marginBottom={4}>Shipping Address</Heading>
              <RadioGroup onChange={setAddress} value={address}>
                <Stack direction="column">
                  {shippingAddresses.map((address) => {
                    return (
                      <Radio marginBottom={4} value={`${address.addressid}`}>
                        <Text>
                          {address.street_number} {address.street},{" "}
                          {address.country}, {address.city}, {address.postal}
                        </Text>
                      </Radio>
                    );
                  })}
                  <Radio value={""}>New Shipping Address</Radio>
                </Stack>
              </RadioGroup>
              <Input
                marginBottom={4}
                marginTop={4}
                placeholder="Street Number"
                value={streetNumber}
                onChange={(e) => setStreetNumber(e.target.value)}
              />
              <Input
                marginBottom={4}
                placeholder="Street Name"
                value={streetName}
                onChange={(e) => setStreetName(e.target.value)}
              />
              <Input
                marginBottom={4}
                placeholder="Country"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
              />
              <Input
                marginBottom={4}
                placeholder="Province"
                value={province}
                onChange={(e) => setProvince(e.target.value)}
              />
              <Input
                marginBottom={4}
                placeholder="City"
                value={city}
                onChange={(e) => setCity(e.target.value)}
              />
              <Input
                marginBottom={4}
                placeholder="Postal Code"
                value={postalCode}
                onChange={(e) => setPostalCode(e.target.value)}
              />
            </Box>
            <Box display="flex" flexDirection="column">
              <Heading marginBottom={4}>Billing Information</Heading>
              <Input
                marginBottom={4}
                placeholder="Card #"
                value={cardNumber}
                onChange={(e) => setCardNumber(e.target.value)}
              />
              <Input
                marginBottom={4}
                placeholder="CCV #"
                value={CCVNumber}
                onChange={(e) => setCCVNumber(e.target.value)}
              />
              <Input
                marginBottom={4}
                placeholder="Expiry Month"
                value={expiryMonth}
                onChange={(e) => setExpiryMonth(e.target.value)}
              />
              <Input
                marginBottom={4}
                placeholder="Expiry Year"
                value={expiryYear}
                onChange={(e) => setExpiryYear(e.target.value)}
              />
              <Button marginTop={14} onClick={completeOrder}>
                Complete Order
              </Button>
            </Box>
          </Box>
        </TabPanel>
        <TabPanel>
          <Heading margin={6}>Tracked Orders</Heading>
          <Box margin={6} display="flex" justifyContent={"space-around"}>
            <Heading width="20%" alignItems="center">
              Order #
            </Heading>
            <Heading width="30%" alignItems="center">
              Date
            </Heading>
            <Heading width="20%" alignItems="center">
              Total
            </Heading>
            <Heading width="50%" alignItems="center">
              Status
            </Heading>
          </Box>
          {trackedOrders.map((order) => {
            return (
              <Box margin={8} display="flex" justifyContent={"space-around"}>
                <Text width="20%" alignItems="center">
                  {order.orderid}
                </Text>
                <Text width="30%" alignItems="center">
                  {new Date(order.date).toDateString()}
                </Text>
                <Text width="20%" alignItems="center">
                  ${order.price}
                </Text>
                <Text width="50%" alignItems="center">
                  {order.tracking.status ?? "Unknown"}
                </Text>
              </Box>
            );
          })}
        </TabPanel>
        <TabPanel>
          <Button onClick={logout}>Logout</Button>
        </TabPanel>
      </TabPanels>
    </Tabs>
  );
};

export default User;
