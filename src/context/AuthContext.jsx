import { createContext, useEffect, useState } from "react";
import axios from "axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  // Removed profileUpdateKey state

  useEffect(() => {
    const initializeUser = async () => {
      const storedUser = localStorage.getItem("user");
      const storedToken = localStorage.getItem("token");

      if (storedUser && storedToken) {
        const parsedUser = JSON.parse(storedUser);
        axios.defaults.headers.common["Authorization"] = `Bearer ${storedToken}`;
        
        try {
          const profileResponse = await axios.get('http://localhost:5000/api/profile');
          const fullUser = { ...parsedUser, profile: profileResponse.data.profile };
          setUser(fullUser);
        } catch (error) {
          console.error('Error fetching profile on init:', error);
          setUser(parsedUser);
        }
      }
      setLoading(false);
    };
    initializeUser();
  }, []);

  const updateUserProfile = async (updatedUser) => {
    const userToStore = { ...updatedUser, password: undefined }; 
    localStorage.setItem("user", JSON.stringify(userToStore));
    setUser(userToStore); // Update the user state
    // Removed setProfileUpdateKey
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    // Removed setProfileUpdateKey(0);
    axios.defaults.headers.common["Authorization"] = "";
    window.location.href = "/login";
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      setUser, 
      updateUserProfile, 
      logout, 
      loading
      // Removed profileUpdateKey from value
    }}>
      {children}
    </AuthContext.Provider>
  );
};
