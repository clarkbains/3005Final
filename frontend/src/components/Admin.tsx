import { useState, useEffect } from "react";
import {
  Box,
  Divider,
  Heading,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
} from "@chakra-ui/react";
import Book from "./Book";

const initialBooks = [
  { title: "Dune", isbn: "293829057af", author: "Gwyneth Paltrow" },
  { title: "Spooderman", isbn: "r23847897a89f", author: "Arthur Conan Doyle" },
];
const Admin = () => {
  const [books, setBooks] = useState(initialBooks);

  useEffect(() => {
    //TODO: fetch books
  }, []);

  const orderBook = (title: string) => {
    //TODO: order books
    console.log("Ordering ", title);
  };

  const removeBook = (title: string) => {
    //TODO: remove books
    console.log("Removing ", title);
  };

  return (
    <Tabs>
      <TabList>
        <Tab>Order Books</Tab>
        <Tab>Remove Books</Tab>
        <Tab>View Reports</Tab>
      </TabList>

      <TabPanels>
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
          {books.map((book) => {
            return (
              <>
                {/* <Book
                  title={book.title}
                  isbn={book.isbn}
                  author={book.author}
                  actionText="Order Book"
                  action={orderBook}
                /> */}
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
          {books.map((book) => {
            return (
              <>
                {/* <Book
                  title={book.title}
                  isbn={book.isbn}
                  author={book.author}
                  actionText="Remove Book"
                  action={removeBook}
                /> */}
                <Divider />
              </>
            );
          })}
        </TabPanel>
        <TabPanel>Viewing reports</TabPanel>
      </TabPanels>
    </Tabs>
  );
};

export default Admin;
