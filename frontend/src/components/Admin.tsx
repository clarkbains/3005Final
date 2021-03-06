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
  useToast,
} from "@chakra-ui/react";
import Book from "./Book";
import { IBook } from "./Users";
import API_ADDR from "../Config";

type IReport = {
  parameters: [
    {
      name: string;
      type: string;
      label: string;
    }
  ];
  info: string;
};

type IPublisher = {
  publisherid: string;
  name: string;
  email: string;
  phone: string;
  branch_transit: string;
  financial_institution: string;
  account_number: string;
  addressid: string;
};

const Admin = () => {
  const [books, setBooks] = useState<IBook[]>([]);
  const [reports, setReports] = useState<IReport[]>([]);
  const [publishers, setPublishers] = useState<IPublisher[]>([]);
  const [renderedReport, setRenderedReport] = useState("");

  const [title, setTitle] = useState("");
  const [isbn, setIsbn] = useState("");
  const [author, setAuthor] = useState("");
  const [genre, setGenre] = useState("");
  const [quantity, setQuantity] = useState("");
  const [salePrice, setSalePrice] = useState("");
  const [purchasePrice, setPurchasePrice] = useState("");
  const [pages, setPages] = useState("");
  const [publisherId, setPublisherId] = useState("");
  const [royalty, setRoyalty] = useState("");

  const toast = useToast();

  const logout = () => {
    localStorage.removeItem("userID");
    window.location.href = "/";
  };

  const getBooks = async () => {
    const res = await fetch(`${API_ADDR}/api/books?nopages=true`, {
      method: "GET",
      credentials: "include",
      headers: {
        Auth: `${localStorage.getItem("userID")}`,
      },
    });

    const books = await res.json();
    setBooks(books);
  };

  const getReports = async () => {
    const res = await fetch(`${API_ADDR}/api/reports`, {
      method: "GET",
      credentials: "include",
      headers: {
        Auth: `${localStorage.getItem("userID")}`,
      },
    });

    const reports = await res.json();
    setReports(reports);
  };

  const getPublishers = async () => {
    const res = await fetch(`${API_ADDR}/api/publishers?nopages=true`, {
      method: "GET",
      credentials: "include",
      headers: {
        Auth: `${localStorage.getItem("userID")}`,
      },
    });

    const publishers = await res.json();
    setPublishers(publishers);
  };

  const removeBook = async (isbn: string) => {
    const res = await fetch(`${API_ADDR}/api/books/${isbn}`, {
      method: "PATCH",
      body: JSON.stringify({
        available: 0,
      }),
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Auth: `${localStorage.getItem("userID")}`,
      },
    });

    if (res.status === 200) {
      toast({
        title: "Book Successfully Removed",
        description: "Your removal went through!",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const createAuthor = async () => {
    const res = await fetch(`${API_ADDR}/api/authors`, {
      method: "POST",
      body: JSON.stringify({
        name: author,
      }),
      headers: {
        "Content-Type": "application/json",
        Auth: `${localStorage.getItem("userID")}`,
      },
    });

    const newAuthor = await res.json();
    return newAuthor;
  };

  const createGenre = async () => {
    const res = await fetch(`${API_ADDR}/api/genres`, {
      method: "POST",
      body: JSON.stringify({
        name: genre,
      }),
      headers: {
        "Content-Type": "application/json",
        Auth: `${localStorage.getItem("userID")}`,
      },
    });

    const newGenre = await res.json();
    return newGenre;
  };

  const addAuthorToBook = async (authorid: string) => {
    await fetch(`${API_ADDR}/api/books/${isbn}/authors`, {
      method: "POST",
      body: JSON.stringify({
        authors: [authorid],
      }),
      headers: {
        "Content-Type": "application/json",
        Auth: `${localStorage.getItem("userID")}`,
      },
    });
  };

  const addGenreToBook = async (genreid: string) => {
    await fetch(`${API_ADDR}/api/books/${isbn}/genres`, {
      method: "POST",
      body: JSON.stringify({
        genres: [genreid],
      }),
      headers: {
        "Content-Type": "application/json",
        Auth: `${localStorage.getItem("userID")}`,
      },
    });
  };

  const addBook = async () => {
    const res = await fetch(`${API_ADDR}/api/books`, {
      method: "POST",
      body: JSON.stringify({
        title,
        isbn,
        sale_price: salePrice,
        purchase_price: purchasePrice,
        pages,
        publisherid: publisherId,
        royalty,
        quantity,
      }),
      headers: {
        "Content-Type": "application/json",
        Auth: `${localStorage.getItem("userID")}`,
      },
    });

    if (res.status === 200) {
      toast({
        title: "Book Successfully Added",
        description: "The order went through!",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    }

    const author = await createAuthor();
    const genre = await createGenre();

    addAuthorToBook(author.authorid);
    addGenreToBook(genre.genreid);
  };

  const generateReport = async (reportTitle: string) => {
    const res = await fetch(`${API_ADDR}/api/reports/${reportTitle}`, {
      method: "POST",
      body: JSON.stringify({
        date: "100000",
      }),
      headers: {
        "Content-Type": "application/json",
        Auth: `${localStorage.getItem("userID")}`,
      },
    });

    setRenderedReport(await res.text());
  };

  function createMarkup(markup: string) {
    return { __html: markup };
  }

  useEffect(() => {
    getBooks();
    getReports();
    getPublishers();
  }, []);

  return (
    <Tabs>
      <TabList>
        <Tab>Add Books</Tab>
        <Tab>Remove Books</Tab>
        <Tab>View Reports</Tab>
        <Tab>Logout</Tab>
      </TabList>

      <TabPanels>
        <TabPanel textAlign="center">
          <Heading textAlign="center" marginBottom={4}>
            Add New Book
          </Heading>
          <Box
            margin={6}
            display="flex"
            flexDirection="row"
            justifyContent="center"
          >
            <Box width="30%" marginRight={6}>
              <Input
                marginBottom={4}
                value={title}
                placeholder="Title"
                onChange={(e) => setTitle(e.target.value)}
              />
              <Input
                marginBottom={4}
                value={isbn}
                placeholder="ISBN"
                onChange={(e) => setIsbn(e.target.value)}
              />
              <Input
                marginBottom={4}
                value={author}
                placeholder="Author"
                onChange={(e) => setAuthor(e.target.value)}
              />
              <Input
                marginBottom={4}
                value={genre}
                placeholder="Genre"
                onChange={(e) => setGenre(e.target.value)}
              />
              <Input
                marginBottom={4}
                value={quantity}
                placeholder="Quantity"
                onChange={(e) => setQuantity(e.target.value)}
              />
            </Box>
            <Box width="30%">
              <Input
                marginBottom={4}
                value={salePrice}
                placeholder="Sale Price"
                onChange={(e) => setSalePrice(e.target.value)}
              />
              <Input
                marginBottom={4}
                value={purchasePrice}
                placeholder="Purchase Price"
                onChange={(e) => setPurchasePrice(e.target.value)}
              />
              <Input
                marginBottom={4}
                value={pages}
                placeholder="# Pages"
                onChange={(e) => setPages(e.target.value)}
              />
              <Select
                variant="filled"
                marginBottom={4}
                placeholder="Select a publisher"
                value={publisherId}
                onChange={(e) => setPublisherId(e.target.value)}
              >
                {publishers.map((publisher) => {
                  return (
                    <option value={publisher.publisherid}>
                      {publisher.name}
                    </option>
                  );
                })}
              </Select>
              <Input
                marginBottom={4}
                value={royalty}
                placeholder="Royalty"
                onChange={(e) => setRoyalty(e.target.value)}
              />
            </Box>
          </Box>
          <Button margin={6} width="20%" onClick={(_) => addBook()}>
            Add Book
          </Button>
        </TabPanel>
        <TabPanel>
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
                  purchase_price={book.purchase_price}
                  cover_url={book.cover_url}
                  genre={book.genre}
                  isbn={book.isbn}
                  author={book.author}
                  quantity={book.quantity}
                  actionText="Remove Book"
                  action={removeBook}
                  admin={true}
                />
                <Divider />
              </>
            );
          })}
        </TabPanel>
        <TabPanel>
          <Box margin={6}>
            <Heading marginBottom={4}>Reports</Heading>
            {Object.entries(reports).map((report) => {
              return (
                <>
                  <Text marginBottom={4}>{report[1].info}</Text>
                  <Button
                    marginBottom={4}
                    onClick={(_) => generateReport(report[0])}
                  >
                    Generate Report
                  </Button>
                  <Divider marginBottom={4} />
                </>
              );
            })}
          </Box>
          <div dangerouslySetInnerHTML={createMarkup(renderedReport)} />
        </TabPanel>
        <TabPanel>
          <Button onClick={logout}>Logout</Button>
        </TabPanel>
      </TabPanels>
    </Tabs>
  );
};

export default Admin;
