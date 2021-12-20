import { Box, Heading, Input, Button, Link } from "@chakra-ui/react";
import { useState } from "react";

const SignUp = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  const signup = async () => {
    const res = await fetch("http://localhost:9756/api/user", {
      method: "POST",
      body: JSON.stringify({
        username,
        password,
        email,
        phone: phoneNumber,
      }),
      headers: { "Content-Type": "application/json" },
    });

    const user = await res.json();
    localStorage.setItem("userID", user.userid);

    user.admin === 1
      ? (window.location.href = "/admin")
      : (window.location.href = "/user");
  };

  return (
    <Box padding={6} display="flex" flexDirection="column" width="40%">
      <Heading paddingBottom={4}>Sign Up</Heading>
      <Input
        marginBottom={4}
        placeholder="Email"
        onChange={(e) => setEmail(e.target.value)}
      />
      <Input
        marginBottom={4}
        placeholder="Username"
        onChange={(e) => setUsername(e.target.value)}
      />
      <Input
        marginBottom={4}
        placeholder="Phone Number"
        onChange={(e) => setPhoneNumber(e.target.value)}
      />
      <Input
        placeholder="Password"
        marginBottom={4}
        type="password"
        onChange={(e) => setPassword(e.target.value)}
      />
      <Button marginBottom={4} type="submit" onClick={signup}>
        Login
      </Button>
      <Link href="/login">Already have an account? Click here to login!</Link>
    </Box>
  );
};

export default SignUp;
