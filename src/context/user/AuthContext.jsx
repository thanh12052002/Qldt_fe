// src/context/AuthContext.js
import { createContext, useState, useEffect } from "react";

// Tạo context
export const AuthContext = createContext();

// Provider bọc toàn ứng dụng
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(null);

  // Khi app load lại, lấy thông tin từ sessionStorage
  useEffect(() => {
    const storedUser = sessionStorage.getItem("user");
    const storedToken = sessionStorage.getItem("accessToken");

    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));
      setAccessToken(storedToken);
    }
  }, []);

  const login = (userData, token) => {
    setUser(userData);
    setAccessToken(token);
    sessionStorage.setItem("user", JSON.stringify(userData));
    sessionStorage.setItem("accessToken", token);
  };

  const logout = () => {
    setUser(null);
    setAccessToken(null);
    sessionStorage.clear(); // hoặc remove từng key
  };

  return (
    <AuthContext.Provider value={{ user, accessToken, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
