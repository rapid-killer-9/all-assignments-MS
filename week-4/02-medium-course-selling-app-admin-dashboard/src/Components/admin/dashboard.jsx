import { useNavigate } from "react-router-dom";
import { Button } from "@mui/material";

function Dashboard() {
    const navigate = useNavigate();
    const addCourse = () => {
        navigate('/addcourse');
    }
    return( 
        <div
        style={{
            display: "flex",
            justifyContent: "center",
            marginTop: "30vh"
        }}
        >
            <Button
            variant="contained"
            size="small"
            sx={{ mt: 2 }}
            onClick={addCourse}
            >
                Add Course 
            </Button>
        </div>
    )
}

export default Dashboard;