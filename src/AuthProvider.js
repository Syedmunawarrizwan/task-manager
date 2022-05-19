import React, { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase-config";
import { useNavigate } from "react-router-dom";

export const AuthContext = React.createContext({ user: null });

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState();
  const navigate = useNavigate();
  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        const { displayName, email, uid } = user;
        console.log(user);
        setCurrentUser({
          displayName,
          email,
          uid,
        });
        navigate("/home", { replace: true });
      } else {
        setCurrentUser(null);
      }
    });
  }, []);

  return (
    <AuthContext.Provider value={currentUser}>
      {children}
    </AuthContext.Provider>
  );
};
