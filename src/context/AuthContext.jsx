import { createContext, useEffect, useState } from "react";
import axios from "axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeUser = async () => {
      const storedUser = localStorage.getItem("user");
      const storedToken = localStorage.getItem("token");

      if (storedUser && storedToken) {
        const parsedUser = JSON.parse(storedUser);
        axios.defaults.headers.common["Authorization"] = `Bearer ${storedToken}`;
        
        try {
          // Fetch the latest profile data
          if (parsedUser.role === 'candidate') {
            const profileResponse = await axios.get('http://localhost:5000/api/profile');
            const fullUser = { ...parsedUser, profile: profileResponse.data.profile };
            setUser(fullUser);
          } else if (parsedUser.role === 'company') {
            const companyResponse = await axios.get('http://localhost:5000/api/company');
            const fullUser = { ...parsedUser, companyDetails: companyResponse.data };
            setUser(fullUser);
          }
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
    
    // Force a fresh fetch of profile/company data after update
    try {
      if (userToStore.role === 'candidate') {
        const profileResponse = await axios.get('http://localhost:5000/api/profile');
        const fullUser = { ...userToStore, profile: profileResponse.data.profile };
        setUser(fullUser);
      } else if (userToStore.role === 'company') {
        const companyResponse = await axios.get('http://localhost:5000/api/company');
        const fullUser = { ...userToStore, companyDetails: companyResponse.data };
        setUser(fullUser);
      }
    } catch (error) {
      console.error('Error updating user profile:', error);
      setUser(userToStore);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
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
    }}>
      {children}
    </AuthContext.Provider>
  );
};
