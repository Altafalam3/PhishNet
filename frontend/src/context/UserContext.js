import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {

   const [isLoggedIn, setIsLoggedIn] = useState(false);
   const [userr, setUserr] = useState({});

   const checkUserLoggedIn = async () => {
      try {
         // This includes cookies in the request
         const response = await axios.get('http://localhost:8800/api/auth/user', {
            withCredentials: true,
            credentials: "include",
         });

         console.log(response.data);
         if (response.data.status) {
            setIsLoggedIn(true);
            setUserr(response.data.user);
            console.log(response.data.user);
         }
         else {
            setIsLoggedIn(false);
            setUserr({});
         }
      } catch (error) {
         console.error('Error checking user login status:', error);
      }
   };


   const handleLogout = async () => {
      try {
         const response = await axios.get('http://localhost:8800/api/auth/logout', {
            withCredentials: true,
            credentials: "include",
         });
         console.log(response.data);
         setIsLoggedIn(false);
         setUserr({});
         console.log(userr, "user delted");

      } catch (error) {
         console.error('Error during logout:', error);
      }
   };


   useEffect(() => {
      checkUserLoggedIn();
   }, []);

   return (
      <UserContext.Provider value={{ isLoggedIn, userr, checkUserLoggedIn, handleLogout }}>
         {children}
      </UserContext.Provider>
   );
};
