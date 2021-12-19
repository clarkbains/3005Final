import { Box, Button, Link, Heading } from "@chakra-ui/react";

const Home = () => {
  return (
    <Box
      alignItems="center"
      width="100%"
      display="flex"
      flexDirection="column"
      padding={6}
    >
      <Heading marginBottom={6}>Welcome to Look Inna Book!</Heading>
      <Box display="flex">
        <Button as={Link} marginRight={10} href="/login">
          Login
        </Button>
        <Button as={Link} href="/signup">
          Sign Up
        </Button>
      </Box>
    </Box>
  );
};

export default Home;
