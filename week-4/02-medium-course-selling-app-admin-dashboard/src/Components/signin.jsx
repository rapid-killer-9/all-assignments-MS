import { Card, Typography, Button, TextField, Box } from "@mui/material";
import {useState} from "react";

function Signin() {

  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
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
        Welcome Back. Sign in below
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
          onClick={() => {
            fetch("http://localhost:3000/admin/login", {
                    method: "POST",
                    headers: {
                        "Content-type": "application/json",
                        "username": email,
                        "password": password
                    }
                }).then((resp) => {
                    return resp.json();
                }).then((data) => {
                    localStorage.setItem("token", data.token);
                });
          }}
        >
          Sign in
        </Button>
      </Card>
    </Box>
  );
}

export default Signin;
