import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Appbar() {
  const navigate = useNavigate();
  const [adminEmail, setadminEmail] = useState(null);

  useEffect(() => {
    fetch("http://localhost:3000/admin/me", {
      headers: {
        "Authorization": "Bearer "+localStorage.getItem("token")
      }
    }).then((resp) => {
      return resp.json();
    }).then((data) => {
      // console.log(data);
      if(data.username){
        setadminEmail(data.username)
      }
    })
  }, []);
  
  return (
    <AppBar position="static" color="">
      <Toolbar
        sx={{
          display: "flex",
          justifyContent: "space-between",
          padding: 1,
        }}
        >
        <Typography
            variant="h6" 
            component="div"
            onClick={() => {
              navigate("/"); 
            }} 
            >
          Coursera
        </Typography>
        <Box sx={{ display: "flex", gap: 2 }}>
        <Button 
            variant="contained" 
            size="small"
            onClick={() => {
              navigate("/signup")
            }}
            >
            Sign Up
        </Button>
        <Button 
            variant="contained" 
            size="small"
            onClick={() => {
              navigate("/signin")
            }}
            >
            Log In
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default Appbar;
