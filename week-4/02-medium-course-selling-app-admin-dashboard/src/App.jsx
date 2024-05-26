import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Landing from "./Components/admin/landing"
import Signup from "./Components/admin/signup"
import Signin from "./Components/admin/signin"
import Appbar from "./Components/admin/appbar";
import AddCourse from "./Components/admin/addcourse"
import Dashboard from './Components/admin/dashboard';

// This file shows how you can do routing in React.
// Try going to /login, /register, /about, /courses on the website and see how the html changes
// based on the route.
// You can also try going to /random and see what happens (a route that doesnt exist)
function App() {
    return (
        <div style={{width: "100vw", height: "100vh", background: "#eeeeee"}}>
            <Router>
                <Appbar />
                <Routes>
                    <Route path='/dashboard' element={<Dashboard/>}/>
                    <Route path="/" element={<Landing />} />
                    <Route path='/addcourse' element={<AddCourse />}/>
                    <Route path="/signup" element={<Signup />} />
                    <Route path="/signin" element={<Signin />} />
                </Routes>
            </Router>
        </div>
    );
}

export default App;