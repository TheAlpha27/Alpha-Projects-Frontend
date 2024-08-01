import axios from "axios";
import React, { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { baseURL } from "./constants";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [userDetails, setUserDetails] = useState(undefined);
  const navigate = useNavigate();

  useEffect(() => {
    getUpdatedUser();
  }, []);

  const getUpdatedUser = async () => {
    const savedUserData = localStorage.getItem("userDetails");
    if (savedUserData) {
      try {
        const parsedUserData = JSON.parse(savedUserData);
        const updatedData = await axios.post(
          baseURL + "/getUpdatedUser",
          parsedUserData,
          {
            headers: {
              Authorization: parsedUserData.token,
            },
          }
        );
        parsedUserData.type = updatedData.data.type;
        parsedUserData.token = updatedData.data.token;
        console.log({ parsedUserData });
        localStorage.setItem("userDetails", JSON.stringify(parsedUserData));
        setUserDetails(parsedUserData);
      } catch (error) {
        logOut();
      }
    } else {
      navigate("/login");
    }
  };

  const logOut = () => {
    console.log("Called");
    localStorage.removeItem("userDetails");
    navigate("/login");
  };

  return (
    <AuthContext.Provider value={{ userDetails, setUserDetails, logOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
