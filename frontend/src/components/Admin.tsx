import { useState, useEffect } from "react";
import {
  Box,
  Button,
  Divider,
  Heading,
  Input,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
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

const Admin = () => {
  const [books, setBooks] = useState<IBook[]>([]);
  const [reports, setReports] = useState<IReport[]>([]);
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
    console.log(reports);
    setReports(reports);
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

    const result = await res.json();
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

    const book = await res.json();
  };

  const generateReport = async (reportTitle: string) => {
    const res = await fetch(
      `${API_ADDR}/api/reports/${reportTitle}`,
      {
        method: "POST",
        body: JSON.stringify({
          date: "100000",
        }),
        headers: {
          "Content-Type": "application/json",
          Auth: `${localStorage.getItem("userID")}`,
        },
      }
    );

    setRenderedReport(await res.text());
  };

  function createMarkup(markup: string) {
    return { __html: markup };
  }

  useEffect(() => {
    getBooks();
    getReports();
  }, []);

  return (
    <Tabs>
      <TabList>
        <Tab>Add Books</Tab>
        <Tab>Remove Books</Tab>
        <Tab>View Reports</Tab>
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
              <Input
                marginBottom={4}
                value={publisherId}
                placeholder="Publisher ID"
                onChange={(e) => setPublisherId(e.target.value)}
              />
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
                  genres={book.genres}
                  isbn={book.isbn}
                  authors={book.authors}
                  quantity={book.quantity}
                  actionText="Remove Book"
                  action={removeBook}
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
      </TabPanels>
    </Tabs>
  );
};

export default Admin;
