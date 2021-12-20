import { Box, Text, Button } from "@chakra-ui/react";
import { FC } from "react";
import { IBook } from "./Users";

interface BookActions {
  actionText: string;
  action: (
    isbn: string,
    title: string,
    sale_price: number,
    amount: number
  ) => void;
}
const Book: FC<IBook & BookActions> = ({
  title,
  isbn,
  authors,
  quantity,
  sale_price,
  actionText,
  action,
}) => {
  return (
    <Box
      margin={6}
      display="flex"
      alignItems={"center"}
      justifyContent={"space-between"}
    >
      <Text width="10%" textAlign={"center"}>
        {isbn}
      </Text>
      <Text width="20%" textAlign={"center"}>
        {title}
      </Text>
      <Text width="20%" textAlign={"center"}>
        {authors && authors}
      </Text>
      <Text width="10%" textAlign={"center"}>
        ${sale_price}
      </Text>

      <Text width="10%" textAlign={"center"}>
        {quantity}
      </Text>
      <Button width="10%" onClick={(_) => action(isbn, title, sale_price, 1)}>
        {actionText}
      </Button>
    </Box>
  );
};

export default Book;
