import { Box, Heading, Input, Button, Link } from "@chakra-ui/react";
import { useState } from "react";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  //TODO: Connect login to API
  const login = () => {
    console.log(username, password);
  };

  return (
    <Box padding={6} display="flex" flexDirection="column" width="40%">
      <Heading paddingBottom={4}>Login</Heading>
      <Input
        marginBottom={4}
        placeholder="Username"
        onChange={(e) => setUsername(e.target.value)}
      />
      <Input
        placeholder="Password"
        marginBottom={4}
        type="password"
        onChange={(e) => setPassword(e.target.value)}
      />
      <Button marginBottom={4} type="submit" onClick={login}>
        Login
      </Button>
      <Link href="/signup">Do not have an account? Click here to signup!</Link>
    </Box>
  );
};

export default Login;
