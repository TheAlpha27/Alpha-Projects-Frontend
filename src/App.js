/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable eqeqeq */
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import Home from "./components/Home/Home";
import Login from "./components/Login/Login";
import { useEffect, useState } from "react";
import axios from "axios";

const baseURL = "http://localhost:4000";

export default function App() {
  const [userDetails, setUserDetails] = useState({});
  useEffect(() => {
    const getUpdatedUser = async () => {
      const savedUserData = localStorage.getItem("userDetails");
      if (savedUserData) {
        // Parse the user data from localStorage
        const parsedUserData = JSON.parse(savedUserData);
        const updatedData = await axios.post(
          baseURL + "/getUpdatedUser",
          parsedUserData
        );
        if (updatedData.data?.error) {
          logOut();
        } else {
          parsedUserData.userType = updatedData.data.results[0].type;
          parsedUserData.token = updatedData.data.token;
          // console.log(parsedUserData);
          localStorage.setItem("userDetails", JSON.stringify(parsedUserData));
          setUserDetails(parsedUserData);
        }
      }
    };
    getUpdatedUser();
  }, []);

  const logOut = () => {
    localStorage.removeItem("userDetails");
    window.location.reload();
  };

  return (
    <div className="App">
      <Router>
        <Routes>
          <Route
            path="/"
            element={
              <Home
                userDetails={userDetails}
                logOut={logOut}
                baseURL={baseURL}
              />
            }
          />
          <Route
            path="/login"
            element={
              <Login
                userDetails={userDetails}
                setUserDetails={setUserDetails}
                baseURL={baseURL}
              />
            }
          />
        </Routes>
      </Router>
    </div>
  );
}
