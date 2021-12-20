import { Box, Text, Button } from "@chakra-ui/react";
import { FC } from "react";
import { IBook } from "./Users";

interface BookActions {
  admin: boolean;
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
  author,
  quantity,
  genre,
  sale_price,
  actionText,
  purchase_price,
  admin,
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
        {author && author}
      </Text>
      <Text width="20%" textAlign={"center"}>
        {genre && genre}
      </Text>
      {admin ? (
        <Text width="10%" textAlign={"center"}>
          ${purchase_price}
        </Text>
      ) : (
        <Text width="10%" textAlign={"center"}>
          ${sale_price}
        </Text>
      )}
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
