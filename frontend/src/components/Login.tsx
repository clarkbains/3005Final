import { Box, Heading, Input, Button, Link } from "@chakra-ui/react";
import { useState } from "react";
import API_ADDR from "../Config";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const login = async () => {
    const res = await fetch(`${API_ADDR}/api/session`, {
      method: "POST",
      body: JSON.stringify({
        username,
        password,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const user = await res.json();
    localStorage.setItem("userID", user.userid);
    console.log(user);

    user.admin === 1
      ? (window.location.href = "/admin")
      : (window.location.href = "/user");
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
