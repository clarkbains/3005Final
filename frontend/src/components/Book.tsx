import { Box, Text, Button } from "@chakra-ui/react";
import { FC, MouseEventHandler } from "react";

interface BookProps {
  title: string;
  isbn: string;
  author: string;
  action: (title: string) => void;
  actionText: string;
}

const Book: FC<BookProps> = ({ title, isbn, author, action, actionText }) => {
  return (
    <Box margin={6} display="flex" alignItems={"center"}>
      <Box display="flex" width="50%" justifyContent="space-around">
        <Text>{isbn}</Text>
        <Text>{title}</Text>
      </Box>
      <Box display="flex" width="50%" justifyContent="space-around">
        <Text>{author}</Text>
        <Button onClick={(_) => action(title)}>{actionText}</Button>
      </Box>
    </Box>
  );
};

export default Book;
