// src/pages/context/LoginContext.jsx
import { createContext, useContext, useState, useEffect } from "react";

const LoginContext = createContext();

export const UserProvider = ({ children }) => {
  const [loggedInUserId, setloggedInUserId] = useState(() => {
    const storedId = localStorage.getItem("LOGGED_IN_USER_ID");
    return storedId ? parseInt(storedId, 10) : null;
  });

  // Sync to localStorage whenever user ID changes
  useEffect(() => {
    if (loggedInUserId !== null) {
      localStorage.setItem("LOGGED_IN_USER_ID", loggedInUserId);
    } else {
      localStorage.removeItem("LOGGED_IN_USER_ID");
    }
  }, [loggedInUserId]);

  return (
    <LoginContext.Provider value={{ loggedInUserId, setloggedInUserId }}>
      {children}
    </LoginContext.Provider>
  );
};

export const useLoggedInUser = () => {
  const context = useContext(LoginContext);
  if (!context) throw new Error("useLoggedInUser must be used within a UserProvider");
  return context;
};
