import { Card, Typography, Button, TextField, Box } from "@mui/material";
import { useState } from "react";

function AddCourse () {

    const [title, setTitle] = useState();
    const [description, setDescription] = useState();
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
        Let's Add Course
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
            setTitle(e.target.value);
          }}
          label="Title"
          variant="outlined"
          size="small"
          margin="normal"
          fullWidth
        />
        <TextField
          onChange={(e) => {
            setDescription(e.target.value);
          }}
          label="Description"
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
                fetch("http://localhost:3000/admin/courses", {
                    method: "POST",
                    body: JSON.stringify({
                        title,
                        description,
                        imageLink: "",
                        published: true
                    }),
                    headers: {
                        "Content-type": "application/json",
                        "Authorization": "Bearer "+localStorage.getItem("token")
                    }
                }).then((resp) => {
                    return resp.json();
                }).then((data) => {
                    localStorage.setItem("token", data.token);
                });
            }}
        >
          Add Course
        </Button>
      </Card>
    </Box>
    )
}

export default AddCourse;