import React from "react";
import axios from "axios";
import { AuthProvider } from "./context/AuthContext";
import "./App.css";
import NavBar from "./components/NavBar";
import Container from "react-bootstrap/Container";
import AboutMe from "./pages/AboutMe";
import Reviews from "./pages/Reviews";
import BookSession from "./pages/BookSession";
import MyAccount from "./pages/MyAccount";
import { Routes, Route } from "react-router-dom";
import Profile from "./pages/Profile";
import AuthSuccess from "./pages/AuthSuccess";

axios.defaults.withCredentials = true;

const App: React.FC = () => {
  return (
    <AuthProvider>
      <NavBar />
      <Container className="mt-4">
        <Routes>
          <Route path="/" element={<BookSession />} />
          <Route path="/about" element={<AboutMe />} />
          <Route path="/reviews" element={<Reviews />} />
          <Route path="/book" element={<BookSession />} />
          <Route path="/account" element={<MyAccount />} />
          <Route path="/auth-success" element={<AuthSuccess />} />
          <Route path="/complete-profile" element={<Profile />} />
        </Routes>
      </Container>
    </AuthProvider>
  );
};

export default App;
