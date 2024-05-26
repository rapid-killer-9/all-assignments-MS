import { Card, Typography, Button, TextField, Box } from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Signup() {
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const navigate = useNavigate();
  const handleSignUp = () => {
    fetch("http://localhost:3000/admin/signup", {
      method: "POST",
      body: JSON.stringify({
        username: email,
        password: password,
      }),
      headers: {
        "Content-type": "application/json",
      },
    })
      .then((resp) => {
        return resp.json();
      })
      .then((data) => {
        localStorage.setItem("token", data.token);
        navigate("/dashboard");
      });
  };

  return (
    <Box
      sx={{
        paddingTop: "12vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <Typography variant="h6" gutterBottom>
        Welcome to Coursera. Sign Up below
      </Typography>
      <Card
        variant="outlined"
        sx={{
          padding: "2rem",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <TextField
          onChange={(e) => {
            setEmail(e.target.value);
          }}
          label="Email"
          variant="outlined"
          size="small"
          margin="normal"
          fullWidth
        />
        <TextField
          onChange={(e) => {
            setPassword(e.target.value);
          }}
          label="Password"
          type="password"
          variant="outlined"
          size="small"
          margin="normal"
          fullWidth
        />
        <Button
          variant="contained"
          size="small"
          sx={{ mt: 2 }}
          onClick={handleSignUp}
        >
          Sign up
        </Button>
      </Card>
    </Box>
  );
}

export default Signup;
