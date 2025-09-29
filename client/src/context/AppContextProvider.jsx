import axios from "axios";
import {  useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { AppContext } from "./AppContext";

// 👇 yahi par context bana do


const AppContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [showLogin, setShowLogin] = useState(false);
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [credit, setCredit] = useState(0); // ✅ start with 0 instead of false
  const navigate = useNavigate();

  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const loadCreditsData = useCallback(async () => {
    if (!token) return;

    try {
      const { data } = await axios.get(`${backendUrl}/api/user/credits`, {
        headers: { token },
      });

      if (data.success) {
        console.log("API response:", data);
        setCredit(data.credits); // 👈 check karo backend `credits` bhej raha hai ya `credit`
        setUser(data.user);
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || error.message || "Failed to load credits"
      );
    }
  }, [backendUrl, token]);

  const generateImage = async (prompt) => {
    if (!token) {
      toast.error("You must be logged in.");
      return;
    }

    try {
      const { data } = await axios.post(
        `${backendUrl}/api/image/generate-image`,
        { prompt },
        { headers: { token } }
      );

      if (data.success) {
        await loadCreditsData();
        return data.resultImage;
      } else {
        toast.error(data.message);
        if (data.creditBalance === 0) {
          await loadCreditsData();
          navigate("/buy");
        }
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || error.message || "Failed to generate image"
      );
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken("");
    setUser(null);
  };

  useEffect(() => {
    if (token) {
      localStorage.setItem("token", token); // ✅ keep token persistent
      loadCreditsData();
    }
  }, [token, loadCreditsData]);

  const value = {
    user,
    setUser,
    showLogin,
    setShowLogin,
    backendUrl,
    token,
    setToken,
    credit,
    setCredit,
    loadCreditsData,
    logout,
    generateImage,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

export default AppContextProvider;
