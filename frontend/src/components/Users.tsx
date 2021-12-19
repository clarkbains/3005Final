import { useState, useEffect } from "react";
import {
  Box,
  Button,
  Divider,
  Heading,
  Input,
  Select,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
} from "@chakra-ui/react";
import Book from "./Book";

const initialBooks = [
  { title: "Dune", isbn: "293829057af", author: "Gwyneth Paltrow" },
  { title: "Spooderman", isbn: "r23847897a89f", author: "Arthur Conan Doyle" },
];

const initialGenres = ["Nonfiction", "Action", "Romance", "Comedy"];

const initialCart = [
  { title: "Spooderman", isbn: "r23847897a89f", author: "Arthur Conan Doyle" },
];

const User = () => {
  const [books, setBooks] = useState(initialBooks);
  const [genres, setGenres] = useState(initialGenres);

  const [filterByTitle, setFilterByTitle] = useState("");
  const [filterByISBN, setFilterByISBN] = useState("");
  const [filterByAuthor, setFilterByAuthor] = useState("");
  const [filterByGenre, setFilterByGenre] = useState("");

  const [cart, setCart] = useState(initialCart);

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

  const [trackingNumber, setTrackingNumber] = useState("");

  useEffect(() => {
    //TODO: fetch initial books
    //TODO: fetch initial genres
    //TODO: fetch initial cart
  }, []);

  useEffect(() => {
    //TODO: fetch books on filters
  }, [filterByTitle, filterByISBN, filterByGenre, filterByAuthor]);

  const addToCart = (title: string) => {
    //TODO: add books to cart
    console.log("Adding book to cart:  ", title);
  };

  const removeFromCart = (title: string) => {
    //TODO: remove books
    console.log("Removing ", title);
  };

  const completeOrder = () => {
    //TODO: complete order
    console.log("Ordering");
  };

  const trackOrder = () => {
    //TODO: get tracking info
    console.log(trackingNumber);
  };

  return (
    <Tabs>
      <TabList>
        <Tab>Purchase Books</Tab>
        <Tab>Cart</Tab>
        <Tab>Track Order</Tab>
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
              value={filterByAuthor}
              onChange={(e) => setFilterByAuthor(e.target.value)}
            />
            <Select
              variant="filled"
              marginBottom={4}
              placeholder="Select a genre"
              value={filterByGenre}
              onChange={(e) => setFilterByGenre(e.target.value)}
            >
              {genres.map((genre) => {
                return <option value={genre}>{genre}</option>;
              })}
            </Select>
          </Box>
          <Box margin={6} display="flex" alignItems={"center"}>
            <Box display="flex" width="50%" justifyContent="space-around">
              <Heading>ISBN</Heading>
              <Heading>Title</Heading>
            </Box>
            <Box display="flex" width="50%" justifyContent="space-around">
              <Heading>Author</Heading>
              <Heading></Heading>
            </Box>
          </Box>
          {books.map((book) => {
            return (
              <>
                <Book
                  title={book.title}
                  isbn={book.isbn}
                  author={book.author}
                  actionText="Add to Cart"
                  action={addToCart}
                />
                <Divider />
              </>
            );
          })}
        </TabPanel>
        <TabPanel>
          <Box margin={6} display="flex" alignItems={"center"}>
            <Box display="flex" width="50%" justifyContent="space-around">
              <Heading>ISBN</Heading>
              <Heading>Title</Heading>
            </Box>
            <Box display="flex" width="50%" justifyContent="space-around">
              <Heading>Author</Heading>
              <Heading></Heading>
            </Box>
          </Box>
          {cart.map((book) => {
            return (
              <>
                <Book
                  title={book.title}
                  isbn={book.isbn}
                  author={book.author}
                  actionText="Remove"
                  action={removeFromCart}
                />
                <Divider />
              </>
            );
          })}
          <Box margin={6} display="flex" justifyContent={"space-around"}>
            <Box display="flex" flexDirection="column">
              <Heading marginBottom={4}>Shipping Address</Heading>
              <Input
                marginBottom={4}
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
          <Input
            padding={6}
            marginBottom={6}
            placeholder="Enter order #"
            onChange={(e) => setTrackingNumber(e.target.value)}
          />
          <Button padding={6} onClick={trackOrder}>
            {" "}
            Track Order{" "}
          </Button>
        </TabPanel>
      </TabPanels>
    </Tabs>
  );
};

export default User;
