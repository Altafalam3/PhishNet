import "./App.css";
import Login from "./Pages/Login/Login.js";
import Navbar from "./Components/Navbar/Navbar";
import Footer from "./Components/Footer/Footer.js";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { UserProvider } from "./context/UserContext";
import Home from "./Pages/home/Home";
import Report from "../src/Pages/report/Report";
import Premium from "./Pages/payment/Premium";
import Dashboard from "./Pages/dashboard/Dashboard";
import Result from "./Pages/result/Result";
function App() {
    return (
        <UserProvider>
            <>
                <BrowserRouter>
                    <Navbar />
                    <Routes>
                        <Route path="/login" element={<Login />} />
                        <Route path="/" element={<Home />} />
                        <Route path="/report" element={<Report />} />
                        <Route path="/dashboard" element={<Dashboard />} />
                        <Route path="/getpremium" element={<Premium />} />{" "}
                        <Route path="/results" element={<Result />} />
                    </Routes>
                    <Footer />
                </BrowserRouter>
            </>
        </UserProvider>
    );
}

export default App;
